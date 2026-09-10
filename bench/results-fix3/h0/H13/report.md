# Table Column Specification Task — Report

## What was done
Modified the panuy app to show only 4 specific columns in the people table by adding column specification to the table particle definition in the spec.

## The change
**File:** `machtzev/generator/specs-ds/panuy.txt`

**Before:**
```
חלקיק אדם: [טבלה]
```

**After:**
```
חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה
```

This syntax was already supported by the particle parser (`particles.mjs` lines 124-138) which allows specifying columns inline.

## How it works
The `shapeOf()` function in `particles.mjs` parses the table expression and extracts the column names:
- Line 133: `const cols = part.split(/[,،]/).map((x) => clean(x)).filter(Boolean).map((l) => F(l))`
- Returns: `{ kind: 'table', columns: [...], sort: null }`

The `particleWidgets()` function in `particles.mjs` (lines 402-409) then uses this:
- Line 403: `const cols = s.columns ? entity.schema.filter((f) => s.columns.includes(f.label)) : entity.schema;`
- Only includes columns that match the spec-defined list
- Generates table with only those columns in specified order

## Verification
1. **Spec parsing verified:** Test script confirms table shape has exactly 4 columns in correct order:
   ```
   "columns": ["שם", "זמין", "מרחק בקמ", "מחיר לשעה"]
   ```

2. **App regeneration successful:** Running `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin` produced:
   ```
   🧩 חלקיקים (הכרעה-27): 12/12 נמצאו-ומחווטים
   ✨ אפליקציה חוללה — 6 מסכים
   ```

3. **Generated code verified:** File `gen_app_panuy_px1_content.dart` line 2 shows:
   ```
   'טבלה שם זמין מרחק בקמ מחיר לשעה'
   ```
   And lines 3-10 define exactly these 4 columns.

## No breaking changes
- All 12 particles resolved successfully
- All 6 screens generated
- The table particle syntax leverages existing parser capability
- Other particles unchanged
- Entity schema unchanged (14 fields still available, just 4 shown in table)
