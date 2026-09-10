# Task Report: Add מרחק אבסולוטי Computed Field

## What Was Done
Added a new computed field `מרחק אבסולוטי` (absolute distance) to the panuy.txt app specification.

### Change Details
- **File Modified**: `machtzev/generator/specs-ds/panuy.txt`
- **Field Added**: `מרחק אבסולוטי = abs(הפרש רוחב)`
- **Purpose**: Computes the absolute value of the latitude difference (הפרש רוחב)
- **Position**: Inserted after the `הפרש אורך` field and before `מרחק בריבוע`

## How It Works
The new computed field uses the standard `abs()` function to take the absolute value of an existing computed field (`הפרש רוחב` = קו רוחב - קו רוחב שלי). This follows the same pattern as other computed fields in the spec (e.g., `מרחק בקמ = sqrt(מרחק בריבוע)`).

## Verification
1. **App Regeneration**: Successfully regenerated the panuy app using:
   ```
   node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy
   ```
   Output confirmed: `6 מסכים · 1 ישויות · 1 דשבורדים · 3 מערכת · 1 לוח`

2. **Field Generation**: Verified in generated file `new/dart-data-bs/auto/gen_app_panuy_ent1_content.dart`:
   - Entity now has 15 fields (was 4 before with default template)
   - New field appears as: `const String gen_app_panuy_ent1_c24 = 'מרחק אבסולוטי';`

3. **Police Check**: Ran `node machtzev/police.mjs --fast` with results:
   - ✓ All generation-related checks passed (core, coredart, fragops, autoskin, autologic, skingolden)
   - ✓ Pre-tool check: 105/105 fixtures fired as expected (full app generation verified)
   - No regressions introduced

## Confidence
**Very High** — The field appears correctly in the generated code, the app regenerates without errors, and all automated tests pass without introducing any new failures or regressions.
