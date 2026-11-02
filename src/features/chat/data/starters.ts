import type { ConversationSettings } from "../types";

export type StarterIcon = "gauge" | "database" | "wrench" | "flask" | "book" | "receipt";

/** A one-click start: it sets the Agent, connections or knowledge and puts an example question in the message box. */
export type Starter = {
  id: string;
  icon: StarterIcon;
  title: string;
  /** What it saves the user from doing by hand. */
  description: string;
  prompt: string;
  settings: Pick<ConversationSettings, "agentId" | "connectionIds" | "knowledge">;
};

const starters: Starter[] = [
  { id: "st-indicators", icon: "gauge", title: "شاخص‌های خط تولید", description: "شاخص‌های خارج از حد را پیدا می‌کند و علتش را می‌گوید.", prompt: "امروز کدام شاخص‌های خط تولید از حد مجاز خارج شده‌اند؟", settings: { agentId: "agent-indicators", connectionIds: [], knowledge: false } },
  { id: "st-reorder", icon: "database", title: "موجودی و سفارش مواد", description: "از پایگاه انبار و تدارک می‌پرسد چه موادی باید سفارش شوند.", prompt: "موجودی کدام مواد اولیه کم شده و باید سفارش بدهیم؟", settings: { agentId: null, connectionIds: ["conn-12", "conn-13"], knowledge: false } },
  { id: "st-alarm", icon: "wrench", title: "آلارم دستگاه", description: "از گزارش‌های تعمیرات و گفتگوها پیدا می‌کند دفعه‌ی قبل چه کردیم.", prompt: "دستگاه آلارم داده؛ علتش چیست و دفعه‌ی قبل چه کردیم؟", settings: { agentId: "agent-maint", connectionIds: [], knowledge: false } },
  { id: "st-quality", icon: "flask", title: "کیفیت و فرمولاسیون", description: "علت مردودی بچ را با شواهد می‌نویسد و رسپی پیشنهاد می‌دهد.", prompt: "علت مردودشدن بچ‌ها در کنترل کیفیت چیست؟", settings: { agentId: "agent-quality", connectionIds: [], knowledge: false } },
  { id: "st-knowledge", icon: "book", title: "دانش سازمانی", description: "از اسناد مجاز شما جواب می‌دهد و منبع هر بخش را نشان می‌دهد.", prompt: "شرایط نگهداری مواد اولیه در انبار چیست؟", settings: { agentId: null, connectionIds: [], knowledge: true } },
  { id: "st-pricing", icon: "receipt", title: "پیش‌فاکتور Word و Excel", description: "قیمت را حساب می‌کند و پیش‌فاکتور را به‌صورت فایل Word و Excel آماده می‌دهد.", prompt: "پیش‌فاکتور فروش را به‌صورت فایل Word و Excel آماده کن.", settings: { agentId: "agent-pricing", connectionIds: [], knowledge: false } },
];

export function getStarters(): Starter[] {
  return starters;
}
