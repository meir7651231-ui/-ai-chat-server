# E06 Plan: Add "שלח תזכורת" action button to peruk17 case screen

## Goal
Add a reminder action button to the case particle screen without breaking existing functionality.

## 10-Step Decomposition

1. Verify current peruk17.txt particle structure
   - Read particle definitions (lines 10-16)
   - Confirm existing "פעולה" pattern

2. Identify correct insertion point
   - After existing action particles in peruk17.txt
   - Before content/report sections

3. Add new particle line to peruk17.txt
   - Format: `חלקיק תיק: [פעולה] שלח תזכורת`
   - Placement: after line 12 (after "פתח תיק" action)

4. Run search-record
   - `node machtzev/search-record.mjs "שלח תזכורת reminder send reminder case"`
   - Record --choose or --none result

5. Verify no existing button named "שלח תזכורת"
   - Grep for similar action buttons
   - Check atom-index for conflicts

6. Run generator pipeline
   - Executes app-ds.mjs (particle-plan auto-generated)
   - New action particle generates new entry in plan
   - No hand-edits in generated files

7. Verify generated particle plan
   - Check particle-plan-peruk17.md updated
   - Confirm DsChipButton mapped correctly

8. Run police machine
   - `node police-bench.mjs --root . --task E06 --claims ./claims.json`
   - Verify: regen_ok, no_hand_edit, byte_identical_others, gates_pass

9. Document verified changes in claims.json
   - Claim: "Added action particle 'שלח תזכורת' to peruk17 case screen"
   - Verify: bytes, particle plan, gates

10. Review and finalize
    - All police checks green
    - Only peruk17.txt modified outside generated/
    - VERDICT: DONE

