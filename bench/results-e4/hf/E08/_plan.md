# Goal
Add a dashboard counter for cases (תיק) where מתווך (intermediary) is כן (yes).

## 10-Step Decomposition

1. **Read spec language reference** - Understand the counter syntax מונה() and how filters work
2. **Analyze current dashboard** - Line 11 shows existing counters; understand the pattern
3. **Search for existing patterns** - Check if there are similar field-value counters
4. **Identify the entity/field** - תיק entity has מתווך{כן|לא} field (line 7)
5. **Craft counter spec** - New counter: מונה(תיק: מתווך=כן)
6. **Edit spec file** - Add to line 11 dashboard definition
7. **Verify byte changes** - Only the dashboard line should change
8. **Run machine report** - Use police-bench.mjs to verify no breakage
9. **Audit through lenses** - Check task-coverage, edge-crash, state-leakage
10. **Write VERDICT** - Report DONE or NOT DONE with findings

## Key Constraint
- Must not break existing counters
- Counter syntax must match spec language
- No hand-edits to generated files
