"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatNumber } from "@/lib/format";
import { AiAnswer } from "../components/ai-answer";
import { AiAction } from "../components/ai-dialog";
import { AiBullets } from "../components/ai-parts";
import { SuggestedTasks } from "../components/suggested-tasks";
import { getMinutes } from "../data/calendar";
import { formatFullDate, formatTime } from "../lib/jalali";
import type { CalendarEvent } from "../types";

/** One event; a recorded meeting gets «✦ صورت‌جلسه و وظایف». */
export function EventDialog({ event, onClose }: { event: CalendarEvent | null; onClose: () => void }) {
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
