# ADR-E03 · Computed Field in Spec Language

**Status:** Accepted (Complete)
**Date:** 2026-09-10
**Related:** spec-lang, app-ds generator, peruk12.txt

## Context

Task: Add a computed field `מחיר עם אגרה` (price with fee) to the `תיק` entity in peruk12.txt that calculates price × 1.03 without manual user input.

## Decision

Implemented the computed field using spec-lang syntax: `שדה = <נוסחה>` inline in the entity definition. The formula `מחיר * 1.03` is placed in the field list after the base price field.

```
ישות תיק עם ... מחיר, מחיר עם אגרה = מחיר * 1.03, ...
```

## Rationale

1. **Spec-lang coverage:** The computed field syntax is already defined in SPEC-LANG.md (line 12), supporting arithmetic operations with operator precedence and safe numeric handling.
2. **Generator integration:** app-ds.mjs parses the formula and passes it to render-ds, which generates type-safe Dart: `(num.tryParse(...) ?? 0) * 1.03`.
3. **No breaking change:** Only peruk12.txt was edited; all other apps remain byte-identical. The generator correctly handles the new field without re-running other specs.
4. **Data persistence:** Computed value is stored in the record map; persists across save/load cycles.

## Alternatives rejected

1. **Hardcoding in Dart:** Would require manually editing generated files, violating L6 (generator is source of truth).
2. **Server-side computation:** Out of scope; this app is offline-first.
3. **Field display without storage:** Would lose data on record save; not acceptable for numeric fields.

## Consequences

- `מחיר עם אגרה` appears in entity forms, cards, tables, and export CSV.
- The field is read-only (computed from price field; no input widget).
- Precision: 2 decimal places via toStringAsFixed(2) on save.
- Empty price input safely defaults to 0, resulting in 0.00 fee.

## Verification

✅ Generator ran successfully: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk12.txt --name peruk12 --skin`
✅ Generated Dart includes formula: `_calc(gen_app_peruk12_ent1_c14, (num.tryParse(_v[3] ?? '') ?? 0) * 1.03)`
✅ No other specs affected; byte-identical verification passed.
