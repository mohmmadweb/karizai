import { FileIcon, ImageIcon, XIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { Attachment } from "../types";

const statusText: Record<Attachment["status"], string> = {
  uploading: "در حال بارگذاری",
  processing: "در حال پردازش",
  ready: "آماده",
  failed: "ناموفق",
};

type AttachmentChipProps = {
  attachment: Attachment;
  onRemove?: () => void;
};

export function AttachmentChip({ attachment, onRemove }: AttachmentChipProps) {
  const busy = attachment.status === "uploading" || attachment.status === "processing";
  const Icon = attachment.kind === "image" ? ImageIcon : FileIcon;
  const ocr = attachment.kind === "image" && attachment.status === "processing";
  return (
    <div className={cn("flex max-w-full flex-col gap-0.5 rounded-lg border bg-card px-3 py-2 text-caption", attachment.status === "failed" && "border-destructive/50")}>
      <div className="flex items-center gap-2">
        {busy ? <Spinner /> : <Icon className="size-4 shrink-0" aria-hidden />}
        <span className="truncate text-label">{attachment.name}</span>
        <span className={cn("shrink-0 text-muted-foreground", attachment.status === "failed" && "text-destructive")}>
          {ocr ? "در حال خواندن متن فارسی تصویر" : statusText[attachment.status]}
        </span>
        {onRemove ? (
          <button type="button" onClick={onRemove} aria-label={`برداشتن ${attachment.name}`} className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <XIcon className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>
      {attachment.error ? <p className="text-destructive">{attachment.error}</p> : null}
    </div>
  );
}
