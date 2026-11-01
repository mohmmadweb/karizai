# Design

- Shared `src/lib/api-keys.ts` and `src/server/provider-store.ts` are identical copies of the admin panel's files (change both together). Storage, hashing and routes are described in the admin change `add-api-keys-management`.
- `ApiKeysProvider` (in `(app)/layout.tsx`): reads `GET /api/api-keys?ownerId=` (policies and the user's keys), computes what the user may do with `combinePolicies` and the user's group ids, `createKey` (POST) and `revokeKey` (POST with `ownerId`).
- UI under `src/features/api-keys/components`: `ApiKeysPageContent`, `KeysList` (cards and a confirmation for revoke), `CreateKeyDialog` (radio groups and `SearchableSelect` over `useModels` and `useAgents`), `SecretDialog` (copy; closing drops the text), `UsageGuide`.
- Section `api-keys` (`KeyRoundIcon`, «API من») in `user-sections.ts`; route `(app)/api-keys`.
- `SearchableSelect` uses `z-modal` so its list is visible inside dialogs.
