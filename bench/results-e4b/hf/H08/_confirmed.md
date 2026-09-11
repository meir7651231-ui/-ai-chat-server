# ✅ VALIDATOR REPORT — panuy computed field

## Verdict Summary
**4 CONFIRMED P1 bugs** found in generated panuy app code. All auditor findings verified correct.
Police report passed all checks (regen, compile, abs-valid), but semantic computation bugs escaped machine detection.

---

## CONFIRMED FINDINGS (by severity)

**P1-A · gen_app_panuy_ent1.dart:51** · Computed field `מרחק אבסולוטי` saves wrong value for new records
- **Evidence**: `gen_app_panuy_ent1_c24: (_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )).toStringAsFixed(2)`
- **Bug**: `_v[8]` is undefined when creating new records (only _v[0..7] exist). Returns 0 instead of abs(latitude-difference)
- **Reachability**: 100% — always hit on save() for new records
- **Fix**: Compute inline: `gen_app_panuy_ent1_c24: (_m_abs((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0))).toStringAsFixed(2)`

**P1-B · gen_app_panuy_ent1.dart:51** · Computed field `מרחק בקמ` saves wrong value for new records  
- **Evidence**: `gen_app_panuy_ent1_c26: (sqrt( (num.tryParse(_v[11] ?? '') ?? 0) )).toStringAsFixed(2)`
- **Bug**: `_v[11]` undefined for new records. Returns sqrt(0)=0 instead of sqrt(distance-formula)
- **Reachability**: 100% — always hit on save() for new records
- **Fix**: Compute inline: `gen_app_panuy_ent1_c26: (sqrt(( (num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0) ) * ( (num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0) ) * 12321 + ( (num.tryParse(_v[3] ?? '') ?? 0)  -  (num.tryParse(_v[5] ?? '') ?? 0) ) * ( (num.tryParse(_v[3] ?? '') ?? 0)  -  (num.tryParse(_v[5] ?? '') ?? 0) ) * 8649)).toStringAsFixed(2)`

**P1-C · gen_app_panuy_ent1.dart:175** · Display calculation for `מרחק אבסולוטי` shows 0 during form entry
- **Evidence**: `_calc(gen_app_panuy_ent1_c24, _m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ))`
- **Bug**: Same as P1-A but in live display (green box during form entry)
- **Reachability**: 100% — always rendered in build() for new records
- **Fix**: `_calc(gen_app_panuy_ent1_c24, _m_abs((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)))`

**P1-D · gen_app_panuy_ent1.dart:177** · Display calculation for `מרחק בקמ` shows 0 during form entry
- **Evidence**: `_calc(gen_app_panuy_ent1_c26, sqrt( (num.tryParse(_v[11] ?? '') ?? 0) ))`
- **Bug**: Same as P1-B but in live display
- **Reachability**: 100% — always rendered in build() for new records
- **Fix**: `_calc(gen_app_panuy_ent1_c26, sqrt(( (num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0) ) * ( (num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0) ) * 12321 + ( (num.tryParse(_v[3] ?? '') ?? 0)  -  (num.tryParse(_v[5] ?? '') ?? 0) ) * ( (num.tryParse(_v[3] ?? '') ?? 0)  -  (num.tryParse(_v[5] ?? '') ?? 0) ) * 8649))`

---

## ROOT CAUSE ANALYSIS

The `_v` map architecture:
- **Input indices (0–7)**: User-entered and default fields; populated on form entry
- **Computed indices (8–14)**: Formula-derived fields; **only populated when editing existing records** (line 63)
- **New record creation**: Only _v[0..7] exist; _v[8..14] never initialized

Lines 51 and 175 incorrectly reference _v[8] and _v[11] as if they're cached values, but they're never populated for new records. The correct pattern (used for c22, c23, c25) is inline computation from inputs.

---

## VERIFICATION

✅ **Machine checks**: All pass (regen_ok, gates_pass, compiles, dart_math_sane, abs-valid)
  - These checks validate syntactic correctness, not semantic computation
  
✅ **Framework semantics**: Dart null coalescing (`_v[8] ?? ''`) is sound; `num.tryParse('')` returns null as expected
  
✅ **Reachability**: New record creation path is 100% reachable; users will hit these bugs immediately on first save
  
✅ **Fix safety**: Inline formulas match the spec and working patterns in c22/c23/c25; no breaking changes

---

## FALSE-POSITIVES: NONE

All auditor findings are CONFIRMED. Police report verdicts unaffected (machine checks were correct; semantic bugs outside their scope).

---

## FALSE-POSITIVE NOTES

The regression auditor also flagged line 178/c27 as P2 (мчиру лшеатаim field treated as editable). This is a secondary issue to P1-A/B/C/D but not blocking — the field is computed and displayed via boqLineAmount on line 179, so the form field on line 178 is orphaned/unused. Noted but not a blocker for the core abs() feature.

---

FIX-LIST: P1-A, P1-B, P1-C, P1-D
