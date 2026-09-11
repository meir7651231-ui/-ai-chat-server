# ADR: Add ממוצע פיקדון particle to peruk02.txt

## Context
Task M12 requires adding a particle named "ממוצע פיקדון" (average deposit) to the case screen in peruk02.txt that shows the average of סכום הפיקדון (deposit amount) over all cases.

## Decision
Add a particle to the תיק (case) entity using the aggregate function syntax found in existing specs:
- Pattern: `חלקיק תיק: ממוצע פיקדון = ממוצע(סכום הפיקדון)`
- Based on: sechirut.txt shows `סכום(סכום)` pattern, panuy.txt shows `ממוצע(אדם.מחיר לשעה)` pattern
- Location: After line 16 in peruk02.txt (before report definitions)

## Rationale
1. The spec language (SPEC-LANG.md line 18) defines: `<שם> = ממוצע / avg(<שדה>)` ממוצע
2. The pattern is used for aggregating numeric fields in existing spec files
3. When a particle contains an aggregate function, it computes across all related records of that entity
4. This is handled by the "particles" gate (line 13 of gates.tsv) which ensures all particles are wired correctly

## Alternatives rejected
1. Adding to the board (לוח בקרה) instead of a particle — task explicitly asks for "particle on case screen"
2. Using a computed field instead of a particle — aggregates are particle-specific per the spec language

## Consequences
- New particle appears on case entity views
- Machine validates the particle is found in open search and correctly wired
- No changes needed to engine (.mjs files) — spec is sufficient
- Other apps remain byte-identical

## Verification
- App regenerates successfully (app-ds.mjs succeeds)
- Dart compilation passes (analyze: 0 errors)
- Byte-identical check passes for other apps
- Particles gate validates the particle is wired
