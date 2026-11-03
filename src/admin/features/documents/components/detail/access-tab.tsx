"use client";

import { toast } from "sonner";
import { AccessGrantsPanel } from "@/admin/components/shared/access-grants-panel";
import { Badge } from "@/components/ui/badge";
import { useAccess } from "@/admin/features/access-control/hooks/use-access";
import { groupAccessSide, userAccessSide } from "@/admin/features/access-control/lib/access-sides";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { useDocuments } from "../../hooks/use-documents";
import { folderGrantNames, hasNoAccess, sourceOf } from "../../lib/selectors";
import type { DocumentRecord } from "../../types";

export function AccessTab({ doc }: { doc: DocumentRecord }) {
  const { users, groups, memberships } = useDirectory();
  const { grants, grant, revoke } = useAccess();
  const { sources } = useDocuments();
  const input = { resourceType: "document" as const, resourceId: doc.id, grants, users, groups, memberships };
  const key = (type: "group" | "user", id: string) => ({
    resourceType: "document" as const,
    resourceId: doc.id,
    subjectType: type,
    subjectId: id,
  });
  const inherited = folderGrantNames(doc, grants, groups, users);
  const folder = sourceOf(doc, sources);
  const nobody = hasNoAccess(doc, grants);

  return (
    <div className="flex flex-col gap-8">
      <p className="text-body-sm text-muted-foreground">
        {doc.confidential
          ? "این سند محرمانه است و فقط موارد اضافه‌شده (اینجا یا در پوشه‌ی منبعش) آن را می‌بینند."
          : "هر کس اینجا یا در پوشه‌ی منبع سند اضافه شود، سند را می‌بیند."}
      </p>
      <AccessGrantsPanel
        idPrefix="doc-access"
        groups={groupAccessSide(input)}
        users={userAccessSide(input)}
        emptyMessage={nobody ? "هنوز هیچ‌کس به این سند دسترسی ندارد و برای هیچ‌کس نمایش داده نمی‌شود." : undefined}
        onGrant={(type, id) => {
          grant(key(type, id));
          toast.success(type === "group" ? "دسترسی گروه اضافه شد." : "دسترسی کاربر اضافه شد.");
        }}
        onRevoke={(type, id) => {
          revoke(key(type, id));
          toast.success("دسترسی برداشته شد.");
        }}
      />
      {folder && (inherited.groups.length > 0 || inherited.users.length > 0) ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-h4 text-foreground">دسترسی از طریق پوشه</h2>
          <p className="text-body-sm text-muted-foreground">
            این موارد از پوشه‌ی «{folder.name}» می‌آیند و از اینجا برداشته نمی‌شوند.
          </p>
          <ul className="flex flex-wrap gap-2">
            {[...inherited.groups, ...inherited.users].map((name) => (
              <li key={name}><Badge variant="outline">{name}</Badge></li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
