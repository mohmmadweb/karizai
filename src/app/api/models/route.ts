import { readSnapshot } from "@/server/provider-store";

/** Enabled models of the registered providers. Keys are never included. */
export async function GET() {
  const { providers, models } = await readSnapshot();
  const list = models
    .filter((model) => model.enabled)
    .map((model) => {
      const provider = providers.find((item) => item.id === model.providerId);
      return {
        id: model.id,
        name: model.displayName,
        provider: provider?.name ?? "",
        description: model.description,
        isInternal: model.selfHosted,
        supportsImages: model.supportsImages,
        supportsTools: model.supportsTools,
        isAvailable: provider?.status !== "unavailable",
      };
    });
  return Response.json({ models: list });
}
