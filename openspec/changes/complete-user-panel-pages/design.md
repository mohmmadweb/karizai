# Design

## Context

Extends the user panel built by `add-chat-and-agent-builder`. Phase 1 lock applies: no backend, no storage; all state temporary.

## Decisions

- Routes in the `(app)` group: `/connections`, `/skills`, `/knowledge`, `/usage`, `/settings`. Sidebar items live in `user-sections.ts`. There is no home page: `/` redirects to `/chat` and login goes to `/chat`.
- `ConnectionsProvider` (user panel) loads `/api/connections` (connections the admin defined and activated), keeps those open to the user's groups (`getCurrentUser().groupIds`), maps `auth: "user-login"` to `needs-auth` until `signIn`, and falls back to the sample list when there are none. The request dialog and tool proposal form were removed.
- Models renamed to well-known LLMs with `provider`; Qwen and Llama are internal.
- Skills: `Skill` gains `instructions`, `approval: approved | pending | rejected`, `rejectionReason`, `pendingEdit`. State stays in `AgentsProvider` (`saveSkill`, `setSkillAgents`). Components in `src/features/skills`. File import reads text with `File.text()` in the browser only.
- Chat prefill: `ChatProvider.prefill` set by the knowledge page; the new-conversation `Composer` consumes it in an effect.
- `usage`: `getUsageReport(period)` mock getter; quota from chat state. `settings`: `getAccount()` with `authType`; theme via `useTheme`; preferences in local state.

## Verification Plan

Lint, tsc, build; browser check of each page at 360px and wide, both themes.
- Workflow connection `conn-11` («جریان کاری هوشمند», tool `tool-16`) has an `endpoint` shown LTR. The engine passes the user's text as the tool input and simulates the n8n output locally (a message containing «تایم‌اوت» simulates a timeout error). No network call is made.
