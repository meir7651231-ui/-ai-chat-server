# Peruk17 Cases Table Sort Fix

## Task
Sort the cases table in the app generated from `machtzev/generator/specs-ds/peruk17.txt` alphabetically by סיווג (classification), without breaking anything.

## Solution
Modified the peruk17.txt spec file in two ways:

### 1. Added Sort Specification
Added sorting directive to the table particle:
```
חלקיק תיק: [טבלה] | מיון: סיווג עולה
```
This tells the generator to sort the table by סיווג field in ascending order.

### 2. Reordered Enum Values Alphabetically
Changed the entity field definition from:
```
סיווג{השלמת מסמכים|דחייה לגופה|זימון ועדה|נגמר השעון}
```
to alphabetical order (Hebrew ד→ה→ז→נ):
```
סיווג{דחייה לגופה|השלמת מסמכים|זימון ועדה|נגמר השעון}
```

This ensures enum-based sorting follows alphabetical order.

## Verification
- ✅ Regenerated app using: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk17.txt --name peruk17 --skin`
- ✅ Generated Dart code contains sort lambda with correct enum order
- ✅ Table sort implementation: `sort((a, b) { ... o = [c8, c9, c10, c11] ... })` 
  where c8=דחייה לגופה, c9=השלמת מסמכים, c10=זימון ועדה, c11=נגמר השעון
- ✅ No syntax errors in generated code
- ✅ Backward compatible: existing data values unchanged, only display order affected

## Impact
The cases table in peruk17 now displays sorted alphabetically by סיווג field. The form and other UI elements reflect the new alphabetical enum order throughout the app.
