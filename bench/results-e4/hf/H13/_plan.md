# Goal
Make the people table in panuy.txt show only four columns (שם, זמין, מרחק בקמ, מחיר לשעה) in that order, using the spec language's column-selection feature.

## Decomposition (10 steps)
1. Verify spec language supports column selection syntax for tables — **DONE** (SPEC-LANG.md line 17)
2. Locate the current table particle definition in panuy.txt — line 6: `חלקיק אדם: [טבלה]`
3. Verify column names exist in the entity definition — all four columns exist in line 4
4. Modify line 6 from `[טבלה]` to `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`
5. Verify no other table particles need modification
6. Run the app generator to emit the modified Dart
7. Verify the generated table shows only those four columns in that order
8. Verify no other apps were broken (byte_identical_others check)
9. Write lesson entry to LEARNINGS.md
10. Run final machine report and collect VERDICT

## Notes
- This is a SPEC-only change; no engine modification needed
- The syntax is already documented in SPEC-LANG.md
- Should be a non-breaking change
