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
  isNew = false,
}: {
  selfHosted: boolean;
  setAside: boolean;
  /** Published or first fetched recently. */
  isNew?: boolean;
}) {
  if (!selfHosted && !setAside && !isNew) return null;
  return (
    <span className="flex flex-wrap items-center gap-1">
      {isNew ? <Badge variant="success">جدید</Badge> : null}
      {selfHosted ? <Badge variant="info">سلف‌هاست</Badge> : null}
      {setAside ? <Badge variant="warning">موقتاً کنار گذاشته شده</Badge> : null}
    </span>
  );
}
