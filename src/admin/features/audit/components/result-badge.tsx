import { Badge } from "@/components/ui/badge";
import { resultLabels, type AuditEvent, type AuditResult } from "../types";

const variant = { success: "success", pending: "warning", denied: "destructive" } as const;

/** Result text, with the short reason for a denied access («دسترسی رد شد: خارج از واحد»). */
export function ResultBadge({ result, event }: { result: AuditResult; event?: AuditEvent }) {
  const outside = result === "denied" && event?.reason?.startsWith("خارج از واحد");
  return <Badge variant={variant[result]}>{resultLabels[result]}{outside ? ": خارج از واحد" : ""}</Badge>;
}
