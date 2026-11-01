# Design

## Context

See proposal.md and specs/. New project `New-Moshekaf-User-Panel` (port 3001), bootstrapped by copying the admin panel's config, tokens, fonts, brand assets, `src/components/ui`, shared components (except access panels), and `src/lib`. The admin panel is not touched. Phase 1 scope lock applies: no backend, API route, Server Action, network request, or persistent storage. Streaming, OCR, tool runs, quota, and sharing approval are simulated with timers over local mock data (`simulateRequest`).

## Goals / Non-Goals

**Goals:** two main pages (chat, agent builder) with temporary shared client state; typed mock records shaped like real ones; reuse admin shell patterns.

**Non-Goals:** real AI answers, artifacts, provider/admin features, any persistence.

## Decisions

### Routes
- `/login`; `/chat` and `/chat/[conversationId]`; `/agents`, `/agents/new`, `/agents/[agentId]`; `/` redirects to `/chat`. Each with `loading.tsx` / `not-found.tsx` where needed, plus an `error.tsx` in the app frame. Route pages stay thin.

### Features (`src/features`)
- `user-shell`: sidebar, mobile sheet, top bar, mock sign-in (copied and adapted from admin-shell and auth).
- `chat`: conversation list, thread, composer, attachments, answer details, quota bar, sensitive-data check. State in one `ChatProvider` (reducer) mounted in the app layout; streaming via a `useStreamingAnswer` hook (interval, stop via cleanup flag).
- `model-catalog`: `getAvailableModels()` returns permitted models with `isInternal`, `supportsImages`, `supportsTools`; `selectModel` logic in `lib/compatibility.ts`.
- `connections`: `getAvailableConnections()` with tools (`requiresApproval`), `status: ready | needs-auth`; per-conversation enabled ids in `ChatProvider`; `lib/run-tool.ts` re-checks access via `getUserAccess()` before simulating a run.
- `agents`: `getMyAgents()`, `getSharedAgents()`, share-request records (`pending | approved | rejected` + `rejectionReason`), `AgentsProvider` for create/edit; form split into sections (`FormSection`), `useUnsavedChangesGuard` (beforeunload + in-app confirm dialog).
- `user-session`: `getCurrentUser()`, `getQuota()` (limit, used, `resetsAt` ISO date).

### Data shapes
String ids, ISO dates, Persian field values in mock data. Examples: `Conversation { id, title, updatedAt, messageIds }`, `Message { id, role, text, modelId, toolRuns, sources, attachments, status }`, `Attachment { id, name, kind, status, error? }`, `Agent { id, name, purpose, instructions, defaultModelId, toolIds, skillIds, isSensitive, ownerId, shareRequests }`, `Skill { id, name, approvalStatus }`.

### Components
Reuse `ui` and shared components: `DataTable`/cards for lists, `SearchField`, `SearchableSelect`/`SearchableMultiSelect`, `Dialog`, `AlertDialog`, `Sheet`, `Tabs`, `Badge`, `Alert`, `Empty`, `Progress` (quota), `Skeleton`. Model, connection, and Agent pickers are `Popover`-like menus built on `DropdownMenu`/`Dialog` (no new primitive unless needed; if a Popover is required it is added via shadcn and noted in design.md).

### Rules enforced in the UI (simulated)
Sensitive Agent forces an internal model (`resolveModel()`); Agent tool access is intersected with user access; quota 0 disables the composer; compatibility check runs before send.

### Decisions (approved by the user on 2026-10-19)
Mid-conversation model change affects next message only; Agent default model fixed; Agent starts from now with a separate-conversation suggestion; personal Agent usable immediately while new skills/connections wait for approval.

## Risks
Composer/picker complexity may push files past 200 lines: split pickers into separate files. Streaming timers must be cleaned on unmount.

## Verification Plan
Lint, build, `tsc --noEmit`, and browser checks of every scenario at 360px and desktop width in RTL, both themes, keyboard use and focus return from dialogs.
