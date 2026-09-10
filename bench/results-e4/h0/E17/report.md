# peruk21 Empty-State Text Update Report

## Task
Change the empty-state text for the case (תיק) screen in peruk21 from "אין תיקים עדיין" to "אין מכתבים פתוחים".

## Changes Made
**File:** `machtzev/generator/specs-ds/peruk21.txt`
**Line 12:** Changed empty-state text in particle definition
```
Before: חלקיק תיק: [ריק] אין תיקים עדיין
After:  חלקיק תיק: [ריק] אין מכתבים פתוחים
```

## Verification
1. **Spec file updated:** ✓ Text verified in peruk21.txt
2. **App regenerated:** ✓ Successfully ran:
   ```
   node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk21.txt --name peruk21 --skin
   ```
   Output: 7 screens generated, all particles wired correctly (8/8)

3. **Text propagated to generated code:** ✓ New text found in:
   - `new/dart-gen-bs/gen_app_peruk21_px1.dart`
   - `new/dart-data-bs/auto/gen_app_peruk21_px1_content.dart`

4. **Old text removed from peruk21:** ✓ Grep confirms "אין תיקים עדיין" does NOT appear in peruk21 output (verified via grep showing 0 matches for peruk21-specific files)

## Status
✅ Complete. Empty-state text successfully updated and propagated through the code generator pipeline. No other files or specs affected.
