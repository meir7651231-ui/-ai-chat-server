# Report — sort meetings by שעה in the calendar app

## What I did
- `new/dart-ui-bs/ds/ds_store.dart`: added two pure top-level helpers, `timeKeyOf(String)` and
  `sortedByTime(List<Map<String,String>> rs, String field)`. The key is numeric minutes parsed from
  `HH:MM` / `HH.MM` / bare hour (so `9:00` sorts before `16:30`, not lexicographically); empty or
  unparseable times go last. The sort is stable (index tiebreak — Dart's `List.sort` is not stable),
  so ties keep store order. The store itself is never mutated.
- `machtzev/generator/time-field.mjs` (new): `isTimeField` / `timeFieldOf(schema)` — one rule for
  "which field is the time field", derived from `spec-lang.data.json` `typeTime` (no domain dictionary).
- `machtzev/generator/render-ds.mjs` (entity screen): when the schema has a time field, the record
  list feeding every view (list · board · calendar · table) and the CSV export is wrapped in `sortedByTime`.
- `machtzev/generator/particles.mjs` (`[טבלה]` particle): table rows are wrapped in `sortedByTime`.
- `machtzev/generator/app-shell.mjs` (shell "רשימה" tab + Ctrl+K palette): same wrap; the old local
  `isTimeLabel` now aliases the shared rule.
- `machtzev/generator/specs-ds/calendar.txt`: added `חלקיק פגישה: [טבלה]` so the calendar app actually has
  a particle screen with a meetings table (the spec had no particle line before, so no such screen existed).
- Regenerated: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`.
- Housekeeping the police requires: `pins-check --write` (render-ds/particles are signature-locked),
  `INDEX.md` row for the new module, `truth.mjs --write` (canonical generator count 49 ⇒ 50).
- Entities without a time field are emitted byte-identical (no wrap); peruk22/peruk23 also have a שעה
  field but I did not regenerate them (out of scope) — they will pick the sort up on their next regen.

## How I know it works (Flutter/Dart not installed — verified by bytes + JS mirror + gates)
- Generated output (grep): `gen_app_calendar_ent1.dart` line 153 `final all = sortedByTime((...records...), gen_app_calendar_ent1_c11)`
  and the CSV loop (line 99); `gen_app_calendar_ent1_content.dart` has `c11 = 'שעה'`.
  `gen_app_calendar_px1.dart` (new particle screen): `ForgeDataGrid(... items: [for (final r in sortedByTime(appStore.records('app_calendar_ent1'), gen_app_calendar_px1_c6)) ...])`
  with `c6 = 'שעה'`. `gen_app_calendar_shell.dart`: `final rs = sortedByTime(..., gen_app_calendar_shell_c12)` with `c12 = 'שעה'`.
  All three files already import `ds_store.dart`, so the helper resolves.
- JS mirror of `timeKeyOf`/`sortedByTime` (same regexes, same index tiebreak) run with Node:
  input `16:30, 9:00, "", 09:00, בבוקר, 10.15, 8, 2026-09-10` ⇒ `8 | 9:00 | 09:00 | 10.15 | 16:30 | "" | בבוקר | 2026-09-10`
  (stable among the three unparseable values); key checks 8/8 ok.
- Particle plan: `1/1 נמצאו-ומחווטים · 1 מסכי-חלקיקים` (particles gate input regenerated, wired).
- `node machtzev/police.mjs --fast`: see result line below.
- Skipped `tighten-types.mjs --record --apply` as instructed. No git commit/push.
