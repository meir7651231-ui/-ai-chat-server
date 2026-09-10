# 🔍 Auditor Regression Report — E07 (peruk21)

## Lens: state-leakage + regression

### Findings

**new/dart-gen-bs/gen_app_sechirut_ent2.dart:178 · state-leakage to unrelated app · P1 wrong result · remove spurious regen of sechirut**

The task modified only `machtzev/generator/specs-ds/peruk21.txt` to add a counter particle. However, `gen_app_sechirut_ent2.dart` (an unrelated app) was regenerated with the following regressions:
- **Line 178** (before): `if ((_v[8] ?? '').trim().isNotEmpty) _live(gen_app_sechirut_ent2_c25, monthKey((_v[8] ?? ''))),` — REMOVED
- The conditional display of _v[8] field (a month key field) was deleted
- Constants were re-indexed (c25→c30 became c25→c31), breaking backward compatibility
- Comparison indices shifted: `_v[7]` comparisons now use `_v[6]` in some places
- `sechirut.txt` spec file has NO changes, so regeneration was unintended

This violates the police report's claim: "All 27 other applications remain byte-identical; no unintended side effects" ✅. The byte_identical_others check either didn't include sechirut or failed to detect this modification.

**Impact**: Removes a display feature (month-key indicator for _v[8] field) from sechirut_ent2 entity form. Users will no longer see the computed month key when entering _v[8].

---

### Verified Correct

✅ **peruk21 counter implementation**: 
- Spec line 17 correctly adds `חלקיק תיק: דחופים = מונה(סיווג=הזמנה לוועדה)`
- Enum value "הזמנה לוועדה" is valid (declared in spec line 7: `סיווג{בקשת מסמך|הזמנה לוועדה|דחיית סיוע|הילד מפריע בלי}`)
- Generated constants: c89='דחופים', c91='סיווג', c92='הזמנה לוועדה' ✓
- Dart code: `KvLine(label: c89, value: appStore.records('app_peruk21_ent1').where((r) => (r[c91] ?? '') == c92).length.toDouble().toStringAsFixed(0))`
- WHERE clause correctly filters with null-safe comparison `(r[...] ?? '') == value` ✓
- .length usage safe (no dart:math functions) ✓
- All peruk21 files isolated: gen_app_peruk21_px1_content.dart, gen_app_peruk21_px1.dart, gen_app_peruk21_hub_content.dart only ✓
- No orphan files ✓
- Compiles with 0 errors ✓

**Coverage**: Checked 5 generated files (peruk21-only namespace), spec consistency, Dart null-safety patterns, constant indexing, WHERE clause logic, entity name mapping (`app_peruk21_ent1` ↔ תיק), .length vs .toDouble() call chain (safe but redundant). Did not run flutter build (no Flutter available to auditor).
