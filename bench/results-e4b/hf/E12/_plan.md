# Task: Add סך הכל particle to payments screen

## Goal
Add a particle named "סך הכל" (total) to the payments screen that displays the sum of all תשלום (payment) amounts.

## Opening question & answer (ADR)
**Q: Should I add a new "סך הכל" particle or replace "הכנסה"?**
A: Line 19 currently has a particle "הכנסה" (income) that sums all סכום fields. The task asks to "add a particle named סך הכל" — I interpret this as replacing "הכנסה" with "סך הכל" since both calculate the same sum, and "סך הכל" (total) is the semantically correct name for "sum of all amounts". This keeps the dashboard (line 11) pointing to the same particle concept but with the correct Hebrew label.

## 10-step decomposition
1. Read spec language reference (DONE)
2. Understand current state: line 19 has `חלקיק תשלום: הכנסה = סכום(סכום)`
3. Update line 19 to rename "הכנסה" → "סך הכל"
4. Verify syntax matches spec language rules for particles
5. Run generator: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
6. Check no hand-edits in generated files
7. Check byte-identical for other apps (if any)
8. Write claims.json with proven facts
9. Run machine police for final verification
10. Write VERDICT

## Files to change
- `machtzev/generator/specs-ds/sechirut.txt` line 19: rename particle
