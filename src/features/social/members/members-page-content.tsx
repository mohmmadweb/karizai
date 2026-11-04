"use client";

import Link from "@/components/shared/app-link";
import { ArrowLeftRightIcon, SettingsIcon, UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FilterPill, MotoCard, MotoPage, MotoPageHeader, MotoPagination, MotoSearch, RoundIconButton } from "@/components/shared/moto/moto";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getColleagueById } from "@/features/messenger/data/colleagues";
import { currentUserId } from "@/features/workspace/lib/people";
import { formatDate, formatNumber } from "@/lib/format";
import { AiButton } from "../components/ai-button";
import { getAgentMembers } from "../data/agents";
import { getMemberContact, getMembers, memberTotal } from "../data/members";
import { useAskAssistant } from "../lib/use-ask-assistant";

const all = "all";
const pageSize = 10;
const dash = <span className="text-muted-foreground">-</span>;

/** «اعضای سازمان»: people synced from Active Directory, and the Agents that work beside them, in the template's table. */
export function MembersPageContent() {
  const ask = useAskAssistant();
  const [query, setQuery] = useState("");
  const [unit, setUnit] = useState(all);
  const [newest, setNewest] = useState(true);
  const [page, setPage] = useState(1);
  const people = getMembers();
  const units = [...new Set([...people.map((m) => m.unit), ...getAgentMembers().map((a) => a.unit)])];
  const unitOptions = [{ value: all, label: "همه اعضا" }, ...units.map((u) => ({ value: u, label: u }))];
  const fits = (name: string, role: string, itemUnit: string) => (unit === all || itemUnit === unit) && (!query.trim() || `${name} ${role}`.includes(query.trim()));
  const shownPeople = people.filter((m) => fits(m.name, m.role, m.unit));
  const shownAgents = getAgentMembers().filter((a) => fits(a.name, "عامل هوش مصنوعی", a.unit));
  const rows = [...shownPeople.map((m) => ({ kind: "person" as const, m })), ...shownAgents.map((a) => ({ kind: "agent" as const, a }))];
  if (!newest) rows.reverse();
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pageCount);
  const visible = rows.slice((current - 1) * pageSize, current * pageSize);
  const reset = <T,>(set: (value: T) => void) => (value: T) => { set(value); setPage(1); };

  return (
    <MotoPage>
      <MotoPageHeader
        title="اعضای سازمان"
        tools={<RoundIconButton label="تنظیمات" icon={SettingsIcon} href="/settings" />}
        search={<MotoSearch value={query} onChange={reset(setQuery)} placeholder="جستجوی اعضا" />}
        filters={<>
          <FilterPill label="واحد" value={unit} options={unitOptions} onChange={reset(setUnit)} />
          <FilterPill label="ترتیب" sort value={newest ? "new" : "old"} options={[{ value: "new", label: "جدیدترین" }, { value: "old", label: "قدیمی‌ترین" }]} onChange={(v) => { setNewest(v === "new"); setPage(1); }} />
        </>}
        action={
          <>
            <Button variant="outline" className="h-10" onClick={() => toast.success(`فهرست اعضا دوباره با Active Directory همگام شد · ${formatNumber(memberTotal)} نفر`)}><ArrowLeftRightIcon data-icon="inline-start" aria-hidden />درون‌ریزی</Button>
            <Button variant="outline" className="h-10" onClick={() => toast.success("فایل Excel فهرست اعضا آماده‌ی دریافت شد")}><ArrowLeftRightIcon data-icon="inline-start" aria-hidden />برون‌ریزی</Button>
          </>
        }
      />
      <p className="text-caption text-muted-foreground">{formatNumber(memberTotal)} نفر · همگام با Active Directory</p>
      <MotoCard className="gap-0 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>نام کاربری</TableHead><TableHead>سمت</TableHead><TableHead className="hidden md:table-cell">واحد</TableHead><TableHead className="hidden lg:table-cell">شماره موبایل</TableHead><TableHead className="hidden lg:table-cell">ایمیل</TableHead><TableHead className="hidden md:table-cell">تاریخ عضویت</TableHead><TableHead>آخرین بازدید</TableHead><TableHead><span className="sr-only">اقدام</span></TableHead></TableRow></TableHeader>
            <TableBody>
              {visible.map((row) => row.kind === "person" ? (
                <TableRow key={row.m.id} className="h-[60px]">
                  <TableCell><span className="flex items-center gap-3"><PersonAvatar seed={row.m.id} name={row.m.name} className="size-10" /><span className="flex flex-col"><span>{row.m.name}</span><bdi dir="ltr" className="text-start text-caption text-muted-foreground">@{getMemberContact(row.m.id).username}</bdi></span></span></TableCell>
                  <TableCell className="whitespace-normal">{row.m.role}</TableCell>
                  <TableCell className="hidden md:table-cell">{row.m.unit}</TableCell>
                  <TableCell dir="ltr" className="hidden text-end font-mono text-caption lg:table-cell">{getMemberContact(row.m.id).mobile}</TableCell>
                  <TableCell dir="ltr" className="hidden text-end font-mono text-caption lg:table-cell">{getMemberContact(row.m.id).email}</TableCell>
                  <TableCell className="hidden text-body-sm md:table-cell">{formatDate(getMemberContact(row.m.id).joinedAt)}</TableCell>
                  <TableCell className="text-body-sm text-muted-foreground">{row.m.lastActive}</TableCell>
                  <TableCell className="text-end">
                    {row.m.id === currentUserId() ? <span className="text-caption text-muted-foreground">شما</span>
                      : getColleagueById(row.m.id) ? <Link href={`/messenger/${row.m.id}`} aria-label={`پیام به ${row.m.name}`} className={buttonVariants({ variant: "ghost", size: "icon-sm" })}><UserPlusIcon aria-hidden /></Link>
                      : <span className="text-caption text-muted-foreground">هنوز در پیام‌رسان نیست</span>}
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={row.a.id} className="h-[60px]">
                  <TableCell><span className="flex items-center gap-3"><span aria-hidden className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">✦</span><span className="flex flex-col"><span>{row.a.name}</span><bdi dir="ltr" className="text-start text-caption text-muted-foreground">{row.a.handle}</bdi></span></span></TableCell>
                  <TableCell><Badge variant="info">عامل هوش مصنوعی</Badge></TableCell>
                  <TableCell className="hidden md:table-cell">{row.a.unit}</TableCell>
                  <TableCell className="hidden lg:table-cell">{dash}</TableCell>
                  <TableCell className="hidden lg:table-cell">{dash}</TableCell>
                  <TableCell className="hidden md:table-cell">{dash}</TableCell>
                  <TableCell className="text-body-sm text-muted-foreground">همیشه</TableCell>
                  <TableCell className="text-end"><AiButton label="گفتگو" onClick={() => ask("", row.a.id)} /></TableCell>
                </TableRow>
              ))}
              {rows.length === 0 ? <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">عضوی با این مشخصات پیدا نشد.</TableCell></TableRow> : null}
            </TableBody>
          </Table>
        </div>
        <p className="border-t px-5 py-3 text-caption text-muted-foreground">نمایش {formatNumber(visible.length)} از {formatNumber(214)} نفر · نمونه: فقط ردیف‌های نخست نمایش داده می‌شود</p>
      </MotoCard>
      <MotoPagination page={current} pageCount={pageCount} onPageChange={setPage} />
      <p className="text-caption text-muted-foreground">عامل‌ها را در گروه‌ها و گفتگوها با نامشان صدا بزنید، مثلاً «@دستیار کیفیت».</p>
    </MotoPage>
  );
}
