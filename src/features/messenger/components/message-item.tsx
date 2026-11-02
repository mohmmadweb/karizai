import Link from "next/link";
import { BellRingIcon, InfoIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MessengerMessage } from "../types";

function AlertCard({ message }: { message: MessengerMessage }) {
  const alert = message.alert!;
  const Icon = alert.tone === "warning" ? BellRingIcon : InfoIcon;
  return (
    <article className="flex w-full max-w-xl flex-col gap-3 rounded-2xl border bg-card p-4">
      <header className="flex items-center gap-2">
        <span aria-hidden className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", alert.tone === "warning" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-sky-500/15 text-sky-600 dark:text-sky-400")}><Icon className="size-5" /></span>
        <h3 className="text-label">{alert.title}</h3>
      </header>
      <p className="text-body-sm text-muted-foreground">{message.text}</p>
      <dl className="grid gap-x-4 gap-y-1.5 text-body-sm sm:grid-cols-[auto_1fr]">
        {alert.fields.map((field) => (
          <div key={field.label} className="contents">
            <dt className="text-muted-foreground">{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>
      <Link href={`/workflows/${alert.workflowId}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit")}>مشاهده‌ی جریان</Link>
    </article>
  );
}

/** One message: an alert card from a workflow, or a bubble from the user or a colleague. */
export function MessageItem({ message }: { message: MessengerMessage }) {
  const mine = message.from === "me";
  return (
    <li className={cn("flex flex-col gap-1", mine ? "items-start" : "items-end")}>
      {message.alert ? <AlertCard message={message} /> : (
        <p className={cn("max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-body", mine ? "bg-primary text-primary-foreground" : "bg-muted")}>{message.text}</p>
      )}
      <time dateTime={message.createdAt} className="px-1 text-caption text-muted-foreground">{formatDateTime(message.createdAt)}</time>
    </li>
  );
}
