# Goal
Add numeric field `משך בדקות` and computed field `משך בשעות = משך בדקות / 60` to the meeting entity in `machtzev/generator/specs-ds/calendar.txt` without breaking anything.

## 10-Step Decomposition

1. **Understand spec syntax**: Review calendar.txt and panuy.txt to understand field declaration syntax (numeric, computed, required vs optional)
2. **Search existing patterns**: Run search-record.mjs to find similar duration/time computed fields in the codebase
3. **Validate syntax**: Confirm the `fieldName = formula` syntax works for computed numeric fields with division operator
4. **Edit calendar.txt**: Add `משך בדקות` (numeric, optional) and `משך בשעות = משך בדקות / 60` to the meeting entity line
5. **Byte-verify the change**: Use grep/diff to confirm exact bytes match expected syntax
6. **Check for gates**: Determine if new threshold rules are needed (unlikely for simple field addition)
7. **Run machine report**: Execute the police-bench tool to verify no regressions
8. **Write LEARNINGS entry**: Document the lesson in machtzev/LEARNINGS.md in M4 format
9. **Audit through lenses**: Review the change through task-coverage, money-numeric, edge-crash, state-leakage, navigation, text-parity lenses in _insp.md
10. **Generate final VERDICT**: Record all claims in claims.json with proven/not-proven notes and run final report
