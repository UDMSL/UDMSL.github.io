import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

const source = await readFile(new URL('../src/utils/memo.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } })
const { fitMemoFontSize } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
const measure = (line) => Array.from(line).length * 100

test('longest explicit line fits width, without wrapping at spaces', () => {
  assert.equal(fitMemoFontSize('시험 안내\n휴대전화는 꺼 주세요', 400, 310, measure), 36)
  assert.equal(fitMemoFontSize('a b c', 400, 310, measure), 80)
})
test('blank and trailing Enter lines count toward available height', () => {
  assert.equal(fitMemoFontSize('a\n\nb\n', 400, 310, measure), 52)
  assert.equal(fitMemoFontSize('a\r\n\r\nb\r\n', 400, 310, measure), 52)
})
test('resizing is deterministic and empty notes remain readable', () => {
  const text = '시험 안내\n입력하세요.'
  const small = fitMemoFontSize(text, 400, 310, measure)
  assert.ok(small > 1)
  assert.ok(fitMemoFontSize(text, 750, 900, measure) > small)
  assert.equal(fitMemoFontSize(text, 400, 310, measure), small)
  assert.equal(fitMemoFontSize('', 400, 310, measure), 160)
})
