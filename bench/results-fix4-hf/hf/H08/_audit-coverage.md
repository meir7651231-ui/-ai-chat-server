# Audit Coverage: מרחק אבסולוטי Computed Field

## Findings

gen_app_panuy_ent1.dart:51 · abs() computed from wrong value · P1 wrong result · compute c26 from freshly computed c22, not stale _v[8]: `gen_app_panuy_ent1_c26: (_m_abs((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0))).toStringAsFixed(2)`

## Verification Details

**Spec**: machtzev/generator/specs-ds/panuy.txt (new file) ✅
- Line 4 correctly defines: `מרחק אבסולוטי = abs(הפרש רוחב)` in entity
- Field label appears in ent1_content.dart:28 and px1_content.dart:15, 30 ✅

**Entity Form (gen_app_panuy_ent1.dart)**:
- Line 17: helper function `_m_abs(num x) => x.abs()` correctly wraps Dart's built-in abs() ✅
- Line 32: field c26 included in _labelsAll (index 12) ✅
- Line 51 **DEFECT**: c26 computation uses `_v[8]` which is the STORED value of c22 from loaded record
  - When adding new record: _v[8] undefined → abs(0) → always '0.00'
  - When editing record after changing input fields: _v[8] NOT updated when _v[2]/_v[4] change → abs() uses stale value
  - Correct formula should use freshly computed c22: `((num.tryParse(_v[2]??'')??0) - (num.tryParse(_v[4]??'')??0))`
- Line 60–63: _edit() loads _v[8] = r[c22] (stored value, correct for display-only)
- Line 177: display shows stale _v[8] value, doesn't reflect input edits ⚠️

**Table View (gen_app_panuy_px1.dart:34)**: ✅
- Column header c13 = 'מרחק אבסולוטי' present
- Data mapping `(r[gen_app_panuy_px1_c28] ?? '')` reads from record key 'מרחק אבסולוטי'
- Field will display whatever was incorrectly saved from ent1

**Police Report (./_police.md)**: ✅ all gates pass, abs used 1×
- ✅ abs check passed (1 call detected)
- ⚠️ Police does not validate correctness of the abs() input source

## Coverage Summary

**Checked**:
- Spec file created with field definition ✅
- Field label generation ✅
- abs() function usage ✅
- Field in entity form (ent1) ✅
- Field in table view (px1) ✅
- Record save logic ❌ DEFECT
- Dart math function correctness ✅

**Could Not Check** (Flutter/Dart not installed):
- Runtime behavior when adding/editing records
- Whether stale _v[8] displays correctly on form
- CSV export (uses stale _v[8])

**Result**: Task partially covered. Field is structurally present in entity, table, and record but computation uses wrong input value, producing '0.00' for new records and stale values when editing.
