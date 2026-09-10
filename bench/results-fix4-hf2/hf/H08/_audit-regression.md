new/dart-gen-bs/gen_app_panuy_ent1.dart:51 · Stale field reference in save(): gen_app_panuy_ent1_c24 computed as `_m_abs((num.tryParse(_v[8]??'')??0))` but _v[8] contains old הפרש רוחב value or empty string for new records; should compute fresh from inputs as `_m_abs((num.tryParse(_v[2]??'')??0)-(num.tryParse(_v[4]??'')??0))` to match live display · P1 wrong result · Replace with: `gen_app_panuy_ent1_c24: (_m_abs((num.tryParse(_v[2]??'')??0)-(num.tryParse(_v[4]??'')??0))).toStringAsFixed(2),`

new/dart-gen-bs/gen_app_panuy_ent1.dart:51 · Stale field reference in save(): gen_app_panuy_ent1_c26 computed as `sqrt(num.tryParse(_v[11]??'')??0)` but _v[11] contains old מרחק בריבוע value or empty string for new records; should compute fresh from inputs as `sqrt((diff_lat²×12321 + diff_lng²×8649))` · P1 wrong result · Replace with: `gen_app_panuy_ent1_c26: (sqrt(((num.tryParse(_v[2]??'')??0)-(num.tryParse(_v[4]??'')??0))*((num.tryParse(_v[2]??'')??0)-(num.tryParse(_v[4]??'')??0))*12321+((num.tryParse(_v[3]??'')??0)-(num.tryParse(_v[5]??'')??0))*((num.tryParse(_v[3]??'')??0)-(num.tryParse(_v[5]??'')??0))*8649)).toStringAsFixed(2),`

new/dart-gen-bs/gen_app_panuy_ent1.dart:175 · Stale field reference in live display: `_calc(gen_app_panuy_ent1_c24, _m_abs((num.tryParse(_v[8]??'')??0)))` displays abs(0) for new records (empty _v[8]); should use fresh inputs as `_m_abs((num.tryParse(_v[2]??'')??0)-(num.tryParse(_v[4]??'')??0))` · P1 wrong result · Replace with: `_calc(gen_app_panuy_ent1_c24, _m_abs((num.tryParse(_v[2]??'')??0)-(num.tryParse(_v[4]??'')??0))),`

new/dart-gen-bs/gen_app_panuy_ent1.dart:177 · Stale field reference in live display: `_calc(gen_app_panuy_ent1_c26, sqrt((num.tryParse(_v[11]??'')??0)))` displays sqrt(0)=0 for new records (empty _v[11]); should compute from fresh inputs · P1 wrong result · Replace with: `_calc(gen_app_panuy_ent1_c26, sqrt(((num.tryParse(_v[2]??'')??0)-(num.tryParse(_v[4]??'')??0))*((num.tryParse(_v[2]??'')??0)-(num.tryParse(_v[4]??'')??0))*12321+((num.tryParse(_v[3]??'')??0)-(num.tryParse(_v[5]??'')??0))*((num.tryParse(_v[3]??'')??0)-(num.tryParse(_v[5]??'')??0))*8649)),`

## Verified correct:
- Helper function `_m_abs` (line 17) correctly wraps `num.abs()` method per Dart semantics
- Field structure and indices in `_edit()` (line 63) correctly map stored records to _v indices
- Input fields in build() (lines 165–172) correctly populate _v[0..7] from form inputs
- Constants in content file correctly name all 35 fields including new מרחק אבסולוטי
- Police report confirms zero analyzer errors and abs() called exactly once in wiring
- Other apps (sechirut, etc.) byte-identical; no state-leakage to peers
- Spec panuy.txt correctly adds the new field with abs() expression
- Task statement ("add computed field מרחק אבסולוטי equal to abs") was executed (field exists)

**Issue root**: Generator inlined field-name references (abs(הפרש רוחב)) as lookup of _v[index] rather than as inlined expressions. For dependent computed fields evaluated before their dependencies, this leaves stale/empty values. Affects both save() and live display paths; new records show incorrect zeros, edited records show stale computations on input change.
