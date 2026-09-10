# Audit Regression Report — M14 (panuy)

## Findings

**new/dart-gen-bs/gen_app_sechirut_ent2.dart:29 · Unintended modification to sechirut app — field index mismatch · P1 regression** 
Field references in labels, validation, and display logic changed from `gen_app_sechirut_ent2_c26/c28` to `gen_app_sechirut_ent2_c27/c29`. Task specified adding stages only to panuy, not sechirut. The sechirut spec (specs-ds/sechirut.txt) was unchanged (HEAD-identical), yet the בטוחה entity (ent2) content file changed from "10 שדות" to "10 שדות · 3 שלבים" (lines 1–3 of diff: c25–c31 renumbered, c25 shifted from "מפתח חודש" to "חורג", and c1 claims 3 stages where none exist in spec). 

**Root cause:** Either (a) the generator made an unwanted side-effect mutation to sechirut on panuy regen, (b) stages were secretly added to בטוחה entity in sechirut.txt but git diff does not show it, or (c) the police "byte_identical_others ✅" claim did not actually verify sechirut. The code clearly shows `gen_app_sechirut_ent2.dart` has 25 lines of logic changes (field indices, validators, display maps, CSV export, form state). This violates the task scope (panuy only).

Concrete failure: `_labelsAll` list line 29 changed from `…gen_app_sechirut_ent2_c26` (was "חורג מול שליש") to `…gen_app_sechirut_ent2_c27` (now "חורג מול שליש" at new index). Validation line 47: `miss.add(gen_app_sechirut_ent2_c29)` became `miss.add(gen_app_sechirut_ent2_c30)`. Form map line 51: `gen_app_sechirut_ent2_c26: ''` became `gen_app_sechirut_ent2_c27: ''`. All 25 changed lines reference the wrong constant indices, indicating the generator regenerated sechirut when it should not have.

**new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart:1–31 · String constants renumbered — entity summary claims stages that don't exist in spec · P1 data inconsistency**
`c1` changed from `'10 שדות'` to `'10 שדות · 3 שלבים'`. בטוחה entity in `specs-ds/sechirut.txt` line 8 contains no `| שלבים:` clause (spec-first doctrine, CLAUDE.md L2026-09-10). Constants `c25–c31` were renumbered: `c25` went from `'מפתח חודש'` to `'חורג'`; `c26–c30` shifted rightward; `c31` added as `'טווח ערבות בנקאית'` (was `c30`). The renumbering cascades through 7 constant definitions, affecting all downstream code that references them.

## Coverage

**Verified correct:**
- panuy.txt spec is sound: line 4 correctly reads `| שלבים: פנוי, הוזמן, בוצע` ✓
- panuy generated content file (gen_app_panuy_ent1_content.dart) correctly reflects 3 stages at c32–c34 ✓  
- panuy Dart files generated and compile with no errors (police: compiles ✅) ✓
- No orphan files in panuy outputs ✓
- LEARNINGS.md L2026-09-10 correctly documents spec-first stages doctrine ✓

**Could not verify (read-only audit):**
- Whether the three quarantined files (ship.mjs, tighten-types.mjs, one.mjs) were intentionally blocked by protocol or if they represent a different issue (they were gutted and replaced with blocking errors; the police report does not explain this)
- Whether the sechirut.txt file was stealthily modified in a way git diff does not detect
- The actual regen command that was run and its output (only the diff results are visible; the machine log is not readable by this audit)

## Conclusion

The task has a **scope breach**: sechirut app was unintentionally modified. The police "byte_identical_others ✅" claim is **unconfirmed** — the diff shows sechirut was changed. This is a P1 regression that violates the task boundary and the machine's own pass/fail criteria.
