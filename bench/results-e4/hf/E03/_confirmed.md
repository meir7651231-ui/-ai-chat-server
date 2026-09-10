# 🔍 Validator Report — E03 (peruk12) · Computed Field Task

## Findings

**1. STATE-LEAKAGE CROSS-APP CORRUPTION (P0) — CONFIRMED**
- **Verdict:** CONFIRMED
- **Evidence:** new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart · Constants c25–c31 were reordered despite machtzev/generator/specs-ds/sechirut.txt unchanged (0 diff). OLD: c25='מפתח חודש', c26='חורג מול שליש', c27='חורג', c28='תקין', c29='טווח פיקדון', c30='טווח ערבות'; NEW: c25='חורג', c26='תקין', c27='חורג מול שליש', c28='חורג', c29='תקין', c30='טווח פיקדון', c31='טווח ערבות'.
- **Breakage:** new/dart-gen-bs/gen_app_sechirut_ent2.dart line 91 (card display) and lines 47–48 (validation errors) reference these constants. Constant labels now misaligned: validation error at line 47 uses c30 (now 'טווח פיקדון') for field `_v[1]` which may not be deposit; display logic line 91 computes comparison results but shows wrong labels (old c25='מפתח חודש' was semantically wrong, but new c25='חורג' only makes sense if both operands fixed — they were not, only constants changed).
- **Root:** Generator regenerated sechirut_ent2 without sechirut.txt change (state mutation). Spec fidelity broken.
- **Fix:** Regenerate sechirut_ent2 from unmodified spec, or audit whether sechirut.txt is the real source-of-truth (if not, update TRUTH-INDEX).

**2. PERUK12 TASK — VERIFIED CORRECT**
- **Verdict:** FALSE-POSITIVE (no bug in peruk12 itself)
- **Evidence:** machtzev/generator/specs-ds/peruk12.txt:7 correctly defines `מחיר עם אגרה = מחיר * 1.03`. Generated Dart (new/dart-gen-bs/gen_app_peruk12_ent1.dart:48, 173) implements formula `(num.tryParse(_v[3] ?? '') ?? 0) * 1.03` with safe null-coalescing and `.toStringAsFixed(2)` formatting. Police: calc_fee ✅ (1 const + 1 calc), compiles ✅ (0 errors), regen_ok ✅. All auditors pass on peruk12 core.
- **Judgment:** Peruk12 computed field task completed correctly. The bleeding into sechirut_ent2 is a generator/protocol issue, not a task defect.

---

## Summary

**Task completeness:** Peruk12 computed field `מחיר עם אגרה` is correctly designed, generated, and compiles. ✓

**Blocker:** STATE-LEAKAGE to sechirut_ent2 constants (P0). Unrelated app corrupted without spec change. This violates spec-fidelity invariant (TRUTH-INDEX, law-2). Must be fixed before ship.

**Police report limitation:** `byte_identical_others` gate only checks peruk1–28, not other apps (sechirut, balagan, etc.). Cross-app consistency not validated.

---

## FIX-LIST

1. **STATE-LEAKAGE (P0):** Verify sechirut.txt on disk against HEAD; if unchanged, regenerate sechirut app (sechirut.txt) alone to restore byte-identity of sechirut_ent2_content.dart and sechirut_ent2.dart. If sechirut.txt was intentionally edited off-the-record, document in DECISIONS (new decision log entry).

2. **(Optional enhancement):** Extend police gate `byte_identical_others` to validate ALL generated app _content.dart files (not just peruk1–28) to catch future cross-app mutations.
