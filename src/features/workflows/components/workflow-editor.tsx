"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";
import { BackLink } from "@/components/shared/back-link";
import { EntityNotFound } from "@/components/shared/entity-not-found";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAgents } from "@/features/agents/components/agents-provider";
import { useUnsavedGuard } from "@/features/agents/hooks/use-unsaved-guard";
import { useConnections } from "@/features/connections/components/connections-provider";
import { useLive } from "@/features/live/components/live-provider";
import { effectMeta } from "@/features/live/lib/effect-meta";
import { getMlModel } from "../data/ml-models";
import { useWorkflowDraft } from "../hooks/use-workflow-draft";
import { validateWorkflow } from "../lib/validate-workflow";
import type { WorkflowNode } from "../types";
import { ApprovalPrompt } from "./approval-prompt";
import { EditorCanvas } from "./editor-canvas";
import { EditorHeader } from "./editor-header";
import { NodeProperties } from "./node-properties";
import { formatNumber } from "@/lib/format";
import { RunSteps } from "./run-steps";
import { RunsTab } from "./runs-tab";
import { RunStatusBadge } from "./workflow-status-badge";
import { TriggersPanel } from "./triggers-panel";
import { useWorkflows } from "./workflows-provider";

type WorkflowEditorProps = { workflowId: string; initialTab?: "design" | "runs" };

export function WorkflowEditor({ workflowId, initialTab = "design" }: WorkflowEditorProps) {
  const { workflows } = useWorkflows();
  const workflow = workflows.find((item) => item.id === workflowId);
  // Rendered, not thrown: a workflow created a moment ago appears as soon as the state arrives.
  if (!workflow) return <EntityNotFound title="جریان پیدا نشد" backHref="/workflows" backLabel="بازگشت به جریان‌ها" />;
  return <EditorBody key={workflow.id} workflowId={workflowId} initialTab={initialTab} />;
}

function EditorBody({ workflowId, initialTab }: Required<WorkflowEditorProps>) {
  const router = useRouter();
  const { workflows, runs, save, activate, run, rerunFrom } = useWorkflows();
  const { agents, skills } = useAgents();
  const { connections } = useConnections();
  const workflow = workflows.find((item) => item.id === workflowId)!;
  const draft = useWorkflowDraft(workflow);
  const guard = useUnsavedGuard(draft.dirty);
  const [problems, setProblems] = useState<string[]>([]);
  const latest = runs.find((item) => item.workflowId === workflowId);
  // Steps light up only for a run started in this session; old runs stay in the Runs tab.
  const liveRun = latest?.id.startsWith("run-new-") ? latest : undefined;
  const running = latest?.status === "running" || latest?.status === "waiting-approval";
  const { effects } = useLive();
  const runEffects = useMemo(() => effects.filter((item) => item.runId === liveRun?.id), [effects, liveRun?.id]);
  // The first thing each finished step did, for the caption on its block («→ وظیفه ثبت شد»).
  const stepEffects = useMemo(() => {
    const found: Record<string, string> = {};
    runEffects.forEach((item) => { if (item.nodeId && !found[item.nodeId]) found[item.nodeId] = effectMeta[item.kind].short; });
    return found;
  }, [runEffects]);

  const subtitle = useCallback(
    (node: WorkflowNode) => {
      const c = node.config;
      if (node.kind === "agent") return agents.find((a) => a.id === c.agentId)?.name;
      if (node.kind === "skill") return skills.find((s) => s.id === c.skillId)?.name;
      if (node.kind === "tool") return connections.find((x) => x.id === c.connectionId)?.tools.find((t) => t.id === c.toolId)?.name;
      if (node.kind === "orchestrator" || node.kind === "router") return `${(c.childAgentIds?.length ?? 0).toLocaleString("fa-IR")} Agent`;
      if (node.kind === "ml-model") return getMlModel(c.mlModelId)?.framework;
      if (node.kind === "code") return c.language === "javascript" ? "JavaScript" : "Python";
      if (node.kind === "supervisor") return `${(c.checks?.length ?? 0).toLocaleString("fa-IR")} معیار`;
      if (c.retries) return `تلاش دوباره: ${c.retries.toLocaleString("fa-IR")} بار`;
      return undefined;
    },
    [agents, skills, connections],
  );

  const current = () => ({ ...workflow, ...draft.draft });
  const check = () => {
    const found = validateWorkflow(current(), { agents, skills, connections });
    setProblems(found);
    return found.length === 0;
  };
  const persist = () => {
    save(current());
    draft.markSaved();
  };

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <BackLink href="/workflows">بازگشت به جریان‌ها</BackLink>
      <EditorHeader
        name={draft.draft.name}
        onRename={draft.rename}
        status={workflow.status}
        dirty={draft.dirty}
        running={running}
        onSave={() => { persist(); toast.success("تغییرها ذخیره شد."); }}
        onTest={() => { if (!check()) return; persist(); run(workflowId, "اجرای آزمایشی"); }}
        onActivate={() => {
          if (!check()) return;
          persist();
          const status = activate(workflowId);
          toast.success(status === "pending-approval" ? "برای تأیید ادمین فرستاده شد." : "کار فعال شد.", { description: status === "pending-approval" ? "تا تأیید، فقط اجرای دستی کار می‌کند." : undefined });
        }}
      />
      {problems.length > 0 ? (
        <Alert variant="destructive">
          <TriangleAlertIcon aria-hidden />
          <AlertTitle>پیش از ادامه این موارد را درست کنید</AlertTitle>
          <AlertDescription><ul className="list-disc ps-5">{problems.map((problem) => <li key={problem}>{problem}</li>)}</ul></AlertDescription>
        </Alert>
      ) : null}
      <Tabs defaultValue={initialTab}>
        <TabsList>
          <TabsTrigger value="design">طراحی</TabsTrigger>
          <TabsTrigger value="runs">اجراها</TabsTrigger>
        </TabsList>
        <TabsContent value="design" className="flex flex-col gap-6 pt-4">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <EditorCanvas draft={draft} run={liveRun} subtitle={subtitle} stepEffects={stepEffects} />
            <NodeProperties draft={draft} />
          </div>
          {liveRun ? (
            <section className="flex flex-col gap-3 rounded-xl border p-4" aria-label="اجرای فعلی" aria-live="polite">
              <h3 className="flex flex-wrap items-center gap-2 text-h4">اجرای فعلی <RunStatusBadge status={liveRun.status} /></h3>
              {liveRun.savedMs ? <p className="rounded-lg bg-info/10 p-3 text-body-sm">⚡ شاخه‌های موازی هم‌زمان اجرا شدند · زمان صرفه‌جویی‌شده: <strong>{formatNumber(Math.max(1, Math.round(liveRun.savedMs / 1000)))} ثانیه</strong></p> : null}
              <RunSteps steps={liveRun.steps} effects={runEffects} onRerun={liveRun.status === "failed" ? (nodeId) => rerunFrom(liveRun.id, nodeId) : undefined} />
            </section>
          ) : null}
          <TriggersPanel triggers={draft.draft.triggers} onChange={draft.setTriggers} />
        </TabsContent>
        <TabsContent value="runs" className="pt-4"><RunsTab workflowId={workflowId} /></TabsContent>
      </Tabs>
      <ApprovalPrompt workflow={workflow} />
      <AlertDialog open={guard.pendingHref !== null} onOpenChange={(open) => !open && guard.stay()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تغییرهای ذخیره‌نشده دارید</AlertDialogTitle>
            <AlertDialogDescription>اگر از این صفحه بروید، تغییرهای کار از بین می‌رود.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ماندن در صفحه</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => { guard.leave(); router.prefetch("/workflows"); }}>خروج بدون ذخیره</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
