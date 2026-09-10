# Report: peruk12 cases table sorted by מחיר (cheapest first, numeric)

## What I did
- `machtzev/generator/spec-lang.data.json`: new grammar words `pSortBy` = לפי · מיין לפי · ממוין לפי.
- `machtzev/generator/particles.mjs`:
  - `shapeOf`: `[טבלה] לפי <שדה>` ⇒ `{kind:'table', sortBy, sortNum}` (field must be in the schema; `sortNum` when the field is `num` or a formula). Plain `[טבלה]` is unchanged.
  - table emission: rows iterate a sorted copy: `(records.toList()..sort((a,b) => (num.tryParse(a[f] ?? '') ?? double.infinity).compareTo(num.tryParse(b[f] ?? '') ?? double.infinity)))` — numeric compare, ascending, empty/non-numeric last; non-numeric fields fall back to string compare.
- `machtzev/generator/peruk.mjs`: peruk12.txt is generated from `peruks/peruk-12.md` and the `peruk` gate requires spec-on-disk ≡ generator, so the sort is derived structurally there: the table is ordered by the numeric input field the first «מה חוזר» part (the card) refers to. For peruk-12 that is `מחיר` ("כרטיס: מחיר מול הגיל/ק״מ"); for the other 27 documents no such field exists, so their specs are byte-identical.
- Regenerated: `node machtzev/generator/peruk.mjs --all` (only `specs-ds/peruk12.txt` changed: `חלקיק תיק: [טבלה] לפי מחיר`), then `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk12.txt --name peruk12 --skin`.
- `node machtzev/pins-check.mjs --write` (particles.mjs and peruk.mjs are signature-pinned).
- Skipped `tighten-types.mjs` as instructed. No commits, no git remote access.

## Result (new/dart-gen-bs/gen_app_peruk12_px1.dart)
`ForgeDataGrid(... items: [for (final r in (appStore.records('app_peruk12_ent1').toList()..sort((a, b) => (num.tryParse(a[c7] ?? '') ?? double.infinity).compareTo((num.tryParse(b[c8] ?? '') ?? double.infinity))))) [...]])`
where `c7`/`c8` are the constant `'מחיר'`. Columns, other particles, screen title and the rest of the app are unchanged.

## How I know it works
- Gates: `peruk.mjs --gate` ✓ (28/28 specs fresh) · `particles.mjs --gate` ✓ (448 particles, 32 specs, 0 unresolved).
- `node machtzev/police.mjs --fast`: 40 ran · 12 skipped · 0 yellow · 1 failed — the failing gate is `learn`, and it failed identically before my change (missing git blobs in this clone; the failure block has the same md5 before/after). No new failures.
- Scratch test (`scratchpad/verify-sort.mjs`): parser cases (`[טבלה]`, `[טבלה] לפי מחיר`, `[רשימה] מיין לפי מחיר`, text field ⇒ string sort, unknown field ⇒ rejected), the exact emitted Dart pattern with both constants = מחיר, no record-sort in the other 27 peruk apps, and a JS mirror of the comparator ordering 800 < 9000 < 42000 < 150000 with empty/missing last (text order would put 150000 before 800).
- Dart typing check by reading: `num.tryParse` → `num?`, `?? double.infinity` → `num`, `num.compareTo(num)` → `int`; `.toList()` copies, so the store list is not mutated. Flutter/Dart is not installed here, so this was not compiled.

## Files changed
particles.mjs · peruk.mjs · spec-lang.data.json · specs-ds/peruk12.txt · particle-plan-peruk12.{json,md} · pins.sha256 · new/dart-gen-bs/gen_app_peruk12_px1.dart · new/dart-data-bs/auto/gen_app_peruk12_px1_content.dart
