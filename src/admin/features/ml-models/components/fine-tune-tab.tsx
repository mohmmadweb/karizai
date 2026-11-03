"use client";

import { useEffect, useState } from "react";
import { PlusIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatNumber } from "@/admin/lib/format";
import { getFineTuneJobs, type FineTuneJob } from "../data/ml-models";

const statusView = { queued: { label: "در صف", variant: "secondary" }, training: { label: "در حال آموزش", variant: "info" }, done: { label: "تکمیل شد", variant: "success" } } as const;
const bases = ["Qwen ۲٫۵ ۷۲B", "Qwen ۳ ۳۲B", "Llama ۳٫۱ ۸B"].map((b) => ({ value: b, label: b }));

/** Fine-tune jobs on the organization's GPU server; progress is simulated and resets on refresh. */
export function FineTuneTab() {
  const [jobs, setJobs] = useState(getFineTuneJobs);
  const [name, setName] = useState("");
  const [base, setBase] = useState(bases[0].value);
  useEffect(() => {
    const timer = setInterval(() => {
      setJobs((list) => {
        const training = list.some((j) => j.status === "training");
        return list.map((j, i): FineTuneJob => {
          if (j.status === "training") {
            const progress = Math.min(100, j.progress + 2);
            return progress >= 100 ? { ...j, progress, status: "done", evalScore: 86 + (i % 6) } : { ...j, progress };
          }
          if (!training && j.status === "queued" && list.findIndex((x) => x.status === "queued") === i) return { ...j, status: "training", progress: 2 };
          return j;
        });
      });
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  function add() {
    if (!name.trim()) return toast.error("نام مدل اختصاصی را بنویسید.");
    setJobs((l) => [...l, { id: `ft-${Date.now()}`, name: name.trim(), baseModel: base, dataset: "اسناد پوشه‌ی انتخاب‌شده در دانش سازمانی", status: "queued", progress: 0, evalScore: null, published: false }]);
    setName("");
    toast.success("کار آموزش در صف قرار گرفت.");
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {jobs.map((j) => (
          <li key={j.id} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex flex-wrap items-center gap-2 font-medium">{j.name}<Badge variant={statusView[j.status].variant}>{statusView[j.status].label}</Badge>{j.published ? <Badge variant="success">منتشر در مدل‌های سازمان</Badge> : null}</span>
              {j.status === "done" && !j.published ? (
                <Button size="sm" variant="outline" onClick={() => { setJobs((l) => l.map((x) => (x.id === j.id ? { ...x, published: true } : x))); toast.success("به فهرست مدل‌های سرور سازمان اضافه شد."); }}><UploadIcon aria-hidden />انتشار</Button>
              ) : null}
            </div>
            <span className="text-body-sm text-muted-foreground">مدل پایه: {j.baseModel} · داده: {j.dataset}{j.evalScore !== null ? ` · امتیاز ارزیابی ${formatNumber(j.evalScore)}٪` : ""}</span>
            <Progress value={j.progress} aria-label={`پیشرفت ${j.name}`} />
          </li>
        ))}
      </ul>
      <form noValidate onSubmit={(e) => { e.preventDefault(); add(); }} className="flex flex-wrap items-end gap-3 rounded-xl border border-border p-4">
        <label className="flex flex-col gap-1 text-label">نام مدل اختصاصی<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً پاسخگوی فنی فروش" className="w-56" /></label>
        <label className="flex flex-col gap-1 text-label">مدل پایه
          <Select items={bases} value={base} onValueChange={(v) => v && setBase(v)}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent><SelectGroup>{bases.map((b) => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}</SelectGroup></SelectContent>
          </Select>
        </label>
        <Button type="submit"><PlusIcon aria-hidden />کار آموزش تازه</Button>
      </form>
    </div>
  );
}
