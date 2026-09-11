# Plan: Convert field to enum and add counter particle

## Goal
Convert the free-text field "האם כבר פנו למוכר" (Have you already contacted the seller) in peruk08.txt to a closed choice with values כן/לא/לא יודע, and add a counter particle on the case screen counting cases where it is לא (no).

## 10-step decomposition

1. **Understand current state**: peruk08.txt line 6 has entity "תיק" with field "האם כבר פנו למוכר" as free text
2. **Read spec-lang reference**: SPEC-LANG.md shows enum syntax is `שדה{א|ב|ג}` (line 10)
3. **Search for pattern**: Look for similar yes/no enum fields in other specs to match naming convention
4. **Modify spec**: Change "האם כבר פנו למוכר" to "האם כבר פנו למוכר{כן|לא|לא יודע}" in entity definition
5. **Add counter particle**: Add new particle line with counter counting cases where field = לא
6. **Place particle correctly**: Particle should be added in the תיק particle section (between other particles)
7. **Verify spec syntax**: Ensure all Hebrew is valid and follows existing patterns in file
8. **Check entity definition completeness**: Verify case screen is mentioned (מסך תיק or default view)
9. **Run machine verification**: Generate app with machine and verify it compiles
10. **Update claims.json**: Document what was changed and verified
