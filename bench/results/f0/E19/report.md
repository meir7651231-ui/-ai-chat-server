# Report — dashboard counter for סיווג=דגל מוגן (peruk25)

## What changed
- `machtzev/generator/specs-ds/peruk25.txt` — dashboard line is now
  `לוח בקרה עם מונה(תיק), מונה(תיק: סיווג=דגל מוגן)` (filtered-counter grammar already supported by app-ds, `FILT_RE`).
- Why not a hand edit only: `peruk25.txt` is *derived* from `peruks/peruk-25.md` by `peruk.mjs`; the `peruk` gate
  requires spec-on-disk ≡ derived spec, and `regen.mjs` reruns `peruk.mjs --all` before app-ds, so a hand edit
  would go red and be overwritten. The counter therefore comes from the reader.
- `machtzev/generator/peruk.mjs` (1 rule, 3 lines): a classification whose name appears in the owner's *written*
  disclaimer (here «דגל מוגן / סילוק — עו״ד») is the case the product only flags and hands off ⇒ the dashboard
  gets `מונה(תיק: סיווג=<class>)`. Structural (class-name ⊂ disclaimer text), no domain dictionary; mirrors the
  existing `מונה(ממצא: צבע=אדום)` precedent. Default disclaimer is excluded.
- Corpus effect measured over all 28 documents: exactly two hit — peruk25 (דגל מוגן) and peruk24 (אחרי נפילה).
  peruk24's spec and app were regenerated too for consistency (flagged here; revert is one line if unwanted).
- Regenerated apps: `app-ds … --name peruk25 --skin` and `… peruk24 --skin`. Files changed (tracked): peruk.mjs,
  2 specs, `gen_app_peruk2{4,5}_scr2.dart`, their `_content.dart`, hub `_content.dart` («2 מדדים»), `pins.sha256`
  (refreshed via `pins-check --write` because peruk.mjs is signature-pinned). `peruk-index.json` unchanged.
- Skipped per instructions: `tighten-types.mjs --record --apply`. No git commit/push.

## How I know it works
- Generated Dart (`new/dart-gen-bs/gen_app_peruk25_scr2.dart`) now has a second KvLine tile labelled 'דגל מוגן'
  whose value is `appStore.records('app_peruk25_ent1').where((r) => (r['סיווג'] ?? '') == 'דגל מוגן').length`,
  plus the bars chart with both values. The enum field on the form stores the option string itself
  (`gen_app_peruk25_ent1_c17 = 'דגל מוגן'`), so the comparison matches bytes.
- Same emitted shape (KvLine + records().where + ForgeWaveformBars) already exists in `gen_app_peruk01_scr3.dart`
  and `gen_app_peruk09_scr3.dart`, which are part of the shelf that passes analyze/build — so the Dart path is
  proven; Flutter is not installed here, so no new compile was run.
- `node machtzev/generator/peruk.mjs --all` ⇒ only peruk24/peruk25 specs changed; `--gate` green (28/28).
- `node machtzev/police.mjs --fast` before and after: identical verdict — 40 ran · 12 skipped · 0 yellow ·
  1 failed. The single failure is the `learn` gate (missing git blobs in this checkout, pre-existing,
  unrelated). `peruk`, `particles`, `balagan` (35/36), `balaganone` (30/30), `pins` all green.
