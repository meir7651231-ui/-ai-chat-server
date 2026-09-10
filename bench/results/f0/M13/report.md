# Report — peruk12: «אגרת העברה» number particle

## What was asked
Add a "your number" particle (`[מספר]`) named `אגרת העברה` to the case (תיק) screen of
`machtzev/generator/specs-ds/peruk12.txt`, text: `אגרת העברת בעלות משולמת לפני הרישום`.

## Result (spec line now present, generated from source)
`חלקיק תיק: אגרת העברה = [מספר] מחיר: אגרת העברת בעלות משולמת לפני הרישום`
(plus `דוח תיק: אגרת העברה = אגרת העברה`, exactly as the engine already does for the sechirut number particle).
`מחיר` is the only numeric field on תיק; a `[מספר]` particle must name a schema field (particles.mjs:109).

## Why not a bare hand-edit
`peruk12.txt` is emitted by `machtzev/generator/peruk.mjs` from the owner document `peruks/peruk-12.md`;
the `peruk` police gate fails when the spec on disk differs from what the reader emits. I verified this: after a
hand-edit only, `peruk.mjs --gate` printed `🔴 peruk-12.md: הספק בדיסק ≠ המחולל`. So the change was made at the source.

## Changes
1. `machtzev/generator/peruks/peruk-12.md` — new item 5 under «מה חוזר»: `אגרת העברה: מחיר` with the note on the
   next line; items 6–7 renumbered (החלטה stays last so its trailing «לא:» line still attaches to it).
2. `machtzev/generator/peruk.mjs` — one narrow structural rule (+ header comment): an output item with no kind word
   (or kind «מספר») whose first detail line is exactly a schema field label containing a `spec-lang.typeNum` word
   ⇒ `[מספר] <field>: <remaining detail>`. No dictionary, no domain words.
3. `node machtzev/generator/peruk.mjs --all` — regenerated all 28 specs + `peruk-index.json`; only peruk12 changed.
4. `node machtzev/generator/app-ds.mjs -f …/peruk12.txt --name peruk12 --skin` — regenerated the app.
5. `node machtzev/pins-check.mjs --write` — refreshed the sha256 pin for peruk.mjs (only line changed in pins.sha256).

## How I know it works
- Baseline: regenerating peruk12 from the untouched spec produced zero diff (generator is deterministic).
- Particle plan: `| אגרת העברה | תיק | number | hero⇒KpiTile | KvLine |` — 7/7 particles found and wired, 0 unresolved.
- Dart: `gen_app_peruk12_px1.dart` gained the KvLine row (`label: 'אגרת העברה'`, value from `מחיר`) plus the
  `kv_line.dart` import; content consts hold the label, the field and the note text. Hub says «7 חלקיקים חיים».
  `gen_app_peruk12_rp1.dart` gained the report section and its text is in the WhatsApp export string.
- Gates: `peruk --gate` ✓ (28/28), `particles --gate` ✓ (450 particles, 32 specs), `police --fast`: 40 ran,
  0 yellow, all of wiring/contract/oracle/pins/particles/peruk/balagan/balaganone green.
- Only pre-existing red: `learn` — it needs git blobs that this shallow clone does not have
  (`git rev-parse --is-shallow-repository` = true, `git cat-file -t 0bc0365…` fails). Unrelated to this change.
- Flutter/Dart are not installed, so no `flutter analyze`; the emitted KvLine call is byte-shaped like the
  already-committed sechirut number particle. `tighten-types.mjs` was skipped as instructed.

## Not touched
No git commit/push/stash. Pre-existing untracked `panuy` files and `_prompt-builder.md` were left as found.
