# ADR: Add ותק בשנים Field to אדם Entity

## Context (Opening Question)
**Task:** Add a field `ותק בשנים` (years of experience) to the person entity in `machtzev/generator/specs-ds/panuy.txt`, limited to range 0–77.

**Opening Question:** Where in the entity definition should the field be added, and should it be displayed in any of the existing particles (table, form, report)?

**Assumed Answer:** 
- The field should be added to the entity definition (line 4: the main entity declaration with other fields)
- It should be included in the table particle since the table displays multiple person attributes
- Format: `ותק בשנים(0..77)` to indicate numeric type with range constraint
- No special particles or reports need to change unless they reference this field

## Decision
Add the field using spec-language range syntax: `ותק בשנים(0..77)` in the entity definition.

## Rationale
1. The spec language supports range constraints via `field(min..max)` syntax (per SPEC-LANG.md line 10)
2. Years of experience is numeric, naturally maps to `מספר` type
3. Range 0–77 is valid; reasonable upper bound for human age/experience
4. Adding to entity line ensures it propagates to all uses (table particle, any forms)
5. Must use spec-ds language, not hand-edit generated outputs

## Verification Steps
1. Read current panuy.txt to understand entity structure
2. Add field with proper syntax in entity definition
3. Regenerate using: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
4. Run machine verification: `node /tmp/claude-0/-home-user/56411416-50d1-59df-8369-5cc1fc15520c/scratchpad/bench/police-bench.mjs --root . --task E10 --claims ./claims.json --base /tmp/base-hashes-fix4.txt --compile /tmp/claude-0/-home-user/56411416-50d1-59df-8369-5cc1fc15520c/scratchpad/repos/bs-compile-3`
5. Check claims and submit
