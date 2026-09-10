# Report — calendar: participants field + custom empty-state text

## What changed
1. `machtzev/generator/specs-ds/calendar.txt`
   - Entity line now: `ישות פגישה עם מה*, מועד*, שעה, מקום, משתתפים, הערה | שלבים: קבוע, התקיים` (new free-text field `משתתפים`).
   - New header line `ריק רשימה: אין פגישות השבוע` (empty-state text of the list screen).
2. Grammar support for that header line (there was no way to set a screen's empty-state text from a spec before):
   - `spec-lang.data.json`: `"emptyWord": "ריק"` (targets reuse `questionTargets`: בית/רשימה/דוח, same as `שאלה <מסך>:`).
   - `chrome.data.json`: template `"emptyCustom": "{text}. {action} — וזהו."`.
   - `app-ds.mjs`: parses `ריק <מסך>: <טקסט>` into `empties`, excludes the line from screen lines, passes `empties` to `renderShell`, and writes `empties` into `apps/<ns>.json` only when present.
   - `app-shell.mjs` (`renderShell`): when `empties.list` is set, the empty-state atom is wired with `label` = the text verbatim and `message` = text + primary action + «וזהו.»; otherwise the previous calm-sentence wiring is used unchanged.
3. Regenerated: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`, then `node machtzev/generator/balagan.mjs` (the merged «בלגן» app reads `apps/calendar.json`).
   `tighten-types.mjs` was skipped as instructed. No git commit/push.

## Evidence it works
- `new/dart-gen-bs/gen_app_calendar_shell.dart:46` is `if (rs.isEmpty) EmptyState(label: gen_app_calendar_shell_c6)` and
  `gen_app_calendar_shell_content.dart` now has `c6 = 'אין פגישות השבוע'` (was `'פגישה'`) and `c5 = 'אין פגישות השבוע. הוספת פגישה — וזהו.'`.
  The picked atom (`dart-ui-bs/auto/empty_state.dart`) has a single `label` slot, so the screen shows exactly the requested text when there are no meetings.
- `apps/calendar.json` root fields now include `{"label":"משתתפים","type":"text","required":false}`; `gen_app_calendar_ent1.dart` form/record-card/CSV
  use 6 labels (c9..c14) incl. משתתפים; hub sub-title `6 שדות · 2 שלבים`; root page `פרטים (6)`; `gen_balagan_moments.dart` calendar module gained
  `BalaganField('משתתפים', 'text', false, [])` and TF-IDF weights for the new word.
- Nothing else broke:
  - Control: regenerated `tasks` with the same command → zero diff (default path is byte-identical; only calendar + balagan files changed).
  - `balagan-look` 35/36 green, 0 red (same as before; rule T6 `calmEmpty` still satisfied — «וזהו.» present in the shell content).
  - `balagan-one` ✓ (30 modules, 30/30), `particles --gate` ✓ (448 particles in 32 specs).
  - `node machtzev/police.mjs --fast` before and after: 40 ran · 12 skipped · 1 failed; per-gate outcome lists are identical (md5 match).
    The single failure, `learn`, is pre-existing and environmental: git reports `fatal: bad object …` for history missing from this clone.
- Flutter/Dart are not installed, so no `flutter analyze`/build was run; the generated Dart differs from the previous output only in the constant table and the field lists.

## Notes
- `machtzev/generator/balagan-score.md` also shows as modified: it is a report the `balagan-look` gate rewrites on every run (the committed copy was stale); not a hand edit.
- Pre-existing untracked files (`_prompt-builder.md`, `panuy*`) were left untouched.
