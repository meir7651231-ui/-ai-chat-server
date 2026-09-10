# Audit Coverage: panuy app · task = "sort by distance (nearest first), show real distance in km"

## Findings

new/dart-gen-bs/gen_app_panuy_ent1.dart:50 · Distance calculation references unset field _v[10]: `gen_app_panuy_ent1_c25: (sqrt( (num.tryParse(_v[10] ?? '') ?? 0) ))` tries to parse _v[10] when creating new records, but _v[10] maps to field c24 (מרחק בריבוע), a CALCULATED field never populated in new-record flow. Defaults to '', parses as 0, yields sqrt(0)=0. All distance values always 0. · P1 · Extract squared-distance calc before _save() map construction: `final sq = (...)*(...)*12321 + (...)*(...)*8649; gen_app_panuy_ent1_c24: sq.toStringAsFixed(2), gen_app_panuy_ent1_c25: (sqrt(sq)).toStringAsFixed(2)`

new/dart-gen-bs/gen_app_panuy_ent1.dart:175 · Same bug in _calc display: `_calc(gen_app_panuy_ent1_c25, sqrt( (num.tryParse(_v[10] ?? '') ?? 0) ))` — when editing, _v[10] is loaded from existing record so works, but for visual consistency should compute sqrt of _v[10] after confirming it's populated, or re-derive from diffs. · P1 · Apply same fix: compute sqrt from squared-distance formula, not from unset _v[10].

## Verified Correct

✅ **Import & function**: `import 'dart:math'` on line 8; `sqrt()` used as top-level function (not method), matching Dart semantics.

✅ **Sort order**: px1.dart line 34 sorts by c6 (מרחק בקמ) numerically, ascending (nearest first) — logic is sound: `nx.compareTo(ny)` where empty puts last.

✅ **Sort trigger**: px1 particle applied, sort is called on `appStore.records('app_panuy_ent1').toList()`.

✅ **Particle surfaces**: px1_content.dart confirms c6='מרחק בקמ', c1='שם', c2='זמין', c3='מחיר לשעה', c4='מחיר לשעתיים' — all 5 columns (name, available, price, price-2h, distance) present in table display.

❌ **Distance values**: Cannot verify correct numeric values without runtime test — all will be 0 (breaking the sort's ability to rank by true proximity).

**COVERAGE:** Entity form (ent1) ✅ · distance calculation ❌ · sort logic ✅ · particle table (px1) ✅ · distance display ❌ · hub/report — not in spec surface, skipped.

**VERDICT:** Task incomplete. Sorting and table surfaces are structurally correct, but distance calculation bug makes the feature non-functional. Distance always 0 defeats nearest-first ordering.
