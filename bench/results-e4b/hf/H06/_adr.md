# ADR: Add price sorting to peruk12 cases table

## Context
Task requires the cases table in peruk12 app to be sorted by price (מחיר), cheapest first, with numeric comparison.

## Decision
Modified line 10 of machtzev/generator/specs-ds/peruk12.txt from:
```
חלקיק תיק: [טבלה]
```
to:
```
חלקיק תיק: [טבלה] לקוח, טלפון, מחיר | מיון: מחיר מהנמוך
```

This uses the native SPEC-LANG syntax (documented in SPEC-LANG.md line 17) which:
1. Specifies the table columns: client (לקוח), phone (טלפון), and price (מחיר)
2. Applies sorting via `מיון:` directive with `מהנמוך` (ascending = cheapest first)
3. The engine automatically treats מחיר as numeric per field name convention (line 11 of SPEC-LANG.md)

## Rationale
- **Spec-first approach**: The spec language already supports table sorting, no engine modification needed
- **Numeric comparison**: SPEC-LANG automatically infers מחיר as numeric type due to the word "מחיר" (price) in the field name
- **Byte-identical others**: Only peruk12 app modified; other apps remain byte-identical per protocol requirement
- **Ascending order**: Using `מהנמוך` (from low) achieves "cheapest first"

## Alternatives rejected
- Modifying app-ds.mjs or engine: Would violate byte-identity requirement for other apps
- Custom sorting logic in generated Dart: Spec language already provides this functionality

## Consequences
- Table will automatically display cases sorted by price ascending on generation
- The existing DsTable and ForgeDataTable atoms handle the rendering with sort semantics
- No breaking changes to other apps

## Verification
- [ ] Regenerated app successfully (done: 7 screens generated)
- [ ] Police check passes: byte_identical_others, compiles, gates_pass
- [ ] Table displays correctly sorted in numeric order
