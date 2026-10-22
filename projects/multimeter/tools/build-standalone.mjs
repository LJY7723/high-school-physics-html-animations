#!/usr/bin/env node
/**
 * Build the standalone MF-47 multimeter page.
 *
 * Source of truth : dev/meter.html  +  vendor/three.min.js
 * Generated file  : index.html      (Three.js inlined, no network, offline ready)
 *
 *   node tools/build-standalone.mjs           regenerate index.html from dev/meter.html
 *   node tools/build-standalone.mjs --check   verify index.html matches its sources (no write)
 *   node tools/build-standalone.mjs --unpack  rewrite dev/meter.html from index.html
 *
 * Never hand-edit index.html: change dev/meter.html and rebuild. If somebody did edit
 * index.html, --unpack moves those edits back into dev/meter.html so they are not lost.
 *
 * Everything is normalised to LF while assembling and emitted as CRLF, so the output is
 * identical no matter what core.autocrlf does to the checked-out vendor file.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEV = join(projectRoot, 'dev', 'meter.html');
const VENDOR = join(projectRoot, 'vendor', 'three.min.js');
const STANDALONE = join(projectRoot, 'index.html');

const MARKER = '<script src="../vendor/three.min.js"></script>';
const OPEN = '<script>';
const CLOSE = '</script>';
const LICENSE_MARK = '@license';

const rel = p => relative(projectRoot, p).split('\\').join('/');
const toLf = s => s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
const toCrlf = s => toLf(s).replace(/\n/g, '\r\n');
const readLf = p => toLf(readFileSync(p, 'utf8'));
const occurrences = (haystack, needle) => haystack.split(needle).length - 1;

/** dev/meter.html -> single-file HTML with Three.js inlined. */
function inlineThree(devSource, threeSource) {
  const hits = occurrences(devSource, MARKER);
  if (hits !== 1) {
    throw new Error(`${rel(DEV)} must reference the local Three.js exactly once, found ${hits}`);
  }
  if (!threeSource.includes(LICENSE_MARK)) {
    throw new Error(`${rel(VENDOR)} lost its upstream license header; refusing to inline it`);
  }
  const block = `${OPEN}\n${threeSource.replace(/\n+$/, '\n')}\n${CLOSE}`;
  return devSource.replace(MARKER, () => block);
}

/** index.html -> dev/meter.html (the inverse transform). */
function unpackThree(standaloneSource) {
  const start = standaloneSource.indexOf(`${OPEN}\n`);
  if (start < 0) throw new Error(`no inline ${OPEN} block found in ${rel(STANDALONE)}`);
  const end = standaloneSource.indexOf(CLOSE, start);
  if (end < 0) throw new Error(`unterminated ${OPEN} block in ${rel(STANDALONE)}`);
  if (!standaloneSource.slice(start, end).includes(LICENSE_MARK)) {
    throw new Error(`the first ${OPEN} block in ${rel(STANDALONE)} is not the inlined Three.js build`);
  }
  return standaloneSource.slice(0, start) + MARKER + standaloneSource.slice(end + CLOSE.length);
}

function describeMismatch(expected, actual) {
  const limit = Math.min(expected.length, actual.length);
  let i = 0;
  while (i < limit && expected[i] === actual[i]) i++;
  const line = expected.slice(0, i).split('\n').length;
  const around = expected.slice(Math.max(0, i - 40), i + 40).replace(/\n/g, '\\n');
  const where = i === limit ? 'end of file' : `line ${line}, offset ${i}`;
  return `${where}\n    expected: ...${around}...`;
}

function main(argv) {
  const mode = argv[0] ?? '';

  if (mode === '--help' || mode === '-h') {
    console.log('usage: node tools/build-standalone.mjs [--check | --unpack]');
    return 0;
  }

  if (mode === '--unpack') {
    writeFileSync(DEV, toCrlf(unpackThree(readLf(STANDALONE))));
    console.log(`unpacked  ${rel(STANDALONE)} -> ${rel(DEV)}`);
    return 0;
  }

  const expected = toCrlf(inlineThree(readLf(DEV), readLf(VENDOR)));

  if (mode === '--check') {
    const actual = readFileSync(STANDALONE, 'utf8');
    if (actual === expected) {
      console.log(`up to date: ${rel(STANDALONE)} matches ${rel(DEV)} + ${rel(VENDOR)}`);
      return 0;
    }
    console.error(`stale: ${rel(STANDALONE)} does not match its sources\n  ${describeMismatch(expected, actual)}\n  run: node tools/build-standalone.mjs`);
    return 1;
  }

  if (mode !== '') throw new Error(`unknown option: ${mode} (try --help)`);

  const previous = readFileSync(STANDALONE, 'utf8');
  writeFileSync(STANDALONE, expected);
  const kb = (Buffer.byteLength(expected, 'utf8') / 1024).toFixed(0);
  console.log(previous === expected
    ? `unchanged ${rel(STANDALONE)} (${kb} KB)`
    : `built     ${rel(STANDALONE)} (${kb} KB) from ${rel(DEV)} + ${rel(VENDOR)}`);
  return 0;
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (error) {
  console.error(`error: ${error.message}`);
  process.exitCode = 1;
}
