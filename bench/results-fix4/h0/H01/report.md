# Panuy App Distance Sorting & Display Fix

## Changes Made

### 1. Spec File: `machtzev/generator/specs-ds/panuy.txt`

**Line 6 (Table Particle):**
- **Before:** `חלקיק אדם: [טבלה]`
- **After:** `חלקיק אדם: [טבלה] | מיון: מרחק בקמ עולה`
- **Effect:** Added sorting configuration to sort the list by distance in ascending order (nearest people first)

**Line 12 (Distance Display):**
- **Before:** `חלקיק אדם: מרחק בריבוע`
- **After:** `חלקיק אדם: מרחק בקמ`
- **Effect:** Changed displayed distance field from squared distance to calculated km distance (uses sqrt formula defined in entity line 4)

## How the Changes Work

### Distance Calculation
The entity definition (line 4) already includes:
```
מרחק בקמ = sqrt(מרחק בריבוע)
```
This field calculates the actual distance in kilometers from the squared distance using the square root formula. The change from line 12 now displays this real distance instead of the raw squared value.

### Sorting Implementation
The table particle now includes the sort specification `| מיון: מרחק בקמ עולה`:
- `מיון` = sorting keyword
- `מרחק בקמ` = field to sort by
- `עולה` = ascending order (lowest/nearest first)

The Dart code generator (sort-cmp.mjs) recognizes these Hebrew keywords and generates a proper Dart sort lambda that:
1. Handles numeric comparison (tries parsing as numbers first)
2. Applies ascending order (עולה = ascending)
3. Places empty values last

## Verification

### Generation Output
```
🧩 חלקיקים (הכרעה-27): 12/12 נמצאו-ומחווטים · 1 מסכי-חלקיקים
```
All 12 particles found and wired successfully, including the table particle with sort configuration.

### Particle Plan Confirmation
The generated `particle-plan-panuy.json` shows:
- Line 5: `"expr": "[טבלה] | מיון: מרחק בקמ עולה"` ✓
- The table particle is marked `"ok": true` ✓
- Status: fully wired to DsTable atom ✓

The generated `particle-plan-panuy.md` shows:
- Row 5: `טבלה מיון מרחק בקמ עולה | אדם | table | ...` ✓
- Row 11: Distance field particle now shows `מרחק בקמ` instead of `מרחק בריבוע` ✓

### Generated Code Artifacts
- Constants file shows both distance fields recognized:
  - `gen_app_panuy_ent1_c24 = 'מרחק בריבוע'` (squared distance)
  - `gen_app_panuy_ent1_c25 = 'מרחק בקמ'` (km distance) ✓
- All generated Dart files created successfully without errors

## No Breaking Changes

- Entity schema unchanged (both distance fields still present for calculations)
- All 12 particles remain functional
- No other particles or app logic modified
- Dashboard/KPI tiles continue showing squared distance data as before
- Only the table display and sorting affected as intended

## How to Test in Production

1. Load the generated app in Flutter
2. View the entity list (table particle)
3. Verify list is sorted by distance ascending (nearest person first)
4. Verify displayed distance shows actual km (e.g., "2.5" instead of "6.25" for squared 2.5²)
