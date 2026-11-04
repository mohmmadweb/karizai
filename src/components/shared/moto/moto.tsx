"use client";

import type { ReactNode } from "react";
import { ArrowUpDownIcon, ChevronDownIcon, ChevronLeftIcon, PlusIcon, SearchIcon, type LucideIcon } from "lucide-react";
import Link from "@/components/shared/app-link";
import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const fa = (value: number) => value.toLocaleString("fa-IR");

/** The search box of the template: white, thin border, icon at the start. */
export function MotoSearch({ value, onChange, placeholder, className }: { value: string; onChange: (value: string) => void; placeholder: string; className?: string }) {
  return (
    <label className={cn("flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border bg-card px-3 focus-within:ring-3 focus-within:ring-ring/50 sm:max-w-xs", className)}>
      <SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} className="min-w-0 flex-1 bg-transparent text-body-sm outline-none placeholder:text-muted-foreground" />
    </label>
  );
}

/** Light-blue dropdown pill for a filter or the sort order. */
export function FilterPill<T extends string>({ value, options, onChange, label, sort = false }: { value: T; options: { value: T; label: string }[]; onChange: (value: T) => void; label: string; sort?: boolean }) {
  const current = options.find((option) => option.value === value)?.label ?? "";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<button type="button" aria-label={label} className="flex h-10 shrink-0 items-center gap-2 rounded-lg border bg-accent px-3 text-body-sm text-accent-foreground outline-none hover:bg-accent/70 focus-visible:ring-3 focus-visible:ring-ring/50" />}>
        {sort ? <ArrowUpDownIcon className="size-4" aria-hidden /> : null}
        {current}
        <ChevronDownIcon className="size-4" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-40">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(next as T)}>
          {options.map((option) => <DropdownMenuRadioItem key={option.value} value={option.value}>{option.label}</DropdownMenuRadioItem>)}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Title, tools, search and filters on one row, with the main action at the far end. */
export function MotoPageHeader({ title, icon: Icon, description, tools, search, filters, action, className }: {
  title: string;
  icon?: LucideIcon;
  description?: string;
  /** Round icon buttons right after the title (settings, notifications). */
  tools?: ReactNode;
  search?: ReactNode;
  filters?: ReactNode;
  /** Buttons at the far end: ✦ actions and the navy «ایجاد …». */
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="flex shrink-0 items-center gap-2 text-h2">{Icon ? <Icon className="size-6 text-primary" aria-hidden /> : null}{title}</h1>
        {tools ? <div className="flex shrink-0 items-center gap-2">{tools}</div> : null}
        {search}
        {filters ? <div className="flex flex-wrap items-center gap-2">{filters}</div> : null}
        {action ? <div className="flex flex-wrap items-center gap-2 sm:ms-auto">{action}</div> : null}
      </div>
      {description ? <p className="text-body-sm text-muted-foreground">{description}</p> : null}
    </header>
  );
}

/** The navy «ایجاد …» button with a plus sign. */
export function CreateButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return <Button type="button" onClick={onClick} className="h-10 shrink-0"><PlusIcon aria-hidden />{children}</Button>;
}

/** Small round status chips under the header. */
export function StatusTabs<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (value: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      {options.map((option) => (
        <button key={option.value} type="button" aria-pressed={option.value === value} onClick={() => onChange(option.value)} className={cn("h-8 rounded-full px-3 text-caption outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50", option.value === value ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/70")}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** Separate white squares: «قبلی ۱ ۲ ۳ بعدی». */
export function MotoPagination({ page, pageCount, onPageChange }: { page: number; pageCount: number; onPageChange: (page: number) => void }) {
  if (pageCount <= 1) return null;
  const cell = "flex h-10 min-w-10 items-center justify-center rounded-lg bg-card px-3 text-body-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:text-muted-foreground/60";
  return (
    <nav aria-label="صفحه‌ها" className="flex flex-wrap items-center justify-center gap-2">
      <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={cell}>قبلی</button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
        <button key={number} type="button" aria-current={number === page ? "page" : undefined} onClick={() => onPageChange(number)} className={cn(cell, number === page && "bg-accent text-accent-foreground")}>{fa(number)}</button>
      ))}
      <button type="button" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} className={cell}>بعدی</button>
    </nav>
  );
}

/** White card with a thin border. */
export function MotoCard({ className, children }: { className?: string; children: ReactNode }) {
  return <article className={cn("flex min-w-0 flex-col gap-3 rounded-2xl border bg-card p-5", className)}>{children}</article>;
}

/** Full-width navy «مشاهده ‹» at the bottom of a card. */
export function CardViewButton({ href, onClick, children = "مشاهده" }: { href?: string; onClick?: () => void; children?: ReactNode }) {
  const content = <>{children}<ChevronLeftIcon aria-hidden /></>;
  if (href) return <Link href={href} className={cn(buttonVariants(), "mt-auto h-10 w-full")}>{content}</Link>;
  return <Button type="button" onClick={onClick} className="mt-auto h-10 w-full">{content}</Button>;
}

/** Text link «مشاهده … ‹» for a card footer. */
export function CardViewLink({ href, onClick, children }: { href?: string; onClick?: () => void; children: ReactNode }) {
  const className = "inline-flex items-center gap-1 rounded-md text-body-sm outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50";
  const content = <>{children}<ChevronLeftIcon className="size-4" aria-hidden /></>;
  return href ? <Link href={href} className={className}>{content}</Link> : <button type="button" onClick={onClick} className={className}>{content}</button>;
}

/** The dashed box for an empty list. */
export function DashedEmpty({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed bg-card px-6 py-12 text-center">
      <p className="text-body font-medium">{title}</p>
      {description ? <p className="text-body-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}

/** The chat-style layout of the social pages: a list on the right, the open item on the left. */
export function TwoPaneShell({ list, children, hasOpenItem, emptyText, fab }: { list: ReactNode; children?: ReactNode; hasOpenItem: boolean; emptyText: string; fab?: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1">
      <aside className={cn("relative flex min-h-0 w-full shrink-0 flex-col border-e bg-card md:w-80", hasOpenItem && "max-md:hidden")}>
        <div className="min-h-0 flex-1 overflow-y-auto">{list}</div>
        {fab ? <div className="absolute bottom-4 end-4">{fab}</div> : null}
      </aside>
      <div className={cn("flex min-h-0 min-w-0 flex-1 flex-col bg-card", !hasOpenItem && "max-md:hidden")}>
        {hasOpenItem ? children : <p className="m-auto text-body-sm text-muted-foreground">{emptyText}</p>}
      </div>
    </div>
  );
}

/** Page width and spacing shared by the template's list pages. */
export function MotoPage({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto flex w-full max-w-page min-w-0 flex-col gap-6 page-gutter py-8", className)}>{children}</div>;
}

/** Title row of the list pane of TwoPaneShell, with the search box and the filters under it. */
export function PaneHeader({ title, icon: Icon, tools, search, filters }: { title: string; icon?: LucideIcon; tools?: ReactNode; search?: ReactNode; filters?: ReactNode }) {
  return (
    <header className="flex flex-col gap-3 border-b p-3">
      <div className="flex items-center gap-2">
        <h1 className="flex min-w-0 flex-1 items-center gap-2 text-h4">{Icon ? <Icon className="size-5 shrink-0 text-primary" aria-hidden /> : null}<span className="truncate">{title}</span></h1>
        {tools}
      </div>
      {search}
      {filters ? <div className="flex flex-wrap items-center gap-2">{filters}</div> : null}
    </header>
  );
}

/** Small round icon button (or link, with `href`) for the tools next to a title (gear, bell). */
export function RoundIconButton({ label, icon: Icon, onClick, href }: { label: string; icon: LucideIcon; onClick?: () => void; href?: string }) {
  const className = "flex size-9 shrink-0 items-center justify-center rounded-full border bg-card text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/50";
  if (href) return <Link href={href} aria-label={label} title={label} className={className}><Icon className="size-4" aria-hidden /></Link>;
  return <button type="button" aria-label={label} title={label} onClick={onClick} className={className}><Icon className="size-4" aria-hidden /></button>;
}

/** Round navy floating button at the bottom of the list pane; a link when `href` is given. */
export function RoundFab({ label, onClick, href, icon: Icon = PlusIcon }: { label: string; onClick?: () => void; href?: string; icon?: LucideIcon }) {
  const className = "flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50";
  if (href) return <Link href={href} aria-label={label} title={label} className={className}><Icon className="size-5" aria-hidden /></Link>;
  return <button type="button" aria-label={label} title={label} onClick={onClick} className={className}><Icon className="size-5" aria-hidden /></button>;
}
