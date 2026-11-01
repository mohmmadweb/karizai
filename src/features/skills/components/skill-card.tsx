"use client";

import { useState } from "react";
import { BotIcon, PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAgents } from "@/features/agents/components/agents-provider";
import type { Skill, SkillContent } from "@/features/agents/types";
import { SkillAgentsDialog } from "./skill-agents-dialog";
import { SkillFormDialog } from "./skill-form-dialog";

const approvalBadge = {
  approved: <Badge variant="success">تأییدشده</Badge>,
  pending: <Badge variant="warning">در انتظار تأیید ادمین</Badge>,
  rejected: <Badge variant="destructive">ردشده</Badge>,
} as const;

export function SkillCard({ skill }: { skill: Skill }) {
  const { agents, editSkill } = useAgents();
  const [editing, setEditing] = useState(false);
  const [attaching, setAttaching] = useState(false);
  const used = agents.filter((agent) => agent.kind === "personal" && agent.skillIds.includes(skill.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">{skill.name}{approvalBadge[skill.approval]}</CardTitle>
        <CardDescription>{skill.description || "بدون توضیح"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-body-sm">
        <p className="line-clamp-3 text-muted-foreground">{skill.instructions}</p>
        {skill.approval === "rejected" && skill.rejectionReason ? <p className="text-destructive">دلیل رد: {skill.rejectionReason}</p> : null}
        {skill.pendingEdit ? <p className="text-warning-foreground dark:text-warning">نسخه‌ی جدید در انتظار تأیید است؛ نسخه‌ی فعلی همچنان فعال است.</p> : null}
        <p className="text-muted-foreground">Agentها: {used.length ? used.map((agent) => agent.name).join("، ") : "هیچ Agentی"}</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}><PencilIcon aria-hidden />ویرایش</Button>
          <Button size="sm" variant="outline" onClick={() => setAttaching(true)}><BotIcon aria-hidden />Agentها</Button>
        </div>
      </CardContent>
      {editing ? <SkillFormDialog key={`${skill.id}-edit`} open onOpenChange={setEditing} skill={skill} onSave={(content: SkillContent) => editSkill(skill.id, content)} /> : null}
      {attaching ? <SkillAgentsDialog key={`${skill.id}-agents`} skill={skill} open onOpenChange={setAttaching} /> : null}
    </Card>
  );
}
