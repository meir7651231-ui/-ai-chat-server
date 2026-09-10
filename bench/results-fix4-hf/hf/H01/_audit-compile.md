# 🔍 AUDIT: panuy distance sort & km calculation

## Findings

**new/dart-gen-bs/gen_app_panuy_ent1.dart:50** · distance_km calculation uses non-existent _v[10] instead of computed squared_distance, results in sqrt(0)=0 for new records · **P1 task-not-done** · Extract squared_distance to variable before sqrt call, or compute sqrt inline: `sqrt(( (lat_diff)² * 12321 + (lng_diff)² * 8649 )).toStringAsFixed(2)`

**new/dart-gen-bs/gen_app_panuy_ent1.dart:175** · same bug in form display; live calc shows 0 km for distance · **P1 wrong-result** · Use computed squared_distance value from line 174 instead of _v[10]

## Coverage verified

✅ **Sort logic (px1 table):** line 34, column c6='מרחק בקמ', ascending order, nearest-first ✓ · uses `nx.compareTo(ny)` for numeric ascending sort · null-safety: `num.tryParse()` safe ✓ · imports `dart:math` for sqrt ✓

✅ **Sort key field indexed correctly:** c6 maps to c25 ('מרחק בקמ' distance_km field) via content file ✓ — but field value itself is wrong due to bugs above

❌ **Distance calculation (entity form save):** intended as `sqrt(squared_distance)` but accesses _v[10] which is unfilled for new records (only initialized at indices [4,5,7]) → `num.tryParse('') ?? 0` → `sqrt(0)` → **stored distance always 0 km on create** 

❌ **Distance display in form:** line 175 _calc() also uses _v[10], so live preview also shows 0 km (edit flow would show stored value, not live calc)

**Not checked:** field formula correctness (coefficients 12321/8649), my-coords defaults, runtime input validation, sortability of km with other numeric fields — scope was compile/edge-crash

## Summary

Sort-by-distance-ascending is wired correctly in the table (px1), but the distance field itself is calculated wrong: `sqrt(_v[10])` where _v[10] is undefined for new records, causing all new distances to be 0 km instead of actual distance. Edit path would use stale _v[10] from previous save, not recalculated squared distance. Fix: compute sqrt inline from lat/lng inputs, not from _v index.
