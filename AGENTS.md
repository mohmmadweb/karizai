# AGENTS.md — User Panel Mock Prototype (Phase 1 of 2)

## Purpose

This repository is the end-user panel (chat and Agent builder) of Moshekaf: a Persian, right-to-left Next.js prototype, separate from the admin panel in the sibling folder `New-Moshekaf-Frontend`, which must not be changed from here. It runs on port 3001. It is Phase 1 of
a two-phase plan: first the interface is built and approved with mock data
only, then, in Phase 2, the approved prototype gets a real backend. Build the
prototype so mock data can later be replaced by real data without redesigning
the interface. Do not invent product features or product behavior that the user
or an approved spec did not describe.

## Hard Scope Lock (Phase 1)

Until the user explicitly starts Phase 2:

- Do not add a database, ORM, authentication, API route, Route Handler, Server
  Action, external network request, or backend service.
- Do not use `localStorage`, IndexedDB, cookies, files, or another mechanism to
  claim that data is permanently saved.
- Temporary UI state is allowed, but describe it as temporary and resettable.
- Server Components may render local mock content, but they must not read
  secrets, call services, or perform server-side I/O.
- Do not change this lock because a new feature would be easier with a backend.
  Only the user ends Phase 1, by following the Phase 2 guide, which replaces
  this section.
- A spec, plan, or task cannot override this lock. If one requires a backend,
  stop and report the conflict instead of implementing it.

## Read Before Editing

1. Read this file completely.
2. Read `product.md` completely when present; it is added before OpenSpec
   initialization. Read `openspec/config.yaml` when present.
3. Read `design.md` completely for every visual change.
4. Read relevant main specs in `openspec/specs` and the active change
   proposal, delta specs, technical design, and tasks when present.
5. Inspect the relevant route in `src/app` and feature in `src/features`.
6. Inspect `src/components/ui` and `src/components/shared` before creating a
   component.
7. Check `package.json` before assuming a library is installed.

## Talking With the User

The user is a non-technical product owner who does not write code. Every
OpenSpec command and every direct request is a conversation in plain Persian.

- Reply in fluent, friendly, everyday Persian. Keep file names, commands, and
  code in English. Explain an unavoidable technical term in one short phrase.
- Ask only product questions: who uses it, what they see and do, which rules
  and states apply, and what is out of scope. Decide technical details
  yourself (libraries, files, components, data shapes, checks) from this file,
  design.md, and the existing code, then mention them briefly.
- Ask at most three questions at a time. Prefer short options with one marked
  as recommended. If the user answers «نمی‌دانم», propose a safe default and ask
  for confirmation.
- Never ask for passwords, tokens, or `.env` values. Refer to variable names
  only.
- End each reply with what was done, what the user should look at or try, and
  the exact next command or prompt.

How each OpenSpec command talks with the user:

- explore: Be a thinking partner. Restate the idea in Persian, ask the missing
  product questions, and compare options in plain words. Write no files.
  Finish with the agreed scope, open questions, and a suggested kebab-case
  change name.
- propose: Create the planning artifacts, then summarize them in Persian: the
  goal, what users will see and do, each scenario in one line, what is out of
  scope, and remaining questions. Name the files the user should read:
  proposal.md and the specs folder.
- update: Restate the requested correction. Show each artifact edit as a short
  Persian before-and-after and wait for approval before writing it. Never edit
  code. If the goal itself changed, recommend a new change instead.
- apply: Work task by task. If a product decision is missing, stop and ask one
  plain question. Finish with what was built, how to try it in the browser
  (address and steps), the checks that ran, and any unfinished task.
- verify: Translate findings as «مشکل جدی» (CRITICAL), «هشدار» (WARNING), and
  «پیشنهاد» (SUGGESTION). For each, say what it means for users and recommend
  fixing it now, accepting it, or deferring it. Then ask for the user's
  decision. Do not fix anything during verify.
- archive: Confirm the tasks and the verify decisions. Explain in one sentence
  that the current specs will now include this change. Sync, archive, and
  report the archive path.

## Spec-Driven Development

Use OpenSpec to clarify ambiguous requirements and record changes to intended
behavior, stored data, authentication, or permissions. Use direct prompts for
known foundation work, small visual/copy edits, behavior-preserving fixes,
and refactors. Recommend a route when unclear; ask only for missing decisions.

- Read product.md for approved product context, not as permission to build
  every planned feature. Respect the current phase boundary in this file.
- Read openspec/config.yaml. Keep its context, rules, and operations
  consistent with this file; report conflicts instead of choosing a rule
  silently.
- Cycle: explore when the idea is unclear, propose, user review, update while
  the plan needs correction, apply in a fresh conversation, user review,
  verify, validate, and archive. Use the installed tool's invocation names.
  Verify needs the expanded workflow profile.
- Use the spec-driven schema. Each active change lives under
  openspec/changes/<change-name> with proposal.md, specs/<capability>/spec.md,
  design.md, and tasks.md. Use a short, action-based kebab-case name.
- Write proposal.md and spec prose in Persian. Keep structural headings,
  SHALL/MUST, GIVEN/WHEN/THEN, code, and paths in English. Write the change
  design.md and tasks.md in English.
- Keep observable behavior and scenarios in specs; put technical choices,
  file paths, data models, and verification plans in the change design.md.
  Root design.md remains the shared visual system; these files are distinct.
- Clarify unknown product decisions before implementation. Do not invent them.
- Before apply, change planning artifacts only through propose or update.
  Update never edits code. If the goal changes, start a new change.
- Follow tasks.md and mark work [x] only when its implementation and checks
  are complete.
- Check structure with openspec validate <change-name> --strict and progress
  with openspec status --change <change-name>. Validation does not prove
  behavior; verify scenarios too.
- Resolve every CRITICAL verify finding and record the user's decision on each
  WARNING before archive. Do not archive unfinished work, even though the tool
  only warns.
- During archive, sync delta specs into openspec/specs/<capability>/spec.md
  and preserve unrelated requirements. Keep history under
  openspec/changes/archive; never rewrite archived changes.
- Main specs describe current behavior. Later behavior changes get a new
  change with ADDED, MODIFIED, REMOVED, or RENAMED deltas as appropriate.
  MODIFIED requirements include the complete replacement and its scenarios.
- Do not hand-edit generated OpenSpec skill/command files. Run openspec update
  after CLI upgrades or profile changes; review the resulting diff.

## Phase 2 MVP backend (started by the user on 2026-10-24)

The user asked for a simple backend inside Next.js so a real model can be used.
This narrowly lifts the Phase 1 scope lock; everything else in the lock stays.

- Allowed: route handlers under `src/app/api` and server code in `src/server`
  for (1) registering model providers, (2) fetching their models, (3) chat with
  an enabled model. Provider data lives in two JSON files in
  `MOSHEKAF_DATA_DIR` (default `../moshekaf-data`), shared by the admin panel
  and the user panel: `store.json` (providers and models, no keys) and
  `keys.json` (API keys, AES-256-GCM, secret in `MOSHEKAF_SECRET`).
- Keys: read from the browser only once, in the register form; the server stores
  them encrypted, never returns them, never logs them. `.env.local` holds the
  secret and is not committed. Never ask for or print keys or secrets.
- Providers must be OpenAI-compatible (`GET /models`, `POST /chat/completions`).
- Still Phase 1 (simulated): authentication and permissions, quotas, tools and
  connections, Agents, document and data assistants, OCR, web search. Real
  models answer plain chat only.
- The storage module `src/server/provider-store.ts` is the seam: replace it with
  the real backend service later; route handlers and screens should not change.

## Project Structure

Bootstrapped by copying the admin panel's design system. Keep the copied files
visually identical to the admin panel (same tokens, fonts, ui components).

- `src/app`: routes and layouts. `/login` (mock sign-in); inside the `(app)`
  route group (frame, providers, `error.tsx`, `not-found.tsx`): `/` redirects to `/chat`,
  `/connections`, `/api-keys`, `/workflows` and `/workflows/[workflowId]`, `/skills`, `/knowledge`, `/usage`, `/settings`, `/chat`, `/chat/[conversationId]`, `/agents`, `/agents/new`,
  `/agents/[agentId]` (with `loading.tsx`).
- `src/features/<feature>`: all code of one product area (`components`, `data`,
  `hooks`, `types`). Existing: `auth`, `user-shell`, `user-session` (user and
  quota), `chat` (one `ChatProvider`; simulated streaming engine), `model-catalog`
  (models, `resolveModel`), `connections` (tools, approval card), `agents`
  (one `AgentsProvider`, builder form, share requests, skills state), `skills`,
  `workflows` (visual workflow editor with `@xyflow/react`, simulated runs, one `WorkflowsProvider`), `knowledge`, `usage`, `settings`; `connections` also has one `ConnectionsProvider`; `api-keys` has one `ApiKeysProvider` (the user's keys and what the groups allow).
  `_template` is empty.
- `src/components/ui`: shadcn primitives (same as the admin panel).
- `src/components/shared`: `page-header`, `form-section`, `empty-state`,
  `theme-toggle`, `search-field`, `password-field`, `searchable-select`,
  `searchable-multi-select`, `picker-dialog`, `back-link`, `entity-not-found`, `list-skeleton`,
  `data-table`. The admin-only access panel was not copied.
- `src/components/brand`, `src/lib` (`utils`, `format`, `use-theme`,
  `simulate-request`), `src/styles/fonts.ts`, `src/assets/fonts`, `public/brand`.
- `design.md`: shared visual system, copied from the admin panel.
- `product.md`: user panel product context.
- `openspec/`: config, specs, and changes (see Spec-Driven Development).

Do not create a `pages` directory.

## File, Next.js, Mock Data, Design Rules

Same as the admin panel: kebab-case files, PascalCase components, one main
component per file, files near or below 200 lines, thin routes, `"use client"`
only where needed, mock records in `src/features/<feature>/data` behind named
getters, typed props, meaningful empty/loading/error/disabled states, no
mock/demo labels on screens, Persian RTL with `<html lang="fa" dir="rtl">`,
semantic tokens only, logical `start`/`end` utilities, both themes, Solar
Hijri dates through `src/lib/format.ts`.

## Verification Policy

Small visual change: inspect in the browser. Structure or config change: run
`npm run lint` and `npm run build`. OpenSpec change: strict validation plus
scenario verification.

## Repository Facts

- Package manager npm; dev server `npm run dev` on port 3001 (`.claude/launch.json`
  defines `dev`). Versions are the same as the admin panel.
- OpenSpec 1.14.1 via `npx @fission-ai/openspec@1.14.1 <command>`; schema
  `spec-driven`; generated files in `.claude/commands/opsx` and `.claude/skills`.
- Active changes: `add-api-keys` (API keys page: group-allowed keys for models, agents and knowledge; built, waiting for verify), `add-smart-supervisor` (per-conversation supervisor switch and timeline step; built, waiting for verify), `add-multi-agent-timeline` (steps of a multi-agent answer shown above the answer; built, waiting for verify), `add-workflows-and-multi-agent` (workflows, triggers, runs, multi-agent step; built, waiting for verify), `align-with-requirements-document` (ChatGPT-style chat with prompt-kit, masking, document and data assistants, web search, tool proposals; built, waiting for verify), `complete-user-panel-pages` (connections page, skills, knowledge, usage, settings; built, waiting for verify) and `add-chat-and-agent-builder` (approved by the user with the recommended answers; built, waiting for verify). All state is temporary and resets on reload.

## Keeping This File Current

Update this file in the same change that alters architecture, scope, routes,
versions, shared components, or commands.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## prompt-kit

Chat UI parts (`prompt-input`, `message`, `markdown`, `code-block`, `chat-container`, `scroll-button`, `loader`) in `src/components/ui` come from prompt-kit (registry `https://www.prompt-kit.com/c/<name>.json`, via shadcn). They were adapted to Base UI (`render` instead of `asChild`) and semantic tokens.

## Smart routers

The admin panel configures smart routers («مسیریاب هوشمند»); they are stored in `routers.json` (see Phase 2 MVP backend). `src/lib/smart-routing.ts` is an identical copy of the admin panel's file: change both together. The user panel reads `GET /api/routers`, keeps the default router and those assigned to the user's groups (`getCurrentUser().groupIds`), and `resolveModel` uses `pickModel` for the «خودکار» choices.

## Connections

The admin panel defines connections (`connections.json` in the shared data folder, keys encrypted under `conn:<id>`); `src/lib/connections.ts` is an identical copy of the admin panel's file. The user panel only reads `GET /api/connections` (active ones) and filters by the user's groups; users cannot create or request connections. A selected connection that has an entry in `src/features/chat/data/connection-replies.ts` (matched by id or name, currently «MES کارخانه») always answers with that fixed text after its tool steps run (a `tool` timeline step per tool); nothing is requested from the connection's address and no model is needed.

## Look of the panel

The frame follows the messenger platform the assistant will live in: a dark navy sidebar at the start side (logo, collapsible groups «گفتگو و دستیارها»، «کارها و اتصال‌ها»، «دانش و مصرف»، then recent conversations; the active item is a light-blue pill), a white top bar (user, search, organization, notifications, theme switch, sign-out) and a blue-gray page background. The sidebar always uses the dark tokens (its container carries the `dark` class) and `--sidebar*` hold the same navy in both themes. In settings («ظاهر ← طرح پنل») the user can go back to the classic look (the `classic` class on <html>, `use-layout-style.ts`: light sidebar with a flat list, its own search box and the profile at the bottom, no top bar from `lg`, the original surfaces); the choice is temporary and a reload returns to the messenger look. The top-bar search filters the recent conversations; the organization menu and the notifications menu are presentation-only.

## Plant scenarios (canned answers)

For the polymer-plant demo, the chat can answer from prepared scripts (`src/features/chat/data/scripted/*` and `scripted-replies.ts`, found with `findCannedReply`): the Agents `agent-quality`, `agent-maint`, `agent-pricing`, `agent-indicators`; the connections `conn-12` to `conn-18` (warehouse and procurement SQL Server, MES indicators, social network, LIMS, CMMS, prices; `plantConnectionIds` keeps them beside the admin's connections); and the «دانش سازمانی» switch in the message box (`ConversationSettings.knowledge`). A script shows its steps running and then streams the prepared text, table and sources; no model, database or network is used. A question that matches no script gets a short hint. The history holds finished conversations built from the same scripts (`conv-7` to `conv-12`), and two ready workflows: «مرکز شاخص‌ها و هشدار هوشمند» (`wf-4`, event `indicator-breach`) and «پیش‌فاکتور و قیمت‌گذاری خودکار» (`wf-5`). Sources can be a document or a colleague's conversation (`kind: "chat"`) and open with an excerpt.

## Workflow steps and their settings

Every step of a workflow belongs to an Agent (its run, or one of its skills) or to a connection (one of its tools); only the route controls (condition, approval) stand alone. The «+» menu is organized that way. A tool has real settings (`ConnectionTool.params`: text, textarea, url, secret, number, select; without them the sample inputs stand in) and may return numbers (`outputs`) that a condition compares (`NodeConfig.rule`). A step keeps its values in `NodeConfig.params`; `validateWorkflow` checks them (required, URL, number range, options, key length) before a test run or activation. The connection's address is shown read-only and its keys stay with the admin; a secret setting (for example the IoT command key) lives only in the open editor's memory and is shown masked. The plant connections (`conn-12` to `conn-19`, including IoT over MQTT) are in `connections/data/plant-connections.ts`.

## Chat starters and design references

A new conversation shows six ready starts under the message box (`chat/data/starters.ts`, `ChatStarters`): choosing one sets the Agent, connections or organizational knowledge and fills an example question; the user still sends it. Design references such as `VoltAgent/awesome-design-md` are inspiration only: they describe other companies' brands, so their colors, fonts and logos are never copied; only structural patterns that fit `design.md` may be borrowed (tonal depth instead of heavy shadows, one solid primary action per group, light type weights, one-click starts).

## Marks and icons

`components/shared/provider-logo.tsx` draws a coloured tile with a letter for a model's maker (OpenAI, Anthropic, Google, DeepSeek, Qwen, Meta, Mistral; others get a neutral robot) in the model picker and under answers. `features/connections/components/connection-icon.tsx` gives each connection a coloured icon by kind (MES, IoT, database, social network, lab, maintenance, prices). These are drawn marks, not the makers' own logos, and their colours identify a kind, so they are not design tokens. Official logos would need local files with the owners' permission; no logo is loaded from the internet.

## API keys

The admin panel decides per group which kinds of key may be created (`apikeys.json`, `src/lib/api-keys.ts` and `src/server/provider-store.ts` are identical copies). The user panel creates keys (`POST /api/api-keys`, refused for a group without permission), lists the user's own keys and revokes them. Only a SHA-256 hash is stored; the key text is shown once and never kept in the browser after the dialog closes. The `/api/v1` gateway that would accept the keys, the real usage count and the monthly ceiling are not built (Planned); the `curl` examples on the page show the planned shape.
