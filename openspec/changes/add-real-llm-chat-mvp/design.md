# Design

## Decisions
- Shared storage `src/server/provider-store.ts` (same file in both apps): `store.json` (providers and models without keys) and `keys.json` (AES-256-GCM, secret `MOSHEKAF_SECRET`, folder `MOSHEKAF_DATA_DIR`). It is the seam for the future backend service.
- Admin: `GET/PUT /api/store` (snapshot; `ModelsProvider` loads it and saves every change after 300 ms), `PUT /api/providers/[id]/key`, `POST /api/providers/[id]/models` (calls `GET {baseUrl}/models` with the stored key). The simulated fetch was replaced.
- User panel: `GET /api/models` (enabled models, no keys) feeding `ModelsProvider`; `POST /api/chat` (calls `{baseUrl}/chat/completions` with `stream: true`, converts SSE to a plain text stream). The chat engine streams it (`realStream`) with an AbortController for stop.
- Known MVP limits: no authentication on the API routes, no rate limit, the admin can register any http(s) address (server-side request risk), two browser tabs saving at once can overwrite each other.
