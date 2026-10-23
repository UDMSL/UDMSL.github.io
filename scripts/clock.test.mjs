import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

const source = await readFile(new URL('../src/utils/clock.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
})
const { clockTime, minuteLightOpacity, secondOrbitAngle } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)

test('midnight and noon use correct 12-hour and 24-hour formats', () => {
  const midnight = new Date(2026, 9, 21, 0, 0, 0, 0)
  const noon = new Date(2026, 9, 21, 12, 0, 0, 0)
  assert.equal(clockTime(midnight, false).digital, '12:00:00')
  assert.equal(clockTime(midnight, false).period, 'AM')
  assert.equal(clockTime(midnight, true).digital, '00:00:00')
  assert.equal(clockTime(noon, false).digital, '12:00:00')
  assert.equal(clockTime(noon, false).period, 'PM')
})

test('displays whole seconds and converts afternoon hours', () => {
  const time = clockTime(new Date(2026, 9, 21, 23, 5, 9, 7), false)
  assert.equal(time.digital, '11:05:09')
  assert.equal('milliseconds' in time, false)
  assert.equal(time.period, 'PM')
  assert.equal(clockTime(new Date(2026, 9, 21, 23, 59, 59, 999), true).digital, '23:59:59')
})

test('hour illumination and minute progress agree with fractional digital time', () => {
  const time = clockTime(new Date(2026, 9, 21, 3, 30, 30, 500), true)
  assert.equal(time.hour, 3)
  assert.ok(Math.abs(time.minuteProgress - (30 + 30.5 / 60)) < 1e-9)
  assert.equal(clockTime(new Date(2026, 9, 21, 0), true).hour, 12)
  assert.equal(clockTime(new Date(2026, 9, 21, 23), true).hour, 11)
})

test('recomputes from wall time after pauses and date rollover', () => {
  const before = clockTime(new Date(2026, 9, 21, 23, 59, 59, 999), true)
  const after = clockTime(new Date(2026, 9, 22, 0, 0, 0, 0), true)
  assert.equal(before.digital, '23:59:59')
  assert.equal(after.digital, '00:00:00')
  assert.equal(after.hour, 12)
  assert.equal(after.minuteProgress, 0)
})

test('second marker advances, overshoots and settles within each second', () => {
  const at = (milliseconds) => secondOrbitAngle(new Date(2026, 9, 21, 12, 0, 10, milliseconds))
  assert.equal(at(0), 54)
  assert.ok(Math.abs(at(220) - (60 + 0.8 / 3)) < 1e-9)
  assert.ok(Math.abs(at(380) - (60 - 0.3 / 3)) < 1e-9)
  assert.ok(Math.abs(at(500) - (60 + 0.1 / 3)) < 1e-9)
  assert.equal(at(640), 60)
  assert.equal(at(999), 60)
})

test('second marker crosses twelve clockwise and skips wobble for reduced motion', () => {
  assert.equal(secondOrbitAngle(new Date(2026, 9, 21, 12, 0, 59, 999)), 354)
  assert.equal(secondOrbitAngle(new Date(2026, 9, 21, 12, 1, 0, 0)), -6)
  assert.equal(secondOrbitAngle(new Date(2026, 9, 21, 12, 1, 0, 820)), 0)
  assert.equal(secondOrbitAngle(new Date(2026, 9, 21, 12, 0, 10, 0), true), 60)
})

test('elapsed minute dashes remain lit while future minutes remain dark', () => {
  assert.equal(minuteLightOpacity(30.5, 29), 1)
  assert.equal(minuteLightOpacity(30.5, 30), 0.5)
  assert.equal(minuteLightOpacity(30.5, 31), 0)
  assert.equal(minuteLightOpacity(0, 0), 0)
  assert.equal(minuteLightOpacity(60, 59), 1)
})

test('sway varies the leading glow without altering completed minute boundaries', () => {
  for (const sway of [-0.08, 0, 0.08]) {
    assert.equal(minuteLightOpacity(30.5, 29, sway), 1)
    assert.equal(minuteLightOpacity(30.5, 31, sway), 0)
    for (let fraction = 0; fraction <= 1; fraction += 0.01) {
      const opacity = minuteLightOpacity(30 + fraction, 30, sway)
      assert.ok(opacity >= 0 && opacity <= 1)
    }
  }
  assert.ok(minuteLightOpacity(30.5, 30, 0.08) > minuteLightOpacity(30.5, 30, -0.08))
})
