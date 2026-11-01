"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Attachment, AttachmentKind } from "../types";

export const acceptedTypes = ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg";
const maxBytes = 20 * 1024 * 1024;

const kinds: Record<string, AttachmentKind> = {
  pdf: "pdf", doc: "word", docx: "word", xls: "excel", xlsx: "excel", png: "image", jpg: "image", jpeg: "image",
};

function detectKind(name: string): AttachmentKind | null {
  return kinds[name.split(".").pop()?.toLowerCase() ?? ""] ?? null;
}

/** Pending attachments of one message. Upload and processing are simulated; nothing is read or kept. */
export function useAttachments() {
  const [items, setItems] = useState<Attachment[]>([]);
  const [problem, setProblem] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach(clearTimeout);
  }, []);

  const update = (id: string, patch: Partial<Attachment>) =>
    setItems((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const add = useCallback((files: FileList | File[]) => {
    setProblem(null);
    for (const file of Array.from(files)) {
      const kind = detectKind(file.name);
      if (!kind) {
        setProblem(`فایل «${file.name}» پذیرفته نشد. فقط PDF، Word، Excel و تصویر (PNG یا JPG) پشتیبانی می‌شود.`);
        continue;
      }
      if (file.size > maxBytes) {
        setProblem(`فایل «${file.name}» از ۲۰ مگابایت بزرگ‌تر است. فایل کوچک‌تری انتخاب کنید.`);
        continue;
      }
      const id = `att-new-${++counter.current}`;
      setItems((list) => [...list, { id, name: file.name, kind, status: "uploading" }]);
      timers.current.push(
        setTimeout(() => update(id, { status: "processing" }), 700),
        setTimeout(() => {
          if (file.size === 0) update(id, { status: "failed", error: "فایل خالی است. فایل دیگری انتخاب کنید یا این را برداشته و دوباره بفرستید." });
          else update(id, { status: "ready" });
        }, 2000),
      );
    }
  }, []);

  const remove = useCallback((id: string) => setItems((list) => list.filter((item) => item.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const busy = items.some((item) => item.status === "uploading" || item.status === "processing");
  const failed = items.some((item) => item.status === "failed");
  return { items, problem, add, remove, clear, busy, failed };
}
