# ADR-H14: Findings Table Sorted by Color Severity

**Status:** Accepted  
**Date:** 2026-09-10  
**Related:** Task H14, `machtzev/generator/specs-ds/sechirut.txt`

## Context

The sechirut (tenancy contract review) app displays a table of findings (ממצא) with a severity color field (צבע). Users need findings displayed in severity order: red (אדום) → yellow (צהוב) → green (ירוק), to quickly see critical issues first.

## Decision

Added entity-level sorting directive to the spec-lang definition of the ממצא (findings) entity:
```
| מיון: צבע עולה
```

This directive is parsed by entity.mjs and passed to render-ds.mjs, which generates a sort lambda that orders records by the enum declaration order of the צבע field.

## Rationale

1. **Enum declaration order matches requirement:** The color enum is defined as `{אדום|צהוב|ירוק}`, which is exactly the desired sort order.
2. **Engine support exists:** The render-ds.mjs engine already supports entity-level sorting via `sortLambda`, which generates efficient comparator code.
3. **Spec-first approach:** Rather than hardcoding sorting in generated Dart, the sort specification is declarative in the spec file, making it maintainable and consistent across future regenerations.
4. **Minimal code change:** Only one line edited in the spec; no hand-edits to generated code.
5. **Byte-identical others:** No other apps affected; the sort directive is app-specific.

## Alternatives Rejected

1. **Manual sorting in Dart code:** Would violate "no hand-edits" protocol; defeats regeneration contract.
2. **Custom sort field:** Would require adding a numeric sort key, complicating the data model.
3. **UI-only grouping (current behavior in px3):** Doesn't sort the table view; only works for particle screen sections.

## Consequences

- Findings table (ent3) now displays rows sorted by color severity in both list and table views.
- Search-filtered results remain sorted (sort applied after filter).
- CSV export includes sorted records.
- Sort order is stable and declarative — survives app regeneration.
- No runtime performance impact (sort happens on filter, not on every render).

## Verification

Machine report confirms:
- ✅ `sort_color` check passes (ent3 sorting verified)
- ✅ `byte_identical_others` passes (no collateral changes)
- ✅ `compiles` passes (generated Dart is valid)
- ✅ All gates pass (no schema or contract violations)
