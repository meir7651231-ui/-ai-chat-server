# Report: closed-choice field `סוג` on entity `פגישה` (calendar)

## What I did
1. `machtzev/generator/specs-ds/calendar.txt` — entity line now reads
   `ישות פגישה עם מה*, מועד*, שעה, מקום, סוג{עבודה|אישי|רפואי}, הערה | שלבים: קבוע, התקיים`
   using the existing spec grammar `שדה{ערך|ערך}` (same form as `צבע{אדום|צהוב|ירוק}` in peruk02/04).
   Placed before `הערה` so the multiline note stays last, as in every other spec.
2. Regenerated the calendar app:
   `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`
   (exit 0; reports `enumField×1`).
3. Regenerated the merged "balagan" app, which consumes `apps/calendar.json`:
   `node machtzev/generator/balagan.mjs` (exit 0; 30 modules, moment-identifier 30/30).
   `tighten-types.mjs` was skipped as instructed. No git commit/push.

## Files changed (all generated except the spec)
- machtzev/generator/specs-ds/calendar.txt
- machtzev/generator/apps/calendar.json — new field `{label:"סוג", type:"text", required:false, enumVals:[עבודה,אישי,רפואי]}`
- new/dart-data-bs/auto/gen_app_calendar_{ent1,hub,root}_content.dart — constants renumbered; hub now says "6 שדות · 2 שלבים"
- new/dart-gen-bs/gen_app_calendar_ent1.dart — imports `ds_enum_field.dart`, form renders
  `DsEnumField(label: סוג, options: [עבודה, אישי, רפואי])`; field added to save/edit maps, record card, CSV, data grid
- new/dart-gen-bs/gen_app_calendar_root.dart — root page shows the field ("פרטים (6)")
- new/dart-gen-bs/gen_balagan_moments.dart — calendar module gets `BalaganField('סוג','text',false,[עבודה,אישי,רפואי])`

## How I know it works
- `apps/calendar.json` and the Dart diffs contain exactly the three values; no other spec/app changed.
- `new/dart-ui-bs/ds/ds_enum_field.dart` exists (the import target); the enum path is the same one
  used by the 20+ peruk apps with `סיווג{...}` fields.
- Brace/paren/bracket balance checked on all regenerated Dart files (Flutter/Dart not installed, so no analyze).
- `node machtzev/police.mjs --fast`: 40 gates ran, all relevant ones green — wiring law (7537 files, 0 violations),
  contracts (1239 atoms), `particles` (448 in 32 specs), `peruk` 28/28, `balagan-look` 35/36, `balagan-one` 30/30,
  `no-fakers` 0, autoskin, autologic, skingolden.
- One gate is red: `learn`. It runs `git show <blob>` on 9 historical blobs (learn-check.mjs:53) that do not exist
  in this shallow clone (`git rev-parse --is-shallow-repository` = true). It does not read any file I touched,
  so it fails identically on the untouched tree. Pre-existing untracked `panuy` files were present before I started
  and were not touched.
