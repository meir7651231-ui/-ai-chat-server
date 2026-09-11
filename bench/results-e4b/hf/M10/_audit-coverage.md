# Auditor Coverage Report · calendar.txt M10 — numeric + computed fields

**Lens:** Task-coverage audit — all surfaces touched by the task must be complete and consistent.

**Task:** Add to meeting entity:
1. Numeric field `משך בדקות` (duration in minutes)
2. Computed field `משך בשעות` = `משך בדקות / 60` (duration in hours)

---

## Findings

No defects found. ✅

---

## Coverage Verified

**Spec layer:**
- ✅ `machtzev/generator/specs-ds/calendar.txt` line 6: Both fields in spec syntax (`משך בדקות, משך בשעות = משך בדקות / 60`)
- ✅ `machtzev/generator/spec-lang.data.json`: "דקות" added to `typeNum` array to register as numeric keyword

**Generated app metadata:**
- ✅ `machtzev/generator/apps/calendar.json` root.fields: Both fields present (lines 64–73)
  - משך בדקות: type "num", required false ✅
  - משך בשעות: type "num", required false ✅
- ✅ Entity count: '7 שדות · 2 שלבים' in both c1 (ent1_content) and hub_content ✅

**Generated content (labels):**
- ✅ `new/dart-data-bs/auto/gen_app_calendar_ent1_content.dart`
  - Line 16: `gen_app_calendar_ent1_c14 = 'משך בדקות'` ✅
  - Line 17: `gen_app_calendar_ent1_c15 = 'משך בשעות'` ✅

**Generated form screen:**
- ✅ `new/dart-gen-bs/gen_app_calendar_ent1.dart`
  - Line 31: `_labelsAll` includes c9–c15 (all 7 fields) ✅
  - Line 51: _save() computes and stores: `gen_app_calendar_ent1_c15: ((num.tryParse(_v[5] ?? '') ?? 0) / 60).toStringAsFixed(2)` ✅
    - Input: _v[5] = user's minutes value (string)
    - Formula: safe null-coalescing (`?? 0`), division by 60, formatted to 2 decimals
    - Output: stored as computed value
  - Line 62: _edit() loads both values from record into _v[5] and _v[6] ✅
  - Lines 156–164: Form layout with 6 input fields + 1 computed display
    - Line 162: Input field for משך בדקות (c14 → _v[5]) ✅
    - Line 163: Display widget _calc(c15, formula) shows computed value read-only ✅
  - Line 91–92: _card() displays all 7 fields in record cards ✅
  - Line 98–100: CSV export includes all 7 columns ✅
  - Line 175: Table (DataGrid) view includes all 7 columns ✅

**Hub summary:**
- ✅ `new/dart-data-bs/auto/gen_app_calendar_hub_content.dart` line 4: c4 = '7 שדות · 2 שלבים' ✅

**Machine report validation:**
- ✅ `_police.md`: regen_ok ✅, dart_math_sane ✅, compiles ✅
- ✅ calc check: consts=1 calc=1 (one constant + one calculation detected) ✅
- ✅ No analyzer errors reported

---

## Summary

**Task completion:** ✅ 100%
- Both fields added: numeric input + computed derived field
- Formula correct and safe: `(num.tryParse / 60).toStringAsFixed(2)`
- All surfaces updated: form input, calculated display, list cards, table, CSV export, hub summary, app spec
- No breakage: machine reports all checks pass, zero analyzer errors
- Field count correct: subtitle reflects '7 שדות · 2 שלבים' everywhere

**What was checked:** Spec syntax, type registry, app metadata, content labels, form input/display logic, form layout (6 inputs + 1 readonly calc), card display, CSV/table export, hub summary, metadata consistency, formula syntax and type safety, machine police report.

**What could not be checked:** Runtime behavior (no Flutter environment); user experience during edit/save cycle (form interaction verified structurally only).

