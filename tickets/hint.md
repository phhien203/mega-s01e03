Source ticket: #4471
Cause: hint
Reports: 33

## Outcome — engineering update

Engineering update on the course page: #4471 closed 05 October. Hint WON’T FIX: booking-v3 form retired. Closed as not planned, not completed; retirement is not a hint correction.

The diagnosis and coverage below describe the original export, before that update.

## Problem

The booking-v3 date field prints MM/DD/YYYY, so people follow a month-first hint while the form reads the value in the tenant's day-first order. This is a separate bug from the shared month-first parser. It affects the form channel for Alder Physio (de-DE), Copper Studio (es-ES), and Pale Harbour (pt-PT).

R-41241 (Alder Physio, form) says bookings for 6 August appeared on 8 June; R-41230 (Copper Studio, form) says 6 January appeared as 1 June. Reproduce by following the MM/DD hint for 6 August (08/06) under a day-first tenant; the form reads 8 June. Expected: the displayed format, submitted value and tenant-aware reader agree. Fix the localized hint and verify the actual end-to-end form path, rather than assuming the shared parser fix covers this.

## Coverage

**33 unique reports** from merged support ticket **#4471**; 3 tenants; received 2026-04-17 through 2026-09-22.

The export contains 427 rows but only 412 unique report IDs (15 overlapping export rows). Counts use uniqueById, then tenant locale, form version and channel via causeOf in src/lib/kb/causes.ts. Browser locale and intakeTag are not authoritative. Intake labels within this group: {"parser":15,"hint":18}.

Keep this ticket separate from the parser ticket even when report subjects match. The current export's table calls this “not this ticket” because it was merged into #4471 without its own desk ticket; this GitHub issue supplies that missing track.

## Desk action while the fix is pending

Use decision 0002 and the revised triage runbook now: route by supported cause, not subject. Unknown or contradictory cases stay under investigation. Reconcile new arrivals against the live queue; these counts are only the export snapshot. This was the routing rule while fixes were pending; the engineering update above now governs closure.

## Evidence and knowledge-base page

- Source: [signed review](https://github.com/phhien203/mega-s01e03/blob/main/src/routes/kb/incidents/4471-review/+page.svx).
- Rendered page: [HTML with computed tables, timeline and desk ref](https://github.com/phhien203/mega-s01e03/blob/main/build/kb/incidents/4471-review/index.html).
- Reproducible count and ID audit: [report-audit.json](https://github.com/phhien203/mega-s01e03/blob/main/analysis/report-audit.json).
- [Replacement merge decision](https://github.com/phhien203/mega-s01e03/blob/main/src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx).

## Covered report IDs

R-41230, R-41241, R-41251, R-41259, R-41262, R-41275, R-41294, R-41305, R-41308, R-41366, R-41372, R-41384, R-41387, R-41396, R-41400, R-41406, R-41415, R-41416, R-41418, R-41428, R-41439, R-41441, R-41449, R-41453, R-41456, R-41460, R-41472, R-41485, R-41493, R-41539, R-41572, R-41582, R-41584
