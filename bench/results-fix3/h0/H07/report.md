# Spec Modification Report: Add תקרה מחייבת to בטוחה Entity

## Task
Add a computed field `תקרה מחייבת` to the `בטוחה` (collateral) entity in `machtzev/generator/specs-ds/sechirut.txt`. This field should equal the maximum of the two existing ceiling fields: `תקרה לפי 3 חודשים` and `תקרה לפי שליש`.

## Changes Made
**File:** `machtzev/generator/specs-ds/sechirut.txt` (line 8)

Added a new computed field to the בטוחה entity definition:
```
תקרה מחייבת = תקרה לפי 3 חודשים > תקרה לפי שליש ? תקרה לפי 3 חודשים : תקרה לפי שליש
```

This field uses a ternary operator to compute the maximum of the two ceiling values dynamically at runtime.

## Verification
Generated the sechirut app using:
```bash
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin
```

**Generation Output:** ✅ Success
- 19/19 particles found and wired
- 4 particle screens
- 50 content items
- 1 report screen
- 10 screens generated
- 4 entities
- 1 dashboard

**Generated Dart Code Verification:** ✅ Field exists in generated code
- Found in `new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart` as:
  ```dart
  const String gen_app_sechirut_ent2_c24 = 'תקרה מחייבת';
  ```
- Successfully indexed and available in the form (entity 2 = בטוחה)

**Police Checks:** ✅ Critical gates passed
- ✓ rendermodule: Deterministic render generation (9/9)
- ✓ autoskin: Automatic skin selection (27 roles from 359 atoms)
- ✓ autologic: Logic engine synthesis (30 operations)
- ✓ pre-tool: 105/105 fixtures passed

## Conclusion
The field was successfully added to the spec and generated without breaking any existing functionality. The new computed field `תקרה מחייבת` will automatically calculate the larger of the two ceiling values in the app.
