import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { uniqueById, groupByCause, type Report, type Tenant } from '../src/lib/kb/causes';
const dir = 'src/lib/data';
const raw: Report[] = JSON.parse(readFileSync(`${dir}/reports-4471.json`, 'utf8'));
const tenants = new Map(readdirSync(`${dir}/tenants`).map(file => {
  const tenant: Tenant = JSON.parse(readFileSync(`${dir}/tenants/${file}`, 'utf8'));
  return [tenant.handle, tenant];
}));
const reports = uniqueById(raw).filter(r => r.mergedInto === 4471);
const groups = groupByCause(reports, r => tenants.get(r.tenant));
const notes = JSON.parse(readFileSync(`${dir}/desk-notes.json`, 'utf8'));
const summary = {
  rawRows: raw.length, uniqueReports: reports.length, duplicateRows: raw.length - uniqueById(raw).length,
  groups: groups.map(({reports, ...g}) => ({...g, count: reports.length, ids: reports.map(r => r.id), examples: reports.slice(0, 3)})),
  oneDayMove: reports.filter(r => notes.oneDayMove.includes(r.id)),
  receivedByMonth: Object.fromEntries([...new Set(reports.map(r => r.receivedAt.slice(0,7)))].sort().map(month => [month, reports.filter(r => r.receivedAt.startsWith(month)).length])),
  mergedByDay: Object.fromEntries([...new Set(reports.map(r => r.mergedAt?.slice(0,10)))].sort().map(day => [day, reports.filter(r => r.mergedAt?.startsWith(day!)).length]))
};
mkdirSync('analysis', {recursive: true});
writeFileSync('analysis/report-audit.json', JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify({...summary, groups: summary.groups.map(({ids, ...g}) => g)}, null, 2));
