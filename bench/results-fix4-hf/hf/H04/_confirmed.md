# Validator Report: Calendar Meetings Sorting (H04)

## Findings

**A1** · CONFIRMED · new/dart-gen-bs/gen_app_calendar_px1.dart:18 · `final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y);` (appears in both sort blocks — מועד and שעה)

Dart type error: `num.tryParse()` returns `num?`. After null-check narrowing, `nx` and `ny` are type `num`. The `num` type in Dart does NOT have a `.compareTo()` method (only `int` and `double` do). This code will fail to compile with "The method 'compareTo' isn't defined for the class 'num'".

Fix: Use comparison operators instead of `.compareTo()`:
```dart
final c = (nx != null && ny != null) ? (nx < ny ? -1 : nx > ny ? 1 : 0) : x.compareTo(y);
```

---

## Summary

- **Audit Coverage**: ✅ correct, thorough; missed one Dart type issue
- **Police Validation**: ✅ gates_pass, but `dart_math_sane` check does not catch `.compareTo()` on `num` type (only checks for patterns like `.sqrt()` without importing `dart:math`)
- **Regression Audit**: ✅ correct isolation verified
- **High-Priority**: YES — this blocks compilation

---

## Verification Details

The auditors correctly verified:
- ✓ Spec syntax: `| מיון: מועד עולה, שעה עולה`
- ✓ Field mapping: c5='מועד', c6='שעה'
- ✓ Sort precedence: date first, time second
- ✓ Null-safety on `?? ''` and `.isEmpty` checks
- ✓ No regressions to other apps
- ✗ Dart type validity on numeric `.compareTo()` — not verified

The machine's `dart_math_sane` gate appears to check for specific anti-patterns (e.g., calling `.sqrt()` on `num` without importing `dart:math`) but does not perform full Dart type checking. The code has not been validated against `flutter analyze` or `dart analyze`.

---

FIX-LIST:
1. **gen_app_calendar_px1.dart:18 (first sort block — מועד)**: Replace `nx.compareTo(ny)` with `(nx < ny ? -1 : nx > ny ? 1 : 0)` 
2. **gen_app_calendar_px1.dart:18 (second sort block — שעה)**: Replace `nx.compareTo(ny)` with `(nx < ny ? -1 : nx > ny ? 1 : 0)`
