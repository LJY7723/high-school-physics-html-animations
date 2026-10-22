# MF-47 Multimeter 3D Interactive Lab

An offline browser demo for exploring an analog multimeter's ranges, probes, target objects, needle response, and reading/safety rules. It also ships a quiz mode that generates random measurement tasks and grades range choice, operating procedure, and the entered reading.

## Files

- `dev/meter.html` is the single source of truth for the page. It loads `../vendor/three.min.js` locally. Make every change here.
- `index.html` is the standalone deliverable, **generated** from `dev/meter.html` and `vendor/three.min.js` by `tools/build-standalone.mjs`. Three.js is inlined, so it opens offline with no network access and no build step. Do not edit it by hand.
- `tools/build-standalone.mjs` is the build and drift guard (plain Node, no dependencies): no flag rebuilds `index.html`, `--check` fails when `index.html` no longer matches its sources, `--unpack` copies hand edits made to `index.html` back into `dev/meter.html`.
- `vendor/three.min.js` is the local Three.js r128 development dependency. Keep its upstream license notice intact; the build refuses to inline it without that notice.
- `references/` contains review screenshots and crops from the development process.

## Run

Open `index.html` directly in a modern browser with WebGL enabled. For development, open `dev/meter.html` directly; it should resolve its local Three.js script relative to this directory.

After changing `dev/meter.html`, rebuild the deliverable:

```powershell
node projects/multimeter/tools/build-standalone.mjs
```

Useful URL parameters (combine freely): `?view=front|top|left|right|dial`, `?theta=&elev=&r=&x=&y=` for a specific camera, `?quiz=1` to start quiz mode.

## Verify changes

- Run `node projects/multimeter/tools/build-standalone.mjs --check`; it must report `up to date`. This is the guard against the dev page and the built page drifting apart.
- Extract each inline JavaScript block from `index.html` and from `dev/meter.html` and run `node --check` on it when JavaScript changes.
- Open the page in a browser with WebGL and check range selection, target selection, probe toggles, ohm/mechanical zero controls, readout/status updates, camera drag/zoom/pan/presets, lesson steps, quiz grading (`?quiz=1`: submit a correct and a wrong reading), and responsive layout.
- Open `dev/meter.html` and confirm the local Three.js dependency loads without a network request.
- Keep the standalone page offline-capable; do not introduce CDN dependencies without updating the project requirements.
