# Handoff: Axis-aligned notation update

- Date: 2026-10-24
- Agent: Codex
- Project: `projects/orthogonal-decomposition/`
- Branch: `main`

## Changes

- Changed the lesson from an arbitrary direction to x/y-axis decomposition: `a=(4,2)` becomes `a₁=(4,0)` and `a₂=(0,2)`.
- Reworked the scenes, coordinate construction, right-angle marker, labels, captions, and formulas to match the high-school coordinate method.
- Added a drawn vector-arrow mark for `a` so the browser does not depend on a font glyph for the arrow-over-letter notation.
- Updated the project README to document the axis-aligned example and notation.

## Verification

- Chrome 155 CDP checks at desktop 1280px and mobile 390px viewports completed without JavaScript or console errors.
- Mobile `scrollWidth` matched the 390px viewport at 00:32, 00:52, and 01:00; scene captions and active chapters matched the selected times.
- Visual screenshots confirmed the x component, y component, right-angle marker, vector-arrow labels, and general-form scene.
- `git diff --check` passed.

## Remaining work

- The lesson still uses on-screen captions and formulas without a recorded voice track.
