# Audit Report — E05 (Calendar)

## Findings

new/dart-gen-bs/gen_app_calendar_px1.dart:14 · empty-state label uses wrong constant (c0 instead of c1), will display "ריק אין פגישות השבוע" instead of requested "אין פגישות השבוע" · P1 wrong result · use `gen_app_calendar_px1_c1` instead of `gen_app_calendar_px1_c0`

## Regression (Not in scope of audit, but noted)

new/dart-gen-bs/gen_balagan_moments.dart · CHANGED when only calendar.txt was modified; calendar module within balagan BalaganModule received new TF-IDF scores and participants field added to its field list — violates byte_identical_others expectation · this is expected cascading behavior (balagan aggregates calendar) but fails isolation test · machine verdict: NOT DONE

## Coverage

✓ Verified participants field correctly added to spec (calendar.txt line 6: משתתפים)
✓ Verified field type is text, required: false in apps/calendar.json
✓ Verified field constant correctly indexed in content file (gen_app_calendar_ent1_c13 = "משתתפים")
✓ Verified screen layout correctly includes field at index 5 in DsField arrays
✓ Verified px1 particle created and routed in hub nav tiles
✓ Verified empty-state detection logic is sound: `appStore.records('app_calendar_ent1').isEmpty`
✗ Could not verify: final rendering output (no Flutter/Dart runtime)
✗ Could not verify: balagan isolation intent (spec ambiguity: should cascading regeneration be allowed)
