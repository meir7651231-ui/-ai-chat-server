# Email Field Addition to תיק Entity

## Summary
Added email field named `אימייל` to the תיק (case) entity in the sechirut spec.

## Changes Made
- Modified `machtzev/generator/specs-ds/sechirut.txt` line 7
- Added `אימייל` field to תיק entity definition between `טלפון` and `עיר`
- Field is a simple text field (no type constraints, optional)

## Verification
Regenerated the app using:
```bash
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin
```

Results:
- ✓ App generated successfully: 10 screens total
- ✓ 4 entities with 3 child entities linked
- ✓ Particles: 19/19 found and wired (4 screens, 50 content items)
- ✓ Forge skin applied with field×17 (now includes אימייל)
- ✓ Police checks passed:
  - Wiring: 7537 files, zero violations
  - Contract: 1239 atoms with green tests
  - Quarry: empty (clean state)
  - Assembly: 46 boxes, zero regression
  - §22 acceptance: complete operating system
- ✓ Field appears in both form and table (via DsLook + field enumeration)

## Technical Details
The email field was added alongside other contact fields (טלפון). The field will auto-render
in any forge-based form/table through the spec's field×17 enumeration. No manual HTML needed.
