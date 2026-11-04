import type { Agent, Skill } from "@/features/agents/types";
import type { Connection } from "@/features/connections/types";
import { numberFromText, paramProblem, toolParams } from "@/features/connections/lib/tool-params";
import { getMlModel } from "../data/ml-models";
import { agentParams } from "./agent-params";
import { conditionSources } from "./condition-sources";
import { hasCycle, startNodes, upstreamOf } from "./graph";
import { needsApproval } from "./describe-trigger";
import type { Workflow } from "../types";

type Context = { agents: Agent[]; skills: Skill[]; connections: Connection[] };

/** Plain-Persian problems that stop a workflow from being saved as ready; an empty list means it is fine. */
export function validateWorkflow(workflow: Workflow, { agents, skills, connections }: Context): string[] {
  const problems: string[] = [];
  const { nodes, edges } = workflow;
  if (!workflow.name.trim()) problems.push("نام کار را بنویسید.");
  if (workflow.triggers.length === 0) problems.push("دست‌کم یک راه‌انداز تعیین کنید.");
  if (nodes.length === 0) {
    problems.push("دست‌کم یک گام اضافه کنید.");
    return problems;
  }
  if (hasCycle(nodes, edges)) problems.push("مسیر کار نباید دور بزند و به گام قبلی برگردد.");
  if (nodes.length > 1) {
    startNodes(nodes, edges).slice(1).forEach((node) => problems.push(`گام «${node.label}» به گام‌های قبلی وصل نیست.`));
    nodes.filter((node) => !edges.some((e) => e.source === node.id || e.target === node.id)).forEach((node) => problems.push(`گام «${node.label}» هیچ اتصالی ندارد.`));
  }
  const unattended = needsApproval(workflow.triggers);
  for (const node of nodes) {
    const c = node.config;
    if (node.kind === "agent") {
      const agent = agents.find((a) => a.id === c.agentId);
      if (!agent) problems.push(`برای گام «${node.label}» یک عامل انتخاب کنید.`);
      else if (!agent.isEnabled) problems.push(`عامل «${agent.name}» غیرفعال است: ${agent.disabledReason ?? "در دسترس نیست."}`);
      for (const param of agentParams) {
        const problem = paramProblem(param, c.params?.[param.key] ?? param.defaultValue);
        if (problem) problems.push(`گام «${node.label}»: ${problem}`);
      }
    }
    if (node.kind === "skill") {
      const skill = skills.find((item) => item.id === c.skillId);
      const owner = agents.find((a) => a.id === c.agentId);
      if (!owner) problems.push(`اسکیل گام «${node.label}» باید زیرمجموعه‌ی یک عامل باشد؛ عامل را انتخاب کنید.`);
      else if (skill && !owner.skillIds.includes(skill.id)) problems.push(`اسکیل «${skill.name}» به عامل «${owner.name}» تعلق ندارد.`);
      if (!skill) problems.push(`برای گام «${node.label}» یک اسکیل انتخاب کنید.`);
      else if (skill.approval !== "approved") problems.push(`اسکیل «${skill.name}» هنوز تأیید ادمین را نگرفته و قابل استفاده نیست.`);
    }
    if (node.kind === "code" && !c.code?.trim()) problems.push(`کد گام «${node.label}» را بنویسید.`);
    if (node.kind === "ml-model" && !getMlModel(c.mlModelId)) problems.push(`برای گام «${node.label}» یک مدل ML ثبت‌شده انتخاب کنید.`);
    if (node.kind === "router" && !c.childAgentIds?.length) problems.push(`برای مسیریاب «${node.label}» دست‌کم یک عامل انتخاب کنید.`);
    if (node.kind === "supervisor" && !c.checks?.some((item) => item.trim())) problems.push(`برای ناظر «${node.label}» دست‌کم یک معیار بنویسید.`);
    if (node.kind === "fork" && edges.filter((e) => e.source === node.id).length < 2) problems.push(`از «${node.label}» دست‌کم دو شاخه بیرون بکشید.`);
    if (node.kind === "join" && edges.filter((e) => e.target === node.id).length < 2) problems.push(`«${node.label}» باید دست‌کم دو شاخه را به هم برساند.`);
    if (c.onError === "branch" && !edges.some((e) => e.source === node.id && e.label === "خطا")) problems.push(`برای گام «${node.label}» گام مسیر «خطا» را انتخاب کنید.`);
    if (node.kind === "orchestrator") {
      if (!c.childAgentIds?.length) problems.push(`برای هماهنگ‌کننده‌ی «${node.label}» دست‌کم یک عامل زیرمجموعه انتخاب کنید.`);
      if (!c.maxSteps || c.maxSteps < 1) problems.push(`سقف گام‌های «${node.label}» را تعیین کنید.`);
    }
    if (node.kind === "condition") {
      if (c.rule) {
        const source = conditionSources(node.id, nodes, edges, connections).find((item) => item.node.id === c.rule?.sourceNodeId);
        if (!source || !source.outputs.some((output) => output.key === c.rule?.field)) problems.push(`شرط «${node.label}» به گامی وصل است که دیگر پیش از آن نیست؛ منبع مقدار را دوباره انتخاب کنید.`);
        else if (numberFromText(c.rule.value) === null) problems.push(`برای شرط «${node.label}» یک عدد معتبر بنویسید.`);
      } else if (!c.condition?.trim()) {
        problems.push(`شرط «${node.label}» را تعیین کنید.`);
      }
    }
    if (node.kind === "tool") {
      const connection = connections.find((item) => item.id === c.connectionId);
      const tool = connection?.tools.find((item) => item.id === c.toolId);
      if (!tool || !connection) {
        problems.push(`برای گام «${node.label}» یک ابزار انتخاب کنید.`);
      } else if (connection.status !== "ready" || !tool.userCanUse) {
        problems.push(`ابزار «${tool.name}» الان در دسترس شما نیست.`);
      } else {
        for (const param of toolParams(tool)) {
          const problem = paramProblem(param, c.params?.[param.key]);
          if (problem) problems.push(`گام «${node.label}»: ${problem}`);
        }
      }
      if (connection && tool && connection.status === "ready" && tool.userCanUse && unattended && tool.requiresApproval) {
        const guarded = [...upstreamOf(node.id, edges)].some((id) => nodes.find((n) => n.id === id)?.kind === "approval");
        if (!guarded) problems.push(`ابزار «${tool.name}» نیاز به تأیید شما دارد؛ چون کار بدون حضور شما اجرا می‌شود، پیش از آن یک گام «تأیید» بگذارید.`);
      }
    }
  }
  return problems;
}
