import type { Connection, GatewayId } from "../types";

export type Gateway = {
  id: GatewayId;
  name: string;
  description: string;
  /** Kariz's own adapter for this gateway, when there is one. */
  karizAdapter?: string;
};

export const gateways: Gateway[] = [
  { id: "identity", name: "هویت", description: "ورود یکپارچه و کاربران سازمان (SSO و AD/LDAP).", karizAdapter: "کاریز SSO" },
  { id: "documents", name: "اسناد", description: "فایل‌ها و اسناد سازمان؛ دسترسی از سامانه‌ی مبدأ به ارث می‌رسد.", karizAdapter: "فایل‌های کاریز" },
  { id: "work", name: "کار و وظایف", description: "پروژه‌ها، وظایف و مسائل تیم‌ها.", karizAdapter: "پروژه‌های کاریز" },
  { id: "messaging", name: "پیام و اعلان", description: "پیام، پیامک، ایمیل و اعلان به همکاران.", karizAdapter: "گفتگو و اعلان کاریز" },
  { id: "calendar", name: "تقویم", description: "جلسه‌ها و تقویم کاری (Exchange).", karizAdapter: "تقویم کاریز" },
  { id: "data", name: "داده‌ی سازمانی", description: "پایگاه‌های داده، ERP و حسابداری؛ بیشتر فقط‌خواندنی." },
  { id: "plant", name: "سامانه‌های کارخانه", description: "MES، LIMS، CMMS، حسگرهای MQTT و SCADA/OPC-UA‏." },
  { id: "other", name: "سایر اتصال‌ها", description: "CRM، نقشه و جریان‌های وارد‌شده." },
];

const byId: Record<string, GatewayId> = {
  "conn-1": "other", "conn-2": "other", "conn-3": "data", "conn-4": "data", "conn-5": "documents", "conn-6": "work",
  "conn-7": "messaging", "conn-8": "messaging", "conn-9": "other", "conn-11": "other",
  "conn-12": "data", "conn-13": "data", "conn-14": "plant", "conn-15": "messaging", "conn-16": "plant", "conn-17": "plant",
  "conn-18": "data", "conn-19": "plant", "conn-20": "documents", "conn-21": "work", "conn-22": "work", "conn-23": "documents",
};

export function gatewayOf(connection: Connection): GatewayId {
  if (connection.gateway) return connection.gateway;
  if (byId[connection.id]) return byId[connection.id];
  const text = `${connection.name} ${connection.domain}`;
  if (/AD|LDAP|هویت/i.test(text)) return "identity";
  if (/تقویم|Exchange/i.test(text)) return "calendar";
  if (/MES|LIMS|CMMS|MQTT|SCADA|OPC|کارخانه|حسگر/i.test(text)) return "plant";
  if (/SQL|ERP|مالی|انبار|راهکاران|سپیدار/i.test(text)) return "data";
  if (/پیام|پیامک|ایمیل|اعلان/.test(text)) return "messaging";
  if (/سند|اسناد|ویکی|نامه/.test(text)) return "documents";
  if (/پروژه|وظیفه|GitLab/i.test(text)) return "work";
  return "other";
}

export function isReadOnly(connection: Connection): boolean {
  return connection.readOnly ?? /فقط.?خواندن/.test(`${connection.domain} ${connection.description}`);
}
