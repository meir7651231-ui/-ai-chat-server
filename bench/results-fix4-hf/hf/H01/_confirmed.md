# ✅ VALIDATOR REPORT — panuy app

## Findings Verification

**FINDING-1** · CONFIRMED · `new/dart-gen-bs/gen_app_panuy_ent1.dart:50` · `gen_app_panuy_ent1_c25: (sqrt( (num.tryParse(_v[10] ?? '') ?? 0) )).toStringAsFixed(2)` · Extract squared_distance once: `final sq = ...formula...; final map = {...gen_app_panuy_ent1_c24: sq.toStringAsFixed(2), gen_app_panuy_ent1_c25: (sqrt(sq)).toStringAsFixed(2)...}`

**FINDING-2** · CONFIRMED · `new/dart-gen-bs/gen_app_panuy_ent1.dart:175` · `_calc(gen_app_panuy_ent1_c25, sqrt( (num.tryParse(_v[10] ?? '') ?? 0) ))` · Compute squared_distance from inputs in _calc call: `final sq = ((..._v[2]-..._v[4]...)*12321 + (..._v[3]-..._v[5]...)*8649); _calc(gen_app_panuy_ent1_c25, sqrt(sq))`

## Verified Correct

✅ **dart:math sqrt**: Line 8 imports `dart:math`; sqrt is top-level function (not method on num); used correctly as `sqrt(num)` on line 50 and 175

✅ **Sort logic**: gen_app_panuy_px1.dart line 34 sorts by distance (c6='מרחק בקמ') ascending (nearest first); numeric compareTo used; empty values sort last; logic is sound

✅ **Field mapping**: _labelsAll index 10 → c24 (squared_distance); index 11 → c25 (distance_km); mapping consistent across form (_calc display) and record display

✅ **No cross-app pollution**: panuy app self-contained; no shared distance constants or state mutations affecting other apps

## Root Cause

When creating new records, only _v[4,5,7] initialized (defaults for my-lat/my-lng/hours). Distance fields _v[8-11] never populated from user inputs before save. Line 50 correctly computes c24 (squared_distance) inline but then tries to read _v[10] for c25, which is empty → tryParse('') → 0 → sqrt(0) = 0. Same issue in _calc display (line 175) for visual feedback.

---

FIX-LIST: FINDING-1, FINDING-2
