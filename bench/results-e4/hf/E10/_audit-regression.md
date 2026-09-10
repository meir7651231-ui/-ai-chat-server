# 🔍 Audit: Regression & State-Leakage — panuy task (E10)

## ⚠️ CRITICAL FINDINGS

**new/dart-gen-bs/gen_app_sechirut_ent2.dart:29 · constant index drift · P0 wrong result · revert sechirut.txt from task modification**

**Summary:** The sechirut app (which has NO spec change) was regenerated with shifted string constant indices. The Dart code now references `gen_app_sechirut_ent2_c27` instead of `gen_app_sechirut_ent2_c26`, and validation uses `c30/c31` instead of `c29/c30`. The underlying constants in the content file also shifted: at HEAD, c25='מפתח חודש', c26='חורג מול שליש', c27='חורג', c28='תקין', c29='טווח פיקדון'; in working tree: c25='חורג', c26='תקין', c27='חורג מול שליש', c28='חורג', c29='תקין', c30='טווח פיקדון', c31='טווח ערבות בנקאית'. This indicates the generator re-indexed all constants when panuy was added, even though sechirut.txt is byte-identical to HEAD. This is unintended state leakage.

**Affected locations:**
- gen_app_sechirut_ent2.dart:29 `_labelsAll` now ends with `c27` not `c26`
- gen_app_sechirut_ent2.dart:47-48 validation error messages changed from `c29/c30` → `c30/c31`
- gen_app_sechirut_ent2.dart:50 field map now includes `c27: ''` (not in HEAD)
- gen_app_sechirut_ent2.dart:62 `_edit()` index 9 now loads `c27` not `c26`
- gen_app_sechirut_ent2.dart:91 `_card()` display logic now uses misaligned constant indices
- new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart entire constant list reindexed

**Root cause:** The generator does not isolate each app's constant numbering. When panuy.txt was added, it likely contributed new content constants that shifted the indices for all downstream apps. The sechirut spec did NOT change (confirmed byte-identical), so its generated code should NOT have changed.

**Impact:** User-facing: the values displayed in sechirut_ent2 screen may be incorrect (wrong fields mapped to wrong indices). The compilation passes but behavior is broken.

---

## ✅ VERIFIED CORRECT

**panuy app only:** 
- New spec `machtzev/generator/specs-ds/panuy.txt` correctly defines the person entity אדם with field ותק בשנים(0..77) — range constraint is properly articulated.
- Generated `new/dart-gen-bs/gen_app_panuy_ent1.dart` properly:
  - Line 31: includes `gen_app_panuy_ent1_c20` (ותק בשנים) in `_labelsAll` array at index 7
  - Line 49: validates range `0 <= n <= 77` with error message constant `c33` = 'טווח ותק בשנים (0–77)'
  - Line 172: renders the field as ForgeDsField with index 7 matching validation
  - Line 51: saves the field with index mapping `7 → c20`
- Generated content file correctly labels the new field with localized strings.
- No orphaned files: all gen_app_panuy_*.dart files correspond to the spec.
- Flutter analyzer shows zero errors for panuy-generated code.
- All gates (syntax, contract, wiring) report passed for panuy.

**What was checked:**
- Range constraint syntax validation (0..77 parsed and enforced)
- Field presence in entity declaration ✓
- String constant references in generated Dart ✓
- Compilation and type safety (zero analyzer errors) ✓
- No orphan particles or screens ✓

**What could not be checked (no runtime):**
- Actual app behavior at runtime (e.g., form accepts valid/rejects invalid input)
- Integration between panuy and other apps (state store isolation)
- Display rendering accuracy

---

## Machine Report vs. Reality

The police report claims **byte_identical_others** ✅ and states "All other apps remain byte-identical; no unintended changes to other specs." **This claim is FALSE.** The git diff clearly shows gen_app_sechirut_ent2.dart was modified from HEAD, and the content constants were reindexed. The police machine's check did not catch this regression.

---

## Recommendation

**Revert:** The generator should emit constants per-app (isolated namespaces) or use a stable numbering scheme that does not re-index when new apps are added. For this task, the panuy spec is sound, but its integration broke sechirut. Do not merge this change as-is.
