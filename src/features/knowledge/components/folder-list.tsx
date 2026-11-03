import { FolderIcon, FolderOpenIcon, LibraryIcon } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = { folders: { name: string; count: number }[]; total: number; selected: string | null; onSelect: (folder: string | null) => void };

const itemClass = "flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-start text-body-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50";

/** The folders documents live in. A row on small screens, a column from the medium width up. */
export function FolderList({ folders, total, selected, onSelect }: Props) {
  const entries = [{ name: null, label: "همه‌ی اسناد", count: total }, ...folders.map((f) => ({ name: f.name, label: f.name, count: f.count }))];
  return (
    <nav aria-label="پوشه‌ها" className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      {entries.map((entry) => {
        const active = entry.name === selected;
        const Icon = entry.name === null ? LibraryIcon : active ? FolderOpenIcon : FolderIcon;
        return (
          <button key={entry.label} type="button" aria-current={active ? "true" : undefined} onClick={() => onSelect(entry.name)} className={cn(itemClass, active && "bg-muted font-semibold")}>
            <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="min-w-0 flex-1 truncate">{entry.label}</span>
            <span className="text-caption tabular-nums text-muted-foreground">{formatNumber(entry.count)}</span>
          </button>
        );
      })}
    </nav>
  );
}
