"use client";

import { useState } from "react";
import {
  FileSpreadsheetIcon,
  PlugIcon,
  SearchXIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchField } from "@/components/shared/search-field";
import { Button } from "@/components/ui/button";
import { useDirectory } from "../../hooks/use-directory";
import { filterUsers } from "../../lib/selectors";
import { AddUserDialog } from "./add-user-dialog";
import { ExcelImportDialog } from "./excel-import-dialog";
import { IntegrationsDialog } from "./integrations-dialog";
import { UsersList } from "./users-list";

type OpenDialog = "add" | "excel" | "integrations" | null;

export function UsersPageContent() {
  const { users, groups, memberships } = useDirectory();
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const visible = filterUsers(users, query);
  const close = (open: boolean) => {
    if (!open) setDialog(null);
  };

  const addButton = (
    <Button onClick={() => setDialog("add")}>
      <UserPlusIcon aria-hidden />
      افزودن کاربر
    </Button>
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="کاربران"
        action={
          <div className="flex flex-wrap gap-3">
            {addButton}
            <Button variant="outline" onClick={() => setDialog("excel")}>
              <FileSpreadsheetIcon aria-hidden />
              افزودن با اکسل
            </Button>
            <Button variant="outline" onClick={() => setDialog("integrations")}>
              <PlugIcon aria-hidden />
              اتصال به نرم‌افزارهای دیگر
            </Button>
          </div>
        }
      />
      {users.length === 0 ? (
        <EmptyState
          icon={<UsersIcon />}
          title="هنوز کاربری اضافه نشده است"
          description="با افزودن اولین کاربر شروع کنید."
          action={addButton}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <SearchField
            label="جست‌وجوی کاربران"
            placeholder="جست‌وجو بر اساس نام یا ایمیل"
            value={query}
            onValueChange={setQuery}
          />
          {visible.length === 0 ? (
            <EmptyState
              icon={<SearchXIcon />}
              title="کاربری پیدا نشد"
              description="نام یا ایمیل دیگری را امتحان کنید."
              action={
                <Button variant="outline" onClick={() => setQuery("")}>
                  پاک‌کردن جست‌وجو
                </Button>
              }
            />
          ) : (
            <UsersList users={visible} groups={groups} memberships={memberships} />
          )}
        </div>
      )}
      <AddUserDialog open={dialog === "add"} onOpenChange={close} />
      <ExcelImportDialog open={dialog === "excel"} onOpenChange={close} />
      <IntegrationsDialog open={dialog === "integrations"} onOpenChange={close} />
    </div>
  );
}
