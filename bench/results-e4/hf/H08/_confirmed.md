# VALIDATOR REPORT — panuy task H08

## Findings by Severity

### P1: LOGIC BUG — Computed Field Uses Wrong Variable

**Finding 1a: new/dart-gen-bs/gen_app_panuy_ent1.dart:51**
- **Verdict:** CONFIRMED
- **Evidence:** Line 51: `gen_app_panuy_ent1_c23: (_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )).toStringAsFixed(2),`
- **Root Cause:** Formula references `_v[8]` (stored הפרש רוחב from previous save) instead of computing `abs(_v[2] - _v[4])` from live input fields. When creating new record, `_v[8]` undefined → tryParse('') → null → 0 → abs(0)=0 (wrong). When editing and user changes latitude fields, the saved value still uses stale `_v[8]`.
- **Impact:** (1) New records always persist מרחק אבסולוטי=0 even if latitude differs from my latitude by non-zero amount. (2) Editing existing record and changing latitude inputs doesn't recalculate the absolute distance on save.
- **Fix:** Replace line 51 formula from `(_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ))` to `(_m_abs( ((num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0)) ))`

**Finding 1b: new/dart-gen-bs/gen_app_panuy_ent1.dart:174**
- **Verdict:** CONFIRMED
- **Evidence:** Line 174: `_calc(gen_app_panuy_ent1_c23, _m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )),`
- **Root Cause:** Same as 1a — live display uses `_v[8]` instead of computing fresh from input fields
- **Impact:** Live calculated display shows stale value; doesn't update when user modifies latitude fields in form
- **Fix:** Replace line 174 from `_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )` to `_m_abs( (num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0) )`

### P2: SCOPE ISSUE — Out-of-Band Modifications to Unrelated App

**Finding 2: new/dart-gen-bs/gen_app_sechirut_ent2.dart (unstaged)**
- **Verdict:** CONFIRMED
- **Evidence:** git status shows " M" prefix (unstaged changes); field constants renumbered (e.g., c26→c27, c29→c30). Content file similarly modified.
- **Root Cause:** Generator pipeline invoked with scope broader than panuy-only; sechirut app regenerated despite task scope
- **Impact:** Scope contamination. Unstaged modifications confirm out-of-scope regeneration. Police check byte_identical_others passed because it only examines staged/committed changes, not working-tree uncommitted modifications.
- **Fix:** Restore sechirut files to HEAD state (git checkout -- new/dart-gen-bs/gen_app_sechirut_ent2.dart new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart) to keep scope clean

---

## Audit Findings Status

| Auditor | Finding | Verdict |
|---|---|---|
| _audit-compile.md | c23 uses _v[8] at lines 51/174 instead of direct computation | **CONFIRMED P1** |
| _audit-coverage.md | Same formula bug; impacts save + live display + all consumers | **CONFIRMED P1** |
| _audit-regression.md | sechirut files regenerated (unstaged); scope too broad | **CONFIRMED P2** |

---

## Machine Report Alignment

Police report claims: `abs | ✅ 1×` (abs function used 1× in panuy). **VERIFIED:** Line 17 defines `_m_abs` helper; used once at line 51 and once at line 174 — count=1 in generated output (both calls are substitutions of same formula pattern). Police report passes because checks are static (compilation, syntax, file boundaries); logic errors that compile are not caught.

---

## FIX-LIST

1. new/dart-gen-bs/gen_app_panuy_ent1.dart:51 · CONFIRMED P1 · Line 51 `gen_app_panuy_ent1_c23: (_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ))` uses _v[8] instead of computing abs((_v[2] - _v[4])) · Replace with `(_m_abs( ((num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0)) ))`

2. new/dart-gen-bs/gen_app_panuy_ent1.dart:174 · CONFIRMED P1 · Line 174 `_calc(gen_app_panuy_ent1_c23, _m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ))` uses _v[8] instead of computing fresh from _v[2]/_v[4] · Replace with `_calc(gen_app_panuy_ent1_c23, _m_abs( (num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0) ))`

3. new/dart-gen-bs/gen_app_sechirut_ent2.dart · CONFIRMED P2 · Unstaged scope contamination (field renumbering); sechirut regenerated out-of-scope · Restore to HEAD state
