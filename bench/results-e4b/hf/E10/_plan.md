# Goal
Add a "ותק בשנים" (years of experience) field to the אדם entity in panuy.txt, with range 0-77.

## Decomposition
1. Read current panuy.txt spec (✓ done)
2. Read SPEC-LANG.md to understand range syntax (✓ done: `field(0..77)`)
3. Write plan.md (✓ this document)
4. Run search-record.mjs for Hebrew/English words to find existing patterns
5. Locate the אדם entity declaration in panuy.txt (line 4)
6. Add field syntax: `ותק בשנים(0..77)` after last existing field
7. Verify no hand-edits outside app generation
8. Run police-bench.mjs to validate
9. Update claims.json with verification
10. Write final inspection report
