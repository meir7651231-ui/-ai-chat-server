# 🔍 Audit Report — M05 (peruk21 message particle)

## Findings

**new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart:27** · State-leakage: unrelated app (sechirut) regenerated when only peruk21 should change — constants c25–c30 renumbered to c25–c31, constant c25 value changed from "מפתח חודש" to "חורג", adding c31 "טווח ערבות בנקאית (0–1000000)" · P1 wrong-result · Revert sechirut_ent2 regeneration and re-run generator limiting scope to peruk21 only

**new/dart-gen-bs/gen_app_sechirut_ent2.dart:29** · State-leakage: same unrelated app regenerated — line 29 label array updated from c26 to c27 (renumbering), line 47–48 validation constants shifted (c29→c30, c30→c31), line 59 _edit field mapping updated with c27 index · P1 wrong-result · Revert sechirut_ent2 regeneration

---

## Coverage

**Verified Correct:**
- ✅ Task spec requirement met: message particle תשובה added to peruk21 case screen with סיווג field binding
- ✅ Content template correct: "קיבלתי, הסיווג: " (with placeholder {ערך} compiled in) in new/dart-data-bs/auto/gen_app_peruk21_px1_content.dart:107
- ✅ Particle plan correctly generated: shape="message", ops=[switch, alert], properly wired to ForgeMustChip + DsNote
- ✅ Dart compilation passes (analyzer errors = 0)
- ✅ No orphaned files (gen_* with no spec)
- ✅ No Hebrew in engine code path
- ✅ Math operations use num.tryParse (sound null-safety)

**Could Not Check:**
- Runtime behavior of message particle (Flutter not installed)
- Whether sechirut changes are legitimate side-effect of shared regeneration vs. bug (requires understanding generator invariants)

---

## Verdict

**Task completion: ✅ Done** — peruk21 message particle properly added, compiles, content correct.

**Quality: 🔴 P1 state-leakage blocking** — Generator inadvertently regenerated unrelated app (sechirut_ent2) causing constant renumbering and logic changes outside scope. Police report marked "byte_identical_others ✅" but claim is false. Both affected files must be reverted before merge.
