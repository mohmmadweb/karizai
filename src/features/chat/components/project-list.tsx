"use client";

import { useState } from "react";
import { FolderPlusIcon } from "lucide-react";
import { useChat } from "./chat-provider";
import { ProjectNameDialog } from "./project-name-dialog";
import { ProjectRow } from "./project-row";

/** The user's chat projects for the sidebar, with a button to make a new one. */
export function ProjectList({ activeId, onNavigate }: { activeId: string | null; onNavigate?: () => void }) {
  const { state, createProject } = useChat();
  const [creating, setCreating] = useState(false);
  return (
    <div className="flex flex-col gap-0.5">
      <button type="button" onClick={() => setCreating(true)} className="flex h-9 items-center gap-2 rounded-lg px-3 text-start text-label outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">
        <FolderPlusIcon className="size-4" aria-hidden />پروژه‌ی تازه
      </button>
      {state.projects.length === 0 ? (
        <p className="px-3 py-2 text-caption text-muted-foreground">هنوز پروژه‌ای ندارید.</p>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {state.projects.map((project) => <ProjectRow key={project.id} project={project} activeId={activeId} onNavigate={onNavigate} />)}
        </ul>
      )}
      <ProjectNameDialog open={creating} onOpenChange={setCreating} title="پروژه‌ی تازه" onSubmit={(name) => createProject(name)} />
    </div>
  );
}
