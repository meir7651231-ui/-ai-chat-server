# Report — «ימים לתגובה» [מספר] particle on the peruk17 case screen

## What was added
`machtzev/generator/specs-ds/peruk17.txt` now contains (lines 7, 22, 23):
- entity `תיק` gained the field `ימים לתגובה` (the value the particle shows)
- `חלקיק תיק: ימים לתגובה = [מספר] ימים לתגובה: 30 ימים מקבלת המכתב`
- `דוח תיק: ימים לתגובה = ימים לתגובה` (the report part the reader always pairs with a number particle)

## Why not a hand edit of the txt
peruk17.txt is a generated file: the `peruk` police gate requires spec-on-disk ≡ output of
`generator/peruk.mjs` from `generator/peruks/peruk-17.md`. A direct edit turns that gate red.
So the change was routed through the source:
1. `peruks/peruk-17.md`: «מה שולחים» gained `ימים לתגובה`; «מה חוזר» gained item
   `6. ימים לתגובה: 30 ימים מקבלת המכתב`.
2. `peruk.mjs` (one structural rule, no new vocabulary): an output part whose name equals an input field
   and whose detail starts with a digit ⇒ `[מספר] <field>: <detail>`. Previously `[מספר]` was only
   emitted for old/new pair fields when the part name contained the word «מספר».
3. `node machtzev/generator/peruk.mjs --all` → only peruk17.txt and peruk-index.json changed
   (the other 27 specs are byte-identical, confirmed via `git status`).
4. `node machtzev/generator/app-ds.mjs -f …/peruk17.txt --name peruk17 --skin` → 8/8 particles wired.
5. `node machtzev/generator/balagan.mjs` (regen order runs it after app-ds) → 30 modules, 30/30 moments.
6. `node machtzev/pins-check.mjs --write` (peruk.mjs is a pinned file).
The known-broken `tighten-types.mjs --record --apply` step was not run.

## How I know it works
- `particle-plan-peruk17.json`: `"name": "ימים לתגובה"`, `"ok": true`, shape `number`, op `hero`, wired `KvLine`
  (same resolution as the existing «המספר שלך» particle in sechirut).
- `new/dart-gen-bs/gen_app_peruk17_px1.dart:35`: `KvLine(label: …c94, value: (num.tryParse(r[…c95] ?? '') ?? 0).toStringAsFixed(0))`
  over `appStore.records('app_peruk17_ent1')`; `…px1_content.dart:99` holds `'30 ימים מקבלת המכתב'`;
  the note also lands in the report screen (`…rp1_content.dart:61,65`).
- Gates: `peruk`, `particles` (448 particles, 32 specs, all wired), `balagan`, `balaganone`, `pins` all ran green.
- `node machtzev/police.mjs --fast` before vs after: identical verdict — 40 ran · 12 skipped · 1 failed,
  the failure being the pre-existing `learn` gate (9 missing git blob refs, same 9 lines before and after,
  unrelated to this change).
- Not verified: `flutter analyze` / `flutter build web` (Flutter is not installed here).

## Files changed (tracked)
peruk-17.md · peruk.mjs · peruk17.txt · peruk-index.json · apps/peruk17.json · particle-plan-peruk17.{json,md} ·
report-plan-peruk17.json · pins.sha256 · gen_app_peruk17_{ent1,px1,root,rp1}.dart (+ their `_content` files, hub content) ·
gen_balagan_moments.dart (peruk17 module: new field + its term weights). No commits, no git remotes touched.
