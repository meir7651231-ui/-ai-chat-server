# ✅ Validator Report — panuy (H08)

## Findings

**AUDIT-1-COMPILE** · CONFIRMED · new/dart-gen-bs/gen_app_panuy_ent1.dart:51 `gen_app_panuy_ent1_c26: (_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ))` · For new records, _v[8] is never initialized (only indices 4,5,7 set at line 33), so abs() always receives 0 → always saves '0.00' instead of abs(קו_רוחב - קו_רוחב_שלי). Change operand to: `((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0))`

**AUDIT-2-REGRESSION** · CONFIRMED · new/dart-gen-bs/gen_app_panuy_ent1.dart:51 `gen_app_panuy_ent1_c26: (_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ))` · _v[8] holds stale database value; edits to _v[2] or _v[4] don't trigger recalculation. Change: `(_m_abs( ((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)) ))`

**AUDIT-3-COVERAGE** · CONFIRMED · new/dart-gen-bs/gen_app_panuy_ent1.dart:51,177 `(_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ))` · Computed field uses stale value at save (line 51) and display (line 177). Both must reference fresh calculation: `((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0))`

## Severity & Context

- **Spec** (machtzev/generator/specs-ds/panuy.txt:4): ✅ Correct — `מרחק אבסולוטי = abs(הפרש רוחב)` and `הפרש רוחב = קו רוחב - קו רוחב שלי`
- **Helper function** (line 17): ✅ Correct — `_m_abs(num x) => x.abs()` properly uses Dart's `num.abs()` method with sound null-safety
- **Police report**: All checks pass (abs 1×, dart_math_sane ✅, calc consts=1 calc=1 ✅) but does not validate correctness of operand source
- **Impact**: Task not done. Field always saves/displays 0 for new records; stale value on edits.

## Final Sweep

- ✅ _v[8] mapping verified: line 33 (init) + line 63 (edit load) + line 51 (save use) — all consistent but wrong source
- ✅ _labelsAll index 12 = gen_app_panuy_ent1_c26 confirmed at line 32
- ✅ c22 (הפרש רוחב) at line 51 computed correctly as `((num.tryParse(_v[2]...) - num.tryParse(_v[4]...)`; c26 should mirror this
- ✅ No other computed fields (c23, c24, c25) have the same stale-reference bug — they compute fresh or chain correctly
- ⚠️ Line 177 display bug also present: same wrong operand

FIX-LIST: AUDIT-1-COMPILE, AUDIT-2-REGRESSION, AUDIT-3-COVERAGE (all same root cause: change _v[8] to fresh calculation in lines 51 & 177)
