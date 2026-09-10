# INSP-H15 — Sort cases by deadline (עד מתי)

**תאריך:** 2026-09-10
**שלב:** [BUILD LOOP]
**diff-scope:** machtzev/generator/specs-ds/peruk21.txt (2 lines modified)

## ממצאים

| מזהה | תיאור | חומרה | סטטוס |
|---|---|---|---|
| sort_ent | Entity list (ent1) sorts cases by deadline ascending (soonest first) | MAJOR | FIXED |
| sort_px | Particle screen (px1) table sorts cases by deadline ascending (soonest first) | MAJOR | FIXED |

## בדיקת-לולאה
No repeated findings from prior reviews.

## בדיקת-Checklists

### FND — יסודות
- FND-01: ✅ flutter analyze — 0 errors (via police-bench)
- FND-02: ✅ No duplicate IDs (auto-generated)
- FND-04: ✅ No new providers (sorting is spec-level)
- FND-08: ✅ No logic in build() - sorting is generated at compile time

### FRM — מסגרת
- FRM-01: ✅ No layout changes
- FRM-02: ✅ No new dialogs/screens (sort is within existing screens)
- FRM-04: ✅ No new tools/dials

### WIR — חיווט
- WIR-02: ✅ No mutations in build() - sorting is data transformation only
- WIR-04: ✅ No new buttons/wiring

### VRB — Verbatim
- VRB-01: ✅ No new Hebrew strings (using existing "עד מתי" field)
- VRB-02: ✅ Sort word "עולה" (ascending) is per spec-lang

### OPS — אופרציות
- OPS-01: ✅ flutter analyze — No issues found
- OPS-02: ✅ regen_ok: Regeneration succeeded
- OPS-03: ✅ byte_identical_others: Only spec file edited
- OPS-04: ✅ gates_pass: All gates pass
- OPS-06: ✅ No hand edits in generated code (spec-first approach)
- OPS-07: ✅ sort_px + sort_ent checks pass

## บันทึก

**Approach:** Modified peruk21.txt spec in two places:
1. Entity definition: Added `| מיון: עד מתי עולה` to sort entity records
2. Particle definition: Added `| מיון: עד מתי עולה` to sort particle table

This leverages the existing generator infrastructure (entity.mjs, particles.mjs, sort-cmp.mjs) which already supports sorting. No manual Dart code changes needed.

**Key evidence:**
- ent1.dart line 153: `rs.sort((a, b) { ... final x = a[gen_app_peruk21_ent1_c24] ... })` where c24 = "עד מתי"
- px1.dart line 31: `appStore.records(...).toList()..sort((a, b) { ... final x = a[gen_app_peruk21_px1_c7] ... })` where c7 = "עד מתי"

**Byte-identity:** peruk21.txt is the only changed file in the spec layer; all generated outputs are deterministic regenerates.

## VERDICT: GO
