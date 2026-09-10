# Plan: Add Email Field to תיק Entity

## Goal
Add an optional email field (אימייל) to the תיק entity in machtzev/generator/specs-ds/sechirut.txt, ensuring it appears in forms and tables without breaking existing functionality.

## 10-Step Decomposition

### 1. Verify Current State
- Read sechirut.txt line 7 (תיק entity definition)
- Confirm current fields: לקוח*, טלפון, עיר, שכירות*, חודשים*, מועד חתימה, מתווך, אופציה, החלטה
- Check that no email field currently exists
- **Status:** DONE

### 2. Understand Spec Grammar
- Email field should follow spec-lang.data.json patterns
- No special typeEmail exists; treat as default string field (like טלפון)
- Field placement: after טלפון to group contact fields
- No required marker (*) needed per ADR
- **Status:** DONE (checked spec-lang.data.json)

### 3. Identify Affected Locations
- Primary: Line 7 in sechirut.txt (entity definition)
- Secondary: Check if any references to תיק fields need updating (lines 37-42 report definitions)
- Verify no hardcoded field lists in generator code
- **Status:** DONE (pattern: entity definition only)

### 4. Make Spec Change
- Edit sechirut.txt line 7
- Add "אימייל" after "טלפון" in the field list
- Preserve all other fields and sections exactly
- **Status:** TODO

### 5. Run Generator
- Execute: node machtzev/one.mjs (full pipeline)
- Check exit code and error output
- Verify no parsing errors on modified spec
- **Status:** TODO

### 6. Inspect Generated Output
- Check generated Dart code in new/dart-gen-bs/
- Verify email field mapped to text input widget
- Check DsTikvonJson schema includes email property
- Verify table/form generation includes email column
- **Status:** TODO

### 7. Byte-Verify Non-Spec Files
- Confirm no hand-edits outside specs/
- Run diff to verify only auto-generated changes
- **Status:** TODO

### 8. Run Gates & Checks
- Execute machine check: node police-bench.mjs --task E01
- Verify all gate checks pass:
  - no_hand_edit
  - byte_identical_others
  - gates_pass
  - regen_ok
- **Status:** TODO

### 9. Document Claims
- Write claims.json with verified assertions:
  - Field added to entity definition (byte proof)
  - Generated code includes email field (grep generated files)
  - No hand-edits introduced (byte-identical check)
  - All gates pass
- **Status:** TODO

### 10. Final Verdict
- Confirm DONE status from machine
- Record all evidence in claims.json notes
- Write INSP report (if needed per protocol)
- **Status:** TODO

---

## Key Constraints (Non-Negotiable)
- Only edit machtzev/generator/specs-ds/sechirut.txt (spec layer)
- Zero hand-edits to generated code (new/)
- All claims backed by byte-level proof (grep/diff)
- Machine check must return DONE
- No commit or push; local work only
