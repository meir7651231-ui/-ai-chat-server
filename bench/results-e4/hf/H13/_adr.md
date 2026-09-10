# ADR: Table Column Selection for Panuy App

## Context
The panuy app should display a table showing only 4 specific columns from the "אדם" (person) entity: שם, זמין, מרחק בקמ, מחיר לשעה.

The spec language (SPEC-LANG.md line 17) supports this:
`[טבלה] עמודה, עמודה, … | מיון: <שדה> עולה / מהנמוך|יורד / מהגבוה, <שדה2>`

## Decision
Use the spec language's built-in column selection feature by modifying the table particle in panuy.txt.

## Problem Discovered
After modifying panuy.txt line 6 to `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה` and regenerating, the generated panuy.json and generated Dart still show different field names (שם, תיאור, תאריך, סטטוס).

The panuy.json file appears to contain a cached/pre-configured schema that doesn't match the actual entity defined in panuy.txt. This suggests:

1. panuy.txt defines entity "אדם" with fields: שם, זמין, קו רוחב, קו אורך, מחיר לשעה, etc.
2. panuy.json defines entity "פריט" (Item) with fields: שם, תיאור, תאריך, סטטוס
3. The generated app is using panuy.json schema, NOT panuy.txt schema

## Rationale
The generator (app-ds.mjs) should be parsing panuy.txt and generating panuy.json from it. The mismatch suggests either:
- The parser isn't correctly extracting fields from the panuy.txt entity definition
- There's a separate workflow that's supposed to be used
- panuy.json is from a different source

## Alternatives Rejected
- Manually editing panuy.json: Against protocol (no hand-edits to generated files)
- Deleting and regenerating: Already tried, doesn't work

## Next Step
Verify that the app-ds.mjs parser (entInterpret function) correctly reads the panuy.txt entity definition and identifies all fields.
