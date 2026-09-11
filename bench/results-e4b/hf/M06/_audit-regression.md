# 🚔 Auditor Report — panuy computed field implementation

## Findings

**new/dart-gen-bs/gen_app_panuy_ent1.dart:92, 99, 178, 188** · Computed field קרוב reads user input instead of constant value · **P1 wrong result** · Replace `(_v[14] ?? '')` with `gen_app_panuy_ent1_c32`

### Defect Detail

Spec requirement: `קרוב = מרחק בריבוע < 100 ? קרוב : רחוק`  
This is a **computed text field**: when מרחק בריבוע < 100, show the constant string "קרוב"; otherwise show "רחוק".

Generated code (line 92, _card method):
```dart
(((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? (_v[14] ?? '') : gen_app_panuy_ent1_c33)
```

**The bug**: `_v[14]` is the input value for field position 14 (which maps to label index 14 in _labelsAll: `gen_app_panuy_ent1_c32`). This treats the computed field as an **input field**, reading the user's own input.

**Correct code**:
```dart
(((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? gen_app_panuy_ent1_c32 : gen_app_panuy_ent1_c33)
```

This affects all display paths:
- Line 92: _card(Map<String, String> r) — displayed in record card
- Line 99: _csv() — exported CSV
- Line 178: _live() widget in form 
- Line 188: ForgeDataGrid table view

**Trigger**: When מרחק בריבוע < 100, the field will display whatever the user typed into the קרוב input (none, or empty string), instead of the constant "קרוב".

**Evidence**: Content file line 34 defines `gen_app_panuy_ent1_c32 = 'קרוב'` and line 35 defines `gen_app_panuy_ent1_c33 = 'רחוק'`. The ternary should use the constant, not the input slot.

---

## Regression Coverage

✅ **No state-leakage to other apps** — git diff shows only panuy.* files changed + sechirut field re-numbering (expected from new fields)  
✅ **No orphaned files** — police report: `no_orphans ✅`  
✅ **No other spec files modified** — police report: `byte_identical_others ✅`  
✅ **Compiles despite bug** — police report: `compiles ✅` (Dart syntax is valid, logic is wrong)  
⚠️ **Gate passes but logic is wrong** — police report: `gates_pass ✅`, `calc ✅` (but calc counts only structure, not semantic correctness)

---

## Summary

Task is **incomplete**: The computed field was added to the spec and generated into Dart, but the generator created a reference to the input slot instead of the constant value. The field will not behave as specified when distance < 100.

