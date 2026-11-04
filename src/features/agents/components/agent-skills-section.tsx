"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { FormSection } from "@/components/shared/form-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAgents } from "./agents-provider";
import { SkillDialog } from "./skill-dialog";

type AgentSkillsSectionProps = { skillIds: string[]; onChange: (ids: string[]) => void };

export function AgentSkillsSection({ skillIds, onChange }: AgentSkillsSectionProps) {
  const { skills, addSkill } = useAgents();
  const [open, setOpen] = useState(false);
  const hasPending = skills.some((skill) => skillIds.includes(skill.id) && skill.approval !== "approved");

  return (
    <FormSection title="مهارت‌ها" description="مهارت‌ها به عامل توانایی‌های آماده می‌دهند.">
      <div className="flex flex-col gap-3 md:col-span-2">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-start gap-2">
            <Checkbox id={`skill-${skill.id}`} checked={skillIds.includes(skill.id)} onCheckedChange={(checked) => onChange(checked === true ? [...skillIds, skill.id] : skillIds.filter((id) => id !== skill.id))} />
            <Label htmlFor={`skill-${skill.id}`} className="flex flex-col items-start gap-0.5">
              <span className="flex items-center gap-2">{skill.name}{skill.approval === "pending" ? <Badge variant="warning">در انتظار تأیید ادمین</Badge> : null}{skill.approval === "rejected" ? <Badge variant="destructive">ردشده</Badge> : null}</span>
              <span className="text-caption font-normal text-muted-foreground">{skill.description}</span>
            </Label>
          </div>
        ))}
        {hasPending ? <p className="text-body-sm text-muted-foreground">مهارت‌های در انتظار تأیید تا تأیید ادمین کار نمی‌کنند؛ در آزمایش و اجرا استفاده نمی‌شوند.</p> : null}
        <Button type="button" variant="outline" className="w-fit" onClick={() => setOpen(true)}><PlusIcon aria-hidden />افزودن مهارت</Button>
      </div>
      <SkillDialog open={open} onOpenChange={setOpen} onAdd={(content) => { const skill = addSkill(content); onChange([...skillIds, skill.id]); }} />
    </FormSection>
  );
}
