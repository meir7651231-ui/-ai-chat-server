# Task: Add sorting to peruk12 cases table

**Goal:** In the app from peruk12.txt, make the cases table sorted by price (מחיר), cheapest first (ascending), comparing as numbers.

**Decomposition (≤10 steps):**
1. Read current peruk12.txt and understand the "תיק" (case) entity fields
2. Read SPEC-LANG.md to confirm sorting syntax for [טבלה] particle
3. Identify the table particle definition in peruk12.txt (line 10: `חלקיק תיק: [טבלה]`)
4. Modify particle to add column list and sorting: `[טבלה] ... | מיון: מחיר מהנמוך`
5. Run search-record.mjs to verify no duplicate atoms
6. Regenerate app using `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk12.txt --name peruk12 --skin`
7. Run police to verify byte-identity of other apps and table ordering
8. Write learnings entry to machtzev/LEARNINGS.md
9. Audit changes through checklist (money-numeric, edge-crash, navigation, text-parity)
10. Write claims.json with verified findings

**Key decisions:**
- Sort column: מחיר (price) — identified as numeric type per SPEC-LANG.md line 11
- Sort direction: מהנמוך (ascending) = cheapest first
- Syntax: `[טבלה] <columns> | מיון: מחיר מהנמוך`
