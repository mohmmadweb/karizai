"use client";

import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AgentPatch, OrgAgent } from "../types";
import { AgentAccessTab } from "./agent-access-tab";
import { AgentPowersForm } from "./agent-powers-form";

type Props = { agent: OrgAgent | null; onOpenChange: (open: boolean) => void; onSave: (id: string, patch: AgentPatch) => void };

/** Side panel with the powers of one Agent and who may use it. */
export function AgentSheet({ agent, onOpenChange, onSave }: Props) {
  return (
    <Sheet open={agent !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-2xl">
        {agent ? (
          <>
            <SheetHeader className="pe-14">
              <SheetTitle className="text-h4">{agent.name}</SheetTitle>
              <SheetDescription>{agent.purpose}</SheetDescription>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline">مالک: {agent.owner}</Badge>
                <Badge variant="outline">واحد: {agent.unit}</Badge>
              </div>
            </SheetHeader>
            <Tabs defaultValue="powers" className="px-4 pb-6">
              <TabsList>
                <TabsTrigger value="powers">اختیارات</TabsTrigger>
                <TabsTrigger value="access">دسترسی کاربران</TabsTrigger>
              </TabsList>
              <TabsContent value="powers" className="pt-4">
                <AgentPowersForm key={agent.id} agent={agent} onSave={(patch) => onSave(agent.id, patch)} />
              </TabsContent>
              <TabsContent value="access" className="pt-4">
                <AgentAccessTab agentId={agent.id} />
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
