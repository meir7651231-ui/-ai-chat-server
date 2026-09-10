# ADR: Sort panuy list by distance (nearest first) with real km display

## Context
The spec `machtzev/generator/specs-ds/panuy.txt` defines people available near me with computed fields:
- `מרחק בריבוע`: squared distance (sum of squared lat/lng differences with weights)
- `מרחק בקמ`: real distance = sqrt(מרחק בריבוע)

Current particle `[טבלה]` shows all fields including only squared distance, with no explicit sort order.

## Decision
Fix the spec to:
1. Change particle `חלקיק אדם: [טבלה]` to explicitly list columns and add sort order by real distance (ascending)
2. Remove `מרחק בריבוע` from display (confusing intermediate)
3. Add `מרחק בקמ` to the displayed columns so users see real km distance
4. Sort by `מרחק בקמ` ascending (nearest first)

## Rationale
- The spec language (line 17 of SPEC-LANG.md) supports: `[טבלה] עמודה, עמודה, … | מיון: <שדה> עולה`
- sqrt is already defined (line 4) so no engine change needed
- Sorting by ascending magnitude (עולה) will show nearest first

## Alternatives rejected
- Adding a gate: unnecessary, spec language fully supports this
- Engine change: unnecessary, sqrt and sort are in spec language
- Hiding squared distance by removing computed field: would break other displays if any exist

## Consequences
- Users see real distance in km instead of squared units
- People are naturally sorted nearest-first by default
- Display cleaner (no intermediate squared value shown)

## Verification
- Run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
- Check generated Dart: table should sort by merhak_baqm ascending, column should display it with unit 'km'
- Machine verify: `node /tmp/.../police-bench.mjs --root . --task H01 --claims ./claims.json`
