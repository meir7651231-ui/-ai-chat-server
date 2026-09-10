# Task Completion Report: Add Computed Field סכום מעוגל

## What Was Done
Added a new computed field `סכום מעוגל` (rounded amount) to the tasks app spec that rounds the `סכום` (amount) field to the nearest whole number using the `round()` function.

### Changes Made
- **File**: `machtzev/generator/specs-ds/tasks.txt`
- **Change**: Added computed field to the משימה entity definition
- **Before**: `ישות משימה עם מה*, מועד, סכום, הערה | שלבים: פתוח, נעשה`
- **After**: `ישות משימה עם מה*, מועד, סכום, הערה, סכום מעוגל=round(סכום) | שלבים: פתוח, נעשה`

## Verification
✅ **Spec parsing**: The formula was correctly parsed by the entity interpreter
- Field name: `סכום מעוגל`
- Type: `num` (inferred from field name)
- Formula: `round(סכום)` (correctly extracted)
- The field is read-only (computed/derived)

✅ **App regeneration**: Successfully regenerated the app with `app-ds.mjs`
- Generated output includes the new field
- No parsing errors or warnings
- The field appears in the generated schema

✅ **Police validation**: Ran `police.mjs --fast` check
- All core functionality gates passed (sentence, enumvalues, core, coredart, fragops, etc.)
- Pre-tool fixtures: 105/105 passed
- No new failures introduced

## How It Works
The `round()` function is a supported mathematical function in the formula engine (mapped to Dart's rounding implementation via `emit/ast-js-to-dart.mjs`). When the app is generated:
1. The formula `round(סכום)` is compiled to safe Dart expressions
2. The field becomes read-only/computed
3. When displaying records, the rounded value is calculated from סכום

## No Breaking Changes
- All existing fields (מה, מועד, סכום, הערה) remain unchanged
- The new field is purely additive and doesn't affect existing workflows
- The two stages (פתוח, נעשה) remain intact
