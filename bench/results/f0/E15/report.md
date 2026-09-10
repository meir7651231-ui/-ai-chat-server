# Report — computed field «סכום כולל מעמ» on משימה (tasks)

## What I did
1. `machtzev/generator/specs-ds/tasks.txt` — added `סכום כולל מעמ = סכום * 1.18` to entity `משימה`
   (placed after `סכום`, before `הערה`; uses the existing `שדה = נוסחה` grammar, same as sechirut.txt).
2. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`.
3. Found and fixed a semantic leak: the module manifest (`apps/tasks.json`) did not carry the formula marker,
   so the balagan aggregator (which reads the manifests) treated the computed field as a plain numeric *input*:
   it would appear as an editable number box in the «הבנתי כך?» confirm form, fact-extraction could drop a
   second number from free text into it, and that value would be stored as if typed (data faking, §20-ג).
   - `app-ds.mjs`: manifest fields now include `formula` when present (other manifests stay byte-identical).
   - `balagan.mjs`: new `inputFields(m)` (fields without a formula) feeds the module constructor line —
     numFields / BalaganField list / time / phone / person / percent / required count. 3 other `m.root.fields`
     uses (TF-IDF doc text, tests) intentionally untouched.
4. Regenerated `sechirut` (only its manifest gained `formula` keys; its Dart output is byte-identical) and `balagan`.
5. Skipped `tighten-types.mjs --record --apply` as instructed. No git commit/push.

## Changed files
spec: specs-ds/tasks.txt · generator: app-ds.mjs, balagan.mjs · derived: apps/tasks.json, apps/sechirut.json,
new/dart-gen-bs/gen_app_tasks_{ent1,home,root}.dart, new/dart-data-bs/auto/gen_app_tasks_{ent1,home,hub,root}_content.dart,
new/dart-gen-bs/gen_balagan_moments.dart.

## How I know it works
- Generated entity screen (`gen_app_tasks_ent1.dart`): the field renders as the read-only `_calc(...)` widget with
  `(num.tryParse(_v[2] ?? '') ?? 0) * 1.18`; on save it is stored as `(...).toStringAsFixed(2)`; it is carried in
  the record card, CSV export and data grid (5 labels). Same code path sechirut's formula fields already compile
  through (flutter analyze / build-web were green for sechirut before this change; Flutter is not installed here).
- Home screen: `_nums = [סכום, סכום כולל מעמ]`, but `_moneyOf` uses `_nums.first` ⇒ ₪ on rows is still `סכום`, no double count.
- Root page shows the new field as a formatted numeric fact (`_fmtNum(r0['סכום כולל מעמ'])`).
- `gen_balagan_moments.dart`: tasks numFields stays `['סכום']`, no `BalaganField('סכום כולל מעמ', ...)`; only TF-IDF
  weights shifted (the new label is part of the module document, as expected). balagan self-identification 30/30.
- `node machtzev/police.mjs --fast`: 40 ran · 0 yellow · 1 failed. Green: wiring, contract, quarry, oracle, pins,
  particles (448/32), peruk 28/28, balagan-look 35/36, balagan-one (30 modules), skingolden 9/9, no-fakers, etc.
  The single failure is `learn`, which needs git blobs absent from this shallow clone (`fatal: bad object …`);
  it is independent of the working tree and fails identically before my edit.

## Known limitation (pre-existing for every computed field)
Records created through balagan's confirm form store no value for computed fields (they are computed only in the
entity form's save); such records show the field empty until edited/saved in the משימה screen.
