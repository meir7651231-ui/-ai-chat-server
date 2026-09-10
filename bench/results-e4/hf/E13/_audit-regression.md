# Audit Report: peruk12 Computed Field Formula

## Findings

new/dart-gen-bs/gen_app_peruk12_ent1.dart:48 · divide-by-zero: formula `מחיר / קילומטראז׳` produces Infinity when kilometers (denominator) is empty but price (numerator) is filled; when both empty produces NaN; `.toStringAsFixed(2)` converts these to string "Infinity"/"NaN" not numeric "0.00" · P1 · guard with `if (denom == 0) return '—'` or add validation that denominator must be >0 when numerator is filled

new/dart-gen-bs/gen_app_peruk12_ent1.dart:174 · same divide-by-zero in display calculation: `_calc()` widget will show "Infinity" or "NaN" when formula encounters division by zero · P1 · same guard needed in display path

## Coverage Verified

✓ **State leakage check:** No cross-contamination to other peruk apps (peruk01–peruk28); grep for קילומטראז׳/מחיר לקמ returns matches only in peruk12 files.

✓ **Orphan files:** No orphan gen_app_peruk12_*.dart files; all 13 generated screens are present (audit, behavior, ent1, flags, home, hub, main, px1, root, rp1, scr2, settings, shell).

✓ **Regression in data files:** Content constants properly incremented; gen_app_peruk12_ent1_content.dart correctly defines c0–c22 with 8 fields (c9–c17) and 5 stages (c18–c22).

✓ **Substring over-triggering:** Formula pattern ` = ... / ` does not match other peruk specs; only sechirut has similar pattern but its denominator (חודשים) is required (*), not optional.

✓ **Read-only enforcement:** Computed field c15 is correctly displayed via read-only `_calc()` widget, never in editable input field (good).

✓ **Type mismatch:** Type declared as "num" in peruk12.json correctly matches computation output (num.toStringAsFixed returns string, stored as string in DB).

✓ **Field ordering:** _v indices [0–7] map correctly to the 8 entity fields; computed field uses indices [3,4] for mחיר/קילומטראז׳ from user input, not from stored value (correct pattern).

---

**Summary:** One genuine P1 bug (divide-by-zero with Infinity/NaN output when optional denominator is empty). No state leakage, no orphans, no regressions to other apps. Computed field logic is structurally sound, only needs divide-by-zero guard.

