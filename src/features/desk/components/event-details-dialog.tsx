"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatNumber } from "@/lib/format";
import { AiAnswer } from "@/features/social/components/ai-answer";
import { AiAction } from "@/features/social/components/ai-dialog";
import { AiBullets } from "@/features/social/components/ai-parts";
import { SuggestedTasks } from "@/features/social/components/suggested-tasks";
import { qualityAgenda } from "@/features/social/data/ai-answers";
import { getMinutes } from "@/features/social/data/calendar";
import { formatFullDate, formatTime } from "@/features/social/lib/jalali";
import type { CalendarEvent } from "@/features/social/types";

/** One event; a recorded meeting gets «✦ صورت‌جلسه و وظایف». */
export function EventDetailsDialog({ event, onClose }: { event: CalendarEvent | null; onClose: () => void }) {
  const minutes = event ? getMinutes(event.id) : undefined;
  return (
    <Dialog open={Boolean(event)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        {event ? (
          <>
            <DialogHeader>
              <DialogTitle>{event.title}</DialogTitle>
              <DialogDescription>{formatFullDate(event.start)} · ساعت {formatTime(event.start)} · {formatNumber(event.durationMinutes)} دقیقه · {event.place}</DialogDescription>
            </DialogHeader>
            {event.agenda ? <AiAction label="دستور جلسه" variant="soft" context={event.title}><AiBullets items={qualityAgenda} /></AiAction> : null}
            {event.suggested ? <p className="text-body-sm text-primary">✦ این زمان را دستیار پیشنهاد داده است؛ همه‌ی شرکت‌کنندگان آزادند.</p> : null}
            {minutes ? (
              <AiAction label="صورت‌جلسه و وظایف" variant="soft" context={event.title}>
                <div className="flex flex-col gap-3">
                  <h3 className="text-label">تصمیم‌ها</h3>
                  <AiBullets items={minutes.decisions} />
                  <h3 className="text-label">{formatNumber(minutes.tasks.length)} وظیفه از صورت‌جلسه استخراج شد</h3>
                  <SuggestedTasks tasks={minutes.tasks} source="minutes" perItem />
                </div>
              </AiAction>
            ) : <AiAnswer delay={0}><p>این رویداد ضبط یا یادداشت ندارد؛ بعد از جلسه یادداشت را بیفزایید تا صورت‌جلسه ساخته شود.</p></AiAnswer>}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
