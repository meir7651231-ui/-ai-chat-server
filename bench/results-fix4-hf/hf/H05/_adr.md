# ADR: Sort Peruk02 Cases Table by Key-Handover Date

## Context
The peruk02.txt spec defines an app with a "תיק" (cases/files) entity. The app displays cases in a table particle (חלקיק תיק: [טבלה]). The requirement is to sort this table by "תאריך מסירת מפתח" (key-handover date), earliest first.

## Decision
Modified line 10 of machtzev/generator/specs-ds/peruk02.txt from:
```
חלקיק תיק: [טבלה]
```

To:
```
חלקיק תיק: [טבלה] | מיון: תאריך מסירת מפתח עולה
```

## Rationale
- The spec language supports sorting syntax: `[טבלה] | מיון: <field> עולה|יורד`
- "עולה" means "ascending" (from spec-lang.data.json sortAsc list)
- The field "תאריך מסירת מפתח" is a date field marked with * in the entity definition, so it's a valid sort key
- This change is in the correct layer (spec .txt file, not generated code)
- The change is minimal and surgical — only adds sorting specification to the table particle

## Alternatives Considered
1. Add sorting in generated code (rejected: violates protocol rule to fix in spec layer only)
2. Use "מהנמוך" instead of "עולה" (rejected: both are equivalent for ascending order, "עולה" is more common)
3. Add multiple sort keys (rejected: not required by task, YAGNI)

## Consequences
- The generated app's table will now sort cases by key-handover date in ascending order (earliest first)
- No code changes needed in generated outputs
- The DsTable atom will use the sortLambda function to generate correct Dart sorting code

## Verification
- Police.mjs --fast will verify the spec parses correctly and generates without errors
- The table particle's sort field is passed to renderEntity in app-ds.mjs as r.sort
- The generated Dart code will include a sort comparator for the date field
