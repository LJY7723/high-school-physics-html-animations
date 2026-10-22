# Interactive Animation Lab

A shared workspace for browser-based interactive animations developed with Codex, WorkBuddy, and other agents. Each animation lives in its own project directory so its entry point, dependencies, references, and checks stay together.

## Projects

| Project | Description | Entry point |
| --- | --- | --- |
| [multimeter](projects/multimeter/README.md) | Interactive 3D MF-47 analog multimeter teaching demo with guided steps and quiz mode | [Open `index.html`](projects/multimeter/index.html) |

## Open and verify

- Open a project's entry HTML file directly in a modern browser. The multimeter demo is self-contained and works offline.
- Read that project's README before changing code; it lists dependencies and practical verification steps.
- No root-level package manager or build step is required at present.

## Add a project

1. Create `projects/<project-id>/` with a concise, lowercase kebab-case ID.
2. Add a project README, a clearly named runnable entry point, and only that project's source/assets/dependencies.
3. Add its purpose, entry point, and verification notes to the root project table.
4. Keep cross-project policies here and in `AGENTS.md`; keep project-specific behavior in the project README.

## Agent collaboration

Read [AGENTS.md](AGENTS.md) before making changes. Parallel tasks use separate worktrees and branches named `agent/<agent-name>/<short-task>`. Follow the [agent workflow](docs/agent-workflow.md), verify the project, then add a task note under `docs/handoffs/` using the [handoff template](docs/handoff-template.md). See [shared decisions](docs/decisions.md).
