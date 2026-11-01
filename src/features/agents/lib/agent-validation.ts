import type { CatalogModel } from "@/features/model-catalog/types";
import type { AgentDraft } from "../types";

export type AgentErrors = {
  name?: string;
  instructions?: string;
  defaultModelId?: string;
  tools?: string;
};

/** Checks required fields and whether the chosen model fits the chosen tools. */
export function validateAgent(draft: AgentDraft, sensitive: boolean, getModel: (id: string) => CatalogModel | undefined): AgentErrors {
  const errors: AgentErrors = {};
  if (!draft.name.trim()) errors.name = "نام Agent را بنویسید.";
  if (!draft.instructions.trim()) errors.instructions = "دستورالعمل Agent را بنویسید.";
  const model = getModel(draft.defaultModelId);
  if (!draft.defaultModelId || !model) {
    errors.defaultModelId = "یک مدل پیش‌فرض انتخاب کنید.";
  } else if (sensitive && !model.isInternal) {
    errors.defaultModelId = "این Agent حساس است و فقط مدل داخلی را می‌پذیرد.";
  } else if (draft.tools.length > 0 && !model.supportsTools) {
    errors.tools = `مدل «${model.name}» ابزار را پشتیبانی نمی‌کند. مدل دیگری انتخاب کنید یا ابزارها را بردارید.`;
  }
  return errors;
}
