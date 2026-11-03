"use client";

import {
  createContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  createDirectoryState,
  directoryReducer,
  padId,
  type DirectoryState,
} from "../lib/directory-reducer";
import type {
  ActionResult,
  AddGroupResult,
  ExcelPreviewRow,
  Group,
  GroupEditInput,
  Membership,
  NewGroupInput,
  NewUserInput,
  User,
} from "../types";

export type DirectoryContextValue = {
  users: User[];
  groups: Group[];
  memberships: Membership[];
  addUser: (input: NewUserInput) => ActionResult;
  /** Returns how many rows were added; rows with a known email are skipped. */
  importUsers: (rows: ExcelPreviewRow[]) => number;
  updateUser: (id: string, input: NewUserInput) => ActionResult;
  setUserStatus: (id: string, active: boolean) => ActionResult;
  addGroup: (input: NewGroupInput) => AddGroupResult;
  updateGroup: (id: string, input: GroupEditInput) => ActionResult;
  setGroupStatus: (id: string, active: boolean) => ActionResult;
  addMember: (userId: string, groupId: string) => ActionResult;
  removeMember: (userId: string, groupId: string) => ActionResult;
};

export const DirectoryContext = createContext<DirectoryContextValue | null>(null);

const ok: ActionResult = { ok: true };
const fail = (error: string) => ({ ok: false, error }) as const;
const same = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase();

type DirectoryProviderProps = {
  initialUsers: User[];
  initialGroups: Group[];
  initialMemberships: Membership[];
  children: ReactNode;
};

/** Temporary in-memory state shared by the users and groups pages. */
export function DirectoryProvider({
  initialUsers,
  initialGroups,
  initialMemberships,
  children,
}: DirectoryProviderProps) {
  const [state, dispatch] = useReducer(
    directoryReducer,
    undefined,
    (): DirectoryState =>
      createDirectoryState(initialUsers, initialGroups, initialMemberships),
  );
  const emailTaken = (email: string, exceptId?: string) =>
    state.users.some((u) => u.id !== exceptId && same(u.email, email));
  const codeTaken = (code: string) => state.groups.some((g) => same(g.code, code));
  const nameTaken = (name: string, exceptId?: string) =>
    state.groups.some((g) => g.id !== exceptId && same(g.name, name));

  const value = useMemo<DirectoryContextValue>(
    () => ({
      users: state.users,
      groups: state.groups,
      memberships: state.memberships,
      addUser: (input) => {
        if (emailTaken(input.email)) return fail("این ایمیل قبلاً استفاده شده است.");
        dispatch({ type: "addUsers", users: [input], now: new Date().toISOString() });
        return ok;
      },
      importUsers: (rows) => {
        const fresh = rows.filter((r) => !emailTaken(r.email));
        if (fresh.length)
          dispatch({
            type: "addUsers",
            users: fresh,
            groupNames: fresh.map((r) => r.groupName),
            now: new Date().toISOString(),
          });
        return fresh.length;
      },
      updateUser: (id, input) => {
        if (emailTaken(input.email, id)) return fail("این ایمیل قبلاً استفاده شده است.");
        dispatch({ type: "updateUser", id, input });
        return ok;
      },
      setUserStatus: (id, active) => {
        const user = state.users.find((u) => u.id === id);
        if (!user) return fail("کاربر پیدا نشد.");
        if (!active && user.role === "admin")
          return fail("ادمین نمی‌تواند خودش را غیرفعال کند.");
        dispatch({ type: "setUserStatus", id, status: active ? "active" : "inactive" });
        return ok;
      },
      addGroup: (input) => {
        if (nameTaken(input.name)) return fail("گروهی با این نام وجود دارد.");
        if (codeTaken(input.code)) return fail("گروهی با این کد وجود دارد.");
        dispatch({ type: "addGroup", input, now: new Date().toISOString() });
        return { ok: true, id: padId("group", state.nextGroup) };
      },
      updateGroup: (id, input) => {
        if (nameTaken(input.name, id)) return fail("گروهی با این نام وجود دارد.");
        dispatch({ type: "updateGroup", id, input });
        return ok;
      },
      setGroupStatus: (id, active) => {
        dispatch({ type: "setGroupStatus", id, status: active ? "active" : "inactive" });
        return ok;
      },
      addMember: (userId, groupId) => {
        const { users, groups, memberships } = state;
        const user = users.find((u) => u.id === userId);
        const group = groups.find((g) => g.id === groupId);
        if (!user || !group) return fail("مورد پیدا نشد.");
        if (user.status !== "active")
          return fail("کاربر غیرفعال را نمی‌شود به گروه اضافه کرد.");
        if (group.status !== "active")
          return fail("به گروه غیرفعال عضو اضافه نمی‌شود.");
        if (memberships.some((m) => m.userId === userId && m.groupId === groupId))
          return fail("این کاربر قبلاً عضو گروه است.");
        dispatch({ type: "addMember", userId, groupId });
        return ok;
      },
      removeMember: (userId, groupId) => {
        dispatch({ type: "removeMember", userId, groupId });
        return ok;
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  );

  return (
    <DirectoryContext.Provider value={value}>{children}</DirectoryContext.Provider>
  );
}
