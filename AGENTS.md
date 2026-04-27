# Project Instructions

This repository keeps the durable Codex project context in `./CODEX.md`.

Before working on this project, read `./CODEX.md` and follow its coding rules, API binding rules, authentication rules, and path conventions.

## Document Roles

- `./AGENTS.md`: required rules, work loop, change type rules, documentation sync rule, and verification gate.
- `./CODEX.md`: detailed project context, path assumptions, DB summary, frontend/backend structure, auth flow, and coding rules.
- `./docs/codex/screen-map.md`: screen route/component/API/DB map.
- `./docs/codex/api-map.md`: frontend API binding and backend endpoint/controller map.
- `./docs/codex/decisions.md`: technical decisions, reasons, and impact.

## Required Rules

- Read `./CODEX.md` before making project-specific changes.
- Use project-root-relative paths in notes and project documentation.
- Do not call axios directly from components; use domain API files under `./src/api`.
- Use camelCase in frontend types and components even if backend responses use snake_case.
- Keep the auth token strategy as `accessToken = sessionStorage` and `refreshToken = HttpOnly Cookie`.
- Logout should clear the refresh cookie and invalidate server-side tokens when the user can be identified.
- When creating or improving functions, add a concise comment explaining the function purpose.
- Before adding or changing project rules, show a preview and ask for `Y/N`.
- If a new project rule seems useful during work, propose it first instead of applying it immediately.
- When screen, API, auth, DB, or architecture behavior changes, update the related docs under `./docs/codex` or explicitly report why no doc update was needed.

## Requires Confirmation

Ask for user confirmation before implementing these changes:

- DB schema changes.
- Authentication or token strategy changes.
- Route structure changes.
- Broad shared style token changes.
- API response shape changes.
- Package add/remove/update changes.
- Deployment or environment configuration changes.

## Work Loop

1. Confirm the user's intent and the target area.
2. Read `./CODEX.md` and any relevant helper document under `./docs/codex`.
3. Inspect the existing code patterns before changing files.
4. Share a short implementation plan when the work is non-trivial.
5. Make focused changes that follow the existing project structure.
6. Run the relevant verification command whenever feasible.
7. Update related context docs when screen/API/architecture behavior changes.
8. Summarize changed files, verification results, documentation updates, and useful next improvement candidates.

## Change Type Rules

- UI changes should follow existing SCSS module patterns and reuse design tokens from `./src/styles`.
- API binding changes should live in `./src/api/<domain>.ts` and keep components free of direct axios calls.
- Authentication changes must preserve the existing token strategy and logout invalidation behavior.
- DB/API changes should cross-check `./db/init.sql` and backend implementation under `../myksBK`.
- Documentation changes should use project-root-relative paths and avoid machine-specific absolute paths.

## Documentation Sync Rule

- Screen route, component structure, or major screen flow changes should update `./docs/codex/screen-map.md`.
- API endpoint, frontend API binding, or backend controller/service flow changes should update `./docs/codex/api-map.md`.
- Auth, token, path, API binding principle, or shared architecture decisions should update `./docs/codex/decisions.md`.
- If a doc update is not needed, mention `documentation update not needed` with a short reason in the final response.

## Verification Gate

- Frontend changes: run `npm run lint`; run `npm run build` when routing, build config, or broad UI behavior changes.
- Backend changes: run `./gradlew compileJava`; run `./gradlew test` when service/controller behavior changes.
- If verification cannot be run, explain why in the final response.

Read order:

1. Enter this repository root.
2. Read `./AGENTS.md`.
3. Read `./CODEX.md`.
4. Inspect task-related files under `./src` or `../myksBK/src`.
5. Implement changes and run the relevant verification commands from `./CODEX.md`.

Path assumptions:

- Frontend project root: `.`
- Backend API project: `../myksBK`
- DB initialization SQL: `./db/init.sql`

Use project-root-relative paths in notes and project documentation. Avoid user-machine absolute paths unless the user explicitly asks for a local clickable file reference in chat.
