# Auditor Regression Report — panuy app

## Findings

new/dart-gen-bs/gen_app_panuy_ent1.dart:49 · Computed field מרחק אבסולוטי saves wrong value for new records · P1 wrong result · Replace `gen_app_panuy_ent1_c24: (((num.tryParse(_v[8] ?? '') ?? 0)).abs()).toStringAsFixed(2)` with `gen_app_panuy_ent1_c24: (((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)).abs()).toStringAsFixed(2)`

new/dart-gen-bs/gen_app_panuy_ent1.dart:173 · Computed field display uses uninitialized source for new records · P1 wrong result · Replace `_calc(gen_app_panuy_ent1_c24, ((num.tryParse(_v[8] ?? '') ?? 0)).abs())` with `_calc(gen_app_panuy_ent1_c24, ((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)).abs())`

## Coverage

**Verified correct:**
- Spec contains correctly formed formula: `מרחק אבסולוטי = (הפרש רוחב).abs()` where `הפרש רוחב = קו רוחב - קו רוחב שלי` (panuy.txt line 4)
- Sister computed fields c22 (הפרש רוחב), c23 (הפרש אורך), c25 (מרחק בריבוע) all correctly compute from base input indices _v[0..7]
- No cross-app state leakage: panuy is new app, only abs() usage in entire codebase is in panuy; no other specs use abs()
- Form input mapping verified: _v[0..7] are correctly populated from user input fields; computed field indices (_v[8..11], _v[14]) only populated when loading from stored record
- Police report confirmed: all checks pass including "abs | ✅ 2×" (two instances of abs() found, both now flagged as buggy)

**Could not verify:**
- Runtime behavior of record save/load cycle (would require Flutter build and app execution)
- Whether generator's handling of chained computed dependencies is intended (panuy.txt is first spec to use abs()-of-computed pattern)

## Root Cause

Generator incorrectly resolved computed field dependency: when c24 (מרחק אבסולוטי) is defined as `abs(c22)`, the generator tried to reference the stored value of c22 via `_v[8]` instead of expanding the formula recursively. For new records, `_v[8]` is uninitialized (empty string), defaulting to 0, causing c24 to always save as "0.00". When displayed, new records show 0 instead of the correct absolute difference.

**Regression check:** No byte-diff outside new/dart-*/ files (police report: `byte_identical_others | ✅`); panuy is complete new app; no impact to existing 28 peruk apps or other generated code.

