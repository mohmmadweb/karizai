"use client";

import type { ReactNode } from "react";
import { BookOpenIcon, BotIcon, GlobeIcon, ShieldCheckIcon, XIcon } from "lucide-react";
import type { Agent } from "@/features/agents/types";
import { ConnectionIcon } from "@/features/connections/components/connection-icon";
import { useConnections } from "@/features/connections/components/connections-provider";

type ComposerPillsProps = {
  agent: Agent | null;
  onLeaveAgent: () => void;
  connectionIds: string[];
  onToggleConnection: (id: string, enabled: boolean) => void;
  knowledge: boolean;
  onKnowledgeOff: () => void;
  webSearch: boolean;
  onWebSearchOff: () => void;
  supervisor: boolean;
  onSupervisorOff: () => void;
};

/** One chosen option inside the message box; pressing it turns the option off. */
function Pill({ icon, label, offLabel, onOff }: { icon: ReactNode; label: string; offLabel: string; onOff: () => void }) {
  return (
    <button
      type="button"
      aria-label={offLabel}
      title={offLabel}
      onClick={onOff}
      className="group inline-flex h-8 max-w-72 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 ps-2.5 pe-2 text-label text-primary outline-none transition-colors hover:bg-primary/15 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span aria-hidden className="flex shrink-0 items-center [&_svg]:size-4">{icon}</span>
      <span className="truncate">{label}</span>
      <XIcon aria-hidden className="size-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
    </button>
  );
}

/** What the user has switched on for this message, shown inside the message box like toggle chips. */
export function ComposerPills(props: ComposerPillsProps) {
  const { available } = useConnections();
  const connections = available.filter((item) => props.connectionIds.includes(item.id));
  return (
    <>
      {props.agent ? <Pill icon={<BotIcon />} label={`Agent: ${props.agent.name}`} offLabel="خروج از حالت Agent" onOff={props.onLeaveAgent} /> : null}
      {props.knowledge ? <Pill icon={<BookOpenIcon />} label="دانش سازمانی" offLabel="خاموش کردن دانش سازمانی" onOff={props.onKnowledgeOff} /> : null}
      {props.webSearch ? <Pill icon={<GlobeIcon />} label="جست‌وجوی وب" offLabel="خاموش کردن جست‌وجوی وب" onOff={props.onWebSearchOff} /> : null}
      {props.supervisor ? <Pill icon={<ShieldCheckIcon />} label="ناظر هوشمند" offLabel="خاموش کردن ناظر هوشمند" onOff={props.onSupervisorOff} /> : null}
      {connections.map((item) => (
        <Pill key={item.id} icon={<ConnectionIcon name={item.name} domain={item.domain} className="size-5 rounded-md" />} label={item.name} offLabel={`خاموش کردن ${item.name}`} onOff={() => props.onToggleConnection(item.id, false)} />
      ))}
    </>
  );
}
