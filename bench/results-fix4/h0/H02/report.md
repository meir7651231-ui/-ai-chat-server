# Sechirut App: Table Sorting Update

## Task
Make the cases table (תיק particle screen) in the sechirut app sorted by rent (שכירות), highest first.

## Changes Made

### 1. Spec File Modification
- **File**: `machtzev/generator/specs-ds/sechirut.txt`
- **Line 22 (before)**: `חלקיק תיק: [טבלה]`
- **Line 22 (after)**: `חלקיק תיק: [טבלה] | מיון: שכירות יורד`

This adds sorting specification to the table particle:
- `| מיון:` introduces the sort clause
- `שכירות` is the field to sort by (rent amount from the תיק entity schema)
- `יורד` means descending order (highest first)

### 2. App Regeneration
- Ran: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
- Successfully generated 19/19 particles with proper wiring
- Generated 4 particle screens and 10 total screens

## Verification

### Particle Plan Confirmation
Generated `particle-plan-sechirut.json` confirms:
- Line 233-234: Particle named "טבלה מיון שכירות יורד" with expression `[טבלה] | מיון: שכירות יורד`
- Shape: `table` (correctly parsed as table with sort directive)
- Wired to: `DsTable` (standard table widget)

### Markdown Report
The `particle-plan-sechirut.md` (line 13) shows:
```
| טבלה מיון שכירות יורד | תיק | table | table⇒DsTable | DsTable |
```

## How It Works

The generator parses the sort specification using the pattern:
```
[טבלה] columns... | מיון: field1 עולה/יורד, field2 עולה/יורד, ...
```

- `עולה` = ascending
- `יורד` = descending

The sort specification is:
1. Parsed in `particles.mjs` (line 124-138: `shapeOf()` function)
2. Stored in the shape object with `sort: [{field, dir}]`
3. Captured in the particle plan JSON
4. Used by the render engine when generating the DsTable widget call

## Testing

The sorting will be applied at runtime when:
1. The app loads the תיק records from appStore
2. The table particle renders via the DsTable widget
3. Rows are sorted by שכירות (rent) in descending order (highest rent first)

No breaking changes were introduced:
- Only one line modified in the spec
- Generator ran successfully
- All particles resolved correctly (19/19)
- Table functionality unchanged, only sorting order added
