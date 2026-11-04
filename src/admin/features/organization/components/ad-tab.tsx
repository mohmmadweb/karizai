"use client";

import { useState } from "react";
import { PlugZapIcon, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import { PasswordField } from "@/components/shared/password-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { simulateRequest } from "@/lib/simulate-request";
import type { OrgUnit } from "../data/org";

const steps = ["خواندن کاربران از AD", "تطبیق گروه‌ها با واحدها", "به‌روزرسانی دسترسی‌ها"];

/** LDAP / Active Directory: server, bind account, group mapping, test and a simulated sync. */
export function AdTab({ units }: { units: OrgUnit[] }) {
  const [values, setValues] = useState({ server: "ldaps://dc01.parsapolymer.local", port: "636", baseDn: "OU=Staff,DC=parsapolymer,DC=local", bindUser: "CN=svc-kariz,OU=Service,DC=parsapolymer,DC=local" });
  const [testing, setTesting] = useState(false);
  const [tested, setTested] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [synced, setSynced] = useState<string>("امروز ۰۶:۰۰");

  async function test() {
    setTesting(true);
    await simulateRequest(1200);
    setTesting(false);
    setTested(true);
    toast.success("اتصال برقرار شد؛ ۲۱۴ کاربر و ۱۲ گروه پیدا شد.");
  }

  async function sync() {
    for (let p = 0; p <= 100; p += 10) {
      setProgress(p);
      await simulateRequest(220);
    }
    setProgress(null);
    setSynced(new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" }).format(new Date()));
    toast.success("۲۱۴ کاربر همگام شد.");
  }

  const set = (k: keyof typeof values, v: string) => { setValues((c) => ({ ...c, [k]: v })); setTested(false); };
  const step = progress === null ? null : steps[Math.min(steps.length - 1, Math.floor(progress / 34))];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="success">همگام با AD</Badge>
        <span className="text-body-sm text-muted-foreground">آخرین همگام‌سازی: {synced} · خودکار هر ۶ ساعت · ۲۱۴ کاربر</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field><FieldLabel htmlFor="ad-server">سرور</FieldLabel><Input id="ad-server" dir="ltr" value={values.server} onChange={(e) => set("server", e.target.value)} /></Field>
        <Field><FieldLabel htmlFor="ad-port">درگاه (پورت)</FieldLabel><Input id="ad-port" dir="ltr" inputMode="numeric" value={values.port} onChange={(e) => set("port", e.target.value)} /></Field>
        <Field><FieldLabel htmlFor="ad-base">Base DN</FieldLabel><Input id="ad-base" dir="ltr" value={values.baseDn} onChange={(e) => set("baseDn", e.target.value)} /></Field>
        <Field><FieldLabel htmlFor="ad-bind">کاربر اتصال (Bind)</FieldLabel><Input id="ad-bind" dir="ltr" value={values.bindUser} onChange={(e) => set("bindUser", e.target.value)} /></Field>
        <Field><FieldLabel htmlFor="ad-pass">رمز کاربر اتصال</FieldLabel><PasswordField id="ad-pass" autoComplete="off" placeholder="فقط روی سرور نگه داشته می‌شود" /></Field>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" loading={testing} onClick={() => void test()}><PlugZapIcon aria-hidden />آزمون اتصال</Button>
        <Button disabled={progress !== null} onClick={() => void sync()}><RefreshCwIcon aria-hidden />همگام‌سازی اکنون</Button>
      </div>
      {tested ? <Alert variant="success" role="status"><AlertDescription>اتصال برقرار شد؛ ۲۱۴ کاربر و ۱۲ گروه در Base DN پیدا شد.</AlertDescription></Alert> : null}
      {progress !== null ? (
        <div className="flex flex-col gap-2" role="status">
          <Progress value={progress} aria-label="پیشرفت همگام‌سازی" />
          <span className="text-body-sm text-muted-foreground">{step}…</span>
        </div>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table aria-label="نگاشت گروه‌های AD">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4">گروه AD</TableHead>
              <TableHead className="px-4">واحد در کاریز</TableHead>
              <TableHead className="px-4">نقش پیش‌فرض</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((u) => (
              <TableRow key={u.id} className="h-12">
                <TableCell className="px-4"><bdi dir="ltr">{u.adGroup}</bdi></TableCell>
                <TableCell className="px-4">{u.name}</TableCell>
                <TableCell className="px-4 text-muted-foreground">{u.id === "u-it" ? "ادمین کل" : "کاربر"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
