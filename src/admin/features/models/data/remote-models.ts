/** The simulated fetch failed; the message is shown to the admin in Persian. */
export class FetchModelsError extends Error {}

const knownLists: Record<string, string[]> = {
  "openrouter.ai": ["openai/gpt-4o", "anthropic/claude-sonnet", "meta/llama-3-70b"],
  "10.0.0.15": ["qwen2.5-72b-instruct", "llama3.1-8b"],
  "api.example-provider.com": ["mistral-large", "mistral-small"],
};

/** Newer versions a provider publishes later; they appear from the second fetch on. */
const newerModels: Record<string, string> = {
  "openrouter.ai": "anthropic/claude-sonnet-4.5",
  "10.0.0.15": "qwen3-coder-30b",
  "api.example-provider.com": "mistral-medium-3",
};

const genericList = ["general/model-a", "general/model-b", "general/model-c"];

/**
 * Stand-in for asking a provider for its models; no request is made. A host
 * that starts with `error.` fails. From the second round on, one extra model
 * appears, so fetching again can be tried.
 */
export function getRemoteModels(baseUrl: string, round: number): string[] {
  let host = "";
  try {
    host = new URL(baseUrl).hostname;
  } catch {
    throw new FetchModelsError("فهرست مدل‌ها دریافت نشد.");
  }
  if (host.startsWith("error.")) throw new FetchModelsError("فهرست مدل‌ها دریافت نشد.");
  const list = knownLists[host] ?? genericList;
  return round >= 1 ? [...list, newerModels[host] ?? `${host}/new-model-preview`] : list;
}
