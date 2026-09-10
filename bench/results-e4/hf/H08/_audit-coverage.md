# Task Audit: מרחק אבסולוטי = abs(הפרש רוחב)

**Scope**: Machine report (_police.md) shows DONE with all checks ✅ (regen_ok, compiles, abs used 1×, calc=1). Manual audit traced generated code across save logic, live display, and particle surfaces.

---

## FINDINGS

**new/dart-gen-bs/gen_app_panuy_ent1.dart:51** · computed field formula uses old stored value instead of freshly computed dependency · **P1 WRONG RESULT** · expand reference to הפרש רוחב into raw formula

Concrete issue:
- Line 51 computes `gen_app_panuy_ent1_c23: (_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )).toStringAsFixed(2)`
- `_v[8]` holds OLD stored value of c22 (הפרש רוחב), not current input-based computation
- When creating new record: _v[8] is undefined → c23 = abs('') = 0, should be abs(latitude - my_latitude)
- When editing and changing latitude/my_latitude: live display (line 174) still uses _v[8], so c23 doesn't update
- **Correct formula**: `(_m_abs( ((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)) )).toStringAsFixed(2)` — substitute הפרש רוחב directly into abs() rather than referencing field index

**Impact scope**: Save logic (data persisted incorrectly) → All consumers of stored c23 value see wrong result across table view (px1.dart:35), card display (ent1.dart:91), CSV export (ent1.dart:96–100).

---

## VERIFIED CORRECT

✅ **Spec compliance**: panuy.txt correctly lists `מרחק אבסולוטי = abs(הפרש רוחב)` in both entity and particle definitions.

✅ **abs() function generation**: Helper `_m_abs` exists (line 17), used 1× per police report, Dart syntax valid.

✅ **Compilation**: Dart analyzer passes (0 errors per police report), type-safe null handling with `.tryParse()` and `?? 0`.

✅ **No data side-effects**: FAKERS not populated, no other app modified (byte_identical_others ✅), pins.sha256 consistent.

✅ **Particle table renders stored field**: px1.dart correctly reads stored c23 from entity records — bug propagates to all UI surfaces.

❌ **Live calculation logic**: Form shows `_calc(…_m_abs(_v[8])…)` on line 174; dependency on _v[2] and _v[4] broken.

---

## COVERAGE CHECKED
- Entity save computation (line 51): formula bug confirmed, wrong input reference
- Live form display (line 174): same formula bug, no dependency tracking
- Particle table (px1.dart:35): reads stored field correctly, but stores wrong value
- Card display (ent1.dart:91): shows stored value from entity
- CSV export (ent1.dart:96–100): exports stored value

## COVERAGE UNABLE TO CHECK
- Runtime behavior (would need to add/edit a record with known lat/my_lat and verify stored/displayed value differs from expected abs difference; app not running in audit context)
- Desktop/mobile UI rendering beyond code inspection
