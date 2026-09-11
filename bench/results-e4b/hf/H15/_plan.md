# Plan: Sort Cases by Deadline in peruk21 App

## Goal
Sort cases by deadline (`עד מתי`) soonest first in cases table (particle screen) and entity list screen.

## 10-Step Decomposition
1. Read peruk21.txt spec to understand structure and case fields
2. Identify where cases are displayed (particle screen vs entity list screen)
3. Read spec-lang.md reference to understand how to express sorting in the spec language
4. Determine if sorting can be expressed in the spec or requires engine changes
5. Check current generated Dart code for cases rendering logic
6. Implement sorting logic in the correct layer (spec first, then engine if needed)
7. Regenerate the app with updated spec
8. Verify sorting works on both screens (cases table + entity list)
9. Run police-bench to check byte-identity of other apps and gates
10. Write audit report (_insp.md) and claims.json with verification

## Key Questions
- Can sorting be expressed in the spec language or does it require engine modification?
- What is the field name for deadline and how are dates represented in this app?
- Are both screens using the same underlying data source or different rendering paths?
