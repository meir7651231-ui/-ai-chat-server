# ADR: Add computed field מחיר עם אגרה (price with fee) to peruk12

## Context
Task requires adding a computed field to the תיק entity in peruk12.txt that calculates price × 1.03 (3% fee), computed by the app, not user-typed.

## Decision
Use spec-lang computed field syntax: add `מחיר עם אגרה = מחיר * 1.03` to the entity definition in line 7 of peruk12.txt.

## Rationale
- SPEC-LANG.md (line 12) defines computed fields as: `שם = <נוסחה>` with support for +, -, *, /, and functions
- This is the correct layer (spec, not engine), as the spec language supports formula fields
- Computed fields are rendered by the engine and computed by the app at runtime
- Keeps change minimal and isolated to peruk12

## Alternatives rejected
1. Add to engine (spec-lang.data.json) — not needed, syntax already exists
2. Create separate entity/field — unnecessary complexity
3. Edit generated Dart directly — violates protocol (no hand-edits in new/)

## Consequences
- peruk12 app will have new field on תיק entity
- Other apps remain byte-identical (app-ds.mjs --name flag ensures only peruk12 regenerates)
- Field will appear in UI, reports, and export

## Verification
- Machine check runs: byte_identical_others must pass
- App compiles: flutter analyze with no errors
- Field appears in app-peruk12 output

## Assumption for implementation
No gate needed (computed fields are standard syntax, already handled by generator)
