# Audit: panuy.txt spec implementation — distance calculation & sorting

## Finding

**new/dart-gen-bs/gen_app_panuy_ent1.dart:50** · Distance in km (c25) calculated from stale _v[10] instead of newly computed squared distance · P1 (wrong result) · Extract squared-distance calc to variable, use for both c24 and c25 fields

### Defect Detail

The save method constructs a map with two related fields:
- Line 1: `gen_app_panuy_ent1_c24: (...calculate squared distance...).toStringAsFixed(2)`
- Line 2: `gen_app_panuy_ent1_c25: (sqrt((num.tryParse(_v[10] ?? '') ?? 0))).toStringAsFixed(2)`

**Wrong behavior:**
- For new records: _v[10] is uninitialized → sqrt(0) = 0 → distance always 0 km
- For edits with coordinate changes: _v[10] holds the old squared distance (loaded in _edit line 62) → sqrt(old_distance²) → stale distance

The squared distance is computed correctly on the line above (line 1), but c25 tries to read _v[10] which is either empty (new record) or holds the previous value (not updated when coordinates change).

**Right behavior:** c25 should be `sqrt(freshly_calculated_squared_distance)`, not `sqrt(_v[10])`.

**Trigger:** Create any record with coordinates, or edit existing record and change coordinates. Stored distance will be 0 (new) or outdated (edit).

## Coverage

✅ **Verified correct:**
- Sort logic (gen_app_panuy_px1.dart:34): numeric ascending order, empty-last, field key 'מרחק בקמ' — sound
- sqrt() import & usage: correct use of `dart:math` sqrt function on line 8 import
- Sort field mapping: px1_c15 correctly maps to 'מרחק בקמ' (distance in km field)
- Spec parsing: panuy.txt correctly interprets `| מיון: מרחק בקמ עולה` as ascending sort on distance
- Police checks: byte_identical_others ✅, sqrt ✅, sort_list ✅, compiles ✅

❌ **Could not verify (not installed):**
- Runtime behavior: actual sort order on live data (requires Flutter/Dart VM)
- Form field reactive updates: whether displayed distance updates correctly as user edits (requires flutter run)
- Cross-app regression: state leakage to other apps (police marked byte_identical_others ✅, trusting that)

## Recommendation

Fix line 50 by extracting the squared-distance calculation:

```dart
final squaredDist = (( (num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0) ) * ... * 12321 + ( (num.tryParse(_v[3] ?? '') ?? 0) - (num.tryParse(_v[5] ?? '') ?? 0) ) * ... * 8649);
final map = <String, String>{
  ...
  gen_app_panuy_ent1_c24: squaredDist.toStringAsFixed(2),
  gen_app_panuy_ent1_c25: sqrt(squaredDist).toStringAsFixed(2),
  ...
};
```

This ensures c25 is always `sqrt(newly_calculated_squared_distance)` regardless of record state.
