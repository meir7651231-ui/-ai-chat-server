# Task M13 Plan

## Goal (1 line)
Add a "number" particle named אגרת העברה with text "אגרת העברת בעלות משולמת לפני הרישום" to the case screen in peruk12.txt

## 10-Step Decomposition

1. **Requirement clarification**: Add a [מספר] (number) particle to show transfer letter text on case view
2. **Check dependencies**: Verify no existing "אגרת העברה" particle in peruk12.txt or related specs
3. **Pattern matching**: Review existing particles in peruk12.txt to match style/placement
4. **Spec language check**: Confirm the format for number particles in SPEC-LANG.md
5. **Search existing atoms**: Run search-record.mjs to ensure no duplicate atom name
6. **Implement**: Add line to peruk12.txt in correct location (after existing particles, before reports)
7. **Verify syntax**: Ensure spec format matches language definition exactly
8. **Check byte-integrity**: Verify only peruk12.txt changed, no other app outputs affected
9. **Run gates**: Execute police checks for syntax/wiring/pins validation
10. **Document**: Create claims.json with verification of all checks passing

## Acceptance Criteria
- New particle renders without compilation errors
- Text displays as "אגרת העברת בעלות משולמת לפני הרישום"
- No other app specs modified (byte-identical check passes)
- Police gates pass (regen_ok, no_orphans, gates_pass)
