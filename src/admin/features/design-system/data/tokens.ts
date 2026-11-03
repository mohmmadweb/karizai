import type { ColorPair, ScaleItem, TypeRole } from "../types";

// Token pairs to check. Their colors are read live from globals.css in the
// current theme, so a color change needs no edit here.
const colorPairs: ColorPair[] = [
  { id: "background", label: "زمینه و متن", background: "background", foreground: "foreground", target: 4.5 },
  { id: "card", label: "کارت", background: "card", foreground: "card-foreground", target: 4.5 },
  { id: "primary", label: "اصلی", background: "primary", foreground: "primary-foreground", target: 4.5 },
  { id: "secondary", label: "ثانویه", background: "secondary", foreground: "secondary-foreground", target: 4.5 },
  { id: "muted", label: "کم‌رنگ", background: "muted", foreground: "muted-foreground", target: 4.5 },
  { id: "accent", label: "تأکید", background: "accent", foreground: "accent-foreground", target: 4.5 },
  { id: "destructive", label: "خطا و حذف", background: "destructive", foreground: "destructive-foreground", target: 4.5 },
  { id: "success", label: "موفقیت", background: "success", foreground: "success-foreground", target: 4.5 },
  { id: "warning", label: "هشدار", background: "warning", foreground: "warning-foreground", target: 4.5 },
  { id: "info", label: "اطلاع", background: "info", foreground: "info-foreground", target: 4.5 },
  { id: "input", label: "حاشیه کنترل", background: "background", foreground: "input", target: 3 },
  { id: "ring", label: "حلقه فوکوس", background: "background", foreground: "ring", target: 3 },
];

const typeRoles: TypeRole[] = [
  { id: "display", label: "عنوان بزرگ", className: "text-display", spec: "۴۰/۵۶ · ۷۰۰" },
  { id: "h1", label: "عنوان ۱", className: "text-h1", spec: "۳۲/۴۸ · ۷۰۰" },
  { id: "h2", label: "عنوان ۲", className: "text-h2", spec: "۲۸/۴۲ · ۷۰۰" },
  { id: "h3", label: "عنوان ۳", className: "text-h3", spec: "۲۴/۳۶ · ۶۰۰" },
  { id: "h4", label: "عنوان ۴", className: "text-h4", spec: "۲۰/۳۲ · ۶۰۰" },
  { id: "body-lg", label: "متن بزرگ", className: "text-body-lg", spec: "۱۸/۳۲ · ۴۰۰" },
  { id: "body", label: "متن", className: "text-body", spec: "۱۶/۲۸ · ۴۰۰" },
  { id: "body-sm", label: "متن کوچک", className: "text-body-sm", spec: "۱۴/۲۴ · ۴۰۰" },
  { id: "label", label: "برچسب و دکمه", className: "text-label", spec: "۱۴/۲۴ · ۶۰۰" },
  { id: "caption", label: "توضیح کوتاه", className: "text-caption", spec: "۱۲/۲۰ · ۴۰۰" },
];

const spacing: ScaleItem[] = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80].map(
  (px) => ({ id: `s-${px}`, label: `${px}px`, value: `${px}px` }),
);

const radii: ScaleItem[] = [
  { id: "sm", label: "کوچک ۶px", value: "var(--radius-sm)" },
  { id: "md", label: "متوسط ۸px", value: "var(--radius-md)" },
  { id: "lg", label: "کنترل ۱۰px", value: "var(--radius-lg)" },
  { id: "xl", label: "بزرگ ۱۶px", value: "var(--radius-xl)" },
  { id: "full", label: "کامل", value: "9999px" },
];

const shadows: ScaleItem[] = [
  { id: "flat", label: "تخت (بخش‌های صفحه)", value: "none" },
  { id: "sm", label: "کارت", value: "var(--shadow-sm)" },
  { id: "lg", label: "منو، پنجره، پنل", value: "var(--shadow-lg)" },
];

const chartIds = [1, 2, 3, 4, 5];

export const getColorPairs = () => colorPairs;
export const getTypeRoles = () => typeRoles;
export const getSpacingScale = () => spacing;
export const getRadii = () => radii;
export const getShadows = () => shadows;
export const getChartIds = () => chartIds;
