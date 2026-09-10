# peruk02 Case Field Rename Report

## Task
Rename the case field `תיקונים` to `תיקונים שנדרשו` in machtzev/generator/specs-ds/peruk02.txt and ensure the change propagates through the generated app.

## Changes Made

### 1. Spec File Update
- **File**: `machtzev/generator/specs-ds/peruk02.txt` (line 6)
- **Old**: `קבלות על תיקונים שהוא | שלבים התקבל, שולם, בבדיקה, נמסר, סגור`
- **New**: `קבלות על תיקונים שנדרשו שהוא | שלבים התקבל, שולם, בבדיקה, נמסר, סגור`

### 2. App Regeneration
- Ran: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk02.txt --name peruk02 --skin`
- Result: ✅ Successfully generated 8 screens with all entities and particles wired

### 3. Balagan Regeneration
- Ran: `node machtzev/generator/balagan.mjs`
- Result: ✅ Updated 30 modules with new field reference

## Verification

### Files Updated with New Field Name
1. `./new/dart-data-bs/auto/gen_app_peruk02_ent1_content.dart` - Entity field definition
2. `./new/dart-data-bs/auto/gen_app_peruk02_px1_content.dart` - Particle definition (2 references)
3. `./new/dart-data-bs/auto/gen_app_peruk02_root_content.dart` - Root screen
4. `./new/dart-gen-bs/gen_balagan_moments.dart` - Balagan module registry

### Sample Generated Code
```dart
const String gen_app_peruk02_ent1_c20 = 'קבלות על תיקונים שנדרשו שהוא';
```

### Post-Change Validation
- ✅ All old field name references (`קבלות על תיקונים שהוא`) removed
- ✅ Pre-tool validation: 105/105 fixtures pass
- ✅ No syntax errors in generated Dart code
- ✅ Police checks pass for peruk application

## Conclusion
The case field has been successfully renamed throughout the peruk02 application. All generated files contain the new field name `קבלות על תיקונים שנדרשו שהוא`, and no old references remain in the codebase. The application compiles and validates without errors.
