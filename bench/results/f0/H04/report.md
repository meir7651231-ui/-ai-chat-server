# Report — calendar meetings table sorted by מועד, then שעה

## What I did
- Added an opt-in entity clause `| מיון: <field>, <field>…` to the spec grammar.
  - `machtzev/generator/spec-lang.data.json`: `מיון` added to `sectionMarkers` + new `markSort`.
  - `machtzev/generator/entity.mjs`: parses the clause into `sortBy` (only labels that exist in the schema, deduped; no clause ⇒ `[]`).
  - `machtzev/generator/app-ds.mjs`: passes `sortBy` to `renderEntity`.
  - `machtzev/generator/render-ds.mjs`: when `sortBy` is non-empty, emits three static helpers into the entity screen
    (`_cmpCell`, `_minutesOf`, `_sorted`) and feeds `_sorted(rs)` to the table view only.
    Comparison is derived from value shape, not domain words: ISO date ⇒ chronological, `HH:MM` ⇒ minutes,
    number ⇒ numeric, otherwise lexical; empty cells sort last; full ties keep insertion order (index tiebreak, stable).
    List / board / calendar views are untouched. With no clause the emitter output is byte-identical to before.
- `machtzev/generator/specs-ds/calendar.txt`: entity line now ends with `| מיון: מועד, שעה`.
- Regenerated: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`.
  Result in `new/dart-gen-bs/gen_app_calendar_ent1.dart`: `_view == 3` (▦ טבלה) now renders
  `ForgeDataGrid(... items: _sorted(rs).map(...))` with sort keys `[gen_app_calendar_ent1_c10, gen_app_calendar_ent1_c11]` (= מועד, שעה).
- `node machtzev/pins-check.mjs --write` (render-ds.mjs is signature-locked) — `machtzev/pins.sha256` updated.
- Skipped `tighten-types.mjs` as instructed. No commits, no git remotes touched.

## How I know it works
- Determinism control: regenerating calendar *before* any change produced zero git diff; regenerating `tasks` (no clause)
  *after* the change also produced zero diff ⇒ other apps are byte-identical. Only `gen_app_calendar_ent1.dart` changed (+29/-1).
- The forge skin pass (`retarget.mjs` role `table`) correctly rewrote `rows: _sorted(rs)…` into `items: _sorted(rs)…`.
- Pure-Dart probe (Flutter not installed, `dart` is): a script extracts the emitted helper block *verbatim* from the generated
  screen plus the real content constants, compiles it with `dart run`, and sorts 7 records covering: two dates, `9:00` vs
  `16:30` (lexical order would be wrong), a same-date/same-time tie (insertion order kept), empty date (last), empty time
  (before non-empty times), and a non-time word in שעה. Expected order `gbacfde` — got `gbacfde`, OK. Empty list ⇒ empty.
  Probe: scratchpad `sort_probe.mjs` / `sort_probe.dart`.
- `node machtzev/police.mjs --fast`: 40 ran · 12 skipped (--fast) · 1 failed. Green includes wiring, contract, pins,
  genratchet, acceptance, particles, peruk, balagan, balaganone, no-fakers, purity gates, truth, oracle.
  The single failure is `learn`, which references git blobs (`fatal: bad object …`) that do not exist in this clone
  (shallow, 1 commit) — pre-existing and unrelated to this change. Police re-ran the generator and reproduced the same file.
- Not verified: `flutter analyze`/`flutter test` (Flutter unavailable). The only Dart added beyond the compiled probe block
  is the single call `_sorted(rs)`, whose types match (`List<Map<String, String>>` in/out).
