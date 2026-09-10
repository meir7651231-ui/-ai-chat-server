# Audit Report: panuy task

## Findings

new/dart-gen-bs/gen_app_panuy_ent1.dart:50 · distance in km uses old _v[10] squared-distance value instead of newly computed value · P1 · compute squaredDist variable once, then use for both c24 and c25 fields

new/dart-gen-bs/gen_app_panuy_ent1.dart:175 · display of distance in km uses old _v[10] instead of newly computed squared distance from line 174 · P1 · compute squaredDist = (delta_lat²×12321 + delta_lon²×8649) once, use in both _calc calls

## Verified Correct

- **Sorting logic**: gen_app_panuy_px1.dart:34 correctly sorts by 'מרחק בקמ' (distance in km) field, ascending order (nearest first via `nx.compareTo(ny)`), using numeric comparison when both values parse as numbers.
- **Sqrt import and usage**: dart:math sqrt is imported and used as a top-level function (not as method), matching Dart semantics.
- **Sort presence**: Sort by distance appears exactly once in px1 screen (line 34 ForgeDataGrid).
- **No state leakage to other apps**: Checked spec and generated files; panuy app is self-contained with no shared list mutation or cross-app distance constants.
- **List display structure**: ForgeDataGrid and record cards correctly reference gen_app_panuy_px1_c10 (distance in km) from stored records.

## Coverage

Checked: distance calculation formula on lines 50 and 175; sort implementation and field references in px1 screen; sqrt import and usage; field mapping between _labelsAll indices and generated constants; no duplication of distance constants across apps.

Could not check: runtime behavior (Flutter not installed); test execution; actual distance values after form submission; whether users entering coordinates observe correct recalculation.
