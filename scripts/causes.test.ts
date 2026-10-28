import { expect, test } from 'bun:test';
import { readFileSync, readdirSync } from 'node:fs';
import { causeOf, dayFirst, uniqueById, groupByCause, sameCause, type Report, type Tenant } from '../src/lib/kb/causes';
import { deskRef } from '../src/lib/kb/desk-ref';
const dir = 'src/lib/data';
const raw: Report[] = JSON.parse(readFileSync(`${dir}/reports-4471.json`, 'utf8'));
const tenants = new Map(readdirSync(`${dir}/tenants`).map(f => {
  const t: Tenant = JSON.parse(readFileSync(`${dir}/tenants/${f}`, 'utf8')); return [t.handle, t];
}));
const reports = uniqueById(raw).filter(r => r.mergedInto === 4471);
test('count overlapping export pages once and reconcile every report', () => {
  expect(raw.length).toBe(427);
  expect(reports.length).toBe(412);
  const groups = groupByCause(reports, r => tenants.get(r.tenant));
  expect(groups.map(g => [g.cause, g.reports.length])).toEqual([['parser',379],['hint',33]]);
  expect(new Set(groups.flatMap(g => g.reports.map(r => r.id))).size).toBe(412);
});
test('tenant configuration, not browser locale or intake label, decides cause', () => {
  const r = reports.find(r => r.id === 'R-41230')!;
  expect(r.meta.intakeTag).toBe('parser');
  expect(causeOf(r, tenants.get(r.tenant))).toBe('hint');
  expect(causeOf({...r, meta: {browserLocale: 'en-US', intakeTag: 'parser'}}, tenants.get(r.tenant))).toBe('hint');
});
test('one tenant and subject can have different causes on different channels', () => {
  const t = tenants.get('alder.physio');
  expect(sameCause({channel:'form'}, t, {channel:'app'}, t)).toBe(false);
});
test('unknown and month-first tenants do not get silently assigned', () => {
  expect(causeOf({channel:'email'}, undefined)).toBeNull();
  expect(dayFirst('en-US')).toBe(false);
  expect(causeOf({channel:'form'}, {handle:'control',name:'Control',locale:'en-US',form:'booking-v3'})).toBeNull();
});
test('unusual timing reports remain included once with explicit uncertainty', () => {
  const ids = JSON.parse(readFileSync(`${dir}/desk-notes.json`, 'utf8')).oneDayMove;
  const odd = reports.filter(r => ids.includes(r.id));
  expect(odd.length).toBe(5);
  expect(odd.every(r => causeOf(r, tenants.get(r.tenant)) === 'parser')).toBe(true);
});
test('signature has a deterministic desk ref', () => {
  const signature = 'phhien203 / Pi / S01E03 / 2026-10-28';
  expect(deskRef(signature)).toMatch(/^DR-[0-9A-Z]{4}-[0-9A-Z]{4}$/);
  expect(deskRef(` ${signature} `)).toBe(deskRef(signature));
});
