# Report: closed-choice field «סוג» on the פגישה entity (calendar)

## What I did
1. `machtzev/generator/specs-ds/calendar.txt` — added `סוג{עבודה|אישי|רפואי}` to the פגישה entity
   (between מקום and הערה), using the spec grammar from SPEC-LANG.md (`שדה{א|ב|ג}` = closed choice).
2. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`
   (exit 0, 6 screens; the forge skin picked `enumField×1`).
3. Regenerated the downstream single-app: `node machtzev/generator/balagan.mjs` (it embeds every module's
   root fields, so `gen_balagan_moments.dart` would otherwise be stale). 30/30 modules, no other module changed.
4. Skipped `tighten-types.mjs --record --apply` as instructed. No git commit/push/checkout.

## Files changed by the regeneration
- `machtzev/generator/apps/calendar.json` — new field `{label:"סוג", type:"text", enumVals:["עבודה","אישי","רפואי"]}`
- `new/dart-gen-bs/gen_app_calendar_ent1.dart` + `_content.dart` — form now renders
  `ForgeDsEnumField(... DsEnumField(options: const [c14, c15, c16] ...))`; field added to save/edit maps,
  record card, CSV export, data grid; constants renumbered (c13=סוג, c14..c16=values, c17=הערה, c18/c19=stages).
- `new/dart-gen-bs/gen_app_calendar_root.dart` + `_content.dart` — record page shows a `KvLine` for סוג.
- `new/dart-data-bs/auto/gen_app_calendar_hub_content.dart` — "5 שדות" → "6 שדות".
- `new/dart-gen-bs/gen_balagan_moments.dart` — calendar's `BalaganField('סוג','text',false,['עבודה','אישי','רפואי'])`.
(`gen_app_sechirut_ent2*` were already modified in the working tree before I started; not mine.)

## How I know it works (Flutter is not installed, so no analyze/build)
- Generator exits 0; `DsEnumField` / `ForgeDsEnumField` exist in `new/dart-ui-bs/ds/ds_enum_field.dart` and
  `new/dart-forge-bs/input/ds_enum_field.dart`, and the same pattern is used by ~10 existing peruk specs.
- Script check on all 6 changed calendar Dart files: braces/parens/brackets balanced; every `gen_app_calendar_*_cN`
  constant referenced by a screen is defined in its `_content.dart` (ent1 20/20, root 45/45, hub 17/17 — 0 missing).
- Gates re-run green after both regenerations: `balagan-one` (30/30), `balagan-look` (35/36 ≥ floor 35, 0 red),
  `particles` (448/448 wired).
- `node machtzev/police.mjs --fast`: 39 ran, 4 failed — all pre-existing and unrelated to this change:
  - `pins`: render-ds.mjs / police.mjs hash drift — git shows both files unmodified, so the drift is in the checkout.
  - `truth`: TRUTH.md differs only in generator-script count (49→52) and gate count (53→55).
  - `index-complete`: 3 scripts missing from INDEX.md (formula-fns, sort-cmp, spec-lang-doc) — untouched by me.
  - `learn`: 9 lesson refs point to git blobs absent from this (shallow) clone.
