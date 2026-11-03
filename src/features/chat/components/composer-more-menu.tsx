"use client";

import Link from "next/link";
import { BookOpenIcon, BotIcon, EllipsisIcon, GlobeIcon, PlugIcon, ShieldCheckIcon, WandSparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Agent } from "@/features/agents/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ConnectionIcon } from "@/features/connections/components/connection-icon";
import { useConnections } from "@/features/connections/components/connections-provider";
import { getCapabilities } from "@/features/user-session/data/session";

/** A check item that closes the menu when chosen and explains itself on hover or focus. */
function HintedCheckbox({ hint, checked, onCheckedChange, children }: { hint: string; checked: boolean; onCheckedChange: (on: boolean) => void; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<DropdownMenuCheckboxItem checked={checked} closeOnClick onCheckedChange={onCheckedChange} aria-description={hint} />}>
        {children}
      </TooltipTrigger>
      <TooltipContent side="left" className="max-w-64">{hint}</TooltipContent>
    </Tooltip>
  );
}

type ComposerMoreMenuProps = {
  connectionIds: string[];
  onToggleConnection: (id: string, enabled: boolean) => void;
  agents: Agent[];
  /** Opened from outside, for example when the user types @ or /. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentOpen: boolean;
  onAgentOpenChange: (open: boolean) => void;
  onAgentSelect: (agent: Agent) => void;
  webSearch: boolean;
  onWebSearchChange: (on: boolean) => void;
  knowledge: boolean;
  onKnowledgeChange: (on: boolean) => void;
  supervisor: boolean;
  onSupervisorChange: (on: boolean) => void;
  optimizer: boolean;
  onOptimizerChange: (on: boolean) => void;
};

/**
 * The three-dot menu in the message box: connections, Agent, organizational knowledge, web search, and the smart supervisor.
 * Choosing web search or the supervisor closes the menu; the choice then shows above the box.
 */
export function ComposerMoreMenu(props: ComposerMoreMenuProps) {
  const connections = useConnections().available;
  const sections = [
    { title: "شخصی", items: props.agents.filter((agent) => agent.kind === "personal") },
    { title: "اشتراکی", items: props.agents.filter((agent) => agent.kind === "shared") },
  ];

  return (
    <DropdownMenu open={props.open} onOpenChange={props.onOpenChange}>
      <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="icon" className="rounded-full" aria-label="گزینه‌های بیشتر" />}>
        <EllipsisIcon aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-48" align="start">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger><PlugIcon aria-hidden />اتصال‌ها{props.connectionIds.length ? ` (${props.connectionIds.length.toLocaleString("fa-IR")})` : ""}</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="min-w-56">
            {connections.length === 0 ? <DropdownMenuItem disabled>اتصالی در دسترس نیست</DropdownMenuItem> : null}
            {connections.map((item) => (
              <DropdownMenuCheckboxItem key={item.id} checked={props.connectionIds.includes(item.id)} disabled={item.status === "needs-auth"} onCheckedChange={(checked) => props.onToggleConnection(item.id, checked)}>
                <ConnectionIcon name={item.name} domain={item.domain} className="size-5 rounded-md" />{item.name}{item.status === "needs-auth" ? " — نیازمند ورود" : ""}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/connections" />}>مدیریت اتصال‌ها</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub open={props.agentOpen} onOpenChange={props.onAgentOpenChange}>
          <DropdownMenuSubTrigger><BotIcon aria-hidden />عامل (Agent)</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="min-w-56">
            {props.agents.length === 0 ? <DropdownMenuItem disabled>هنوز Agentی ندارید</DropdownMenuItem> : null}
            {sections.map((section) =>
              section.items.length ? (
                <DropdownMenuGroup key={section.title}>
                  <DropdownMenuLabel>{section.title}</DropdownMenuLabel>
                  {section.items.map((agent) => (
                    <DropdownMenuItem key={agent.id} onClick={() => props.onAgentSelect(agent)}>
                      {agent.name}{!agent.isEnabled ? " — غیرفعال" : agent.isSensitive ? " — حساس" : ""}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              ) : null,
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/agents" />}>مدیریت عامل‌ها</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {getCapabilities().includes("knowledge") ? (
          <HintedCheckbox hint="پاسخ را فقط از اسنادی می‌نویسد که شما اجازه‌ی خواندنشان را دارید و منبع هر بخش را نشان می‌دهد." checked={props.knowledge} onCheckedChange={props.onKnowledgeChange}><BookOpenIcon aria-hidden />دانش سازمانی</HintedCheckbox>
        ) : null}
        <HintedCheckbox hint="پاسخ را با جست‌وجو در وب کامل می‌کند و منبع‌ها را با لینک می‌آورد." checked={props.webSearch} onCheckedChange={props.onWebSearchChange}><GlobeIcon aria-hidden />جست‌وجوی وب</HintedCheckbox>
        <HintedCheckbox hint="یک عامل مستقل درستی و کیفیت پاسخ را بررسی و در صورت نیاز اصلاح می‌کند؛ توکن و زمان بیشتری مصرف می‌کند." checked={props.supervisor} onCheckedChange={props.onSupervisorChange}><ShieldCheckIcon aria-hidden />ناظر هوشمند</HintedCheckbox>
        <HintedCheckbox hint="پیش از ارسال، عبارت‌های اضافه حذف و پیام‌های قبلی خلاصه می‌شود تا توکن و هزینه کمتر شود؛ پرامپت اصلی و فشرده زیر پاسخ دیده می‌شود." checked={props.optimizer} onCheckedChange={props.onOptimizerChange}><WandSparklesIcon aria-hidden />✦ بهینه‌ساز پرامپت</HintedCheckbox>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
