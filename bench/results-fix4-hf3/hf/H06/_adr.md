# ADR: Sort Cases Table by Price (Numeric, Cheapest First)

## Context
In the app generated from `peruk12.txt`, the cases table is created by line 10: `חלקיק תיק: [טבלה]`.
The table displays תיק (case) entities which have a מחיר (price) field.
Currently, the table has no explicit sort order (defaults to insertion/creation order).

## Opening Question
**Should sorting be expressed at the spec level (in peruk12.txt) or at the engine level (in app-ds.mjs rendering logic)?**

## Assumed Answer
**Spec-first approach**: If the spec language (SPEC-LANG.md) allows specifying sort order for tables, use that.
If not, the sorting logic belongs in the Dart rendering layer (DsTable, DsTodayItem, or the table generator).
Since this is a single app change, modifying engine logic for this app should be acceptable per the protocol (byte-identical for other apps).

## Decision
1. First, check SPEC-LANG.md to see if sorting syntax exists
2. If not, add sorting at the engine level for this app's table rendering
3. Ensure sort is numeric (int/double) not lexicographic (string)
4. Verify via `flutter analyze` before final police check

## Verification Plan
- Byte-verify the generated Dart contains numeric sort logic
- Run machine police report to confirm no byte-identical violations
- Test the actual table display (conceptually - no Flutter runtime available)
