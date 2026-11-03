import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { ApiKeyKind, ApiKeyPolicy, ApiKeyRecord } from "@/lib/api-keys";

/**
 * Phase 2 MVP storage: two small JSON files in a folder shared by the admin
 * panel and the user panel. API keys are encrypted (AES-256-GCM) in their own
 * file and are never part of the snapshot. Replace this module with the real
 * backend service later; the route handlers only use the functions below.
 */
const dataDir = process.env.MOSHEKAF_DATA_DIR ?? path.resolve(process.cwd(), "../moshekaf-data");
const snapshotFile = path.join(dataDir, "store.json");
const keysFile = path.join(dataDir, "keys.json");

export type StoredProvider = {
  id: string;
  name: string;
  baseUrl: string;
  status: "available" | "unavailable";
  [field: string]: unknown;
};

export type StoredModel = {
  id: string;
  providerId: string;
  remoteId: string;
  displayName: string;
  description: string;
  enabled: boolean;
  selfHosted: boolean;
  supportsImages: boolean;
  supportsTools: boolean;
  [field: string]: unknown;
};

export type Snapshot = { providers: StoredProvider[]; models: StoredModel[] };

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, value: unknown) {
  await fs.mkdir(dataDir, { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(temp, JSON.stringify(value, null, 2), { mode: 0o600 });
  await fs.rename(temp, file);
}

function secretKey(): Buffer {
  const secret = process.env.MOSHEKAF_SECRET;
  if (!secret) throw new Error("MOSHEKAF_SECRET تنظیم نشده است.");
  return crypto.scryptSync(secret, "moshekaf-provider-keys", 32);
}

function encrypt(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", secretKey(), iv);
  const body = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), body].map((part) => part.toString("base64")).join(".");
}

function decrypt(payload: string): string {
  const [iv, tag, body] = payload.split(".").map((part) => Buffer.from(part, "base64"));
  const decipher = crypto.createDecipheriv("aes-256-gcm", secretKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(body), decipher.final()]).toString("utf8");
}

export async function readSnapshot(): Promise<Snapshot> {
  return readJson<Snapshot>(snapshotFile, { providers: [], models: [] });
}

/** Saves the lists and forgets the keys of providers that no longer exist. */
export async function writeSnapshot(snapshot: Snapshot) {
  await writeJson(snapshotFile, snapshot);
  const keys = await readJson<Record<string, string>>(keysFile, {});
  const alive = new Set(snapshot.providers.map((provider) => provider.id));
  const kept = Object.fromEntries(Object.entries(keys).filter(([id]) => alive.has(id) || id.startsWith("conn:")));
  if (Object.keys(kept).length !== Object.keys(keys).length) await writeJson(keysFile, kept);
}

export async function setProviderKey(providerId: string, apiKey: string) {
  const keys = await readJson<Record<string, string>>(keysFile, {});
  keys[providerId] = encrypt(apiKey);
  await writeJson(keysFile, keys);
}

export async function getProviderKey(providerId: string): Promise<string | null> {
  const keys = await readJson<Record<string, string>>(keysFile, {});
  return keys[providerId] ? decrypt(keys[providerId]) : null;
}

export type StoredRouter = {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  groupIds: string[];
  members: { modelId: string; tier: "light" | "medium" | "heavy" }[];
};

const routersFile = path.join(dataDir, "routers.json");

const defaultRouter: StoredRouter = { id: "router-default", name: "خودکار", description: "مسیریاب پیش‌فرض برای همه‌ی کاربران.", isDefault: true, groupIds: [], members: [] };

/** The default router always exists, even before the admin saved anything. */
export async function readRouters(): Promise<StoredRouter[]> {
  const list = await readJson<StoredRouter[]>(routersFile, []);
  return list.some((router) => router.isDefault) ? list : [defaultRouter, ...list];
}

export async function writeRouters(routers: StoredRouter[]) {
  const withDefault = routers.some((router) => router.isDefault) ? routers : [defaultRouter, ...routers];
  await writeJson(routersFile, withDefault);
}

export type StoredConnection = {
  id: string;
  name: string;
  domain: string;
  description: string;
  type: "mcp" | "api" | "n8n" | "dify";
  endpoint: string;
  auth: "none" | "shared-key" | "user-login";
  tools: { id: string; name: string; description: string; requiresApproval: boolean }[];
  groupIds: string[];
  active: boolean;
};

const connectionsFile = path.join(dataDir, "connections.json");

export async function readConnections(): Promise<StoredConnection[]> {
  return readJson<StoredConnection[]>(connectionsFile, []);
}

/** Saves the connections and forgets the keys of connections that no longer exist. */
export async function writeConnections(connections: StoredConnection[]) {
  await writeJson(connectionsFile, connections);
  const keys = await readJson<Record<string, string>>(keysFile, {});
  const alive = new Set(connections.map((connection) => `conn:${connection.id}`));
  const kept = Object.fromEntries(Object.entries(keys).filter(([id]) => !id.startsWith("conn:") || alive.has(id)));
  if (Object.keys(kept).length !== Object.keys(keys).length) await writeJson(keysFile, kept);
}

type StoredApiKey = ApiKeyRecord & { hash: string };

const apiKeysFile = path.join(dataDir, "apikeys.json");

async function readApiKeysFile(): Promise<{ policies: ApiKeyPolicy[]; keys: StoredApiKey[] }> {
  const file = await readJson<{ policies?: ApiKeyPolicy[]; keys?: StoredApiKey[] }>(apiKeysFile, {});
  return { policies: file.policies ?? [], keys: file.keys ?? [] };
}

function withoutHash(stored: StoredApiKey): ApiKeyRecord {
  const record: Partial<StoredApiKey> = { ...stored };
  delete record.hash;
  return record as ApiKeyRecord;
}

/** Policies and keys. The hash of a key never leaves this module. */
export async function readApiKeys(): Promise<{ policies: ApiKeyPolicy[]; keys: ApiKeyRecord[] }> {
  const { policies, keys } = await readApiKeysFile();
  return { policies, keys: keys.map(withoutHash) };
}

export async function writeApiKeyPolicies(policies: ApiKeyPolicy[]) {
  const file = await readApiKeysFile();
  await writeJson(apiKeysFile, { ...file, policies });
}

export type NewApiKey = { name: string; ownerId: string; ownerName: string; kind: ApiKeyKind; resourceId: string; resourceName: string; expiresAt: string | null };

/** Creates a key. The secret is returned once; only its hash is kept. */
export async function createApiKey(input: NewApiKey): Promise<{ record: ApiKeyRecord; secret: string }> {
  const file = await readApiKeysFile();
  const secret = `msk_${crypto.randomBytes(32).toString("base64url")}`;
  const stored: StoredApiKey = {
    ...input,
    id: `key-${crypto.randomBytes(6).toString("hex")}`,
    last4: secret.slice(-4),
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    revokedAt: null,
    hash: crypto.createHash("sha256").update(secret).digest("hex"),
  };
  await writeJson(apiKeysFile, { ...file, keys: [...file.keys, stored] });
  return { record: withoutHash(stored), secret };
}

/** Revokes a key. With `ownerId`, only the owner's own key can be revoked. */
export async function revokeApiKey(id: string, ownerId?: string): Promise<boolean> {
  const file = await readApiKeysFile();
  const target = file.keys.find((key) => key.id === id && (ownerId === undefined || key.ownerId === ownerId));
  if (!target) return false;
  if (!target.revokedAt) target.revokedAt = new Date().toISOString();
  await writeJson(apiKeysFile, file);
  return true;
}
