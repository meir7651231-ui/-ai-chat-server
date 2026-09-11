# Audit Report: Email Field Addition to Sechirut App

## Findings

### P0: UNTRACKED ORPHAN FILES - Panuy App Generated Unexpectedly
**File:** `git status` output · new/dart-gen-bs/gen_app_panuy_*.dart (13 files) + new/dart-data-bs/auto/gen_app_panuy_*_content.dart (12 files) untracked
**Defect:** Builder regenerated gen_app_panuy namespace files that were not part of the task scope (task was sechirut-only). These orphaned files now sit untracked and should either be committed or cleaned.
**Severity:** P1 (task not done correctly — state leaked beyond scope)
**Fix:** Investigate whether panuy was intentionally regenerated or if builder ran generator on all specs. If unintended, clean with `git clean -fd new/dart-gen-bs/gen_app_panuy* new/dart-data-bs/auto/gen_app_panuy*`.

---

## Verified Correct ✓

### Email Field Integration (Sechirut - ent1: תיק)
- **Form rendering:** Email field at index [2] renders correctly as ForgeDsField in form (line 196, gen_app_sechirut_ent1.dart)
- **Field label & constant:** gen_app_sechirut_ent1_c11 = 'אימייל' correctly placed between טלפון (c10) and עיר (c12) in spec and generated content
- **Mandatory fields validation:** Correctly checks _v[0] (לקוח*), _v[4] (שכירות*), _v[5] (חודשים*) — email is not required ✓
- **Save mapping:** Email stored as gen_app_sechirut_ent1_c11 → _v[2] ✓
- **Edit loading:** Email loaded back correctly in _edit() as _v[2] ✓
- **Table display:** Email column included in table view (line 219, columns list includes c11) ✓
- **CSV export:** Email included in CSV header and row export ✓
- **Record card display:** Email shown in DsRecordCard labels ✓

### Calculations (Sechirut - ent1)
- **שכירות לשנה (c27):** Formula _v[4] * 12 uses correct index (שכירות) ✓
- **תקרה לפי 3 חודשים (c28):** Formula _v[4] * 3 ✓
- **תקרה לפי שליש (c29):** Formula _v[4] * _v[5] / 3 uses correct indices (שכירות * חודשים / 3) ✓
- **No division-by-zero:** All num.tryParse calls provide ?? 0 fallbacks ✓

### Constant Renumbering Cascade
- **Sechirut ent1 content:** Constants c9–c29 generated correctly; c11 properly represents אימייל
- **Sechirut ent2 content:** Constants renumbered (c24 shift to c27, c26 shift to c29) consistent with ent1 shift, no duplicates ✓
- **Sechirut ent2 calculations:** Formula indices updated correctly (line 217 board view, line 219 table view both use updated constants)

### Spec Changes
- **specs-ds/sechirut.txt:** Email field inserted in correct position (between טלפון and עיר) in entity definition ✓
- **apps/sechirut.json:** Email field object added with type:'text', required:false ✓
- **LEARNINGS.md:** New entry L2026-09-10-sechirut-e01 correctly documents field-type-inference rule for Hebrew text fields ✓

### No Regressions in Other Sechirut Entities
- **ent3 (ממצא):** Not changed — no email field needed ✓
- **ent4 (תשלום):** Not changed — no email field needed ✓
- **px1, root, hub screens:** Updated only to sync constant renumbering; no logic change ✓

---

## Coverage

✅ **Checked:**
- Form field rendering and indices (ent1 lines 194–199, 196 for email)
- Mandatory field validation logic (ent1 lines 47–49)
- Save/load round-trip (ent1 _save/_edit lines 53, 65)
- Table and card display (ent1 lines 106, 219)
- CSV export (ent1 line 122)
- All calculations (ent1 lines 205–207; ent2 computed fields)
- Constant definitions match usage (ent1_content c11 vs c9 baseline; ent2_content c24 vs c27 shift)
- Spec syntax and JSON validity

❌ **Not Checked (Dart compiler/runtime):**
- Flutter compilation & type analysis (requires flutter analyze)
- Runtime state mutations during save/edit
- Unit tests for email validation (none generated; regex per LEARNING)
- Data persistence in appStore
- Cross-app references from other specs

---

## Conclusion

Task **partially complete**: Email field correctly integrated into sechirut תיק entity with proper form, table, and CSV rendering. **However, untracked panuy files indicate scope creep or uncontrolled regeneration.**  Builder should clean orphaned panuy artifacts or document why they exist.
