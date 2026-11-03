import { Badge } from "@/components/ui/badge";
import type { EntityStatus } from "../types";

/** Status always carries text, never color alone. */
export function StatusBadge({ status }: { status: EntityStatus }) {
  return status === "active" ? (
    <Badge variant="success">فعال</Badge>
  ) : (
    <Badge variant="secondary">غیرفعال</Badge>
  );
}
