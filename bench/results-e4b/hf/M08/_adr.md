# ADR: Convert Contact Field to Enum and Add Counter Particle

## Context
Task M08 requires converting a free-text field "האם כבר פנו למוכר" (Have they already contacted the seller) in peruk08.txt spec to a closed choice field, and adding a counter particle to the case screen showing how many cases have the value "לא" (no).

## Decision
1. **Enum conversion**: Changed the field from free-text to closed choice with three values: כן (yes), לא (no), לא יודע (don't know)
   - Syntax: `האם כבר פנו למוכר{כן|לא|לא יודע}`

2. **Counter particle**: Added a new particle on the תיק (case) entity that counts all cases where the field value equals "לא"
   - Syntax: `חלקיק תיק: לא פנו = מונה(תיק: האם כבר פנו למוכר=לא)`
   - Placement: Line 64 in peruk08.txt, after the reporting particles

## Rationale
- **Enum format** follows existing spec-lang patterns from other specs (panuy.txt, sechirut.txt)
- **Counter particle syntax** requires entity prefix `תיק:` and field condition to properly count across entity collection
- **Particle placement** in the entity's particle definition section ensures it renders on the case screen
- The counter aggregates data across all cases in the system, not within a single case

## Alternatives Rejected
1. **No entity prefix in counter** - initial syntax `מונה / count(field=value)` was rejected; machine marked it as ratio, not count
2. **Dashboard counter instead** - task explicitly specifies "case screen", not dashboard
3. **Computed field approach** - computed fields work within single entity scope, not across collection

## Consequences
- All 1,774 indexed atoms remain compatible; no breaking changes
- Generated Dart code compiles without errors (0 analyzer errors)
- Enum provides data validation at UI level
- Counter provides real-time aggregate visibility on case screen
- Other apps (byte_identical_others check) remain unchanged

## Verification
- Machine police report: **DONE** 
- All gate checks passed (regen_ok, byte_identical_others, no_orphans, gates_pass)
- Enum created successfully (1×)
- Counter particle created successfully (consts=1)
- Generated code compiles: analyzer errors total=0
- No hand edits made to generated files; spec-only changes
