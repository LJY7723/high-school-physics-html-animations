# Shared Decisions

## Workspace structure

- Use one Git repository for this collection while projects remain small and share a collaboration workflow.
- Keep each animation independently understandable under `projects/<project-id>/`.
- Keep the current multimeter as a standalone offline HTML page. Its development page may load the same local Three.js vendor file from the project directory.

## Collaboration

- `AGENTS.md` is the shared instruction source for all agents; tool-specific memory is supplementary.
- Parallel changes use separate worktrees and task branches. Integrate by reviewing and merging commits; do not share a mutable working tree between concurrent agents.
- Record meaningful task handoffs in `docs/handoffs/` so an agent can resume without private chat history.

## Build

- `dev/meter.html` is the single source of truth for the multimeter page; `index.html` is a generated artifact. Regenerate it with `projects/multimeter/tools/build-standalone.mjs` and never hand-edit it. The script's `--check` mode is the drift guard, and `--unpack` recovers edits that slipped into the generated page.
- Keep build scripts project-local, dependency-free plain Node while each project owns its own pipeline; skip root-level build tooling until several projects share a concrete need.

## Revisit when

- Split a project into a separate repository if it needs independent access control, release/versioning, or a substantially different toolchain.
- Add root-level build tooling only when multiple projects have a concrete shared build or test need.
