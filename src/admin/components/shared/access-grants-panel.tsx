"use client";

import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AccessGrantsSection, type AccessSide } from "./access-grants-section";

export type { AccessSide, AccessSubject } from "./access-grants-section";

type SubjectType = "group" | "user";

type AccessGrantsPanelProps = {
  idPrefix: string;
  groups: AccessSide;
  users: AccessSide;
  onGrant: (type: SubjectType, id: string) => void;
  onRevoke: (type: SubjectType, id: string) => void;
  /** Shown when neither a group nor a user has access yet. */
  emptyMessage?: string;
};

/**
 * Who may use one item: groups, plus users with special access. Presentational
 * and generic, so models, documents, data and tools can all reuse it.
 */
export function AccessGrantsPanel({
  idPrefix,
  groups,
  users,
  onGrant,
  onRevoke,
  emptyMessage,
}: AccessGrantsPanelProps) {
  const nobody = groups.granted.length === 0 && users.granted.length === 0;
  return (
    <div className="flex flex-col gap-8">
      {nobody && emptyMessage ? (
        <Alert variant="warning" role="status">
          <InfoIcon aria-hidden />
          <AlertDescription>{emptyMessage}</AlertDescription>
        </Alert>
      ) : null}
      <AccessGrantsSection
        idPrefix={`${idPrefix}-groups`}
        title="گروه‌ها"
        description="همه‌ی اعضای هر گروهی که اینجا اضافه شود دسترسی دارند."
        addLabel="افزودن گروه"
        placeholder="یک گروه انتخاب کنید"
        emptyPickerText="گروه دیگری برای افزودن نیست."
        searchPlaceholder="جست‌وجوی نام گروه"
        side={groups}
        onGrant={(id) => onGrant("group", id)}
        onRevoke={(id) => onRevoke("group", id)}
      />
      <AccessGrantsSection
        idPrefix={`${idPrefix}-users`}
        title="کاربران با دسترسی ویژه"
        description="دسترسی تک‌تک کاربران، علاوه بر دسترسی گروه‌هایشان."
        addLabel="افزودن کاربر"
        placeholder="یک کاربر انتخاب کنید"
        emptyPickerText="کاربر دیگری برای افزودن نیست."
        searchPlaceholder="جست‌وجوی نام یا ایمیل"
        side={users}
        onGrant={(id) => onGrant("user", id)}
        onRevoke={(id) => onRevoke("user", id)}
      />
    </div>
  );
}
