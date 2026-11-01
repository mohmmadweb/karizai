"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAgents } from "@/features/agents/components/agents-provider";
import type { Skill } from "@/features/agents/types";

type SkillAgentsDialogProps = { skill: Skill; open: boolean; onOpenChange: (open: boolean) => void };

/** Choose which of the user's own Agents use the skill. */
export function SkillAgentsDialog({ skill, open, onOpenChange }: SkillAgentsDialogProps) {
  const { agents, setSkillAgents } = useAgents();
  const mine = agents.filter((agent) => agent.kind === "personal");
  const [chosen, setChosen] = useState(mine.filter((agent) => agent.skillIds.includes(skill.id)).map((agent) => agent.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agentهای دارای «{skill.name}»</DialogTitle>
          <DialogDescription>{skill.approval === "approved" ? "اسکیل را به Agentهای خود اضافه یا از آن‌ها جدا کنید." : "این اسکیل تا تأیید ادمین در Agentها کار نمی‌کند، ولی می‌توانید از حالا آن را اضافه کنید."}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {mine.length === 0 ? <p className="text-body text-muted-foreground">هنوز Agentی ندارید.</p> : null}
          {mine.map((agent) => (
            <div key={agent.id} className="flex items-center gap-2">
              <Checkbox id={`sa-${agent.id}`} checked={chosen.includes(agent.id)} onCheckedChange={(checked) => setChosen((list) => (checked === true ? [...list, agent.id] : list.filter((id) => id !== agent.id)))} />
              <Label htmlFor={`sa-${agent.id}`}>{agent.name}</Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button>
          <Button onClick={() => { setSkillAgents(skill.id, chosen); onOpenChange(false); }}>ذخیره</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
