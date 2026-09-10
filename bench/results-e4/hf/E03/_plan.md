# E03: Add computed field מחיר עם אגרה (price with fee)

## Goal
Add a computed field `מחיר עם אגרה` (price with fee = price × 1.03) to the תיק entity in peruk12.txt, computed by the app.

## 10-step decomposition

1. Read SPEC-LANG.md to understand computed field syntax in spec language
2. Read current peruk12.txt to see existing structure and price field
3. Search-record for "מחיר אגרה fee computed" to check for similar patterns
4. Read spec language to find computed/formula syntax
5. Add the computed field line to peruk12.txt in correct syntax
6. Regenerate app-peruk12 using app-ds.mjs with --name peruk12 --skin
7. Byte-verify output: peruk12's app logic is new, other apps unchanged
8. Run machine check (police-bench.mjs) and verify DONE status
9. Add gate if needed, write LEARNINGS entry
10. Final INSP audit and machine VERDICT

## Key questions answered in _adr.md
- Syntax: Is it `= price * 1.03` or formula syntax? (Answer: use formula field with =)
- Scope: Apply only to peruk12 (Answer: yes, spec is per-app)
- Byte safety: Other apps must not change (Answer: app-ds.mjs generates only for named app)
