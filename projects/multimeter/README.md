# MF-47 Multimeter 3D Interactive Lab

An offline browser demo for exploring an analog multimeter's ranges, probes, target objects, needle response, and reading/safety rules.

## Files

- `index.html` is the standalone deliverable. Three.js is embedded so it can be opened offline without a build step or network access.
- `dev/meter.html` is the editable development page and loads `../vendor/three.min.js` locally.
- `vendor/three.min.js` is the local Three.js r128 development dependency. Keep its upstream license notice intact.
- `references/` contains review screenshots and crops from the development process.

## Run

Open `index.html` directly in a modern browser with WebGL enabled. For development, open `dev/meter.html` directly; it should resolve its local Three.js script relative to this directory.

## Verify changes

- Extract each inline JavaScript block from `index.html` and run `node --check` on it when JavaScript changes.
- Open the page in a browser with WebGL and check range selection, target selection, probe toggles, ohm/mechanical zero controls, readout/status updates, camera drag/zoom/presets, and responsive layout.
- Open `dev/meter.html` and confirm the local Three.js dependency loads without a network request.
- Keep the standalone page offline-capable; do not introduce CDN dependencies without updating the project requirements.
