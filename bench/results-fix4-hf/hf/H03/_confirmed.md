# ✅ Validator Report: Tasks Sort H03

## Summary
- **Machine claims**: 4 ✅ CONFIRMED (regen_ok, byte_identical_others, gates_pass, sort=px1)
- **Audit findings**: 1 (from _audit-regression.md)
  - **1 CONFIRMED** documentation defect (P2 - minor)
  - **0 FALSE-POSITIVES**
  - **0 ADJUST**

---

## Finding Verification

### ID: REG-2026-09-10-sort-misleading-docs
**Verdict: CONFIRMED**

**File:line**: `machtzev/LEARNINGS.md:5` + `machtzev/LEARNINGS.md:9`

**Evidence**:
- Claim at line 5: `sortLambda מטפל בתאריכים ובמספרים אוטומטית` (sortLambda handles dates and numbers automatically)
- Claim at line 9 (RULE): `המנוע (sortLambda) יזהה שדה-תאריך וישמור על סדר חודש/יום/שנה` (The engine will identify date fields and preserve month/day/year order)
- Actual implementation in `machtzev/generator/sort-cmp.mjs:8-10`:
  ```javascript
  const cmp = ev
    ? `final o = [${evList}]; final c = o.indexOf(x).compareTo(o.indexOf(y));`
    : `final nx = num.tryParse(x), ny = num.tryParse(y); final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y);`;
  ```
  This shows: enum index comparison OR (numeric parse if both succeed) OR lexicographic fallback. **No field type detection. No special date handling.**

**Why confirmed**: sortLambda has no field-type awareness and no date-specific logic. It relies entirely on data format: ISO dates work because YYYY-MM-DD sorts lexicographically correctly; Hebrew-formatted dates ("15 בספטמבר") would fail silently.

**Severity**: P2 (minor) — functional task works correctly for ISO dates; documentation misleads future developers into believing sortLambda is smarter than it is.

**Fix**: Revise LEARNINGS.md line 5 header and lines 9-10 RULE to clarify:
- sortLambda has no special date handling — works only if dates are in ISO format (YYYY-MM-DD), numeric timestamps, or enum values.
- sortLambda does not detect field types from schema — it compares values generically: try numeric parse first, else lexicographic.
- Sorting by date field requires dates stored in sortable format; the engine does not normalize formats.

**Safe to fix?**: Yes — documentation-only change, no code paths, no tests affected.

---

## Functional Verification (All Passed ✅)

- **Task requirement**: Make tasks table sorted by מועד (due date), soonest first.
- **Spec layer**: `machtzev/generator/specs-ds/tasks.txt:7` correctly declares `| מיון: מועד עולה` ✓
- **Generated sort lambda**: `new/dart-gen-bs/gen_app_tasks_px1.dart:18` returns `c` (not `-c`) = ascending = soonest first ✓
- **Field mapping**: `gen_app_tasks_px1_c5 = 'מועד'` ✓
- **Null handling**: Empty dates pushed to end ✓
- **Dart syntax**: Valid — `.isEmpty`, `.tryParse()`, `.compareTo()` all exist ✓
- **No regressions**: All gates passed, byte-identical other files ✓

---

FIX-LIST: REG-2026-09-10-sort-misleading-docs
