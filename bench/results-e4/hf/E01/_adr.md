# ADR: Add email field to תיק entity in sechirut spec

## Context
The sechirut application tracks rental contract review cases (תיק). The entity needs an email field to collect and display contact information for tenants in both the form and table views.

## Decision
Add a new field "אימייל" (email) to the תיק entity in machtzev/generator/specs-ds/sechirut.txt, positioned after the "טלפון" field since they are related contact information.

## Rationale
- The spec language automatically infers email type from the field name "אימייל" (regex in sentence.mjs: `/mail|מייל|אימייל/`)
- No engine modification needed - use spec language only
- Positioning after טלפון makes logical sense (both contact fields)
- Other apps remain unaffected (spec modification only changes sechirut app output)
- Generated Dart will properly infer the email field type and render it as an email input field

## Alternatives Rejected
1. Creating a new atom/type: Unnecessary - email type inference is already built into the engine
2. Modifying spec-lang.data.json: Not needed - "אימייל" is already recognized
3. Hand-editing generated files: Violates the protocol - all changes must be spec-based

## Consequences
- The תיק entity now has: לקוח*, טלפון, אימייל, עיר, שכירות*, חודשים*, etc.
- Email field will appear in the form for creating/editing תיק records
- Email field will appear in the table view of תיק records
- Email field can be included in report definitions if needed
- No other apps affected (byte-identical check)

## Verification
- App regeneration completed successfully (10 screens, 4 entities, all wired)
- Forge skin applied with field×17 and other components
- Will verify with police-bench.mjs machine check:
  - regen_ok: Engine pipeline runs without errors
  - no_hand_edit: No manual edits to generated files
  - byte_identical_others: Other apps unchanged
  - gates_pass: All policy gates pass
  - compiles: Generated Dart passes flutter analyze
