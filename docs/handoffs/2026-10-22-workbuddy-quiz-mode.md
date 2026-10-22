# Handoff: Multimeter quiz mode

- Date: 2026-10-22
- Agent: WorkBuddy
- Project: `projects/multimeter/`
- Branch: `agent/workbuddy/quiz-mode`

## Changes

- Added a quiz mode (练习判分): top-center quiz bar toggled by the new `练习模式` button (or `?quiz=1`). Each question picks a random target (battery 1.5 V / resistor from 120 Ω–47 kΩ / forward diode), the student selects the range themselves and enters a reading; grading checks 挡位类型 (2 pts) + 规范操作 (2 pts, probes plugged, ohm ranges must be zeroed) + 量程合适 (2 pts, needle 15%–95%, no overload) + 读数 (4 pts, ±6% tolerance, accepts `47k`-style input), shows a per-item breakdown with corrective hints, and keeps a ✓/✗ history with running score.
- Synced `dev/meter.html` with `index.html` **before** building on it: the lesson guide (实验步骤), left-panel collapse button, mobile media queries, aria/keyboard bits, pixel-ratio cap, pointer-cancel fix and arrow-key shortcuts existed only in the built page. Dev now matches production (dev = index minus the inlined vendor script), so the dev → build pipeline no longer drops features.
- Quiz bar hides the lesson bar while active; responsive placement (top on desktop, bottom above the readout panel under 560 px).
- Random resistor questions mutate `TARGETS.res` (value, card label, left-panel button text stay in sync).
- Added two review screenshots (`references/quiz_desktop.png`, `references/quiz_mobile.png`) and documented the URL parameters + rebuild step in the project README.

## Verification

- `node --check` on every inline JS block of `index.html` and `dev/meter.html`: all OK.
- Automated headless grading test (temporary page, removed afterwards): correct answer with ×10/×100/×1k auto-picked + zeroed → "挡位✓ 规范✓ 量程✓ 读数✓ → 10/10"; wrong reading → "6/10（正确值约 1.2 kΩ）".
- Chrome headless SwiftShader render of `index.html?quiz=1` at 1440×900 and 390×844: quiz bar lays out correctly, no overlap with the left panel (mobile) or lesson bar (desktop).
- Confirmed dev/build parity: de-vendored `index.html` is byte-identical to `dev/meter.html` before the quiz changes, and `index.html` is regenerated from `dev/meter.html` afterwards.

## Remaining work

- Quiz pool could include reverse-diode (judgment question) and AC-voltage trick questions once their grading rules are agreed.
- Reading tolerance is a flat ±6%; consider half-division estimation rules per range for stricter scoring.
- Manual touch interaction on a real device (pointer events are emulated only in headless).
