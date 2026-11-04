import type { Agent } from "@/features/agents/types";
import type { Attachment } from "@/features/chat/types";
import { pickModel, type SmartRouter } from "@/lib/smart-routing";
import type { CatalogModel, ModelChoice } from "../types";

export type ModelResolution =
  | { status: "ok"; model: CatalogModel; note?: string }
  | { status: "blocked"; reason: string }
  | { status: "incompatible"; reason: string; suggestion?: CatalogModel };

type ResolveInput = {
  choice: ModelChoice;
  agent: Agent | null;
  attachments: Attachment[];
  usesTools: boolean;
  /** Models the user may use right now. */
  models: CatalogModel[];
  /** Smart routers that apply to the user (empty for sample models). */
  routers?: SmartRouter[];
  /** What the user wrote, used to judge how complex the request is. */
  prompt?: string;
  historyLength?: number;
  /** The user chose to send sensitive text to an internal model instead of masking it. */
  forceInternal?: boolean;
  /** Internet is cut: only internal models can answer. */
  offline?: boolean;
  /** Why only an internal model may answer, for example a field or file the admin marked; shown under the answer. */
  internalReason?: string;
};

type Needs = { images: boolean; tools: boolean };

const fits = (model: CatalogModel, needs: Needs) =>
  model.isAvailable && (!needs.images || model.supportsImages) && (!needs.tools || model.supportsTools);

/**
 * Decides which model really answers. A sensitive Agent (or a message the user
 * keeps inside the organization) always uses an internal model; another Agent
 * uses its own default model. If the wanted model is down, a permitted
 * alternative with the same rules takes over.
 */
export function resolveModel({ choice, agent, attachments, usesTools, models, routers = [], prompt = "", historyLength = 0, forceInternal, offline, internalReason }: ResolveInput): ModelResolution {
  const needs: Needs = {
    images: attachments.some((item) => item.kind === "image"),
    tools: usesTools || (agent?.tools.length ?? 0) > 0,
  };

  if (agent?.isSensitive || forceInternal || offline || internalReason) {
    const internal = models.filter((model) => model.isInternal && model.isAvailable);
    if (internal.length === 0) {
      return { status: "blocked", reason: "این درخواست باید فقط با مدل داخلی سازمان اجرا شود، اما الان مدل داخلی در دسترس نیست. کمی بعد دوباره تلاش کنید یا با ادمین تماس بگیرید." };
    }
    const match = internal.find((model) => fits(model, needs));
    if (!match) {
      return { status: "blocked", reason: "مدل داخلی با پیوست یا ابزار این پیام سازگار نیست. پیوست را بردارید و دوباره بفرستید." };
    }
    const wantedName = choice === "auto" || choice.startsWith("auto:") ? null : models.find((model) => model.id === choice && !model.isInternal)?.name;
    const note = agent?.isSensitive
      ? "چون عامل حساس است، مدل داخلی استفاده شد."
      : internalReason
        ? `${internalReason} پس پیام فقط با مدل داخلی «${match.name}» پردازش شد.`
        : offline
          ? `اتصال اینترنت قطع است؛ ${wantedName ? `درخواست «${wantedName}» به` : "پاسخ با"} مدل داخلی «${match.name}» ${wantedName ? "سپرده شد" : "ساخته شد"}.`
          : "طبق انتخاب شما، پیام فقط با مدل داخلی پردازش شد.";
    return { status: "ok", model: match, note };
  }

  // An Agent whose default model is not in the list (for example after the admin changed providers) falls back to the automatic choice.
  const wanted = agent
    ? models.find((model) => model.id === agent.defaultModelId)
    : choice === "auto" || choice.startsWith("auto:")
      ? undefined
      : models.find((model) => model.id === choice);

  if (wanted && fits(wanted, needs)) return { status: "ok", model: wanted };

  if (wanted && !wanted.isAvailable) {
    const alternative = models.find((model) => fits(model, needs));
    if (alternative) {
      return { status: "ok", model: alternative, note: `«${wanted.name}» الان در دسترس نبود؛ «${alternative.name}» جایگزین شد.` };
    }
    return { status: "blocked", reason: `«${wanted.name}» الان در دسترس نیست و مدل جایگزین مجازی هم پیدا نشد. کمی بعد دوباره تلاش کنید.` };
  }
  if (wanted) {
    const suggestion = models.find((model) => fits(model, needs));
    const what = needs.images && !wanted.supportsImages ? "تصویر را نمی‌فهمد" : "ابزارها را پشتیبانی نمی‌کند";
    return { status: "incompatible", reason: `مدل «${wanted.name}» ${what}.`, suggestion };
  }
  // Automatic choice: the smart router picks by how complex the prompt is.
  const router = routers.find((item) => item.id === choice.slice(5)) ?? routers.find((item) => item.isDefault);
  if (router && router.members.length > 0) {
    const pick = pickModel(router, models, prompt, { images: needs.images, tools: needs.tools, hasFiles: attachments.length > 0, historyLength });
    if (pick.ok) return { status: "ok", model: models.find((model) => model.id === pick.model.id)!, note: pick.reason };
  }
  const auto = models.find((model) => fits(model, needs));
  if (!auto) return { status: "blocked", reason: "هیچ مدل مجازی برای این درخواست در دسترس نیست. کمی بعد دوباره تلاش کنید." };
  return { status: "ok", model: auto, note: `انتخاب خودکار: «${auto.name}» با توجه به نوع درخواست، هزینه و مدل‌های در دسترس انتخاب شد.` };
}
