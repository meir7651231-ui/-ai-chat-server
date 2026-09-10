# Validator Report: panuy task

## Machine Baseline
- **police.md:** All checks ✅ (regen_ok, gates_pass, compiles, byte_identical_others, no_hebrew_in_engine, dart_math_sane, sqrt imported correctly)
- **Claims:** sort_by_distance_ascending, display_real_distance_km both marked UNVERIFIED — red flag given severity below

## Finding 1: New Record Distance Calculation = 0.0 (BROKEN)
- **Verdict:** CONFIRMED P0
- **File:** gen_app_panuy_ent1.dart:50, 175
- **Evidence:** Line 50: `gen_app_panuy_ent1_c25: (sqrt( (num.tryParse(_v[10] ?? '') ?? 0) )).toStringAsFixed(2)`
- **Evidence:** Line 175 display: `_calc(gen_app_panuy_ent1_c25, sqrt( (num.tryParse(_v[10] ?? '') ?? 0) ))`
- **Evidence:** _v[10] is initialized only in _edit() line 62 (`10: r[gen_app_panuy_ent1_c24] ?? ''`) for existing records; never set in _save() for new records
- **Evidence:** Content file confirms c24='מרחק בריבוע' (squared distance); c25='מרחק בקמ' (distance in km)
- **Root cause:** When saving new record, code tries to read `_v[10]` which is uninitialized (empty string → num.tryParse() returns null → ?? 0 → sqrt(0) = 0.0). Squared distance c24 IS calculated correctly in same save() call but never stored in _v[10] first.
- **Failure scenario:** User enters coordinates (lat=32.1, lon=34.8, my_lat=32.0853, my_lon=34.7818); squared distance calculates correctly but then distance_in_km saved as "0.00" instead of ~1.5 km
- **Fix:** Extract squared-distance calculation to variable, reuse: `final sq = ((...)*12321 + (...)*8649).toStringAsFixed(2); map[c24] = sq; map[c25] = (sqrt(num.tryParse(sq) ?? 0)).toStringAsFixed(2)`

---

## Finding 2: Table Column Order Mismatch
- **Verdict:** CONFIRMED P1
- **File:** gen_app_panuy_px1.dart:34
- **Evidence:** Spec line 6: `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה` = [name, available, distance, price]
- **Evidence:** Content c1='שם', c2='זמין', c3='מחיר לשעה', c4='מרחק בקמ'
- **Evidence:** Code line 34 columns: `[gen_app_panuy_px1_c1, gen_app_panuy_px1_c2, gen_app_panuy_px1_c3, gen_app_panuy_px1_c4]` = [name, available, price, distance]
- **Evidence:** Code line 34 items: `[c6, c7, c8, c9]` = [name, available, price, distance]; should be `[c6, c7, c9, c8]`
- **Failure scenario:** Table displays (name | available | price | distance) but spec requires (name | available | distance | price)
- **Fix:** Swap c3↔c4 in columns array and c8↔c9 in items array: `columns: [gen_app_panuy_px1_c1, gen_app_panuy_px1_c2, gen_app_panuy_px1_c4, gen_app_panuy_px1_c3]` and items `[c6, c7, c9, c8]`

---

## Auditor Verdict Assessment

| Auditor | Finding | Verdict | Correct? |
|---------|---------|---------|----------|
| _audit-coverage.md | Column order P1 | CONFIRMED | ✅ Correct |
| _audit-coverage.md | Distance calc correct | FALSE-POSITIVE | ❌ Missed P0 new-record bug |
| _audit-compile.md | Distance=0 for new records P0 | CONFIRMED | ✅ Correct; correctly identified the _v[10] bug |
| _audit-compile.md | Column order P1 | CONFIRMED | ✅ Correct |
| _audit-regression.md | Distance + sort DONE | FALSE-POSITIVE | ❌ Missed P0 new-record bug; sort works but distance broken for new records |
| _audit-regression.md | Column order P2 | CONFIRMED but ADJUST | ⚠️ Correct finding; severity should be P1 not P2 (blocks task per spec) |

---

## FIX-LIST:

1. CONFIRMED P0 · gen_app_panuy_ent1.dart:50 · New records save distance=0 instead of sqrt(squared_distance) — `_v[10]` uninitialized in _save() · Extract squared distance to variable, reuse in both c24 and c25 calculation

2. CONFIRMED P1 · gen_app_panuy_px1.dart:34 · Table column order [name,available,price,distance] does not match spec [name,available,distance,price] · Swap columns [c1,c2,c4,c3] and items [c6,c7,c9,c8]
