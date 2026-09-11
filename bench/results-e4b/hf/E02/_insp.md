# Inspection Checklist: Add Priority Field to Case Entity

**Task:** Add עדיפות{גבוהה|בינונית|נמוכה} to תיק entity in peruk02.txt

## Audit Lenses

**task-coverage:** ✅ Priority field added to case entity; spec syntax valid (closed choice with 3 Hebrew values); generator accepted and emitted Dart code with field name.

**money-numeric:** ✅ No numeric fields involved; priority is pure enum (not money-related).

**edge-crash:** ✅ No empty enum values; all three priority levels present (גבוהה=high, בינונית=medium, נמוכה=low). Closed choice prevents invalid inputs.

**state-leakage:** ✅ New field is entity-local (תיק); no cross-entity side effects. Field stored as string, loaded via appStore.

**navigation:** ✅ Priority field appears in record cards and forms as enum field; existing navigation (edit/list/board/calendar views) automatically wire enum dropdown.

**text-parity:** ✅ No Hebrew text changes to existing fields; only new field added with consistent naming (field:עדיפות, values:גבוהה/בינונית/נמוכה).

## VERDICT: GO

- Spec regenerated: peruk02 field count 9→10 ✅
- Dart code generated with priority constant ✅
- No hand-edits in generated files ✅
- Other peruk apps unchanged ✅
- Compiler acceptance confirmed ✅
