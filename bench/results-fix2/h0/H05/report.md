# Task Report: Sort Cases Table by Key-Handover Date

## What I Did
Modified the peruk02 app specification to sort the cases table by the key-handover date (תאריך מסירת מפתח) in ascending order (earliest first).

### Change Details
- **File Modified**: `machtzev/generator/specs-ds/peruk02.txt`
- **Line Changed**: Line 10
- **Previous**: `חלקיק תיק: [טבלה]`
- **New**: `חלקיק תיק: [טבלה] | מיון: תאריך מסירת מפתח עולה`

The syntax `| מיון: <field> עולה` (sort: <field> ascending) is standard in the app-ds generator and is parsed by the `particles.mjs` module, which extracts the sort specification and passes it to the Dart code generator.

## How I Know It Works
1. **Spec Syntax Valid**: The syntax follows the documented pattern in `particles.mjs` lines 123-141, which parses `[טבלה] | מיון: field עולה/יורד`.

2. **Successful Regeneration**: Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk02.txt --name peruk02 --skin` which completed with "✨ אפליקציה חוללה — 8 מסכים" (app successfully generated).

3. **Generated Code Correct**: Verified in `gen_app_peruk02_px1.dart`:
   - Line 2 comment confirms: "טבלה מיון תאריך מסירת מפתח עולה"
   - Line 27 implements sorting: `.toList()..sort((a, b) { { final x = a[gen_app_peruk02_px1_c13] ?? '', y = b[gen_app_peruk02_px1_c13] ?? ''; ...`
   - `c13` maps to "תאריך מסירת מפתח" field from content file

4. **Content Data Recorded**: In `gen_app_peruk02_px1_content.dart` line 2:
   - `const String gen_app_peruk02_px1_c0 = 'טבלה מיון תאריך מסירת מפתח עולה';`

5. **Police Check Passed Critical Gates**: 
   - ✓ goldquarry, rendermodule, retarget, sentence, core, coredart, fragops
   - ✓ autoskin, autologic, skingolden, atom-count, pre-tool
   - Failures are pre-existing git blob issues, unrelated to this change

## No Breaking Changes
- Only modified the particle specification for the table particle
- All other fields, entities, and particles remain unchanged
- Generated Dart sorting logic is robust (handles empty values, numeric/date comparison)
- The sort is applied client-side in Flutter's Dart runtime
