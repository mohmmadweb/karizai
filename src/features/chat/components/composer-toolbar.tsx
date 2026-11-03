"use client";

import { useRef } from "react";
import { FolderOpenIcon, PlusIcon } from "lucide-react";
import { PromptInputAction } from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/features/agents/types";
import { acceptedTypes } from "../hooks/use-attachments";
import { ComposerMoreMenu } from "./composer-more-menu";

type ComposerToolbarProps = {
  connectionIds: string[];
  onToggleConnection: (id: string, enabled: boolean) => void;
  agents: Agent[];
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  agentOpen: boolean;
  onAgentOpenChange: (open: boolean) => void;
  onAgentSelect: (agent: Agent) => void;
  webSearch: boolean;
  onWebSearchChange: (on: boolean) => void;
  knowledge: boolean;
  onKnowledgeChange: (on: boolean) => void;
  supervisor: boolean;
  onSupervisorChange: (on: boolean) => void;
  onFiles: (files: FileList) => void;
  /** Opens «📎 فایل از کاریز». */
  onKnowledgeFile: () => void;
  optimizer: boolean;
  onOptimizerChange: (on: boolean) => void;
  disabled: boolean;
};

/** Controls inside the message box: attach and the three-dot menu. */
export function ComposerToolbar(props: ComposerToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    // The message box focuses its text field on click; menus must not lose focus to it.
    <div className="flex flex-wrap items-center gap-1" onClick={(event) => event.stopPropagation()}>
      <PromptInputAction tooltip="پیوست فایل (PDF، Word، Excel، تصویر)">
        <Button type="button" variant="ghost" size="icon" className="rounded-full" aria-label="پیوست فایل" disabled={props.disabled} onClick={() => fileRef.current?.click()}>
          <PlusIcon aria-hidden />
        </Button>
      </PromptInputAction>
      <PromptInputAction tooltip="📎 فایل از کاریز">
        <Button type="button" variant="ghost" size="icon" className="rounded-full" aria-label="فایل از کاریز" disabled={props.disabled} onClick={props.onKnowledgeFile}>
          <FolderOpenIcon aria-hidden />
        </Button>
      </PromptInputAction>
      <input
        ref={fileRef}
        type="file"
        multiple
        hidden
        accept={acceptedTypes}
        onChange={(event) => {
          if (event.target.files) props.onFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <ComposerMoreMenu
        connectionIds={props.connectionIds}
        onToggleConnection={props.onToggleConnection}
        agents={props.agents}
        open={props.menuOpen}
        onOpenChange={props.onMenuOpenChange}
        agentOpen={props.agentOpen}
        onAgentOpenChange={props.onAgentOpenChange}
        onAgentSelect={props.onAgentSelect}
        webSearch={props.webSearch}
        onWebSearchChange={props.onWebSearchChange}
        knowledge={props.knowledge}
        onKnowledgeChange={props.onKnowledgeChange}
        supervisor={props.supervisor}
        onSupervisorChange={props.onSupervisorChange}
        optimizer={props.optimizer}
        onOptimizerChange={props.onOptimizerChange}
      />
    </div>
  );
}
