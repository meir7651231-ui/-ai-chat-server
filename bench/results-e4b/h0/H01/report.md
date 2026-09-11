# Panuy App Distance Sorting & Display Fix

## Summary
Modified the `panuy.txt` spec to:
1. **Sort the person list by distance (nearest first)** — added `| מיון: מרחק בקמ עולה` to the table definition
2. **Show real distance in km** — changed displayed field from `מרחק בריבוע` to `מרחק בקמ`, which uses sqrt() of squared distance

## Changes Made

### File: `machtzev/generator/specs-ds/panuy.txt`

**Line 6** (table definition):
- **Before:** `חלקיק אדם: [טבלה]`
- **After:** `חלקיק אדם: [טבלה] | מיון: מרחק בקמ עולה`

**Line 12** (displayed field):
- **Before:** `חלקיק אדם: מרחק בריבוע`
- **After:** `חלקיק אדם: מרחק בקמ`

## Verification

### Generated Specification (particle-plan-panuy.json)
✅ Table particle correctly parses sorting:
```json
{
  "expr": "[טבלה] | מיון: מרחק בקמ עולה",
  "ok": true,
  "shape": "table"
}
```

✅ Distance field particle correctly shows real distance:
```json
{
  "expr": "מרחק בקמ",
  "ok": true,
  "shape": "raw"
}
```

### Displayed Fields
✅ Raw field particles shown in list:
- שם (name)
- **מרחק בקמ** (distance in km) — **correctly showing real distance now**
- מחיר לשעה (price/hour)
- מחיר לשעתיים (price/2 hours)

✅ Old `מרחק בריבוע` (squared distance) **no longer displayed**

### Build Status
✅ `app-ds.mjs` generation successful
✅ All 12 particles wired correctly
✅ Police checks passed (pre-existing git errors unrelated to this change)

## How It Works
- The spec has `מרחק בקמ = sqrt(מרחק בריבוע)` defined in line 4
- Sorting uses `מיון: מרחק בקמ עולה` (ascending order = nearest first)
- The generator reads this and applies numeric sorting on the field
- Display shows real km distance, not the raw squared value

## Testing
No test failures introduced. Police output clean except for pre-existing git blob errors (unrelated to panuy changes).
