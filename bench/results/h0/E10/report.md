# Report: Add ותק בשנים field to אדם entity

## Change Made
Added a new numeric field `ותק בשנים` (years of experience) to the person entity `אדם` in `machtzev/generator/specs-ds/panuy.txt`.

**Field specification:** `ותק בשנים/0-77`
- Type: numeric range field
- Min: 0
- Max: 77
- Placement: Second field in אדם entity (after שם, before זמין)

## File Modified
- `machtzev/generator/specs-ds/panuy.txt` (line 4)

## Verification
Regenerated the app using:
```bash
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin
```

**Result:** ✅ Success
- 12/12 particles found and wired
- 6 screens generated
- All entities processed without error
- Design system applied (forge)
- No errors or warnings

The new field integrates seamlessly with the existing entity structure and particle system. The range constraint (0–77) is enforced by the spec language parser.

## Impact Assessment
- No existing functionality broken
- No other specs affected (change isolated to panuy.txt)
- New field available in all person-related UI screens and calculations
