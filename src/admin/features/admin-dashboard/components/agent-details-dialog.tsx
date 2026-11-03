import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/admin/lib/format";
import { formatDuration } from "../lib/model-speed";
import type { AgentRun } from "../types";
import { bottleneckOf, kindLabels, shareOf, totalMs } from "./step-bar";

type Props = { agent: AgentRun | null; onClose: () => void };

export function AgentDetailsDialog({ agent, onClose }: Props) {
  return (
    <Dialog open={agent !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        {agent ? (
          <>
            <DialogHeader>
              <DialogTitle>{agent.name}</DialogTitle>
              <DialogDescription>
                میانگین زمان اجرای کامل {formatDuration(totalMs(agent.steps))}؛ زمان هر مرحله در جدول آمده است.
              </DialogDescription>
            </DialogHeader>
            <Table aria-label={`مرحله‌های ${agent.name}`}>
              <TableHeader>
                <TableRow>
                  <TableHead>مرحله</TableHead>
                  <TableHead>نوع</TableHead>
                  <TableHead className="text-end">زمان</TableHead>
                  <TableHead className="text-end">سهم</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agent.steps.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="whitespace-normal">
                      <span className="flex flex-wrap items-center gap-2">
                        {s.name}
                        {s.id === bottleneckOf(agent.steps).id ? <Badge variant="destructive">گلوگاه</Badge> : null}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground">{kindLabels[s.kind]}</TableCell>
                    <TableCell className="text-end tabular-nums">{formatDuration(s.ms)}</TableCell>
                    <TableCell className="text-end tabular-nums">{formatNumber(shareOf(s, agent.steps))}٪</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
