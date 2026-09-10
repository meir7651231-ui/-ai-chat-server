# Regression Audit: Tasks Table Sort Implementation (H03)

## Findings

### 1. machtzev/LEARNINGS.md line 5 · Misleading claim about sortLambda date handling · P2 (minor) · Clarify that sortLambda has no special date-type awareness

**Defect**: The learning entry claims "sortLambda מטפל בתאריכים ובמספרים אוטומטית" (sortLambda handles dates and numbers automatically), but `machtzev/generator/sort-cmp.mjs:10` shows sortLambda generates only generic comparison: `num.tryParse()` or lexicographic `.compareTo()`. It has no date-type detection or special handling for Hebrew-formatted dates.

**Why this matters**: Future developers reading this learning may assume sortLambda intelligently handles date formats, when in fact it relies on dates being in sortable format (ISO YYYY-MM-DD or numeric). If dates were stored in Hebrew text ("15 בספטמבר"), sorting would fail. The claim obscures this dependency.

**Reality check**: DsDateField (new/dart-ui-bs/ds/ds_date_field.dart:19) stores dates in ISO format `YYYY-MM-DD`, which sorts correctly lexicographically. The sort works, but the learning overstates what sortLambda does.

**Fix**: Revise LEARNINGS.md line 6 RULE to state: "מיון לשדה תאריך יעבוד אם התאריך באחד מן הפורמטים שמתמיינים כראוי: ISO (YYYY-MM-DD), timestamp מספרי, או enum. sortLambda עצמו עיוור לסוג שדה — מיומן רק אלגוריתם ההשוואה (מספרי > מחרוזת)."

---

## Coverage

### ✅ Verified correct (no regressions detected):

- **Particle generation (gen_app_tasks_px1.dart)**: Sort lambda correctly generated on line 18 with ascending order (סדר עולה), empty-last handling, numeric-then-lexicographic comparison. Syntax is valid Dart.

- **Sort specification parsing**: Spec `[טבלה] מה, מועד, סכום, הערה | מיון: מועד עולה` correctly parsed in particle-plan-tasks.json:5, ascending order (`עולה`) mapped to `desc=false`, sort applied only to the משימה particle (no cross-app contamination).

- **No shared state mutation**: Only modified files are `machtzev/generator/specs-ds/tasks.txt` (new particle line) and `machtzev/LEARNINGS.md` (documentation). No changes to `sort-cmp.mjs`, `particles.mjs`, or shared schema. All 5 cross-references to `app_tasks_ent1` in other generated files are expected navigation/metadata in balagan (gen_balagan_*.dart), not functional regressions.

- **Data format fit**: ISO date storage (verified in DsDateField.dart) ensures lexicographic sort order matches temporal order. No date format incompatibility.

### ❌ Could not verify (tools unavailable):

- **Runtime behavior**: Actual table rendering and sort order in flutter app (would require buildsmart + flutter test).
- **Dart type inference**: Whether `DsTable` widget correctly interprets the generated sort lambda as `(Map<String,String>, Map<String,String>) → int`.
- **Empty data edge case**: Behavior when all dates in table are empty (police report confirms gate passed, but gates are compile-time structural checks, not data-driven).

---

## Verdict

**One minor documentation defect, zero functional regressions.**
