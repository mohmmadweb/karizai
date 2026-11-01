# Design

- Setting: `ConversationSettings.supervisor` (default `false`), copied from the draft like the other settings; `SendInput.supervisor` carries it to the engine.
- UI: a check item «ناظر هوشمند» in `ComposerMoreMenu` (tooltip with the hint, `closeOnClick`), plus a chip with an off button in `ComposerStatus`. The first version used a switch in the toolbar; it was moved at the user's request.
- Timeline: `TimelineStep.kind` and `PlannedStep.kind` gain `"supervisor"`. In `use-chat-engine` `begin`, a supervisor step is appended to the plan (or is the only step for plain answers) when the setting is on.
- `lib/supervisor.ts`: `decideSupervision(text, orchestrated)` returns the canned outcome: orchestrated answers get one correction (the share of the capital city is changed from ۳۸٪ to ۳۶٪ in the final text), prompts with «تحلیل/مقایسه/استدلال» are re-run with a stronger model, the rest are approved.
- `run-timeline.ts` runs the supervisor step last; `ChatProvider` supplies `supervisorModels({ sensitive, answeringModel })` returning an independent model and a stronger one (the model list is ordered from strongest to lightest; internal models only for a sensitive Agent; `null` fails the step, and no stronger model turns a re-run into an approval). Supervisor tokens are added to the quota usage. A re-run patches the message's `modelName`.
- Stop aborts the waits as for the other steps. Quota: the composer already blocks sending when the quota is spent.
