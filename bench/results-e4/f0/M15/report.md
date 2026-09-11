# Report — rename meeting field מקום → כתובת (calendar app)

## What I did
1. `machtzev/generator/specs-ds/calendar.txt`: the פגישה entity line now reads
   `ישות פגישה עם מה*, מועד*, שעה, כתובת, הערה | שלבים: קבוע, התקיים` (one word changed).
2. Regenerated the calendar app exactly as the pipeline (`regen.mjs`) does:
   `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`
   → `machtzev/generator/apps/calendar.json` (field label), `new/dart-data-bs/auto/gen_app_calendar_ent1_content.dart`
   (1 const) and `gen_app_calendar_root_content.dart` (5 consts) changed from 'מקום' to 'כתובת'.
   All 10 `new/dart-gen-bs/gen_app_calendar_*.dart` screen files came out byte-identical to HEAD
   (labels live in the content consts), so the regen is deterministic and the `--skin` flag matches how they were built.
3. The «בלגן» aggregate app embeds every module's field list (`gen_balagan_moments.dart`, built from `apps/*.json`).
   I first previewed the rebuild into scratch dirs via `GEN_OUT`/`GEN_DATA_OUT`, confirmed the only changes were the
   calendar module's `BalaganField('מקום')` → `'כתובת'` plus recomputed TF-IDF weights (מקומ/כתובת document
   frequencies shifted on 4 module lines), then ran `node machtzev/generator/balagan.mjs` in place.
   `balagan-index.json` and all other gen_balagan_* files are unchanged.
4. Skipped `tighten-types.mjs` as instructed. No git commit/push/stash; pre-existing dirty files
   (sechirut, untracked panuy, _prompt-builder.md) were not touched.

## Changed files (mine)
- machtzev/generator/specs-ds/calendar.txt
- machtzev/generator/apps/calendar.json
- new/dart-data-bs/auto/gen_app_calendar_ent1_content.dart
- new/dart-data-bs/auto/gen_app_calendar_root_content.dart
- new/dart-gen-bs/gen_balagan_moments.dart

## How I know it works
- `grep 'מקום'` over all gen_app_calendar_* / gen_balagan_* / apps/calendar.json: zero hits for the field
  (only the unrelated word «במקום» in comments and other modules' titles).
- כתובת is already in `spec-lang.data.json` `typeLocation` (alongside מקום), so the field keeps type `text` and the
  root page still gets the «ניווט» (Google-Maps) button — `gen_app_calendar_root_content.dart` c27 = 'ניווט' unchanged,
  and the `balagan-one` gate's "תיק-עם-מקום בלי «ניווט»" rule (which accepts מקום|כתובת|מיקום) passes.
- Gates: `balagan-one.mjs --gate` ✓ (30/30 modules), `balagan-look.mjs --gate` ✓ 35/36 (same floor as before),
  `police.mjs --fast`: 39 ran, 0 yellow, 4 failed = truth · pins · index-complete · learn.
- Those 4 failures are pre-existing: I ran the same `police.mjs --fast` on a pristine `git archive HEAD` copy
  (scratchpad, MACHTZEV_ROOT) and it fails the identical gates (pins flags LEARNINGS.md/gates.tsv/render-ds.mjs/
  particles.mjs/police.mjs — none touched by me; index-complete names sort-cmp/formula-fns/spec-lang-doc committed in HEAD;
  learn needs git blobs missing from this clone; truth = TRUTH.md drift already at HEAD).
- Flutter/Dart are not installed, so no compile; the risk is minimal because the only Dart changes are string literals
  in const declarations and one already-quoted label inside the balagan module table.
