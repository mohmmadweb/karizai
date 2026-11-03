import Link from "next/link";
import { BellRingIcon, InfoIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MessengerMessage } from "../types";
import { useAlerts } from "@/features/alerts/components/alerts-provider";
import { Button } from "@/components/ui/button";
import { ThreadAvatar } from "./thread-avatar";

function AlertCard({ message }: { message: MessengerMessage }) {
  const alert = message.alert!;
  const { marks, mark } = useAlerts();
  const current = marks[message.id];
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
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/workflows/${alert.workflowId}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit")}>مشاهده‌ی جریان</Link>
        <Button type="button" size="sm" variant={current === "important" ? "default" : "outline"} aria-pressed={current === "important"} onClick={() => mark(message.id, "important")}>مهم</Button>
        <Button type="button" size="sm" variant={current === "unimportant" ? "default" : "outline"} aria-pressed={current === "unimportant"} onClick={() => mark(message.id, "unimportant")}>بی‌اهمیت</Button>
      </div>
      {current === "unimportant" ? <p className="text-caption text-muted-foreground">علامت شما ثبت شد.</p> : current === "important" ? <p className="text-caption text-muted-foreground">علامت شما ثبت شد.</p> : null}
    </article>
  );
}

/** One message: an alert card from a bot, or a bubble from the user or a colleague. Messages from the other side carry their picture. */
export function MessageItem({ message }: { message: MessengerMessage }) {
  const mine = message.from === "me";
  return (
    <li className={cn("flex items-end gap-2", mine ? "justify-start" : "justify-end")}>
      {mine ? null : <ThreadAvatar threadId={message.threadId} className="size-8" />}
      <div className={cn("flex min-w-0 max-w-[85%] flex-col gap-1", mine ? "items-start" : "items-end")}>
        {message.sender ? <span className="px-1 text-caption text-muted-foreground">{message.sender}</span> : null}
        {message.alert ? (
          <>
            <p className="rounded-2xl rounded-ee-sm bg-muted px-4 py-2 text-body">{message.text}</p>
            <AlertCard message={message} />
          </>
        ) : (
          <p className={cn("whitespace-pre-wrap rounded-2xl px-4 py-2 text-body", mine ? "rounded-es-sm bg-primary text-primary-foreground" : "rounded-ee-sm bg-muted")}>{message.text}</p>
        )}
        <time dateTime={message.createdAt} className="px-1 text-caption text-muted-foreground">{formatDateTime(message.createdAt)}</time>
      </div>
    </li>
  );
}
