"use client";

import { FormSection } from "@/components/shared/form-section";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useConnections } from "@/features/connections/components/connections-provider";
import type { AgentToolRef } from "../types";

type AgentToolsSectionProps = {
  tools: AgentToolRef[];
  error?: string;
  onChange: (tools: AgentToolRef[]) => void;
};

/** Tools are picked one by one from each connection; only tools the user may use are listed. */
export function AgentToolsSection({ tools, error, onChange }: AgentToolsSectionProps) {
  const { available } = useConnections();
  const connections = available
    .map((item) => ({ ...item, tools: item.tools.filter((tool) => tool.userCanUse) }))
    .filter((item) => item.tools.length > 0);

  function toggle(connectionId: string, toolId: string, on: boolean) {
    onChange(on ? [...tools, { connectionId, toolId }] : tools.filter((ref) => !(ref.connectionId === connectionId && ref.toolId === toolId)));
  }

  return (
    <FormSection title="اتصال‌ها و ابزارها" description="از هر اتصال فقط ابزارهایی را انتخاب کنید که عامل لازم دارد.">
      <div className="flex flex-col gap-4 md:col-span-2">
        {connections.length === 0 ? <p className="text-body text-muted-foreground">اتصالی در دسترس شما نیست.</p> : null}
        {connections.map((connection) => (
          <fieldset key={connection.id} className="flex flex-col gap-2 rounded-lg border p-3">
            <legend className="flex items-center gap-2 px-1 text-label">
              {connection.name}
              {connection.status === "needs-auth" ? <Badge variant="warning">نیازمند ورود</Badge> : null}
            </legend>
            {connection.tools.map((tool) => {
              const id = `tool-${connection.id}-${tool.id}`;
              return (
                <div key={tool.id} className="flex items-start gap-2">
                  <Checkbox id={id} checked={tools.some((ref) => ref.toolId === tool.id && ref.connectionId === connection.id)} onCheckedChange={(checked) => toggle(connection.id, tool.id, checked === true)} />
                  <Label htmlFor={id} className="flex flex-col items-start gap-0.5">
                    <span>{tool.name}{tool.requiresApproval ? " (اجرا با تأیید شما)" : ""}</span>
                    <span className="text-caption font-normal text-muted-foreground">{tool.description}</span>
                  </Label>
                </div>
              );
            })}
          </fieldset>
        ))}
        {error ? <FieldError>{error}</FieldError> : null}
      </div>
    </FormSection>
  );
}
