# Report — calendar: sort meetings by שעה everywhere they are listed

## What I changed
1. `machtzev/generator/specs-ds/calendar.txt`
   - Entity line: appended `| מיון: שעה עולה` (existing L105 grammar) ⇒ the entity list screen sorts by time.
   - New line `חלקיק פגישה: פגישות = [טבלה] | מיון: שעה עולה` ⇒ a particle screen with the meetings table, sorted by time.
     (The spec had no particle screen before; the grammar's `[טבלה] | מיון:` form was already supported.)
2. `machtzev/generator/sort-cmp.mjs` (shared comparator emitter, not signature-pinned)
   - Added a time-aware branch: for a field whose label is a `typeTime` word (same rule as `isTimeLabel` in app-shell.mjs),
     the emitted Dart compares `H:MM` values as minutes-from-midnight, falling back to string compare. Without this,
     `9:00` sorted after `16:30` (lexical). Numeric / enum / other text fields emit byte-identical code as before.
3. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`
   - Changed: `gen_app_calendar_ent1.dart` (+ `rs.sort(...)` on the record list, before the list/board/calendar/table branches),
     `gen_app_calendar_hub.dart` (+ nav tile to the new screen), their `_content.dart` constants, `particle-plan-calendar.json`.
   - New: `gen_app_calendar_px1.dart` + content (ForgeDataGrid over `records(...).toList()..sort(<time comparator>)`), `particle-plan-calendar.md`.

## How I know it works (Flutter/Dart not installed, so no compile/run)
- Before editing, regenerating calendar unchanged produced zero git diff, so every diff above is from this change only.
- `gen_app_calendar_ent1.dart:157` and `gen_app_calendar_px1.dart:18` both contain the sort; the key constants resolve to `'שעה'`
  (`gen_app_calendar_ent1_c16`, `gen_app_calendar_px1_c6`). Empty times sort last, as in the existing comparator.
- JS mirror of the emitted comparator (same regex + minute arithmetic) on sample rows gives
  `08:45 · 9:00 · 09:15 · 13:00 בערך · 16:30 · (empty)` — scratch script, not committed.
- Regenerated the five other specs that use `מיון` (peruk13/15/16/22/24): zero diff ⇒ comparator change is byte-identical for non-time fields.
- Gates run green: `particles --gate` (449 particles / 32 specs, calendar's new particle resolved+wired to DsTable),
  `balagan-look --gate` (35/36, 0 red, 31 paper apps incl. calendar), `balagan-one --gate` (30 modules), `spec-lang-doc --gate`.
- `node machtzev/police.mjs --fast`: 39 ran, 4 failed — all pre-existing and unrelated to this change:
  `pins` (particles.mjs/render-ds.mjs/police.mjs/gates.tsv/LEARNINGS.md changed in HEAD without pin refresh; I did not touch them),
  `index-complete` (formula-fns/sort-cmp/spec-lang-doc missing from INDEX.md since HEAD),
  `truth` (TRUTH.md says 49 generator scripts / 53 gates, live tree has 52 / 55 — from HEAD, not from generated app files),
  `learn` (git blobs missing in this clone). Skipped `tighten-types` as instructed.

## Not done / notes
- No git commit. The `sechirut_ent2` diff and `panuy` untracked files were already dirty before I started and are untouched.
- Sort is by שעה only (as asked), not date-then-time.
