# Audit: מרחק אבסולוטי Field Implementation

## Findings

**new/dart-gen-bs/gen_app_panuy_ent1.dart:51** · Wrong field reference in abs() computation · P1 (wrong result) · Use direct formula instead of loaded value: change `(_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ))` to `(_m_abs( ((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)) ))`

**new/dart-gen-bs/gen_app_panuy_ent1.dart:17** · Helper function wrapper is correct (sound Dart use of `.abs()` method on `num` type) · verified ✅

## Why This Is a Bug

The spec defines: `מרחק אבסולוטי = abs(הפרש רוחב)` where `הפרש רוחב = קו רוחב - קו רוחב שלי`.

The generated save() method (line 51) computes:
```dart
gen_app_panuy_ent1_c26: (_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )).toStringAsFixed(2)
```

The problem: `_v[8]` is the **loaded/stored value** of הפרש_רוחב (c22), NOT the newly computed value for this save. For **new records**, `_v[8]` is never initialized (only defaults at indices 4,5,7 on line 33), so it parses as empty → 0, yielding `abs(0) = 0` instead of the actual latitude difference.

**Contrast with c22 itself (line 51)**: correctly computed as `((num.tryParse(_v[2]) ?? 0) - (num.tryParse(_v[4]) ?? 0))`, directly from source fields.

**Why c25 doesn't show the same issue**: c25 = sqrt(_v[10]) does reference the loaded c24, but c24 is recomputed fresh on the same line, so when loading a fresh copy, the transitive dependency is not broken. However, c26 breaks the chain by reading from a field (_v[8]) that was never recomputed for new records in this flow.

Failure scenario:
- User creates new record: קו_רוחב=32.5, קו_רוחב_שלי=32.0853 (auto-filled)
- Saves
- מרחק_אבסולוטי is stored as 0 instead of ≈0.41

## Coverage

✅ **Verified correct**:
- _m_abs() helper function correctly wraps Dart's `num.abs()` method (line 17)
- abs() appears only in panuy.txt (grep: 1 match) — no cross-app contamination
- Police report shows `abs | ✅ 1×` (test count verified)
- Field label c26 = 'מרחק אבסולוטי' correct (gen_app_panuy_ent1_content.dart:28)
- Field position in form/edit/csv consistent (index 12 in _labelsAll)

**Could not verify**:
- Actual runtime behavior (Flutter/Dart not installed; reasoning from lang spec only)
- Whether editor correctly loads & re-saves existing records (would need inspect DB & test flow)
- What the police test actually covers for abs (claims `1×` but test code not readable)
