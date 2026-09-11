# Computed Field Addition Report: מחיר עם אגרה

## Task Summary
Added a computed field `מחיר עם אגרה` (price with fee) to the `תיק` (case) entity in `peruk12.txt` that calculates the price times 1.03 (a 3% fee).

## Changes Made

### 1. **Spec File Update** (`machtzev/generator/specs-ds/peruk12.txt`)
- **Line 7** (entity definition): Added the computed field using the spec language syntax
- **Before**: `ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, מה המוכר אמר, האם נסעת | שלבים ...`
- **After**: `ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, מחיר עם אגרה = מחיר * 1.03, מה המוכר אמר, האם נסעת | שלבים ...`

### 2. **Generator Enhancement** (`machtzev/generator/app-ds.mjs`)
- **Line 302**: Added `formula` property to the field serialization
- **Before**: `fields: rootE.schema.map((f) => ({ label: f.label, type: f.type || 'text', required: !!f.required, enumVals: f.enumVals || [] }))`
- **After**: Added `, formula: f.formula || null` to preserve formula data in the app spec JSON

## Verification

All checks passed:

1. **Spec Parsing**: Entity definition correctly contains the formula
2. **App Spec JSON**: Formula is properly stored as `"formula": "מחיר * 1.03"`
3. **Formula Validation**:
   - References the correct source field: `מחיר`
   - Uses correct operator: `*`
   - Uses correct multiplier: `1.03`
4. **Entity Structure**: All 7 expected fields present, no regressions
5. **Police Check**: No new failures introduced (existing git object issues unrelated)

## How It Works

The computed field:
- Is defined in the spec file using the Hebrew spec language syntax: `שדה = נוסחה`
- Is parsed by `entity.mjs` which extracts and validates the formula
- Is now preserved in the app spec JSON output via the `app-ds.mjs` generator
- Will be used by the Dart code generator to create a computed property that applies the formula at runtime
- Is not editable by users (read-only computed field)

## Files Modified
1. `machtzev/generator/specs-ds/peruk12.txt` — added computed field to entity definition
2. `machtzev/generator/app-ds.mjs` — added formula property to JSON serialization

## Breaking Changes
None. The change is backward compatible and only adds new functionality.
