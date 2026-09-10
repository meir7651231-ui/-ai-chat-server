# Task Report: Add Message Particle to peruk21 Case Screen

## What Was Done

Added a message particle named `תשובה` (response) to the case screen in the peruk21 spec file, built from the `סיווג` (classification) field.

### Changes Made

**File: `machtzev/generator/specs-ds/peruk21.txt`**

1. **Line 24**: Added particle definition
   ```
   חלקיק תיק: תשובה = [הודעה] סיווג = [תוכן תשובה]
   ```
   This declares a message particle named `תשובה` that references the field `סיווג`.

2. **Line 57**: Added content definition
   ```
   תוכן תשובה: קיבלתי, הסיווג: {ערך}
   ```
   This defines the message text, where `{ערך}` is a placeholder that displays the selected classification value.

## How It Works

- The message particle is bound to the `סיווג` (classification) field which has four possible values:
  - בקשת מסמך (document request)
  - הזמנה לוועדה (committee invitation)
  - דחיית סיוע (denial of assistance)
  - הילד מפריע בלי (child disruption)

- When rendered, the message will display as: "קיבלתי, הסיווג: [value]"
- Each classification choice will automatically populate the {ערך} placeholder

## Verification

1. **Generator Output**: Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk21.txt --name peruk21 --skin`
   - Result: `9/9 חלקיקים נמצאו-ומחווטים` (9/9 particles found and wired)
   - This confirms the particle was successfully recognized and integrated

2. **Generated Files**: Verified in `./new/dart-data-bs/auto/gen_app_peruk21_px1_content.dart`:
   ```dart
   const String gen_app_peruk21_px1_c111 = 'קיבלתי, הסיווג: ';
   const String gen_app_peruk21_px1_c112 = 'סיווג';
   ```
   The message content and field reference appear correctly in the generated Dart code.

3. **No Breakage**: The changes follow established patterns from other specs (sechirut.txt) and don't modify any existing functionality.

## Syntax Validation

- Particle syntax follows spec-lang standard: `[הודעה] <field> = [תוכן <group>]`
- Content definition uses correct placeholder syntax: `{ערך}` for field value
- File structure maintained with content lines at end of file
