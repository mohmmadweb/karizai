import type { CatalogModel } from "../types";

/** A version released in the last 45 days counts as new. */
const newForDays = 45;

export function isNewModel(model: CatalogModel, now = Date.now()): boolean {
  return Boolean(model.releasedAt) && now - new Date(model.releasedAt!).getTime() <= newForDays * 864e5;
}

/** A model without a group list is open to everyone. */
export function isAllowedForGroups(model: CatalogModel, groupIds: string[]): boolean {
  return !model.allowedGroupIds || model.allowedGroupIds.some((id) => groupIds.includes(id));
}
