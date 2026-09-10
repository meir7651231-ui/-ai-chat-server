# Task Coverage Audit — H07 (sechirut) · תקרה מחייבת

## Findings
No defects found. Task implementation is complete and correct.

## Coverage Verification

**Verified surfaces covered:**

1. **Spec definition** ✓ — machtzev/generator/specs-ds/sechirut.txt line 8 correctly defines:
   `תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)`

2. **Entity screen form** ✓ — gen_app_sechirut_ent2.dart:
   - Line 176: Input field for תקרה לפי 3 חודשים (_v[6])
   - Line 178: Input field for תקרה לפי שליש (_v[7])
   - Line 179: Computed display field `_calc(gen_app_sechirut_ent2_c24, max(...))`
   - Line 9: `import 'dart:math'` present for max() function
   - max() correctly invokes `max((num.tryParse(_v[6] ?? '') ?? 0), (num.tryParse(_v[7] ?? '') ?? 0))`

3. **Save/persistence** ✓ — gen_app_sechirut_ent2.dart line 51:
   `gen_app_sechirut_ent2_c24: (max(...)).toStringAsFixed(2)` stored in record

4. **Record edit/load** ✓ — gen_app_sechirut_ent2.dart line 63:
   Field c24 loaded into _v[8] when editing existing record

5. **Card list view** ✓ — gen_app_sechirut_ent2.dart line 92:
   Column c24 included in DsRecordCard; value read from persisted record

6. **Table/grid view** ✓ — gen_app_sechirut_ent2.dart line 191:
   Column c24 included in ForgeDataGrid with `r[gen_app_sechirut_ent2_c24] ?? ''`

7. **CSV export** ✓ — gen_app_sechirut_ent2.dart lines 98–100:
   Header and data rows include `gen_app_sechirut_ent2_c24`

8. **Content/labels** ✓ — gen_app_sechirut_ent2_content.dart line 26:
   `const String gen_app_sechirut_ent2_c24 = 'תקרה מחייבת'`

9. **Machine checks** ✓ — ./_police.md reports:
   - regen_ok ✅
   - compiles ✅ (0 analyzer errors)
   - max ✅ (calc=true, fn=true)
   - gates_pass ✅ (53/53)

**Dart language correctness verified:**
- max() from dart:math imported (line 9)
- Both arguments parsed as `num` via `num.tryParse()` with 0 default
- Result formatted to 2 decimal places via `toStringAsFixed(2)`
- Sound null safety respected

**Task complete:** Computed field `תקרה מחייבת` successfully added as max of two data fields, integrated across all entity surfaces (form, list, table, export), and compiles with zero errors.
