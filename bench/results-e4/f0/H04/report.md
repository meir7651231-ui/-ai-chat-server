# Report — calendar: meetings sorted by מועד then שעה

## What I did
1. **Spec** `machtzev/generator/specs-ds/calendar.txt`: appended `| מיון: מועד, שעה` to the פגישה entity line.
   The spec grammar already had this L105 sort directive (`markSort` in spec-lang.data.json, parsed in entity.mjs); no spec had ever used it.
2. **Emitter** `machtzev/generator/render-ds.mjs`: the entity-screen sort line used `rs.sort(...)` in place. When the search box is empty,
   `rs` *is* the list returned by `appStore.records()`, which is the store's backing list, so it would have re-ordered the store
   from inside `build`. Now the emitter wraps the record expression as `(...).toList()..sort(cmp)` and sorts a copy.
   When an entity has no `מיון`, the emitted bytes are unchanged.
3. **Comparator** `machtzev/generator/sort-cmp.mjs` (shared by entity screens and `[טבלה]` particles): values shaped `H:MM`
   are compared as minutes-of-day, so `9:00` sorts before `16:30` (lexically it did not). Numeric-then-lexical behaviour is
   otherwise unchanged; ISO dates from `DsDateField` sort correctly lexically; empty values still sort last.
4. Regenerated: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`.
   Output diff is confined to `new/dart-gen-bs/gen_app_calendar_ent1.dart` (the `rs` line) and
   `new/dart-data-bs/auto/gen_app_calendar_ent1_content.dart` (+2 label constants). `rs` feeds the list, the board, the
   month calendar and the ▦ table view, so all of them now come out in date-then-time order.

## How I know it works (Flutter/Dart not installed, so no `flutter analyze`)
- **Determinism**: regenerated calendar before any change → zero diff. Regenerated `tasks.txt` (same base layer, no מיון) after
  the change → zero diff, proving the emitter is byte-identical for apps that don't sort.
- **Mirror test** (scratchpad, `mirror-test.mjs`): extracted the Dart comparator actually emitted into
  `gen_app_calendar_ent1.dart`, mechanically rewrote it to JS (RegExp / int.parse / num.tryParse / compareTo / isEmpty),
  ran it on 7 sample records. Result: dates ascend (2025-12-31 < 2026-09-10 < 2026-09-12), within a date `9:00` = `09:00` < `16:30`,
  empty time after set time, empty date last. Passed.
- **Dart reading**: `final rs = (…).toList()..sort(…)` keeps `rs` as `List<Map<String,String>>`; `nx`/`ny` are `num?` and are
  promoted after the null check; `tx`/`ty` are promoted inside the ternary; `RegExp(r'…')` is a raw string.
- **Police** `node machtzev/police.mjs --fast` before vs after (timings stripped): identical output. 39 ran · 0 yellow · 4 failed,
  and the same 4 gates (truth, pins, index-complete, learn) were already red before I touched anything
  (missing git blobs referenced by LEARNINGS, stale pins on files including render-ds.mjs that were already drifted).
  `particles`, `balagan`, `speclangdoc`, `formulafns`, `no-fakers` etc. all green.
- `node --check` on both edited modules passes.

## Notes
- Pre-existing, not mine: modified `gen_app_sechirut_ent2*` and untracked `panuy` files / `_prompt-builder.md` were already in the tree.
- I did not run `pins-check --write` (pins were already stale before my change; that is a commit-time step and I was told not to commit).
- Leftover untracked logs in repo root (rm/mv were denied): `_pb.txt _pa.txt _police-before.txt _police-after.txt _regen-after.txt _regen-tasks.txt` — safe to delete.
- `tighten-types.mjs` was not run, as instructed.
