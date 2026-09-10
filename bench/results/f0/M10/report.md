# Report: calendar meeting duration fields

## What I did
1. `machtzev/generator/specs-ds/calendar.txt` — appended two fields to the meeting entity (after `הערה`, before `| שלבים`):
   `משך בדקות, משך בשעות = משך בדקות / 60`
   Appending at the end keeps the existing `_v[0..4]` indices of the five original fields unchanged.
2. `machtzev/generator/spec-lang.data.json` — added `"דקות"` to `typeNum`. The entity parser (`entity.mjs::inferType`)
   types fields purely by keyword hints from this data atom (§19-ד: no dictionary in the engine), and no existing hint
   matches "משך בדקות", so without this the minutes field would have been a plain text input. `משך בשעות` already
   matched `שעות` and is a formula anyway.
3. Regenerated: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`,
   then `node machtzev/generator/balagan.mjs` (the merged Balagan app consumes `apps/calendar.json`).
   I also re-ran `peruk.mjs --all` to confirm the new type hint does not change any owner-document spec: only
   `calendar.txt` differs in `specs-ds/` (the `ו(typeNum)` compound-splitter never hits "ודקות" in `peruks/`).
   Skipped `tighten-types.mjs` as instructed. No git commit/push.

## Evidence it works (Flutter not installed, so bytes + gates)
- `apps/calendar.json`: two new schema entries, both `"type": "num"`.
- `gen_app_calendar_ent1_content.dart`: `c1 = '7 שדות · 2 שלבים'`, `c14 = 'משך בדקות'`, `c15 = 'משך בשעות'`.
- `gen_app_calendar_ent1.dart` line 51 (record map) and line 163 (live calc row):
  `((num.tryParse(_v[5] ?? '') ?? 0)  / 60)` — index 5 is the minutes field; same pattern as the rental app's
  `שכירות * 12` formula, which is the proven path.
- `gen_app_calendar_root.dart`: record page gained two `KvLine(... _fmtNum(...))` rows for the new fields.
- Other diffs in home/root/hub content are only constant renumbering (same strings, shifted indices); a script
  confirmed every `gen_app_calendar_*_cN` referenced in the four gen files is defined in its content file
  (ent1 18/18, home 79 used/81 defined, root 48/62, hub 17/18, missing = none) and that `()`, `{}`, `[]` balance
  in all changed Dart files. `gen_balagan_moments.dart` changed only in recomputed TF-IDF weights.
- `balagan.mjs`: 30 modules, moment identifier self-matches 30/30.
- `node machtzev/police.mjs --fast` before vs after: gate ledger byte-identical (40 ran · 12 skipped · 0 yellow ·
  1 failed). The single failure is `learn` and is pre-existing: it references git blob objects missing from this
  clone (`fatal: bad object ...`), unrelated to my change. Relevant gates green: `balagan` 35/36 on 31 paper apps,
  `balaganone` 30/30, `particles` 448 particles wired, `entity` grammar/type-hint checks, `peruk` 28/28.

## Files changed
spec + dictionary (2) · `apps/calendar.json` · 4 `gen_app_calendar_*_content.dart` · 3 `gen_app_calendar_*.dart` ·
`gen_balagan_moments.dart`.
