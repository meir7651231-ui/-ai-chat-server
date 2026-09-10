# 🔍 VALIDATOR REPORT — E13 (peruk12)

## Auditor Findings Analysis

| Finding ID | Verdict | Evidence | Fix |
|---|---|---|---|
| audit-compile:48 | CONFIRMED | new/dart-gen-bs/gen_app_peruk12_ent1.dart:48 `((num.tryParse(_v[3] ?? '') ?? 0) / (num.tryParse(_v[4] ?? '') ?? 0)).toStringAsFixed(2)` — When _v[4] (קילומטראז׳) is empty, tryParse→null→0; numerator 5000 ÷ 0 = Infinity; Infinity.toStringAsFixed(2) throws RangeError at runtime | Guard denominator before division: `final denom = num.tryParse(_v[4] ?? '') ?? 0; final result = denom == 0 ? '0.00' : ((num.tryParse(_v[3] ?? '') ?? 0) / denom).toStringAsFixed(2)` |
| audit-compile:174 | CONFIRMED | new/dart-gen-bs/gen_app_peruk12_ent1.dart:174 `_calc(gen_app_peruk12_ent1_c15, (num.tryParse(_v[3] ?? '') ?? 0) / (num.tryParse(_v[4] ?? '') ?? 0))` — Same divide-by-zero produces Infinity/NaN; _calc line 131 calls `.toStringAsFixed(2)` which crashes | Apply same denominator guard before division; or add check in _calc: `final num v_safe = v.isFinite ? v : 0.0` before `.toStringAsFixed(2)` |
| audit-regression:48 | CONFIRMED | Same as audit-compile:48 — divide-by-zero on Infinity/NaN with .toStringAsFixed(2) crash when קילומטראז׳ empty | Guard denominator: check `denom != 0` before division |
| audit-regression:174 | CONFIRMED | Same as audit-compile:174 — divide-by-zero in display calculation path | Apply denominator guard |
| audit-coverage:general | FALSE-POSITIVE | _audit-coverage.md claims "No defects identified" and "Formula uses safe `num.tryParse` with defaults". This is wrong. The LEARNINGS.md entry L2026-09-10-formula-computed at line 857 explicitly acknowledges the divide-by-zero risk: "divide-by-zero: empty denominator field ⇒ tryParse → 0 → 0 in numerator ÷ 0 = Infinity or NaN", contradicting its own claim in line 58 that the edge case is "documented as safe". Dart semantics: Infinity.toStringAsFixed(N) and NaN.toStringAsFixed(N) both throw RangeError; 0÷0=NaN (not 0.00 as the learning misclassifies). Coverage audit misread both the code and the learning document. | Coverage audit's verification is invalid; auditors compile & regression are correct |

## Machine Report Validation

`./_police.md` shows all checks ✅ (compiles, regen_ok, gates_pass, etc.). These do NOT catch runtime divide-by-zero: Dart's static analyzer permits `Infinity` and `NaN` as valid `num` values; only `.toStringAsFixed()` on these special values throws at runtime. Machine checks are correct ✅; auditor compile & regression correctly found the runtime bug that static analysis misses.

## Dart Facts Applied

- `num.tryParse("")` → `null` ⇒ `null ?? 0` → `0`
- `5.0 / 0` → `Infinity` (valid num)
- `0.0 / 0` → `NaN` (valid num)
- `Infinity.toStringAsFixed(2)` → **RangeError: Infinity can't be represented as a String with toStringAsFixed**
- `NaN.toStringAsFixed(2)` → **RangeError: -Infinity can't be represented as a String with toStringAsFixed**

Both error paths are reachable: user enters price without kilometers, or leaves both empty, or enters kilometers without price.

---

**FIX-LIST:**
1. P0 — new/dart-gen-bs/gen_app_peruk12_ent1.dart:48 divide-by-zero crash when קילומטראז׳ is empty; guard with `if (denom == 0) return '0.00'`
2. P0 — new/dart-gen-bs/gen_app_peruk12_ent1.dart:174 same divide-by-zero in display path; apply same guard before passing to _calc or add `.isFinite` check in _calc method
