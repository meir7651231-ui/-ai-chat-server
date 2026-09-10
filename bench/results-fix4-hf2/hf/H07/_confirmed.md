# ✅ Validator Report — H07 (sechirut תקרה מחייבת)

## Validation Summary
- **Task:** Add computed field `תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)` to בטוחה entity
- **Machine checks:** All 9 gates ✅ (regen_ok, byte_identical_others, gates_pass, no_hebrew_in_engine, dart_math_sane, compiles, no_hand_edit, calc, max)
- **Auditors:** 3 reports, 0 findings
- **Compiler:** 0 analyzer errors

## Byte Verification

**Spec (machtzev/generator/specs-ds/sechirut.txt:8)**
```
ישות בטוחה עם … תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש), …
```
✅ Correct formula, positioned after input fields תקרה לפי 3 חודשים and תקרה לפי שליש

**Import (new/dart-gen-bs/gen_app_sechirut_ent2.dart:9)**
```dart
import 'dart:math';
```
✅ Top-level max() function requires dart:math; no method syntax

**Save Logic (line 51)**
```dart
gen_app_sechirut_ent2_c24: (max( (num.tryParse(_v[6] ?? '') ?? 0) ,  (num.tryParse(_v[7] ?? '') ?? 0) )).toStringAsFixed(2)
```
- _v[6] = תקרה לפי 3 חודשים (index 6 = c21 in labels array)
- _v[7] = תקרה לפי שליש (index 7 = c23 in labels array)
- num.tryParse() returns num?; ?? 0 makes it num (not null)
- max(num, num) → num (correct signature)
- .toStringAsFixed(2) valid on num ✅

**Display Logic (line 179)**
```dart
_calc(gen_app_sechirut_ent2_c24, max( (num.tryParse(_v[6] ?? '') ?? 0) ,  (num.tryParse(_v[7] ?? '') ?? 0) ))
```
✅ Same computation, read-only display via _calc() widget

**Field Metadata (new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart:26)**
```dart
const String gen_app_sechirut_ent2_c24 = 'תקרה מחייבת';
```
✅ Correct label

**Field Ordering (ent2.dart:30)**
```dart
static const List<String> _labelsAll = […, gen_app_sechirut_ent2_c21, gen_app_sechirut_ent2_c23, gen_app_sechirut_ent2_c24, gen_app_sechirut_ent2_c25, …]
```
✅ c24 at index 8; inserted after c23, before c25 (dependents); no index shifts in existing fields

**Cross-App (git diff --name-only)**
Only sechirut files changed; byte_identical_others ✅

**Compilation**
- analyzer: 0 total errors, 0 in-app errors
- no_hand_edit: ✅ fully generated
- max() check: calc=true (computed), fn=true (function call), alt=false (not alternative), method=false (not .max()) ✅

## Final Sweep

- ✅ Null safety: All num operations guarded with ?? fallback; no dereference of null
- ✅ Type safety: max(num, num) → num; result stringified; field indexed correctly
- ✅ No regressions: Existing derived fields (חורג מול 3 חודשים, חורג מול שליש) unchanged; still reference original ceilings
- ✅ Dart semantics: `max` is top-level from dart:math (not a method); import present; signature valid
- ✅ Data flow: Two input fields → max computation → save to c24 → display via _calc(); CSV and list views include field

## FINDINGS

**None.** All machine checks pass, all audits clean, byte verification confirms correct implementation across spec, import, save logic, display, metadata, and field ordering. Task complete.

**FIX-LIST: none**
