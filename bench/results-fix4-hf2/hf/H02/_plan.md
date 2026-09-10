# PLAN: Sort Cases Table by Rent (שכירות), Highest First

## Goal (one line)
In the sechirut app's תיק (cases) particle table, add sorting by שכירות (rent) field in descending order (highest first).

## Context
- App spec: `machtzev/generator/specs-ds/sechirut.txt`
- Line 22: `חלקיק תיק: [טבלה]`
- This is the table particle for the תיק entity
- The תיק entity has a `שכירות` field (line 7)
- Need to sort by שכירות, highest first

## ≤10-Step Decomposition

1. **Identify current spec syntax** — Read line 22 to see current table definition
2. **Check spec language** — Verify sort syntax from SPEC-LANG.md (§16 on [טבלה])
3. **Determine sort direction** — "highest first" = יורד (descending) in spec language
4. **Update spec line 22** — Add `| מיון: שכירות יורד` to particle definition
5. **Verify spec syntax** — Confirm the updated line matches grammar rules
6. **Run machine report** — Execute police-bench to check for errors
7. **Verify generated output** — Check that Dart output includes sort
8. **Validate byte-identity** — Ensure no other apps' output changed
9. **Check gates** — Confirm all machine checks pass
10. **Record finding** — Document in claims.json with verified checks

## Assumed Answer to Opening Question (§ג.1)

**מה:** Add sort by rent descending to cases table  
**מקור:** spec line 22  
**תרגום:** One-liner to spec language — `| מיון: שכירות יורד`  
**helper נדרש:** None (sorting is at spec level)  
**מחרוזות verbatim:** None (no new Hebrew strings)  
**חסום (⛔):** None

This is a **spec-layer change** (per protocol § ג.2 "fix in the correct layer — FIRST the spec").

## Verification
- Machine report will re-run generator pipeline
- Check: `regen_ok`, `byte_identical_others`, `gates_pass`
