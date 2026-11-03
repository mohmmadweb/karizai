import type {
  EntityStatus,
  Group,
  GroupEditInput,
  Membership,
  NewGroupInput,
  NewUserInput,
  User,
} from "../types";

export type DirectoryState = {
  users: User[];
  groups: Group[];
  memberships: Membership[];
  /** Counters for ids of records created in this browser session. */
  nextUser: number;
  nextGroup: number;
};

export type DirectoryAction =
  | { type: "addUsers"; users: NewUserInput[]; groupNames?: string[]; now: string }
  | { type: "updateUser"; id: string; input: NewUserInput }
  | { type: "setUserStatus"; id: string; status: EntityStatus }
  | { type: "addGroup"; input: NewGroupInput; now: string }
  | { type: "updateGroup"; id: string; input: GroupEditInput }
  | { type: "setGroupStatus"; id: string; status: EntityStatus }
  | { type: "addMember"; userId: string; groupId: string }
  | { type: "removeMember"; userId: string; groupId: string };

export function createDirectoryState(
  users: User[],
  groups: Group[],
  memberships: Membership[],
): DirectoryState {
  return {
    users,
    groups,
    memberships,
    nextUser: users.length + 1,
    nextGroup: groups.length + 1,
  };
}

export const padId = (prefix: string, n: number) =>
  `${prefix}-${String(n).padStart(3, "0")}`;

export function directoryReducer(
  state: DirectoryState,
  action: DirectoryAction,
): DirectoryState {
  switch (action.type) {
    case "addUsers": {
      const users = [...state.users];
      const memberships = [...state.memberships];
      let next = state.nextUser;
      action.users.forEach((input, index) => {
        const id = padId("user", next++);
        users.push({
          id,
          name: input.name.trim(),
          email: input.email.trim(),
          status: "active",
          role: "user",
          createdAt: action.now,
        });
        const group = state.groups.find(
          (g) => g.name === action.groupNames?.[index] && g.status === "active",
        );
        if (group) memberships.push({ userId: id, groupId: group.id });
        for (const groupId of input.groupIds ?? []) {
          const chosen = state.groups.find((g) => g.id === groupId && g.status === "active");
          if (chosen && !memberships.some((m) => m.userId === id && m.groupId === groupId)) {
            memberships.push({ userId: id, groupId });
          }
        }
      });
      return { ...state, users, memberships, nextUser: next };
    }
    case "updateUser":
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.id
            ? { ...u, name: action.input.name.trim(), email: action.input.email.trim() }
            : u,
        ),
      };
    case "setUserStatus":
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.id ? { ...u, status: action.status } : u,
        ),
      };
    case "addGroup":
      return {
        ...state,
        groups: [
          ...state.groups,
          {
            id: padId("group", state.nextGroup),
            code: action.input.code.trim().toLowerCase(),
            name: action.input.name.trim(),
            description: action.input.description.trim(),
            status: "active",
            createdAt: action.now,
          },
        ],
        nextGroup: state.nextGroup + 1,
      };
    case "updateGroup":
      return {
        ...state,
        groups: state.groups.map((g) =>
          g.id === action.id
            ? {
                ...g,
                name: action.input.name.trim(),
                description: action.input.description.trim(),
              }
            : g,
        ),
      };
    case "setGroupStatus":
      return {
        ...state,
        groups: state.groups.map((g) =>
          g.id === action.id ? { ...g, status: action.status } : g,
        ),
      };
    case "addMember":
      return {
        ...state,
        memberships: [
          ...state.memberships,
          { userId: action.userId, groupId: action.groupId },
        ],
      };
    case "removeMember":
      return {
        ...state,
        memberships: state.memberships.filter(
          (m) => !(m.userId === action.userId && m.groupId === action.groupId),
        ),
      };
  }
}
