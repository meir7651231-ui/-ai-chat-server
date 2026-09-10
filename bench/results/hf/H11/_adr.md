# ADR — Adding תקרה נמוכה Field

## Opening Question (per MASTER_PROTOCOL.md §ג.1)

**מה:** Add computed field `תקרה נמוכה` to entity `תיק` in sechirut.txt
**מקור:** Task H11
**מה המטרה:** Provide a single ceiling field that respects the legal minimum (smaller of two statutory thresholds)
**תרגום:** Add one computed field to spec, app generates the min(a, b) calculation
**helper נדרש:** None (pure min operation, handled by app generator)
**מחרוזות:** None (all Hebrew text already in spec)
**חסום:** None

## Assumed Answer

The field should be added to `תיק` entity definition in sechirut.txt as a computed field following the pattern of existing fields (תקרה לפי 3 חודשים, תקרה לפי שליש).

Syntax: `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)`

This is a pure data operation with no side effects, no UI changes, and no state machine impact.
