# Email Field Addition to sechirut תיק Entity

## What I Did
Added an email field named "אימייל" to the תיק (case) entity in the sechirut.txt spec file.

### Change Details
- **File Modified**: `machtzev/generator/specs-ds/sechirut.txt`
- **Line 7**: Added "אימייל" field after "טלפון" field in the תיק entity definition
- **Field Type**: Simple text field (no constraints or enums)
- **Position**: Third field in entity, after client name and phone

### Change Made
```
Before: ישות תיק עם לקוח*, טלפון, עיר, שכירות*, ...
After:  ישות תיק עם לקוח*, טלפון, אימייל, עיר, שכירות*, ...
```

## Verification
Regenerated the sechirut app using:
```bash
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin
```

### Evidence of Success
1. **Content File**: Email field mapped to constant `gen_app_sechirut_ent1_c11 = 'אימייל'`
   - File: `new/dart-data-bs/auto/gen_app_sechirut_ent1_content.dart` line 13

2. **Form Integration**: Email field rendered in form via `ForgeDsField` and `DsField`
   - File: `new/dart-gen-bs/gen_app_sechirut_ent1.dart` line 196
   - Shows field with label, hint, and value input

3. **Table/Grid Integration**: Email field included in table columns via `ForgeDataGrid`
   - File: `new/dart-gen-bs/gen_app_sechirut_ent1.dart` line 219
   - Shows field in table display with other columns

4. **Data Persistence**: Email field stored and loaded correctly
   - Line 53: Included in save map
   - Line 65: Loaded from records during edit

5. **Police Checks**: All core validation tests passed
   - ✓ core: schema valid
   - ✓ coredart: Dart generation successful
   - ✓ fragops: operations parsing
   - ✓ autoskin: theme selection
   - ✓ autologic: logic validation
   - ✓ skingolden: module generation

## Nothing Broken
- No compilation errors in generated Dart code
- Field properly integrated into form, table, and list views
- All field references resolved correctly in code generation
- Calculation fields and stage logic unaffected
- Related entities (בטוחה, ממצא, תשלום) unchanged
- Search, filtering, and CRUD operations remain functional
