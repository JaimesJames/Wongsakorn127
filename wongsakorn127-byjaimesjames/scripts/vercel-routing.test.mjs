import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const config = JSON.parse(
  await readFile(new URL('../vercel.json', import.meta.url), 'utf8'),
);

test('interactive routes use the Angular client-rendered shell on Vercel', () => {
  const rewrites = new Map(
    config.rewrites.map(rewrite => [rewrite.source, rewrite.destination]),
  );

  assert.equal(rewrites.get('/auth'), '/index.csr.html');
  assert.equal(rewrites.get('/nosy-game'), '/index.csr.html');
  assert.equal(rewrites.get('/kinglee-game'), '/index.csr.html');
});
