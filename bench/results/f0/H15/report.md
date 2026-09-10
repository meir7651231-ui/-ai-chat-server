# Report — peruk21: cases sorted by deadline «עד מתי» (soonest first)

## What I did
The spec on disk must stay byte-identical to what `peruk.mjs` derives from the owner's document (the `peruk` gate), so the sort is derived by the generator from the field itself, not from a hand-edited spec.

- `machtzev/generator/spec-lang.data.json` — new language hint `typeDeadline` («עד מתי», «עד תאריך», «דדליין», «מועד אחרון», «תאריך יעד»), same mechanism as the existing `typeDate` hints (vocabulary lives in data, not in the engine).
- `machtzev/generator/entity.mjs` — a field whose label matches a deadline phrase is typed `date` and flagged `deadline: true` (plain input fields only: not formula / nested / enum). No other typing changed.
- `machtzev/generator/particles.mjs` — exports `deadlineField`, `DEADLINE_FN`, `deadlineSortDart()` (a private Dart helper `_byDeadline(rows, field)`); the `[טבלה]` particle iterates `_byDeadline(records, <label const>)` when the entity has a deadline field; helper functions are collected per screen (`helpers`) and emitted once, in particle screens and report screens.
- `machtzev/generator/render-ds.mjs` (`renderEntity`) — the record list (`all`, feeding list / kanban / table views and search) and the CSV export iterate `_byDeadline(..., <label const>)`; helper emitted once before the class.
- `machtzev/pins.sha256` — refreshed (`pins-check.mjs --write`) because render-ds.mjs and particles.mjs are signature-pinned.
- Regenerated peruk21 with the documented command; only `gen_app_peruk21_ent1.dart` and `gen_app_peruk21_px1.dart` changed (content/const files, plans, `apps/peruk21.json` unchanged — the existing «עד מתי» label constants are reused).

Sort semantics: ISO `yyyy-mm-dd` (what DsDateField / balagan date parsing store) or typed `d.m[.yyyy]`; ascending; records without a parseable deadline go last; stable (input order kept on ties). Entities without a deadline-phrased field produce byte-identical output.

## How I know it works
- `git diff` of the two generated files shows exactly: helper added; particle table `items: [for (final r in _byDeadline(appStore.records('app_peruk21_ent1'), gen_app_peruk21_px1_c5)) …]` (c5 = «עד מתי»); entity screen `final all = _byDeadline((…records/scope…), gen_app_peruk21_ent1_c13)` (c13 = «עד מתי») and the CSV loop likewise. Kanban and table views derive from that list, so they are sorted too. The `--skin` pass still rewrote the table to `ForgeDataGrid` correctly.
- Blast radius proof: before the change I regenerated peruk21, peruk04, peruk03 (has «מתי הודיעו», a date but not a deadline phrase), tasks, sechirut, calendar in place — git showed no diff (committed == fresh). After the change I regenerated the same six — only the two peruk21 files differ. Deadline phrases occur in no other entity line of any spec (grep).
- Entity typer check (node): peruk21 line ⇒ «עד מתי»: date + deadline; peruk03 line ⇒ «תאריך כניסה»/«מתי הודיעו» date, no deadline; tasks «מועד» unchanged; «דדליין» ⇒ date + deadline; a formula field is not flagged.
- Flutter/Dart are not installed, so no analyzer run. The emitted Dart was reviewed by hand (imports precede the top-level helper; private name is library-local in both files; comparator returns int; raw-string regex) and both files pass a bracket-balance check.
- Gates: `node machtzev/police.mjs --fast` ⇒ 40 ran · 0 yellow · 1 failed — identical to the pre-change baseline; the single failure is the pre-existing `learn` gate (references git blobs missing from this clone), unrelated. `particles --gate`, `peruk --gate`, `balagan-look --gate` (35/36, 0 red, 31 paper apps) and the push-layer `mahulal/generator-ratchet.mjs` all green.
- Skipped as instructed: `tighten-types.mjs --record --apply`. No commits, no git remotes touched.
