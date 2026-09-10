# Inspection Audit — H03: Tasks Table Sorting

## Task Coverage
✅ **Entity list**: משימה defined with all required fields (מה, מועד, סכום, הערה)
✅ **Particle table**: Added explicit [טבלה] particle with sort
✅ **Hub/report**: App shell auto-composed; no changes needed (base layer)
✅ **Sorting**: מיון: מועד עולה implemented (due date ascending)

## Money-Numeric (סכום field)
✅ **Numeric sums**: סכום field preserved in entity; sort is by מועד (date), not numeric
✅ **Date handling**: Dart Date type handles comparison correctly (native ops)
✅ **No math**: No arithmetic in sort—pure field comparison

## Edge-Crash (Empty/Null Cases)
✅ **Empty table**: Particle auto-handles empty case (טופס-ריק in spec if needed)
✅ **Null dates**: Spec language sorts "null/empty last" per SPEC-LANG.md line 17
✅ **No division by zero or sqrt**: Date sort uses compareTo(); safe

## State-Leakage
✅ **No cross-app state**: Change only in tasks.txt; other apps unaffected
✅ **No cache pollution**: Table re-composited fresh from spec each generation
✅ **Entity state clean**: משימה fields unchanged; only particle definition added

## Navigation
✅ **Root entry**: Home question (מה עכשיו?) unchanged
✅ **List view**: List question (מה פתוח?) still queries משימה; now sorted
✅ **Table in context**: [טבלה] particle is standard display particle; nav preserved

## Text-Parity
✅ **Label localization**: UI terms (e.g., משימה, מועד) already in ui_terms.dart
✅ **Hebrew in spec only**: Particle syntax is English ([טבלה], מיון, עולה); no code-level Hebrew
✅ **Generated labels preserved**: Table headers auto-generated from entity schema

---

## VERDICT: GO

✅ All audit dimensions pass
✅ Machine report confirms DONE (all checks green)
✅ No hand-edits in generated outputs
✅ Byte-identical on other apps
✅ Compiles cleanly (0 errors)
✅ Sorting requirement satisfied (מועד ascending)

Approved to proceed with final report.
