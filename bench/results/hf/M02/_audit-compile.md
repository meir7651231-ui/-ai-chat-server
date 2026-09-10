# 🔍 Auditor Report — peruk12 Compilation + Edge Cases

## Findings

new/dart-data-bs/auto/gen_app_peruk12_scr3_content.dart:7 · incorrect counter label for filtered entity · P1 wrong result · change `const String gen_app_peruk12_scr3_c5 = 'לא';` to `const String gen_app_peruk12_scr3_c5 = 'בדיקה: לא';` to correctly label the inspection counter filtered by תקין=לא, matching spec requirement `מונה(בדיקה: תקין=לא)`

new/dart-gen-bs/gen_app_peruk12_scr3.dart:21 · ambiguous counter label obscures entity context in hub dashboard · P2 minor · consider using c6 ('בדיקה · לא') instead of c5 ('לא') for the counter label to provide full context: `KvLine(label: gen_app_peruk12_scr3_c6, value: ...)`

## Verified Correct

**Dart null-safety & math (complete):**
- gen_app_peruk12_ent2.dart: all field accesses use safe `?? ''` operators (lines 44, 45, 50, 60, 61, 62, 88, 89, 90, 98, 148, 151, 152, 154, 156); no `.sqrt()`, `.min()`, `.max()` methods on num (only `.toDouble()`, `.round()`, `.trim()`, `.isEmpty`)
- gen_app_peruk12_scr3.dart: counter values call `.toDouble().toStringAsFixed(0)` correctly; no invalid math methods; bar chart uses `.fold()` with proper reduction to `double` type

**Entity בדיקה definition (complete):**
- Entity exists: gen_app_peruk12_ent2.dart created ✓
- Three fields correctly defined: תיק (link, required via index 0), מה נבדק (text, required via index 1), תקין (enum yes/no via index 2) ✓
- Validation enforces both required fields on save (lines 44–45) ✓
- Relations registered correctly (gen_app_peruk12_relations.dart line 6) ✓

**Table screen for בדיקה (complete):**
- gen_app_peruk12_px2.dart created with ForgeDataGrid table (line 26) showing all three fields (c1, c2, c3 = 'תיק', 'מה נבדק', 'תקין') ✓
- Table header and values correctly wired (c4, c5, c6 match field names) ✓
- Empty state particle included (line 28) ✓
- Particles for בדיקה correctly generated: table, add action, empty state, and enum partitions (px2_content.dart c33–c34) ✓

**Dashboard counter logic (code correct, label incomplete):**
- KvLine counter for בדיקה records exists in scr3.dart line 21 ✓
- where-clause correctly filters: `appStore.records('app_peruk12_ent2').where((r) => (r['תקין'] ?? '') == 'לא')` ✓
- Counter value uses `.length.toDouble().toStringAsFixed(0)` safely ✓
- ForgeWaveformBars visualization also uses same filtered data (line 22) ✓
- Content constants correctly set: c9='תקין' (field name), c10='לא' (filter value) ✓
- **BUT:** Counter label c5 only reads 'לא' instead of 'בדיקה: לא' or 'בדיקה · לא', losing entity context

**No breaking changes:**
- Regeneration passed (regen_ok ✅)
- No mutations to files outside peruk12 namespace (byte_identical_others ✅)
- All generator gates pass (gates_pass ✅)
- No Hebrew in engine code (no_hebrew_in_engine ✅)
- No invalid Dart math (dart_math_sane ✅)

**Spec compliance status:**
- ✅ Entity בדיקה added with required תיק link
- ✅ Fields מה נבדק and תקין correctly typed
- ✅ Table screen (particle px2) created and renders all rows
- ⚠️ Dashboard counter logic correct but label misleading: shows 'לא' not 'בדיקה: לא'
