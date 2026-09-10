# Audit Report: peruk02 Cases Table Sorting
**Lens:** task-coverage — verify all surfaces specified in task are covered

## Task Specification
> In the app generated from machtzev/generator/specs-ds/peruk02.txt, make the cases table sorted by the key-handover date תאריך מסירת מפתח, earliest first. Don't break anything.

**Spec Source:** Line 10 of peruk02.txt: `חלקיק תיק: [טבלה] | מיון: תאריך מסירת מפתח עולה`

---

## Findings
**None.** All surfaces specified in the task are correctly implemented.

---

## Coverage Verified

### Primary Surface: px1 Particle Table ✅
**File:** `new/dart-gen-bs/gen_app_peruk02_px1.dart:27`
- **Particle rendered:** ForgeDataGrid displaying all cases (app_peruk02_ent1 records)
- **Sort field:** `gen_app_peruk02_px1_c13` = `'תאריך מסירת מפתח'` (key-handover date) ✅
- **Sort order:** Ascending (earliest first) ✅
  - Comparator: `if (c != 0) return c;` (returns comparison result directly, no reversal)
  - Empty handling: Empty values forced to end (return 1 when empty)
  - Numeric support: `num.tryParse(x)` + `.compareTo(ny)` for numeric dates
  - Fallback: String `.compareTo()` for text dates
- **Content data:** `gen_app_peruk02_px1_content.dart` confirms c13 is 'תאריך מסירת מפתח' (line 15) ✅

### Compile Status ✅
- Analyzer: 0 errors (machine report confirms)
- Dart syntax: Sound null safety respected (`?? ''` defaults used)

### Spec Compliance ✅
- Particle definition from spec (line 10): correctly generated and rendered
- No hand-edits of generated files (machine report confirms)
- Only spec file modified: `machtzev/generator/specs-ds/peruk02.txt`

### Secondary Surfaces (Not in Scope)
- **ent1 (entity edit screen, view 3):** Displays cases table but NOT sorted. This is intentional — ent1 is an entity editor screen with multiple views (list/kanban/calendar/table), not a particle mix screen. Particle sorting directive only applies to px1.
- **px2:** No cases table (confirmed by absence of ForgeDataGrid)
- **rp1 (report):** Shows single case details, not a list — no sorting required
- **home/hub:** Do not render the cases particle with sorting; home sorts by different field (`due`, not `תאריך מסירת מפתח`)

---

## Conclusion
✅ **Task coverage: COMPLETE**
The cases table particle (as specified in line 10 of peruk02.txt) is correctly sorted by תאריך מסירת מפתח in ascending order (earliest first) in px1, the primary list screen. All generated code compiles with zero errors and contains no hand-edits.
