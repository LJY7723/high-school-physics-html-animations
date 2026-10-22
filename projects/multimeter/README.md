# MF-47 Multimeter 3D Interactive Lab

An offline browser demo for exploring an analog multimeter's ranges, probes, target objects, needle response, and reading/safety rules. It also ships a quiz mode that generates random measurement tasks and grades range choice, operating procedure, and the entered reading.

## Files

- `index.html` is the standalone deliverable. Three.js is embedded so it can be opened offline without a build step or network access.
- `dev/meter.html` is the editable development page and loads `../vendor/three.min.js` locally. **Keep it in sync with `index.html`: all production features must exist here first.** Rebuild `index.html` by replacing the vendor `<script src>` tag with the inline contents of `../vendor/three.min.js`.
- `vendor/three.min.js` is the local Three.js r128 development dependency. Keep its upstream license notice intact.
- `references/` contains review screenshots and crops from the development process.

## Run

Open `index.html` directly in a modern browser with WebGL enabled. For development, open `dev/meter.html` directly; it should resolve its local Three.js script relative to this directory.

Useful URL parameters (combine freely): `?view=front|top|left|right|dial`, `?theta=&elev=&r=&x=&y=` for a specific camera, `?quiz=1` to start quiz mode.

## Verify changes

- Extract each inline JavaScript block from `index.html` and run `node --check` on it when JavaScript changes.
- Open the page in a browser with WebGL and check range selection, target selection, probe toggles, ohm/mechanical zero controls, readout/status updates, camera drag/zoom/pan/presets, lesson steps, quiz grading (`?quiz=1`: submit a correct and a wrong reading), and responsive layout.
- Open `dev/meter.html` and confirm the local Three.js dependency loads without a network request.
- Keep the standalone page offline-capable; do not introduce CDN dependencies without updating the project requirements.
