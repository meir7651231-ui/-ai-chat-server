# 🔍 Regression Audit — panuy app (H01)

## Findings

new/dart-gen-bs/gen_app_panuy_ent1.dart:50 · Distance in km calculated from uninitialized _v[10] (always yields sqrt(0)=0.00) · P1 task not done · Extract squared-distance calculation into variable before save; use calculated value for sqrt instead of reading from _v[10] which is never populated during _save()

## Coverage

**Verified correct:**
- Sorting logic (line 187): correctly sorts by gen_app_panuy_ent1_c34 ('מרחק בקמ'), ascending (nearest first); num.compareTo() is ascending by default. ✓
- Display (line 188): table includes c25 ('מרחק בקמ') in columns list; particle spec line 12 requests this field; correct. ✓
- sqrt() import and usage (line 8 import, line 175/50 usage): correctly imports dart:math as top-level function, not as method on num. ✓
- Squared-distance calculation (line 50 first part): correctly computes (lat_diff)² × 12321 + (lng_diff)² × 8649 and stores to map[c24]. ✓
- No state leakage: police report byte_identical_others ✅ confirms no other apps' generated files changed. ✓
- No orphan files: police report no_orphans ✅; 13 panuy files expected, 13 exist. ✓
- Compiles: police report compiles ✅; no analyzer errors. ✓

**Could not check (Flutter/Dart not installed):**
- Runtime behavior (whether the bug actually manifests in UI or store)
- AppStore record serialization/deserialization
