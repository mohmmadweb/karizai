import { Badge } from "@/components/ui/badge";
import type { ProviderStatus } from "../../types";

export function ProviderStatusBadge({ status }: { status: ProviderStatus }) {
  return status === "available" ? (
    <Badge variant="success">در دسترس</Badge>
  ) : (
    <Badge variant="warning">در دسترس نیست</Badge>
  );
}

/** Flags beside a model name. Each one carries text, never color alone. */
export function ModelFlags({
  selfHosted,
  setAside,
}: {
  selfHosted: boolean;
  setAside: boolean;
}) {
  if (!selfHosted && !setAside) return null;
  return (
    <span className="flex flex-wrap items-center gap-1">
      {selfHosted ? <Badge variant="info">سلف‌هاست</Badge> : null}
      {setAside ? <Badge variant="warning">موقتاً کنار گذاشته شده</Badge> : null}
    </span>
  );
}
