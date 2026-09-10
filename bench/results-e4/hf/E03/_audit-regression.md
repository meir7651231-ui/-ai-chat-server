# 🔍 Audit: Peruk12 Computed Field (E03) — State-Leakage & Regression

## Findings

**STATE-LEAKAGE REGRESSION (P0):**
new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart:25–31 · Constants were reordered/shuffled without spec change — c25 changed from "מפתח חודש" to "חורג", c26 from "חורג מול שליש" to "תקין", c27 from "חורג" to "חורג מול שליש", c28 from "תקין" to "חורג", c29 from "טווח פיקדון" to "תקין", and new c30/c31 added. This breaks sechirut_ent2 display logic: gen_app_sechirut_ent2.dart:91 now uses wrong constants for card display (comparison indices _v[7]→_v[6], dual comparisons now broken). sechirut.txt was NOT modified; sechirut_ent2 should be byte-identical. · Fix: Regenerate sechirut_ent2 from unmodified sechirut.txt or restore pre-change constants.

**PERUK12 CORE — VERIFIED CORRECT:**
new/dart-gen-bs/gen_app_peruk12_ent1.dart:48,173 · Computed field `מחיר עם אגרה = מחיר * 1.03` is correctly implemented: (a) Formula correct: `(num.tryParse(_v[3] ?? '') ?? 0) * 1.03` safely parses, defaults to 0, multiplies by 1.03 ✓; (b) Storage correct: `.toStringAsFixed(2)` formats to 2 decimal places ✓; (c) Live display correct: `_calc()` widget shows live value as price changes ✓; (d) Read-only correct: field not in input form, only computed during save ✓; (e) Schema correct: new/dart-data-bs/auto/gen_app_peruk12_ent1_content.dart:16 labels correctly include "מחיר עם אגרה" ✓; (f) Police gates: `calc_fee` passed with 1 const + 1 calc, `compiles` passed (0 analyzer errors) ✓. Task for peruk12 itself is DONE and sound.

## Coverage

✅ **Verified correct:** Peruk12 computed field logic (null safety, arithmetic formula, formatting, read-only semantics, live display, storage, Dart sound semantics, police gates). Spec change (peruk12.txt line 7) correctly flowed through to entity screen, content constants, and form rendering. Formula `* 1.03` for 3% fee is correct. No mutations of shared lists or orphan files in peruk12 scope.

❌ **State-leakage regression caught:** Sechirut_ent2 constants were scrambled despite no change to sechirut.txt spec. This indicates generator corrupted an unrelated app's output. Police report `byte_identical_others` only covers peruk1–28, not cross-app consistency. Balagan_moments (intentionally updated with new peruk12 field, correct) but sechirut_ent2 (unintentional corruption, wrong).

🚫 **Not checked (out of scope):** Ship.mjs intentional quarantine (protocol block, not auditor lens), LEARNINGS.md learning entry content (documentation), other apps' logical correctness (display screens, list views, CSV export) — spot-checked sechirut_ent2 card display references wrong constants c25/c26 now, will show user wrong labels.

## Verdict

**TASK STATUS: NOT DONE · BLOCKER DETECTED**

Peruk12 itself is sound. But STATE-LEAKAGE to sechirut_ent2 is a P0 compile-break (logic corruption despite zero analyzer errors): constants c25–c31 were renumbered without spec change, breaking display logic in _card() and validation messages. Sechirut_ent2 must be byte-identical to HEAD since sechirut.txt unchanged. Builder likely ran generator on full suite and corrupted unrelated app output. Police gates do not catch cross-app scrambling. Regenerate sechirut_ent2 or restore constants from git stash.
