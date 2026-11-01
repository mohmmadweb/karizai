"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConicalIcon } from "lucide-react";
import { toast } from "sonner";
import { BackLink } from "@/components/shared/back-link";
import { PageHeader } from "@/components/shared/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { simulateRequest } from "@/lib/simulate-request";
import { useAgentForm } from "../hooks/use-agent-form";
import { useUnsavedGuard } from "../hooks/use-unsaved-guard";
import { AgentBasicSection } from "./agent-basic-section";
import { AgentShareSection } from "./agent-share-section";
import { AgentSkillsSection } from "./agent-skills-section";
import { AgentTestPanel } from "./agent-test-panel";
import { AgentToolsSection } from "./agent-tools-section";
import { useAgents } from "./agents-provider";

/** Create (no agentId) or edit one personal Agent. */
export function AgentForm({ agentId }: { agentId?: string }) {
  const router = useRouter();
  const { agents, saveAgent, skills } = useAgents();
  const agent = agents.find((item) => item.id === agentId && item.kind === "personal");
  const form = useAgentForm(agent);
  const guard = useUnsavedGuard(form.dirty);
  const [saving, setSaving] = useState(false);
  const pendingSkills = skills.filter((skill) => form.draft.skillIds.includes(skill.id) && skill.approval === "pending");

  async function save() {
    if (!form.validate()) {
      toast.error("فرم را کامل کنید", { description: "فیلدهای دارای خطا را اصلاح کنید و دوباره ذخیره کنید." });
      return;
    }
    setSaving(true);
    await simulateRequest(600);
    const id = saveAgent(agent?.id ?? null, form.draft);
    form.markSaved();
    setSaving(false);
    toast.success(agent ? "تغییرها ذخیره شد" : "Agent ساخته شد", {
      description: pendingSkills.length ? "مهارت‌های در انتظار تأیید ادمین تا آن زمان کار نمی‌کنند." : "همین حالا می‌توانید در گفتگو از آن استفاده کنید.",
    });
    if (!agent) setTimeout(() => router.push(`/agents/${id}`), 0);
  }

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <BackLink href="/agents">بازگشت به Agentهای من</BackLink>
      <PageHeader
        title={agent ? `ویرایش ${agent.name}` : "ساخت Agent"}
        description="Agent دستیاری است با دستورالعمل، مدل و ابزارهای خودش. دسترسی آن هرگز از دسترسی خود شما بیشتر نیست."
        action={
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}><FlaskConicalIcon aria-hidden />آزمایش Agent</SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>آزمایش Agent</SheetTitle>
                <SheetDescription>با تنظیمات فعلی فرم، حتی بدون ذخیره.</SheetDescription>
              </SheetHeader>
              <AgentTestPanel draft={form.draft} name={form.draft.name} />
            </SheetContent>
          </Sheet>
        }
      />
      <form noValidate onSubmit={(event) => { event.preventDefault(); void save(); }} className="flex flex-col gap-8">
        <AgentBasicSection draft={form.draft} errors={form.errors} sensitive={agent?.isSensitive ?? false} onChange={form.setField} />
        <AgentToolsSection tools={form.draft.tools} error={form.errors.tools} onChange={(tools) => form.setField("tools", tools)} />
        <AgentSkillsSection skillIds={form.draft.skillIds} onChange={(ids) => form.setField("skillIds", ids)} />
        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={saving}>{agent ? "ذخیره‌ی تغییرها" : "ذخیره و ساخت Agent"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/agents")}>انصراف</Button>
        </div>
      </form>
      {agent ? <AgentShareSection agent={agent} /> : null}
      <AlertDialog open={guard.pendingHref !== null} onOpenChange={(open) => !open && guard.stay()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تغییرهای ذخیره‌نشده دارید</AlertDialogTitle>
            <AlertDialogDescription>اگر از این صفحه بروید، تغییرهای فرم از بین می‌رود.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ماندن در صفحه</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={guard.leave}>خروج بدون ذخیره</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
