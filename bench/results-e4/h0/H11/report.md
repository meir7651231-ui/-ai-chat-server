# Sechirut App: Added Computed Field תקרה נמוכה

## Change Made
Added a computed field `תקרה נמוכה` to the תיק entity in `machtzev/generator/specs-ds/sechirut.txt`.

**Specification:**
```
תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)
```

This field calculates the minimum ceiling between:
- תקרה לפי 3 חודשים (3 months of rent)
- תקרה לפי שליש (1/3 of total contract rent)

## Verification

### 1. Spec File Validation
- File modified: `machtzev/generator/specs-ds/sechirut.txt` (line 7)
- Change verified by file read: new field properly inserted in entity definition
- Syntax: Matches existing computed field pattern (name = formula)

### 2. Code Generation
- Ran: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
- Result: ✓ Success
- Output: 10 screens generated, 4 entities processed, 19/19 particles wired
- No errors or warnings related to the new field

### 3. Police Check (Linting)
- Ran: `node machtzev/police.mjs --fast`
- Exit code: 0 (pass)
- Wiring validation: ✓ passed
- Contract validation: ✓ passed
- Index validation: ✓ passed

## Impact
- No existing fields or logic modified
- New computed field available for use in:
  - Reports
  - Particles
  - Display logic
  - Any formula referencing תיק entity
- Backward compatible (existing code unaffected)

## How It Works
The app automatically computes `תקרה נמוכה` whenever:
1. שכירות (rent) value changes → תקרה לפי 3 חודשים updates
2. חודשים (months) value changes → תקרה לפי שליש updates
3. Either source field changes → תקרה נמוכה recalculates as min() of the two

The min() function is handled by the app's expression evaluator during render/compute cycles.
