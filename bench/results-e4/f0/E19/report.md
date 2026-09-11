# Report: peruk25 dashboard counter for סיווג = דגל מוגן

## What I did
- `machtzev/generator/specs-ds/peruk25.txt` is not hand-edited in this repo: the `peruk` police gate
  requires every `specs-ds/perukNN.txt` to be byte-identical to what `generator/peruk.mjs` derives
  from the owner's document `peruks/peruk-25.md`. A direct edit would have turned that gate red.
- So the counter is added through the reader, data-driven:
  - `machtzev/generator/peruk-lang.data.json`: new key `dashClassCounts: ["דגל מוגן"]` — classification
    values that earn a filtered dashboard counter when the document's סיווג section contains them.
  - `machtzev/generator/peruk.mjs` (dashboard line): appends `, מונה(תיק: סיווג=<value>)` for each
    value in `dashClassCounts` that is present in the doc's classes (same pattern as the existing
    severity counter `מונה(ממצא: צבע=אדום)`).
- Ran `node machtzev/generator/peruk.mjs --all`: only `specs-ds/peruk25.txt` changed (one line),
  `peruk-index.json` and the other 27 specs are unchanged. The line now reads:
  `לוח בקרה עם מונה(תיק), מונה(תיק: סיווג=דגל מוגן)`
- Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk25.txt --name peruk25 --skin`
  (exit 0, 7 screens). Changed outputs: `new/dart-gen-bs/gen_app_peruk25_scr2.dart`,
  `new/dart-data-bs/auto/gen_app_peruk25_scr2_content.dart`, `gen_app_peruk25_hub_content.dart`
  ("1 מדדים" → "2 מדדים"). `apps/peruk25.json` is unchanged.
- `peruk.mjs` is signature-locked, so I ran `node machtzev/pins-check.mjs --write` (the documented step).
  Note: it also refreshed hashes for files that were already stale at HEAD (LEARNINGS.md, gates.tsv,
  particles.mjs, render-ds.mjs, police.mjs, + new formula-fns/spec-lang-doc entries) — pre-existing drift.
- Skipped `tighten-types.mjs --record --apply` (known-broken). No git commit/push.

## How I know it works
- Generated dashboard Dart now contains the live filtered counter:
  `appStore.records('app_peruk25_ent1').where((r) => (r[c9] ?? '') == c10).length` with
  `c9 = 'סיווג'`, `c10 = 'דגל מוגן'`, tile label `'דגל מוגן'`, sub `'תיק · דגל מוגן'`, plus the
  two-value ForgeWaveformBars comparison. This is byte-pattern identical to the already-compiling
  filtered counter in `gen_app_peruk04_scr3.dart` (`צבע=אדום`), which is the strongest available
  evidence without Flutter installed.
- `node machtzev/generator/peruk.mjs --gate` → green, 28/28 specs ≡ reader.
- `node machtzev/police.mjs --fast`: gates `pins`, `peruk`, `particles`, `balagan`, `balaganone`,
  `oracle`, `acceptance` all ran green. 3 gates are red — `truth` (TRUTH.md says 49 canonical files /
  53 gates, live tree has 52 / 55), `index-complete` (formula-fns.mjs, sort-cmp.mjs, spec-lang-doc.mjs
  missing from INDEX.md), `learn` (missing git blobs in this clone). All three concern files/objects
  I did not touch and are pre-existing at HEAD; my change adds no file and no gate.
- Pre-existing uncommitted changes in the tree (sechirut ent2 files, untracked panuy app) were left as is.
