# ADR: Add computed field תקרה מחייבת to בטוחה entity

## Context
Add a computed field equal to the max of two existing ceilings in the בטוחה entity.

## Question (ג.1 opening)
Should תקרה מחייבת be stored in the database or calculated on each render?

## Decision & Assumed Answer
**Calculated on each render** (no storage mutation, purer design). The field is derived from two other computed fields that are already in the spec. Storing it would create redundancy and sync risks.

## Rationale
- Eliminates redundant storage
- Formula is simple: max(תקרה לפי 3 חודשים, תקרה לפי שליש)
- Matches the pattern of other computed fields in the spec (חורג מול 3 חודשים, חורג מול שליש)

## Alternatives rejected
- Storing as separate mutable field: adds complexity, risks inconsistency with source fields

## Consequences
- No breaking changes to existing computed fields
- Generated Dart code will include the formula for conversion to Hebrew rendering
- The field will appear on any report/particle that references it (need to verify nothing breaks)

## Verification
- Run police check
- Verify spec parses without errors
- Check that generated code includes the new field
- Run tests and confirm no test failures
