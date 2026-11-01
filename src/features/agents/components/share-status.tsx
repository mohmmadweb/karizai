import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { ShareRequest } from "../types";

const labels = { pending: "در انتظار تأیید ادمین", approved: "تأییدشده", rejected: "ردشده" } as const;
const variants = { pending: "warning", approved: "success", rejected: "destructive" } as const;

export function ShareStatusBadge({ status }: { status: ShareRequest["status"] }) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}

export function ShareRequestRow({ request }: { request: ShareRequest }) {
  return (
    <li className="flex flex-col gap-1 rounded-lg border p-3 text-body-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>{request.targets.map((target) => target.name).join("، ")}</span>
        <ShareStatusBadge status={request.status} />
      </div>
      <span className="text-caption text-muted-foreground">درخواست در {formatDate(request.requestedAt)}</span>
      {request.status === "rejected" && request.rejectionReason ? <span className="text-destructive">دلیل رد: {request.rejectionReason}</span> : null}
    </li>
  );
}
