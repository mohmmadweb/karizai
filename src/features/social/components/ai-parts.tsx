import type { ReactNode } from "react";
import { FileTextIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/** Where an answer came from: documents, systems or colleagues' chats. */
export function SourceChips({ sources }: { sources: string[] }) {
  if (sources.length === 0) return null;
  return (
    <ul aria-label="منابع" className="flex flex-wrap gap-1.5">
      {sources.map((source) => (
        <li key={source}><Badge variant="outline" className="font-normal"><FileTextIcon aria-hidden />{source}</Badge></li>
      ))}
    </ul>
  );
}

export function AiBullets({ items }: { items: ReactNode[] }) {
  return <ul className="flex list-disc flex-col gap-1.5 ps-5 text-body-sm">{items.map((item, index) => <li key={index}>{item}</li>)}</ul>;
}

/** A row of actions under an answer. */
export function AiActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2 pt-1">{children}</div>;
}
