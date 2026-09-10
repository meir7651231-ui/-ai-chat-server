# ✅ Validator Report — peruk12 Computed Field (מחיר עם אגרה)

## Verification Summary

All three auditors reported: **No findings.** Performed final adversarial verification against generated Dart files and git diff.

### Bytes Verified

**Spec (machtzev/generator/specs-ds/peruk12.txt:7):**
```
ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, מחיר עם אגרה=מחיר * 1.03, מה המוכר אמר, האם נסעת | …
```
✓ Formula syntax correct: `מחיר עם אגרה=מחיר * 1.03`

**JSON config (machtzev/generator/apps/peruk12.json:65-68):**
```json
{
  "label": "מחיר עם אגרה",
  "type": "num",
  "required": false,
  "enumVals": []
}
```
✓ Positioned correctly after מחיר (field 4 of 7), type num, not required

**Save formula (new/dart-gen-bs/gen_app_peruk12_ent1.dart:48):**
```dart
gen_app_peruk12_ent1_c14: ((num.tryParse(_v[3] ?? '') ?? 0) * 1.03).toStringAsFixed(2)
```
✓ Sound null-safety: `num.tryParse()→num?`, coalesce to 0, multiply by 1.03 (num), format to 2 decimals
✓ Computes correctly: price × 1.03, stored as String with 2 decimal places

**Display formula (new/dart-gen-bs/gen_app_peruk12_ent1.dart:173):**
```dart
_calc(gen_app_peruk12_ent1_c14, (num.tryParse(_v[3] ?? '') ?? 0) * 1.03)
```
✓ Same null-safe computation, displayed via `_calc()` widget (read-only, non-editable)
✓ Updates live as user edits price field (_v[3])

**Read-only enforcement:**
- No `ForgeDsField` for _v[4] (the computed field index)
- Only indices 0,1,2,3,5,6 have editable fields (lines 168-175)
- Index 4 displayed via `_calc()` only (line 173)
✓ User cannot edit the computed field

**Content constant (new/dart-data-bs/auto/gen_app_peruk12_ent1_content.dart:16):**
```dart
const String gen_app_peruk12_ent1_c14 = 'מחיר עם אגרה';
```
✓ Label correct

**Field array mapping (new/dart-gen-bs/gen_app_peruk12_ent1.dart:29):**
```dart
static const List<String> _labelsAll = […, gen_app_peruk12_ent1_c13, gen_app_peruk12_ent1_c14, gen_app_peruk12_ent1_c15, …];
```
✓ Index 3 = c13 (מחיר), Index 4 = c14 (מחיר עם אגרה) — correct for formula `_v[3]`

**All views include field:**
- Card display (line 89): included in labels and values arrays ✓
- Table/Grid (line 186): included in columns array ✓  
- CSV (lines 94,97): included in header and row values ✓

**Load on edit (line 60):**
```dart
4: r[gen_app_peruk12_ent1_c14] ?? ''
```
✓ Loads stored computed value when opening record for edit

**Police report (./_police.md):**
- regen_ok ✅
- byte_identical_others ✅
- gates_pass ✅
- no_hebrew_in_engine ✅
- dart_math_sane ✅
- calc_fee ✅ consts=1 calc=1

## Verdict

All findings from auditors confirmed as accurate. No regressions, no bugs, no breaking changes.

---

FIX-LIST: none
