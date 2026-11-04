"use client";

import { Building2Icon, CheckIcon, PaperclipIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAgents } from "@/features/agents/components/agents-provider";
import { getCurrentUser } from "@/features/user-session/data/session";
import { useOrgSkills } from "@/lib/org-skills";

/**
 * Skills the admin uploaded in «مهارت‌ها» and published for the user's groups.
 * Adding one copies it into «اسکیل‌های من» already approved, since the admin published it.
 */
export function OrgSkillsSection() {
  const { skills: orgSkills } = useOrgSkills();
  const { skills, addSkill, decideSkill } = useAgents();
  const groupIds = getCurrentUser().groupIds;
  const visible = orgSkills.filter((skill) => skill.status === "published" && (skill.groupIds.length === 0 || skill.groupIds.some((id) => groupIds.includes(id))));
  if (visible.length === 0) return null;

  function add(skill: (typeof visible)[number]) {
    const created = addSkill({ name: skill.name, description: skill.description, instructions: skill.instructions });
    decideSkill(created.id, true);
    toast.success(`اسکیل «${skill.name}» به اسکیل‌های شما اضافه شد`, { description: "حالا می‌توانید آن را به عامل‌هایتان بدهید." });
  }

  return (
    <section aria-labelledby="org-skills-title" className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Building2Icon className="size-5 text-muted-foreground" aria-hidden />
        <h2 id="org-skills-title" className="text-h4">اسکیل‌های سازمان</h2>
        <span className="text-caption text-muted-foreground">منتشرشده توسط ادمین</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((skill) => {
          const added = skills.some((item) => item.name === skill.name);
          return (
            <Card key={skill.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">{skill.name}<Badge variant="secondary">نسخه {skill.version}</Badge></CardTitle>
                <CardDescription>{skill.description}</CardDescription>
              </CardHeader>
              {skill.files.length ? (
                <CardContent className="flex flex-wrap gap-1.5">
                  {skill.files.map((file) => <Badge key={file} variant="outline"><PaperclipIcon aria-hidden /><bdi dir="ltr">{file}</bdi></Badge>)}
                </CardContent>
              ) : null}
              <CardFooter>
                <Button variant={added ? "outline" : "default"} size="sm" disabled={added} onClick={() => add(skill)}>
                  {added ? <><CheckIcon aria-hidden />افزوده شد</> : <><PlusIcon aria-hidden />افزودن به اسکیل‌های من</>}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
