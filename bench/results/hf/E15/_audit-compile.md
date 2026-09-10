# 🔍 AUDIT-COMPILE: tasks.txt computed field (סכום כולל מעמ)

## Findings
**None.** No compile defects, null-safety violations, or logic errors detected.

## Coverage: verified correct

**Null safety** (Dart sound): Line 51 and 161 both use `num.tryParse(_v[2] ?? '') ?? 0` — safe coalescing at every level. Result is num (non-null) before multiplication. ✓

**Dart method calls**: 
- `.toStringAsFixed(2)` on num type: valid (line 51, line 134 in _calc widget). ✓
- `num.tryParse()`: valid static method. ✓

**Formula logic**: 
- Field index _v[2] → gen_app_tasks_ent1_c11 ('סכום'): correct. ✓
- Multiplier 1.18 hardcoded, matches spec. ✓
- Calculation `num * 1.18` → num: correct type. ✓

**Field inclusion**:
- Line 32: _labelsAll has 5 fields (c9–c13), c13 is 5th element. ✓
- Line 51: c13 stored in save map with recalculated value (not user-editable). ✓
- Line 63: c13 loaded from record when editing (as _v[4]). ✓
- Line 92, 98, 100, 173: c13 included in card, CSV, table displays. ✓
- Line 161: c13 displayed via _calc widget with live calculation. ✓

**Spec syntax**: tasks.txt line 6 uses ASCII `*` (not Unicode ×), matches rule in LEARNINGS.md L2026-09-10-formula-syntax-e15. ✓

**Edge cases verified**: empty input → 0; negative numbers → correct sign; decimals → preserved to 2 places. ✓

**Police verdict**: `calc` gate CONFIRMED (consts=1 calc=1), `regen_ok` CONFIRMED, `dart_math_sane` CONFIRMED. ✓

---

**Summary**: The computed field סכום כולל מעמ = סכום * 1.18 is correctly implemented in spec, transpiled to Dart, and integrated into all UI surfaces (form, card, table, CSV). Task complete with zero compile or runtime defects.
