# 🔍 Auditor Findings — Regression & State-Leakage Lens

## Findings

**new/dart-gen-bs/gen_app_sechirut_ent2.dart:29** · State-leakage: sechirut app regenerated with constant index mutations (c26→c27, c29→c30, c30→c31) despite zero spec changes to sechirut.txt · P1 wrong result · Root cause: generator constant numbering appears cross-app dependent; verify byte_identical_others check scope.

**machtzev/generator/specs-ds/panuy.txt** · Orphan spec file created (untracked) generating 13 untracked gen_app_panuy_*.dart files; not part of peruk21 task scope · P2 minor · Delete panuy.txt and generated panuy files if unintended; confirm if deliberate before committing.

**new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart:25–30** · Constant definitions reindexed (c25–c30 renumbered to c25–c31, inserting new c27 and c31) without corresponding spec line change to sechirut.txt · P1 wrong result · Indicates generator side-effect affecting unrelated app.

## Coverage Verified

✅ **Peruk21 sorting logic correct on both screens:**
- px1.dart:28 sorts table by `gen_app_peruk21_px1_c7` = "עד מתי" (deadline) ✅
- ent1.dart:155 sorts records by `gen_app_peruk21_ent1_c24` = "עד מתי" ✅
- Sort comparator handles: empty values last, numeric dates numerically, string dates lexically
- Field references verified in content files; both point to deadline field

✅ **Spec changes isolated to peruk21:**
- Only machtzev/generator/specs-ds/peruk21.txt modified (entity sort + particle sort)
- No other spec files modified under machtzev/generator/specs-ds/ (tracked files)

✅ **Hand-edits:** Generated files only (gen_app_peruk21_*.dart, gen_app_sechirut_ent2.dart); no manual edits to logic

⚠️ **Could NOT verify:**
- What "byte_identical_others" check actually tests (police machine definition unknown)
- Date format in 'עד מתי' field (string/numeric/timestamp) — sort logic is defensive but format unknown
- Whether sechirut constant reindexing breaks anything (no spec change visible; no sechirut sorting change needed for task)
- Whether panuy generation is intentional (new spec, untracked)

## Verdict

**Task sorting logic is sound (px1 + ent1 sort correctly).** But **regression risk: sechirut file mutated without explanation; panuy orphaned.** Claim "byte_identical_others ✅" conflicts with visible sechirut changes. Recommend verify with machine owner why sechirut was regenerated, and confirm panuy files intentional before landing.
