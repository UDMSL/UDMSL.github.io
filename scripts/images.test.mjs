import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

// Run the actual TypeScript utility without adding a test framework dependency.
const source = await readFile(new URL('../src/utils/images.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
})
const { toWebpUrl } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)

test('converts local raster assets and preserves complete query strings and fragments', () => {
  assert.equal(toWebpUrl('/img/portrait.JPG'), '/img/portrait.webp')
  assert.equal(toWebpUrl('img/photo.jpeg?size=2?raw#preview'), 'img/photo.webp?size=2?raw#preview')
  assert.equal(toWebpUrl('/img/logo.png#brand'), '/img/logo.webp#brand')
  assert.equal(toWebpUrl('/img/logo.png?'), '/img/logo.webp?')
})

test('does not request speculative WebP siblings from remote image providers', () => {
  for (const url of [
    'https://example.com/photo.jpg?token=abc',
    'http://example.com/photo.png',
    '//example.com/photo.jpg',
    'data:image/png;base64,abc',
    'blob:https://example.com/photo.png',
  ]) {
    assert.equal(toWebpUrl(url), url)
  }
})

test('leaves empty sources, other formats and query values unchanged', () => {
  for (const url of ['', '/img/photo.webp', '/img/icon.svg', '/img/animated.gif', '/image?file=photo.png']) {
    assert.equal(toWebpUrl(url), url)
  }
})
