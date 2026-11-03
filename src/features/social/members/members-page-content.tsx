"use client";

import Link from "next/link";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { SearchField } from "@/components/shared/search-field";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getColleagueById } from "@/features/messenger/data/colleagues";
import { currentUserId } from "@/features/workspace/lib/people";
import { formatNumber } from "@/lib/format";
import { AiButton } from "../components/ai-button";
import { getAgentMembers } from "../data/agents";
import { getMembers, memberTotal } from "../data/members";
import { useAskAssistant } from "../lib/use-ask-assistant";

const all = "all";

/** «اعضای سازمان»: people synced from Active Directory, and the Agents that work beside them. */
export function MembersPageContent() {
  const ask = useAskAssistant();
  const [query, setQuery] = useState("");
  const [unit, setUnit] = useState(all);
  const people = getMembers();
  const units = [...new Set([...people.map((m) => m.unit), ...getAgentMembers().map((a) => a.unit)])];
  const unitItems = [{ value: all, label: "همه‌ی واحدها" }, ...units.map((u) => ({ value: u, label: u }))];
  const fits = (name: string, role: string, itemUnit: string) => (unit === all || itemUnit === unit) && (!query.trim() || `${name} ${role}`.includes(query.trim()));
  const shownPeople = people.filter((m) => fits(m.name, m.role, m.unit));
  const shownAgents = getAgentMembers().filter((a) => fits(a.name, "عامل هوش مصنوعی", a.unit));

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <PageHeader title="اعضای سازمان" description={`${formatNumber(memberTotal)} نفر · همگام با Active Directory`} action={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.success(`فهرست اعضا دوباره با Active Directory همگام شد · ${formatNumber(memberTotal)} نفر`)}><UploadIcon data-icon="inline-start" aria-hidden />درون‌ریزی</Button>
          <Button variant="outline" onClick={() => toast.success("فایل Excel فهرست اعضا آماده‌ی دریافت شد")}><DownloadIcon data-icon="inline-start" aria-hidden />برون‌ریزی</Button>
        </div>
      } />
      <div className="flex flex-wrap gap-2">
        <SearchField value={query} onValueChange={setQuery} label="جست‌وجوی اعضا" placeholder="نام یا سمت..." />
        <Select items={unitItems} value={unit} onValueChange={(v) => v && setUnit(v)}>
          <SelectTrigger aria-label="واحد" className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{unitItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>نام</TableHead><TableHead>سمت</TableHead><TableHead className="hidden md:table-cell">واحد</TableHead><TableHead className="hidden sm:table-cell">آخرین فعالیت</TableHead><TableHead><span className="sr-only">اقدام</span></TableHead></TableRow></TableHeader>
          <TableBody>
            {shownPeople.map((m) => (
              <TableRow key={m.id}>
                <TableCell><span className="flex items-center gap-2"><PersonAvatar seed={m.id} name={m.name} className="size-8" />{m.name}</span></TableCell>
                <TableCell>{m.role}</TableCell>
                <TableCell className="hidden md:table-cell">{m.unit}</TableCell>
                <TableCell className="hidden text-body-sm text-muted-foreground sm:table-cell">{m.lastActive}</TableCell>
                <TableCell className="text-end">
                  {m.id === currentUserId() ? <span className="text-caption text-muted-foreground">شما</span>
                    : getColleagueById(m.id) ? <Link href={`/messenger/${m.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>پیام</Link>
                    : <span className="text-caption text-muted-foreground">هنوز در پیام‌رسان نیست</span>}
                </TableCell>
              </TableRow>
            ))}
            {shownAgents.map((a) => (
              <TableRow key={a.id}>
                <TableCell><span className="flex items-center gap-2"><span aria-hidden className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">✦</span>{a.name}</span></TableCell>
                <TableCell><Badge variant="info">عامل هوش مصنوعی</Badge></TableCell>
                <TableCell className="hidden md:table-cell">{a.unit}</TableCell>
                <TableCell className="hidden text-body-sm text-muted-foreground sm:table-cell">همیشه</TableCell>
                <TableCell className="text-end"><AiButton label="گفتگو" onClick={() => ask("", a.id)} /></TableCell>
              </TableRow>
            ))}
            {shownPeople.length + shownAgents.length === 0 ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">عضوی با این مشخصات پیدا نشد.</TableCell></TableRow> : null}
          </TableBody>
        </Table>
      </div>
      <p className="text-caption text-muted-foreground">{formatNumber(shownPeople.length)} نفر از {formatNumber(memberTotal)} نفر نمایش داده شده‌اند. عامل‌ها را در گروه‌ها و گفتگوها با نامشان صدا بزنید، مثلاً «@دستیار کیفیت».</p>
    </div>
  );
}
