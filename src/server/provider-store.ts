import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { defaultPolicies, type Policies } from "@/lib/policies";

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
  type: "mcp" | "api" | "n8n" | "dify" | "gitlab" | "mattermost" | "confluence" | "erp" | "opcua";
  endpoint: string;
  auth: "none" | "shared-key" | "user-login";
  tools: { id: string; name: string; description: string; requiresApproval: boolean; writes?: boolean }[];
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

const policiesFile = path.join(dataDir, "policies.json");

/** Saved policies; a missing or older file falls back to the defaults field by field. */
export async function readPolicies(): Promise<Policies> {
  const saved = await readJson<Partial<Policies>>(policiesFile, {});
  const base = defaultPolicies();
  return {
    confidentialDocumentIds: saved.confidentialDocumentIds ?? base.confidentialDocumentIds,
    weeklyLimits: saved.weeklyLimits ?? base.weeklyLimits,
    masking: { fields: { ...base.masking.fields, ...saved.masking?.fields }, phrases: saved.masking?.phrases ?? base.masking.phrases },
    toolAccess: saved.toolAccess ?? base.toolAccess,
  };
}

/** Saves the whole policies object; the admin panel writes it, both panels read it. */
export async function writePolicies(policies: Policies) {
  await writeJson(policiesFile, policies);
}
