# Plan: Add computed fee field to peruk12 תיק entity

**Goal:** Add `מחיר עם אגרה` computed field to the `תיק` entity in peruk12.txt that equals price × 1.03 without breaking any other apps.

**Decomposition:**
1. Read current peruk12.txt and understand entity structure
2. Verify spec language syntax for computed fields (formula: `name = base * 1.03`)
3. Add computed field line to תיק entity definition
4. Run machine report to verify: regen_ok, no_hand_edit, byte_identical_others, gates_pass
5. Record finding in claims.json with check IDs
6. Write LEARNINGS entry (M4 format) about computed field pattern
7. Final police check + audit through inspection lenses (task-coverage, money-numeric, edge-crash, state-leakage, navigation, text-parity)
8. Verify all other apps remain byte-identical
9. VERDICT: GO or NO-GO
