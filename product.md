# product.md — User Panel Product Overview

## Status

The user panel is the end-user side of Moshekaf (موشکاف), an enterprise
assistant built on generative AI. The admin side is a separate app (folder
`New-Moshekaf-Frontend`). Phase 1: frontend prototype with mock data only.

## Users and Journeys

Regular user (کاربر عادی): chats with the models the admin enabled, optionally
attaching files (valid only in that conversation), uses connections to company
systems, calls ready-made Agents, and builds personal Agents.

Two main pages: the chat page, and the build/edit Agent page (reached from
«Agentهای من»).

## Out of Scope (for the user panel)

Provider management, technical MCP/API registration, approving requests, setting
quotas, organization document management, full user logs, workflow design,
database connection setup. These belong to the admin panel.

## Delivery Status

Built (mock only, nothing saved), waiting for verify: `add-chat-and-agent-builder` — chat with simulated answers, model/connection/Agent pickers, tool approval, attachments, quota, and the Agent builder with sharing requests. Also built, waiting for verify: `add-workflows-and-multi-agent` — «کارهای من» with a visual editor, triggers (manual, schedule, event), multi-agent step, simulated runs and run history; and `align-with-requirements-document` — ChatGPT-style chat, web search, masking of sensitive data, document and data assistants with tables and charts, model fallback, tool proposals, and session expiry; and `complete-user-panel-pages` — connections page with requests, skills page, organization knowledge, personal usage, and settings.

## Product Language

Persian, right-to-left. Vocabulary: مدل، Agent، اتصال (connection)، ابزار، مهارت
(skill)، گفتگو، پیوست، سهمیه (quota).

## Update Rule

Update verified status only after a change is verified. Keep secrets out.
