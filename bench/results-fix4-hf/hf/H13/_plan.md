# Plan: Restrict panuy Table to 4 Columns

## Goal (One Line)
Modify panuy.txt to show only שם, זמין, מרחק בקמ, מחיר לשעה in the people table (no engine changes needed — feature already exists).

## 10-Step Decomposition

1. **Requirement Verification (bytes)**
   - Verify particles.mjs lines 124-138 implement column selection
   - Verify spec-lang.data.json defines table column syntax
   - Verify panuy.txt current state (line 6 says `[טבלה]`)
   - Verify panuy entity has all 4 required columns

2. **Design: Spec Change**
   - New spec syntax: `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`
   - No algorithm change needed
   - Column order must match requirement exactly

3. **Dependency Check**
   - No helpers need writing (feature already exists)
   - No new atoms needed
   - No new gates needed (column filtering is existing feature)

4. **Pattern Check**
   - Verify no other app uses column-selection syntax
   - Check if other panuy particles reference the table
   - Confirm no conflicts in field naming

5. **Edit panuy.txt**
   - Line 6: replace `חלקיק אדם: [טבלה]` 
   - With: `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`
   - Save file

6. **Byte Verification**
   - Read panuy.txt line 6
   - Verify exact string match (no typos in field names)
   - Confirm field names match schema exactly

7. **Engine Run: Regen Only**
   - Run generator to produce new particle plan
   - Check particles.mjs output filters columns correctly
   - Verify no errors in column lookup

8. **Policy Check (gates)**
   - Run police-bench.mjs --root . --task H13
   - Verify no_hand_edit passes
   - Verify byte_identical_others passes
   - Verify gates_pass passes
   - Verify regen_ok passes

9. **Inspection (INSP Report)**
   - Task coverage: table shows 4 columns ✓
   - Entity list: all required fields present ✓
   - Edge cases: what if a field doesn't exist? (engine handles via error message)
   - Write INSP report with VERDICT: GO or NO-GO

10. **Documentation: LEARNINGS Entry**
    - Record in machtzev/LEARNINGS.md M4 format:
    - What: Column selection was underdocumented in example specs
    - Why: Feature exists but not used in any spec example
    - How: Use `[טבלה] עמודה1, עמודה2` syntax from SPEC-LANG.md
    - Lesson: Check SPEC-LANG.md before assuming feature missing
