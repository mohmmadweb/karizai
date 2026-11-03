import { CheckIcon, XIcon } from "lucide-react";
import { formatDateTime } from "@/admin/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { approvalTypeLabels, type ApprovalItem } from "../types";

type Props = { item: ApprovalItem; onApprove: () => void; onReject: () => void };

/** One request: type, requester, what is asked, its conditions and the two decisions. */
export function ApprovalCard({ item, onApprove, onReject }: Props) {
  return (
    <Card className="h-full">
      <CardHeader className="gap-2">
        <Badge variant="secondary">{approvalTypeLabels[item.type]}</Badge>
        <CardTitle className="text-body font-semibold">{item.title}</CardTitle>
        <p className="text-body-sm text-muted-foreground">
          درخواست: {item.requester}
          {item.requestedAt ? ` · ${formatDateTime(item.requestedAt)}` : ""}
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="text-body-sm">{item.ask}</p>
        <ul className="flex flex-wrap gap-1.5" aria-label="شرط‌ها">
          {item.conditions.map((c) => (
            <li key={c}><Badge variant="outline">{c}</Badge></li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3 border-t bg-muted/40 p-4">
        <Button size="sm" onClick={onApprove}>
          <CheckIcon aria-hidden />
          تأیید
          <span className="sr-only"> {item.title}</span>
        </Button>
        <Button size="sm" variant="outline" onClick={onReject}>
          <XIcon aria-hidden />
          رد با دلیل
          <span className="sr-only"> {item.title}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
