# kb — the support knowledge base

## S01E03 review and deliverables

- [Parser ticket: 379 unique reports](https://github.com/phhien203/mega-s01e03/issues/1)
- [Booking-v3 hint ticket: 33 unique reports](https://github.com/phhien203/mega-s01e03/issues/2)
- [Signed review source](src/routes/kb/incidents/4471-review/+page.svx)
- [Rendered review HTML](build/kb/incidents/4471-review/index.html), including the computed cause table, queue timeline, dedupe examples and signature stamp
- [Rendered review text](analysis/rendered-review.txt) for easy inspection on GitHub
- [Count and report-ID audit](analysis/report-audit.json)
- [Current triage runbook](src/routes/kb/triage/dedupe/+page.svx)
- [Replacement decision 0002](src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx); accepted decision 0001 is unchanged

The original export had no app build configuration. This repo adds a SvelteKit/mdsvex static build without changing the supplied cause classifier, tenant directory, report data or stamp algorithm. The original incident prose is marked historical and points to the new review.

```sh
bun install --frozen-lockfile
bun test
bun run analyze
bun run build
python3 -m http.server 4173 --directory build --bind 127.0.0.1
# Open http://127.0.0.1:4173/kb/incidents/4471-review/
```

The checked-in `build/` is the real compiled site, not handwritten HTML. Its CSS and scripts are included. Serve it from the build root so absolute asset paths work. Pages are an export snapshot, not access to the live support queue.

---

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.
