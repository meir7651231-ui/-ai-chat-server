# Audit: Distance Sorting & sqrt Calculation (panuy)

## FINDINGS

### 1. **P0 (TASK NOT DONE)** — sqrt calculation missing
**File:line:** new/dart-gen-bs/gen_app_panuy_ent1.dart:49  
**Defect:** The "מרחק בקמ" (distance in km) field is assigned empty (`_v[11] ?? ''`) instead of calculating sqrt of squared distance. The specification requires `מרחק בקמ = sqrt(מרחק בריבוע)`, but the generated code contains NO sqrt call.  
**Severity:** P0 — Task requirement not met; users see empty distance values, cannot sort meaningfully  
**Fix:** Replace `gen_app_panuy_ent1_c25: _v[11] ?? ''` with calculated formula: `gen_app_panuy_ent1_c25: (sqrt((num.tryParse(map[gen_app_panuy_ent1_c24] ?? '0') ?? 0).toDouble()) ?? 0).toStringAsFixed(2)`

### 2. **P1 (WRONG RESULT)** — Sorting by squared distance, not actual distance
**File:line:** new/dart-gen-bs/gen_app_panuy_px1.dart:34  
**Defect:** Table row sorting compares `a[gen_app_panuy_px1_c15]` and `b[gen_app_panuy_px1_c16]`, both resolving to "מרחק בריבוע" (squared distance). Task requires sorting by actual distance ("מרחק בקמ"). Sorting by squared distance gives same order but violates the spec ("distance shown is the real distance in km").  
**Severity:** P1 — Sort produces wrong result (ascending squared distance ≠ ascending actual distance when values differ)  
**Fix:** Change sort field to "מרחק בקמ" label, using the correct constants from px1_content

### 3. **P2 (STYLE VIOLATION)** — Hebrew in engine code
**File:line:** machtzev/generator/particles.mjs:387  
**Defect:** Automatic sort-field detection uses regex `/^(מרחק|distance)/` with Hebrew field name. CLAUDE.md §8 "no_hebrew_in_engine" rule — engine code must not embed domain-specific strings.  
**Severity:** P2 — Minor; violates generator discipline but does not break functionality  
**Fix:** Replace Hebrew pattern with language-neutral fallback: detect by label type/prefix (e.g., `startsWith('מרחק')` → use column position instead of label text)

---

## COVERAGE VERIFIED

✅ **Checked:**
- Entity calculation logic (ent1.dart _save method, line 49) — confirmed no sqrt
- Particle table sorting logic (px1.dart, line 34) — confirmed wrong field indices
- Specification requirement (panuy.txt line 4) — confirmed `sqrt(מרחק בריבוע)` required
- Formula compiler (render-ds.mjs) — confirmed attempted to add sqrt support but never called in output
- Machine report (police.md) — confirmed `sqrt: ❌ import=false fn=false method=false` + `sort_ent ❌ sortlines=0`
- Import paths (render-ds.mjs ~375) — import statement added but not verified in generated code

✅ **Could not check (read-only):**
- Runtime behavior (field actually empty or contains value)
- End-to-end sort verification (would require running app with test data)
- Whether other Dart files in build broke (limited to panuy scope)

---

## VERDICT
**NOT DONE**: Two task requirements failed — sqrt never executes (P0), and sort uses wrong field (P1). Task asks for "sorted by distance (nearest first)" with "real distance in km (square root)" — both missing.
