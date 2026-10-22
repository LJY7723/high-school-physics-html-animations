# Agent Git Workflow

Use one worktree per concurrent task. These examples use PowerShell from the primary repository root and assume the default branch is `main`.

## Start a task

First check that the repository is clean and identify the current base commit:

```powershell
git status --short --branch
git log -1 --oneline
```

Create a sibling worktree with a unique agent and task name. Use a different path and branch for every active task:

```powershell
git worktree add ..\html-animation-worktrees\codex-meter-controls -b agent/codex/meter-controls main
Set-Location ..\html-animation-worktrees\codex-meter-controls
```

For another agent, replace both `codex` and `meter-controls` with unique names. Do not use `git switch` in a worktree another task is using.

## Finish a task

From the task worktree, inspect and validate only that task's changes, add a handoff note, and commit:

```powershell
git status --short
git diff --check
git diff
git add <task-files>
git commit -m "Describe the task"
```

Use the handoff template in `docs/handoff-template.md`; include verification results and remaining work. Do not stage unrelated or ignored local files.

## Integrate

After the task commit is ready, return to the primary worktree, review the incoming branch, and merge it:

```powershell
Set-Location <primary-repository-path>
git status --short --branch
git log --oneline main..agent/codex/meter-controls
git diff --check main...agent/codex/meter-controls
git merge --no-ff agent/codex/meter-controls
```

Resolve conflicts with the task owner when behavior or intent is unclear. After merge, remove only the completed task's worktree and branch when no one needs them:

```powershell
git worktree remove ..\html-animation-worktrees\codex-meter-controls
git branch -d agent/codex/meter-controls
```

Never force-remove a worktree or delete a branch containing unmerged work.
