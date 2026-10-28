<script lang="ts">
  import raw from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, groupByCause, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  const reports = uniqueById(raw as Report[]).filter(r => r.mergedInto === 4471);
  const groups = groupByCause(reports, tenantOf);
  const bulkDay = '2026-07-02';
  const bulk = reports.filter(r => r.mergedAt?.startsWith(bulkDay));
  const after = reports.filter(r => r.receivedAt.slice(0,10) > bulkDay);
  const mismatches = groups.reduce((n,g) => n + g.reports.filter(r => r.meta.intakeTag !== g.cause).length, 0);
  const odd = reports.filter(r => notes.oneDayMove.includes(r.id));
</script>

<p>The export has <strong>{raw.length}</strong> rows, including <strong>{raw.length - reports.length}</strong> repeated IDs.
Deduplicating by report ID leaves <strong>{reports.length}</strong> reports in #4471.
Tenant locale, booking-form version and channel determine the cause; browser locale and intake tags do not.
<strong>{mismatches}</strong> intake tags disagree with the cause.</p>

<h2>What the timeline shows</h2>
<p><strong>{bulk.length}</strong> reports were merged on {bulkDay}, although reports had arrived since
{groups.map(g => g.firstSeen).sort()[0]}. The July spike is a merge backlog, not the beginning of the incident.
Another <strong>{after.length}</strong> reports arrived after that day. Marking the issue known did not stop new reports.
This is an export through {reports.map(r => r.receivedAt.slice(0,10)).sort().at(-1)}, not a live queue.</p>

<h2>Symptoms that still need checking</h2>
<p><strong>{odd.length}</strong> reports in desk-notes describe a one-day move or another unusual timing symptom.
The supplied tenant classifier files all of them under parser; they are included there, not counted twice.
Their wording does not prove a timezone bug or a third cause. Preserve and investigate them with the original date input,
parsed value, timezone, generated invite and expected local time before claiming the parser fix resolves them.</p>
<ul>{#each odd as r}<li><code>{r.id}</code> · {r.tenant} · {r.channel}: {r.body}</li>{/each}</ul>

<h2>Report-to-ticket audit</h2>
{#each groups as g}
  <details><summary>{g.cause}: {g.reports.length} unique report IDs</summary><p>{g.reports.map(r => r.id).join(', ')}</p></details>
{/each}
