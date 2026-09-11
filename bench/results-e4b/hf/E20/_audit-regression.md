# 🔴 Audit: State-Leakage Regression in E20 (panuy)

## Findings

`new/dart-gen-bs/gen_app_sechirut_ent2.dart:L1-end` · **State-leakage: sechirut app regenerated without spec change** · P1 (wrong result) · Investigate generator to prevent cross-app constant renumbering

`new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart:L25-31` · **Constant indices shifted: c25–c30 → c25–c31 with changed values** (c25: "מפתח חודש" removed, replaced by "חורג" duplicate) · P1 · Verify generator isolation for multi-app pipelines

---

## Coverage & Verification

**Checked:**
- Task completion: ✅ panuy spec line 17 added `חלקיק אדם: [פעולה] שלח הודעה` correctly
- Generated output: ✅ gen_app_panuy_px1.dart L13 comment and L47 button render (ProposePrimaryBtn with label c90="שלח הודעה")
- Label content: ✅ gen_app_panuy_px1_content.dart has correct labels c87="הזמן עכשיו" and c90="שלח הודעה"
- Police gate result: ✅ All gates passed per _police.md (regen_ok, compiles, gates_pass, action×2)

**NOT checked (Flutter/Dart not installed):**
- Runtime behavior: Does the new button navigate correctly? Does ProposePrimaryBtn vs BigButton work as intended?
- Actual UI rendering: Is the button visible and clickable on the people screen?
- Cascade effects: Do other screens in panuy work correctly with the new wiring?

**Regression detected (high confidence):**
- `git diff HEAD` shows ONLY sechirut_ent2 files changed in dart-gen-bs / dart-data-bs
- `machtzev/generator/specs-ds/sechirut.txt` is UNCHANGED
- Yet constants in gen_app_sechirut_ent2_content.dart were renumbered (c25–c30 shifted to c25–c31)
- Police report claims "byte_identical_others ✅" but sechirut_ent2 exists in the diff
- **Root cause:** Generator pipeline regenerated sechirut despite no change to its spec
- **Impact:** If the constant indices are now wrong, sechirut code will access stale constant IDs (e.g., old c26 value "חורג מול שליש" is now at c27, code still refers to old c26="תקין" but gets "תקין" at wrong semantics)

Example corruption in constants:
- Old: c26 = "חורג מול שליש" (meaning "exceeds")
- New: c26 = "תקין" (meaning "OK")
- Code that expected "exceeds" status will now read "OK", inverting business logic

