import { Badge } from "@/components/ui/badge";
import type { TestResult } from "../../types";

export function SourceTestBadge({ result }: { result: TestResult }) {
  if (result === "success") return <Badge variant="success">موفق</Badge>;
  if (result === "failed") return <Badge variant="destructive">ناموفق</Badge>;
  return <Badge variant="secondary">آزموده نشده</Badge>;
}
