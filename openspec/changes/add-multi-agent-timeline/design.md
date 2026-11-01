# Design

- Types: `TimelineStep` (`id`, `kind`, `title`, `status`, `modelName`, `inputTokens`, `outputTokens`, `lines`, `result`, `error`, `approval`) and `Message.timeline`.
- `lib/orchestration.ts`: `planOrchestration(text)` returns planned steps when the prompt has a sales/data word and a contract/document word (keywords; no real language understanding); `composeAnswer(steps)` builds the final text, sources, and tool names from the step results.
- `hooks/run-timeline.ts`: `runTimeline` runs the steps with a `wait` that rejects on abort, checks the capability of each agent step with `getCapabilities()`, appends short progress lines, asks for approval through a promise, and reports every change through `update(steps)`.
- `use-chat-engine.ts`: `begin` starts the timeline first, then streams the final answer (canned text, or `realStream` when a real model was chosen). `stop` aborts the timeline controller and marks running steps failed. The engine receives `agentModelName(agentId)` from `ChatProvider` (uses `useAgents` and `useModels`).
- UI: `timeline-view.tsx` (rows with `aria-expanded` buttons; running or failed steps open by default), shown in `MessageBubble` above the text. `ToolApprovalDialog` also opens for a step in `waiting-approval`; `ChatProvider` exposes `decideStep`.
- No network call and no storage for the simulated steps.
