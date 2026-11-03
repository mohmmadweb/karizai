import { salesGroupId, type Group } from "../types";

const groups: Group[] = [
  { id: salesGroupId, name: "گروه فروش", description: "هماهنگی تیم فروش؛ جریان‌های قیمت‌گذاری اینجا خبر می‌دهند", kind: "group" },
  { id: "grp-quality", name: "گروه کیفیت", description: "هماهنگی آزمایشگاه و کنترل کیفیت", kind: "group" },
  { id: "chan-news", name: "اخبار سازمان", description: "اطلاعیه‌های رسمی سازمان", kind: "channel" },
];

export function getGroups(): Group[] {
  return groups;
}

export function getGroupById(id: string): Group | undefined {
  return groups.find((item) => item.id === id);
}
