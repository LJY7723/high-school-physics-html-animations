# Shared Agent Instructions

This repository is a collection of independent browser-based interactive animation projects. These rules apply to Codex, WorkBuddy, and any other agent working in the repository.

## Before changing files

- Read this file and the target project's `README.md` first.
- Inspect `git status --short --branch` and the current diff. Preserve changes you did not make.
- Work on one project per task unless the task explicitly spans projects.
- For parallel work, use a separate Git worktree and task branch. Do not switch branches in another agent's active worktree or edit the shared main branch.
- Do not modify generated, minified, or vendor files unless the task requires it. Keep third-party notices with their assets.

## Project conventions

- Put each animation in `projects/<project-id>/` with a project README, an obvious runnable entry point, and project-owned development assets.
- Keep demos usable offline when their project README promises offline use. Prefer local dependencies over remote CDNs.
- Keep references and intentional review screenshots in the project's `references/` directory. Do not commit temporary logs, caches, or unrelated exports.
- Keep shared agent instructions and decisions in repository documentation. Tool-specific memory such as `.workbuddy/` is local and is not the shared source of truth.

## Handoff and verification

- Before handing work off, run the checks documented by the project and report their actual results.
- Add a short task note under `docs/handoffs/` using `docs/handoff-template.md` when work changes project files. Include changed areas, verification, and remaining work.
- Commit only task-related changes. Use a descriptive message; do not amend or rewrite another agent's commits.
- Summarize the project path, verification performed, and any known limitations in the completion message.

## Worktree workflow

- Use branch names in the form `agent/<agent-name>/<short-task>`.
- Keep each worktree focused on one task. Review its diff and run project checks before merging it into the primary branch.
- Remove a task worktree only after its changes are merged or intentionally discarded and no work remains there.
