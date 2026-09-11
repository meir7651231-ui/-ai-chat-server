# Audit: panuy table columns — H13

## Findings

new/dart-gen-bs/gen_app_panuy_ent1.dart:187 · ForgeDataGrid displays 14 columns (c9, c10, c13, c14, c15, c17, c19, c20, c22, c23, c24, c25, c26, c27) when spec requires exactly 4: שם, זמין, מרחק בקמ, מחיר לשעה (c9, c10, c25, c19) in that order. Items array also carries all 14 values per row instead of 4. · P0 compile-break · Change line 187 columns to `const [gen_app_panuy_ent1_c9, gen_app_panuy_ent1_c10, gen_app_panuy_ent1_c25, gen_app_panuy_ent1_c19]` and items array to `rs.map((r) => [r[gen_app_panuy_ent1_c9] ?? '', r[gen_app_panuy_ent1_c10] ?? '', r[gen_app_panuy_ent1_c25] ?? '', r[gen_app_panuy_ent1_c19] ?? ''])`.

new/dart-gen-bs/gen_app_panuy_ent1.dart:96–102 · _csv() method writes all 14 column headers and values to CSV output instead of the spec-required 4 columns (שם, זמין, מרחק בקמ, מחיר לשעה). Lines 96 (header) and 99 (data) both list all columns; should be reduced to 4. · P1 wrong result · Change header list on line 96 to `const [gen_app_panuy_ent1_c9, gen_app_panuy_ent1_c10, gen_app_panuy_ent1_c25, gen_app_panuy_ent1_c19]` and data list on line 99 similarly.

## Verified Correct

- Spec reads and parses correctly: `machtzev/generator/specs-ds/panuy.txt:6` defines `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה` unambiguously (4 column names in order).
- Content constants generated correctly: `new/dart-data-bs/auto/gen_app_panuy_ent1_content.dart` maps c9→'שם', c10→'זמין', c25→'מרחק בקמ', c19→'מחיר לשעה' — all present.
- Dart null-safety and type usage: `num.tryParse()`, `.toStringAsFixed()`, string coercion all sound; no unsafe method calls on primitives.
- No compilation errors in analyzer run (police report `compiles ✅`).

## Coverage

Checked: table column selection (line 187 and 96–102), content constant correctness, Dart type safety in arithmetic/formatting. **Did not run:** Flutter build, render test, ForgeDataGrid widget behavior at runtime. **Police-reported check mismatch:** `_police.md` line 13 claims `four_columns ✅ columns=4` but the generated code contradicts this. The check likely counted the spec *request* (4 columns) rather than the *generated output* (14 columns).
