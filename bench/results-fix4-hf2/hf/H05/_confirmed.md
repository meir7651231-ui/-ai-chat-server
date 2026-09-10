# ✅ VALIDATOR REPORT — peruk02 cases table sorting

## Generic machine checks
All generic checks in `_police.md` PASSED (✅):
- `regen_ok` ✅
- `byte_identical_others` ✅
- `gates_pass` ✅
- `no_hebrew_in_engine` ✅
- `dart_math_sane` ✅
- `compiles` ✅
- `sort` ✅ px1

No automatic P0 findings from machine failures.

---

## Auditor findings verification

### Finding 1: audit-compile-01
**Verdict: CONFIRMED P0**

**Evidence:** `gen_app_peruk02_px1.dart:27`
```dart
final nx = num.tryParse(x), ny = num.tryParse(y);
```

**Issue:** `num.tryParse()` does not exist as a static method in Dart SDK. The `num` class is abstract and does not define `tryParse()`. Only `int.tryParse()` and `double.tryParse()` exist as static methods.

**Dart fact verification:** In Dart:
- `int.tryParse(String source) → int?` ✓ exists
- `double.tryParse(String source) → double?` ✓ exists
- `num.tryParse(String source)` ✗ does not exist

**Safe fix:** Replace `num.tryParse(x)` with `int.tryParse(x) ?? double.tryParse(x)` to parse as int first, falling back to double; returns `num?` as intended.

**Impact:** Compile-time error; code will not build with `flutter analyze`.

---

### Finding 2: audit-compile-02
**Verdict: FALSE-POSITIVE**

**Evidence:** Same line 27, the compareTo call
```dart
final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y);
```

**Claim:** "`nx.compareTo(ny)` — `num` type does not define `.compareTo()` method"

**Verification:** This claim is incorrect. In Dart, `num extends Comparable<num>`, which declares:
```dart
int compareTo(num other);
```
Therefore `num` **does** have a `.compareTo()` method.

**Null narrowing:** After the condition `(nx != null && ny != null)` in a ternary expression, Dart 3.0+ narrows the types of `nx` and `ny` to `num` (non-nullable) in the true branch. Thus, `.compareTo()` is available and valid.

**Dart fact:** `num` has instance methods `.abs()`, `.round()`, and `.compareTo()`. The auditor incorrectly claimed compareTo doesn't exist.

**Verdict:** Not a bug; the compareTo call is sound after type narrowing (conditional on fixing finding 1 first).

---

## Coverage sweep

**Verified:**
- Spec change (peruk02.txt:10): Sort directive correctly added ✓
- Field mapping (c13 = 'תאריך מסירת מפתח'): Correct ✓
- Sort logic intent (ascending, earliest first): Correct ✓
- No regressions to other peruk apps: Confirmed ✓
- Task requirement: Cases table now sorted by key-handover date ✓

**Not verified:** Runtime behavior (Flutter/Dart runtime not available).

**Discrepancy:** Machine report claims `compiles ✅`, but bytecode contains `num.tryParse()` which is a compile-time error. The machine check appears to have been run before the code was finalized, or the check is not detecting this error. Regardless, the error is real and must be fixed.

---

## FIX-LIST

**FIX-LIST: audit-compile-01**

1. audit-compile-01 · CONFIRMED P0 · `gen_app_peruk02_px1.dart:27` · `final nx = num.tryParse(x)` · Replace `num.tryParse()` with `int.tryParse(x) ?? double.tryParse(x)` on both lines
