# Handoff: Standalone build script and drift guard

- Date: 2026-10-22
- Agent: DeepSeek Harness
- Project: `projects/multimeter/`
- Branch: `agent/dsh/sync-dev-standalone`

## Changes

- Added `projects/multimeter/tools/build-standalone.mjs`, a dependency-free Node script that generates `index.html` from `dev/meter.html` + `vendor/three.min.js`. Modes:
  - no flag: rebuild the standalone page;
  - `--check`: exit 1 when `index.html` no longer matches its sources (the drift guard);
  - `--unpack`: rewrite `dev/meter.html` from `index.html`, so hand edits made to the generated page can be recovered.
- The script normalises both inputs to LF and emits CRLF, so the result is byte-identical regardless of `core.autocrlf` (currently `true`, which checks `vendor/three.min.js` out with CRLF). It refuses to inline a vendor file whose `@license` header is missing.
- Recorded the source-of-truth rule in `docs/decisions.md` (new **Build** section) and rewrote `projects/multimeter/README.md` (Files / Run / Verify) to document the commands instead of the old "replace the vendor tag by hand" instruction.
- No page output changed: `dev/meter.html` and `index.html` content is untouched by this task. WorkBuddy's `ebf616f` had already resynced the two pages, so only the reproducible pipeline and guard were missing.

## Verification

- `node projects/multimeter/tools/build-standalone.mjs --check` on a clean tree: `up to date`, exit 0.
- `node projects/multimeter/tools/build-standalone.mjs`: reported `unchanged index.html (647 KB)`, proving the generator reproduces the committed page byte for byte.
- `--unpack` then `--check`: `dev/meter.html` stayed byte-identical (`git status` showed only the new `tools/` directory).
- Negative tests: appending a line to `index.html` made `--check` exit 1 (`end of file` mismatch); editing `dev/meter.html` made it exit 1 (`line 1, offset 0` after a PowerShell BOM rewrite); a rebuild restored a passing state each time.
- `node --check` on every inline JS block: `index.html` blocks 1–2 and `dev/meter.html` block 1 all OK.
- Chrome headless (SwiftShader) rendered `index.html` and `dev/meter.html` at 1440×900 and at a true 390×844 viewport (iframe harness): multimeter, panels, lesson bar and quiz bar all render; dev resolves the local vendor script with no network request.
- Tooling caveat found while verifying: on this machine Chrome headless enforces a **~500 px minimum window width**, so `--window-size=390,844` lays out at ~500 px and crops the screenshot to 390 px — the right edge looks clipped even though the layout is fine. True narrow-viewport checks need an iframe (or DevTools device emulation) with an outer window ≥ 500 px. The committed `references/quiz_mobile.png` was produced the cropped way, so its apparent right-edge clipping is that artefact, not a layout bug.

## Remaining work

- At a true 390 px viewport the quiz bar's hint text ("提交后在这里看逐项判分") collapses into a one-character-wide column beside the input row, because the hint shares a flex row with wide controls. Needs a `@media (max-width:560px)` rule in the quiz CSS — left untouched here to avoid editing another agent's in-flight feature.
- `references/quiz_mobile.png` should be re-shot through a real 390 px viewport so it stops implying a layout problem.
- Manual touch interaction on a real device still unverified (pointer events are only emulated in headless).
