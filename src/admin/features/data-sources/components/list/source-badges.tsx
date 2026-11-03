import { Badge } from "@/components/ui/badge";
import type { TestResult } from "../../types";

/** Each badge carries text, never color alone. */
export function TestResultBadge({ result }: { result: TestResult }) {
  if (result === "success") return <Badge variant="success">موفق</Badge>;
  if (result === "failed") return <Badge variant="destructive">ناموفق</Badge>;
  return <Badge variant="secondary">آزموده نشده</Badge>;
}

export function ActiveBadge({ active }: { active: boolean }) {
  return active ? (
    <Badge variant="success">فعال</Badge>
  ) : (
    <Badge variant="secondary">غیرفعال</Badge>
  );
}
