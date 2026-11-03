import { Badge } from "@/components/ui/badge";
import { statusLabel } from "../../lib/pipeline";
import type { DocStatus } from "../../types";

const variant = { queued: "secondary", processing: "info", ready: "success", error: "destructive" } as const;

/** Status always carries text, never color alone. */
export function DocStatusBadge({ status }: { status: DocStatus }) {
  return <Badge variant={variant[status]}>{statusLabel[status]}</Badge>;
}

export function ConfidentialBadge({ confidential }: { confidential: boolean }) {
  return confidential ? <Badge variant="warning">محرمانه</Badge> : null;
}
