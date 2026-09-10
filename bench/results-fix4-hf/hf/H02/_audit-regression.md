# Audit Report: H02 (sechirut table sort by rent, descending)

## Findings

None — verified correct on all regression checks.

## Coverage Summary

**What was checked:**
1. **Spec change scope**: Only machtzev/generator/specs-ds/sechirut.txt line 22 modified (particle from `[טבלה]` to `[טבלה] | מיון: שכירות יורד`) ✓
2. **State leakage to other apps**: Verified that no other particle-plan*.json files changed; only particle-plan-sechirut.json updated with matching particle name and sort expr ✓
3. **Generated Dart code (gen_app_sechirut_px1.dart)**:
   - Sort applied to ForgeDataGrid items via `.toList()..sort((a, b) { ... })`
   - Sort field: `gen_app_sechirut_px1_c19 = 'שכירות'` (rent) ✓
   - Sort order: returns `-c` negating comparison ⇒ descending (highest first) ✓
   - Numeric handling: `num.tryParse(x), num.tryParse(y)` with correct null-coalescing ✓
   - Empty value handling: prioritizes non-empty records (`return x.isEmpty ? 1 : -1`) ✓
4. **Generated content file (gen_app_sechirut_px1_content.dart)**:
   - Particle name constant updated: `c6 = 'טבלה מיון שכירות יורד'` ✓
   - Sort field constant correct: `c19 = 'שכירות'` ✓
5. **Police gates (from _police.md)**:
   - `regen_ok`: ✅ generator ran without errors
   - `byte_identical_others`: ✅ no unintended files modified
   - `sort`: ✅ px1 — sort specification detected and applied
   - `desc`: ✅ px1 — descending keyword 'יורד' correctly recognized
6. **LEARNINGS.md**: New entry added documenting the feature (L2026-09-10-sort-particles-feature) with gate references and antipattern guidance ✓

**What could not be checked:**
- Runtime behavior in Flutter (Dart compilation and execution require flutter/dart tools not available in audit environment) — delegated to police gates and golden tests
- All other sechirut screens (ent1, ent2, ent3, ent4, home, etc.) — spot-checked px1; no indication of state leakage to entity/navigation screens based on spec-level change scope

**Result**: Spec change correctly propagated to generated artifacts; sort semantics sound; no regressions detected.
