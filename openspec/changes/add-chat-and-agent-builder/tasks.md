# Tasks

## 1. Foundation

- [x] 1.1 Add `src/app/login/page.tsx`, `src/features/user-shell/*` (sidebar, mobile sheet, top bar, theme toggle, sign-out) adapted from the admin panel; `/` redirects to `/chat`. Verify `/login` and the frame at 360px and wide.
- [x] 1.2 Add `src/features/user-session` (`getCurrentUser`, `getQuota`) and `app/(app)/layout.tsx` mounting providers. Verify `npx tsc --noEmit`.
- [x] 1.3 Add shared `error.tsx`, `loading.tsx`, `not-found.tsx` for the app frame. Verify an unknown conversation id shows not-found.

## 2. Mock data and types

- [x] 2.1 `src/features/model-catalog/{types,data}`: 6 models (internal, image-capable, tool-capable, one text-only). Verify no component imports raw arrays.
- [x] 2.2 `src/features/connections/{types,data}`: 3 connections with tools (some `requiresApproval`, one `needs-auth`, one revoked case).
- [x] 2.3 `src/features/agents/{types,data}`: personal and shared Agents, one disabled, one sensitive, skills with approval status, share requests (pending, approved, rejected with reason).
- [x] 2.4 `src/features/chat/{types,data}`: 4 conversations with messages, sources, tool runs.

## 3. Chat page

- [x] 3.1 `ChatProvider` reducer and hooks (conversations, send, stop, rename, delete, enabled connections, selected model/Agent). Verify `tsc`.
- [x] 3.2 Conversation list with search, new, rename, delete (AlertDialog) and mobile sheet. Verify "Conversation list" scenarios.
- [x] 3.3 Thread and composer with simulated streaming and stop. Verify "Send message" scenarios.
- [x] 3.4 Attachments with states and errors, per-conversation scope. Verify "File attachments" scenarios.
- [x] 3.5 Answer details (model, tools, sources) and error messages with retry. Verify "Answer details" and "Errors" scenarios.
- [x] 3.6 Quota display and exhausted state; sensitive-data warning and forbidden data. Verify those scenarios.

## 4. Pickers

- [x] 4.1 Model picker with search, automatic choice, compatibility suggestion, sensitive-Agent override. Verify "user-model-picker" scenarios.
- [x] 4.2 Connection picker, per-conversation toggles, chips beside the composer. Verify "user-connections" selection scenarios.
- [x] 4.3 Tool approval card, run status, result/error, access re-check. Verify approve, reject, error, revoked.
- [x] 4.4 Agent picker (button and `@`), Agent mode chip, leave mode, suggestion dialog, disabled/revoked reason. Verify "user-agent-chat" scenarios.

## 5. Agent builder

- [x] 5.1 `/agents` list with statuses and empty state. Verify "My Agents list".
- [x] 5.2 Agent form sections, validation, permitted options only, per-connection tool picking. Verify "Agent form" and "Pick tools" scenarios.
- [x] 5.3 Skills import/create with pending status. Verify "Skills and pending approval".
- [x] 5.4 Test panel using the chat components. Verify "Test the Agent".
- [x] 5.5 Sharing request with status and rejection reason; sensitive flag read-only; unsaved-changes guard. Verify those scenarios.

## 6. Verification and documentation

- [ ] 6.1 (lint, tsc and build pass; browser-checked so far: send and stream, tool approval, form validation at desktop width; the remaining scenarios and 360px still need a pass in verify) Check every scenario in the browser at 360px and wide, RTL, both themes, keyboard focus. Run `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- [x] 6.2 Update `AGENTS.md` (routes, features, shared components) and `product.md` delivery status after verification.
