import type { Connection } from "../types";

/** Identity, calendar and plant-control systems: AD/LDAP, Exchange and SCADA over OPC-UA. */
export const gatewayConnections: Connection[] = [
  {
    id: "conn-24", name: "Active Directory (LDAP)", domain: "هویت و ساختار سازمانی", gateway: "identity", adapter: "external", readOnly: true,
    description: "کاربران، گروه‌ها و واحدها از Active Directory همگام می‌شوند؛ دسترسی‌ها از گروه‌های AD به ارث می‌رسد. فقط خواندن.",
    endpoint: "ldaps://dc01.parsapolymer.local:636", status: "ready",
    tools: [
      { id: "tool-62", name: "جست‌وجوی همکار", description: "نام، سمت، واحد و مدیر مستقیم یک همکار را از AD می‌خواند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "نام", value: "علی رضایی" }] },
      { id: "tool-63", name: "اعضای یک گروه", description: "اعضای یک گروه AD را فهرست می‌کند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "گروه", value: "QC-Team" }] },
    ],
  },
  {
    id: "conn-25", name: "Microsoft Exchange", domain: "تقویم و جلسه‌ها", gateway: "calendar", adapter: "external",
    description: "تقویم، جلسه‌ها و اتاق‌های جلسه از Exchange سازمان؛ ساخت جلسه فقط با تأیید شما.",
    endpoint: "https://mail.parsapolymer.local/EWS/Exchange.asmx", status: "needs-auth",
    tools: [
      { id: "tool-64", name: "جلسه‌های امروز من", description: "جلسه‌های امروز و فردای شما را می‌خواند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "روز", value: "امروز" }] },
      { id: "tool-65", name: "ساخت جلسه", description: "یک جلسه با شرکت‌کنندگان و اتاق می‌سازد.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "موضوع", value: "بررسی بچ مردود B-1405-212" }, { label: "زمان", value: "فردا ۱۰:۰۰" }] },
    ],
  },
  {
    id: "conn-26", name: "SCADA خطوط اکسترودر (OPC-UA)", domain: "سامانه‌ی کنترل و پایش کارخانه", gateway: "plant", adapter: "external", readOnly: true,
    description: "تگ‌های لحظه‌ای PLCهای خطوط ۱ تا ۳ از سرور OPC-UA سامانه‌ی SCADA: دمای نواحی، فشار مذاب، دور اسکرو و آلارم‌ها. فقط خواندن؛ هیچ فرمانی به دستگاه نمی‌رود.",
    endpoint: "opc.tcp://scada01.plant.local:4840", status: "ready",
    tools: [
      {
        id: "tool-66", name: "خواندن تگ OPC-UA", description: "آخرین مقدار و کیفیت یک تگ را می‌خواند.", requiresApproval: false, userCanUse: true,
        sampleInputs: [{ label: "تگ", value: "ns=2;s=Line2.Extruder.Zone4.Temp" }],
        params: [{ key: "nodeId", label: "شناسه‌ی تگ (NodeId)", kind: "text", required: true, placeholder: "ns=2;s=Line2.Extruder.Zone4.Temp" }],
        outputs: [{ key: "value", label: "مقدار تگ" }],
      },
      { id: "tool-67", name: "آلارم‌های فعال", description: "آلارم‌های فعال یک خط را با زمان و شدت می‌خواند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "خط", value: "خط ۲" }] },
    ],
  },
];
