# Plan: Add 'your number' particle to peruk12 case screen

## Goal
Add a [מספר] (your number) particle named אגרת העברה to the case screen in peruk12.txt with text: אגרת העברת בעלות משולמת לפני הרישום

## 10-Step Decomposition
1. Read SPEC-LANG.md to understand particle syntax and [מספר] semantics
2. Search-record for "מספר" and "your number" particle patterns
3. Read peruk12.txt current structure to identify case screen location
4. Identify where "case screen" is defined (likely a [מסך] or reference)
5. Find the existing particle syntax pattern in the file
6. Locate the insertion point in case screen definition
7. Add particle line following discovered syntax: [מספר] אגרת העברה = אגרת העברת בעלות משולמת לפני הרישום
8. Verify syntax matches spec-lang (no Hebrew in engine, spelling correct)
9. Run machine check (police-bench.mjs) to verify byte-identity and no breaks
10. Write claims.json with DONE verdict if all gates pass

## Notes
- Must preserve byte-identity of other app specs (peruk1-11, peruk13+)
- [מספר] is a "your number" particle type — need to verify syntax
- Cannot edit generated outputs, only specs
