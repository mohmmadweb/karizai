"use client";

import { useRef, useState } from "react";
import { FileSpreadsheetIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/admin/lib/format";
import { getExcelPreviewRows } from "../../data/excel-preview";
import { useDirectory } from "../../hooks/use-directory";

type Step = "file" | "preview" | "confirm";
const steps: Step[] = ["file", "preview", "confirm"];
const stepTitles: Record<Step, string> = {
  file: "انتخاب فایل",
  preview: "پیش‌نمایش ردیف‌ها",
  confirm: "تأیید",
};

/** Only the file name is kept; the file itself is never read. */
function ExcelImportFlow({ onClose }: { onClose: () => void }) {
  const { importUsers } = useDirectory();
  const [step, setStep] = useState<Step>("file");
  const [fileName, setFileName] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const rows = getExcelPreviewRows();
  const index = steps.indexOf(step);

  function confirm() {
    const added = importUsers(rows);
    toast.success(`${formatNumber(added)} کاربر افزوده شد.`);
    onClose();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-label text-foreground">
          مرحله‌ی {formatNumber(index + 1)} از {formatNumber(steps.length)}:{" "}
          {stepTitles[step]}
        </p>
        <Progress value={((index + 1) / steps.length) * 100} />
      </div>

      {step === "file" ? (
        <div className="flex flex-col items-start gap-3">
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={(e) => setFileName(e.target.files?.[0]?.name)}
          />
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            <FileSpreadsheetIcon aria-hidden />
            انتخاب فایل اکسل
          </Button>
          <p className="text-body-sm text-muted-foreground" dir="auto">
            {fileName ? `فایل انتخاب‌شده: ${fileName}` : "هنوز فایلی انتخاب نشده است."}
          </p>
        </div>
      ) : null}

      {step === "preview" ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>ایمیل</TableHead>
              <TableHead>گروه</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <bdi dir="ltr">{row.email}</bdi>
                </TableCell>
                <TableCell>{row.groupName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}

      {step === "confirm" ? (
        <p className="text-body">
          {formatNumber(rows.length)} کاربر آماده‌ی افزودن است. کاربران تازه «فعال»
          هستند.
        </p>
      ) : null}

      <DialogFooter>
        {step === "file" ? (
          <Button disabled={!fileName} onClick={() => setStep("preview")}>
            ادامه
          </Button>
        ) : null}
        {step === "preview" ? (
          <Button onClick={() => setStep("confirm")}>ادامه</Button>
        ) : null}
        {step === "confirm" ? <Button onClick={confirm}>افزودن کاربران</Button> : null}
        {step !== "file" ? (
          <Button variant="outline" onClick={() => setStep(steps[index - 1])}>
            بازگشت
          </Button>
        ) : null}
        <Button variant="ghost" onClick={onClose}>
          انصراف
        </Button>
      </DialogFooter>
    </div>
  );
}

type ExcelImportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ExcelImportDialog({ open, onOpenChange }: ExcelImportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>افزودن با اکسل</DialogTitle>
          <DialogDescription>
            ستون‌های فایل: نام، ایمیل، رمز عبور و گروه.
          </DialogDescription>
        </DialogHeader>
        <ExcelImportFlow onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
