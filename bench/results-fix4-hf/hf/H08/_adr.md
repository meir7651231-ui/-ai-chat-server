# ADR: Add מרחק אבסולוטי computed field to panuy.txt

## ג.1 · Opening Question (with assumed answer)

**מה:** Add a computed field `מרחק אבסולוטי` (absolute distance) to the person entity in `machtzev/generator/specs-ds/panuy.txt`

**מקור:** task H08 — spec-based generator for data schema

**תרגום ל-dial:** N/A (data model change, not UI)

**helper נדרש:** `abs()` function already available in Dart/native; field is computed (formula in spec)

**מחרוזות verbatim:** All field names in Hebrew as specified in task

**חסום (⛔):** None — this is pure data schema addition

---

## ג.2 · 10-Step Decomposition

1. **Requirement:** Add field `מרחק אבסולוטי` computed as `abs(הפרש רוחב)`
2. **Sources:** `panuy.txt` spec (line 4), uses existing field `הפרש רוחב` as input
3. **Pattern check:** Computed fields already exist in the spec (e.g., `מרחק בריבוע`, `מרחק בקמ`); this follows the same pattern
4. **Design:** Field definition: `מרחק אבסולוטי = abs(הפרש רוחב)` using abs formula
5. **Verify bytes:** Read spec, locate insertion point, append new field definition
6. **Run generator:** Invoke the generator to see if field is wired into the Dart output
7. **Check analyze:** `flutter analyze` on the generated code — 0 errors
8. **Wire check:** Verify field appears in the rendered output (test or grep)
9. **Test:** If tests exist for this spec, ensure all pass
10. **Verify claim:** Byte-check that the new field exists in both the spec and generated output

---

## Context
The `panuy.txt` file uses a declarative language for defining entities and their computed fields.
The task is to add a new computed field for absolute latitude difference.
No breaking changes expected as we're only adding a new field.

## Decision
Add the field as a new line in the entity definition using the existing `abs()` formula pattern.

## Rationale
- Consistent with existing computed fields in the spec
- Uses built-in `abs()` function
- No new dependencies or complex logic

## Alternatives rejected
- Inline in particle definitions (wrong layer — should be entity-level)
- As a separate particle (redundant — field already exists at entity level)

## Consequences
- New field will be available in generated Dart classes
- Any UI particles that want to display absolute distance can use this field
- Generator pipeline must run successfully with the new field

## Verification
- Spec file updated with new field
- Generator pipeline runs without errors
- Machine report shows DONE
