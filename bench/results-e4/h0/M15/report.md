# Field Rename Report: מקום → כתובת

## Task Completed
Renamed the meeting field "מקום" (place) to "כתובת" (address) in the calendar app spec.

## Changes Made
1. **Spec File**: `machtzev/generator/specs-ds/calendar.txt`
   - Line 6: Updated entity definition
   - Changed: `מה*, מועד*, שעה, מקום, הערה`
   - To: `מה*, מועד*, שעה, כתובת, הערה`

2. **App Regeneration**: Ran `node machtzev/generator/app-ds.mjs` with calendar spec
   - Generated 6 screens (1 entity, 0 dashboards, 4 system, 1 board)
   - All files generated via pure render-ds pipeline

## Verification Results
✅ **Spec file correctly updated** - כתובת appears in entity definition
✅ **Field renamed in output** - 10 generated .dart files contain "כתובת"
✅ **No residual references** - Zero occurrences of old "מקום" in generated code
✅ **App generation successful** - All screens generated without errors

## Evidence
- Checked: `./new/dart-data-bs/auto/gen_app_calendar_*.dart` files
- Found: Multiple references to כתובת in content definitions (lines c12-c26)
- Confirmed: No syntax or structural issues in generated output
- Field appears in: entity content, root content, home content, and screen layouts

## Conclusion
Field rename complete. The calendar app now uses "כתובת" (address) as the meeting location field.
All generated code properly reflects the change. Nothing broken.
