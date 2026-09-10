# ✅ Validator Report — M06 (panuy) · קרוב field

## Verdicts

### P1: gen_app_panuy_ent1.dart:50 · Computed field קרוב saved as empty string
**CONFIRMED** · Spec line 4: `קרוב = מרחק בריבוע < 100 ? קרוב : רחוק` requires computed value; code saves `gen_app_panuy_ent1_c32: ''` instead of computation · new/dart-gen-bs/gen_app_panuy_ent1.dart:50, quoted: `gen_app_panuy_ent1_c32: ''` · Fix: compute condition and assign result (not empty string); use mérRaw value from distance-squared calculation: `gen_app_panuy_ent1_c32: (((num.tryParse( (( (num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0) ) * ( (num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0) ) * 12321 + ( (num.tryParse(_v[3] ?? '') ?? 0) - (num.tryParse(_v[5] ?? '') ?? 0) ) * ( (num.tryParse(_v[3] ?? '') ?? 0) - (num.tryParse(_v[5] ?? '') ?? 0) ) * 8649) ?? 0) < 100) ? gen_app_panuy_ent1_c32 : gen_app_panuy_ent1_c33)` or extract distance-squared to temp var first

### P1: gen_app_panuy_ent1.dart:91 · Card display shows empty value instead of literal text
**CONFIRMED** · Display uses form state _v[10] (unpopulated on first save) and _v[14] (empty string) instead of record data r[c24] or constants; line 91 quoted: `(((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? (_v[14] ?? '') : gen_app_panuy_ent1_c33)` · Fix: replace with record-based evaluation: `(((num.tryParse(r[gen_app_panuy_ent1_c24] ?? '') ?? 0) < 100) ? gen_app_panuy_ent1_c32 : gen_app_panuy_ent1_c33)` (same for lines 99, 178, 188)

### P1: gen_app_panuy_ent1.dart:99 · CSV export shows empty value
**CONFIRMED** · Same root cause as line 91; line 99 uses same broken expression with form state instead of record data · Fix: use record-based expression (same as line 91)

### P1: gen_app_panuy_ent1.dart:178 · Form preview shows empty value  
**CONFIRMED** · Same root cause; line 178 uses `_v[10]` and `_v[14]` instead of record/constant values · Fix: use record-based expression (same as line 91)

### P1: gen_app_panuy_ent1.dart:188 · Grid display shows empty value
**CONFIRMED** · Same root cause; line 188 in grid rendering uses form state instead of record data · Fix: use record-based expression (same as line 91)

## Summary

All auditor findings CONFIRMED. The field קרוב does not compute or display correctly:
1. **Save method (line 50)** never computes the conditional; stores empty string
2. **Display methods (lines 91, 99, 178, 188)** all read from uninitialized form state indices instead of record data or constants

Machine passes all checks (compiles ✅, regen_ok ✅, gates_pass ✅) because these are logic bugs, not syntax errors. Police report correctly shows 1 calc field detected and 1 conditional expression recognized, but the save/display implementation is broken.

FIX-LIST: P1-line-50-save-empty, P1-line-91-display-form-state, P1-line-99-csv-form-state, P1-line-178-preview-form-state, P1-line-188-grid-form-state
