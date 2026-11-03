"use client";

import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AccessGrantsSection, type AccessSide, type GrantPermission } from "./access-grants-section";

export type { AccessSide, AccessSubject, GrantPermission } from "./access-grants-section";

type SubjectType = "group" | "user";

type AccessGrantsPanelProps = {
  idPrefix: string;
  groups: AccessSide;
  users: AccessSide;
  onGrant: (type: SubjectType, id: string) => void;
  onRevoke: (type: SubjectType, id: string) => void;
  /** Shown when neither a group nor a user has access yet. */
  emptyMessage?: string;
  /** When given, each grant can be «خواندن» or «خواندن‌ونوشتن». */
  onPermissionChange?: (type: SubjectType, id: string, permission: GrantPermission) => void;
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
  onPermissionChange,
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
        onPermissionChange={onPermissionChange ? (id, p) => onPermissionChange("group", id, p) : undefined}
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
        onPermissionChange={onPermissionChange ? (id, p) => onPermissionChange("user", id, p) : undefined}
      />
    </div>
  );
}
