# Design

## Context
Builds on `add-chat-and-agent-builder` and `complete-user-panel-pages`. Source: requirements document v1.0 (Mehr 1405). Phase 1 lock applies.

## Decisions
- prompt-kit components come from the official shadcn registry at `https://www.prompt-kit.com/c/*.json` (the apex domain timed out): `prompt-input`, `message` (+ `markdown`, `code-block`), `chat-container`, `scroll-button`, `loader` in `src/components/ui`. `TooltipTrigger asChild` was changed to `render` (Base UI), and prompt-input colors use semantic tokens. New dependencies: `use-stick-to-bottom`, `react-markdown`, `remark-gfm`, `remark-breaks`, `marked`, `shiki`.
- Chat: `Composer` uses `PromptInput`; `ChatHeader` holds the model picker; `MessageList` uses `ChatContainer`; `ToolApprovalDialog` wraps the approval step; empty conversations center the composer.
- `chat/lib/sensitive-check.ts` detects card, mobile, national id; `maskText` and `restoreText` replace and restore tokens. The engine sends `sentText` to the simulated model and restores values for the user.
- `resolveModel` handles `isAvailable`, `forceInternal`, fallback and auto choice, and returns a `note` stored as `routerReason`.
- `chat/lib/mock-reply.ts` builds answers; `resolveRole` picks the document or data assistant by keywords. Structured output (`StructuredResult`) is rendered by `StructuredResultView` with SVG charts; CSV and Excel files are built in the browser.
- Built-in assistants `agent-doc` and `agent-bi` (`systemRole`) are shared Agents.
- Tool proposals: `ConnectionsProvider.requestTool` adds a pending connection; secrets are not kept.
- `IdleTimeout` in the `(app)` layout.

## Verification Plan
Lint, tsc, build; browser checks of masking, data assistant, composer, tool proposal, at wide and 360px, both themes.

- Update (user request): model, connection, Agent and web search controls are drop-down menus without descriptions or search. Details live on the pages «اتصال‌ها» and «Agentهای من» (which now also lists shared and built-in Agents).
- Update (user request, 2026-10-20): one ChatGPT-style sidebar (`SidebarBody`: logo, search dialog, collapse, nav, recent conversations, profile); no top bar; the three-dot menu in the message box holds connections, Agent (also opened by typing @ or /), and web search, and web search is also a one-click button; light theme is the default; the provider-down notice above the chat was removed.
