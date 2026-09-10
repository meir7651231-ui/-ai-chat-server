# ✓ Validation Report — H13 (Panuy Table Columns)

## Findings (by severity)

**P1 · CONFIRMED · new/dart-data-bs/auto/gen_app_panuy_px1_content.dart:5-6 · Column order reversed in particle table**
Spec (panuy.txt:6) requires `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה` (order: name, available, **distance, price**). Generated px1_content.dart shows `c3='מחיר לשעה'` and `c4='מרחק בקמ'` (order: name, available, **price, distance** — **c3↔c4 swapped**). px1.dart line 34 renders `columns: [c1,c2,c3,c4]` which produces wrong column order in table display. Fix: swap c3 and c4 values in px1_content.dart, update px1.dart line 34 items list accordingly from `[price,distance]` to `[distance,price]`.

**DEFER · audit-coverage findings (P0/P1 on ent1 showing all 14 columns)**
ent1.dart line 187 displays all 14 entity fields in its table view, not restricted to 4 columns. Auditor-coverage claims this violates task requirement. However: (a) ent1 is the full entity editor screen (architectural pattern: show all fields for edit form), while px1 is the specialized [טבלה] particle table (architectural pattern: show restricted set). Audit-compile explicitly verified this is correct design. (b) Machine police.md passed all checks (regen_ok, compiles, four_columns=4, has_km=3×) and verdict is DONE. (c) Whether ent1 should also be filtered is an architectural decision beyond validator scope. **Recommendation: Defer to owner decision on whether ent1 should respect [טבלה] spec or remain full-field editor.**

## Audit Reconciliation

- audit-compile.md: Correctly identified c3↔c4 swap (P1). Correctly notes px1 shows 4 columns. Explicitly states ent1 showing all 14 is correct architecture.
- audit-coverage.md: Correctly observed ent1 shows all 14. Interpretation disagreement: assumes ent1 should be filtered by [טבלה] spec. This contradicts audit-compile's architectural assessment.
- police.md: All checks ✅. Machine confidence: task done. Did not verify column ORDER (only count). Column order claim "שם, זמין, מרחק בקמ, מחיר לשעה" is FALSE per bytes.

## Final Verdict

Machine report contains one implicit false claim: the "four_columns" check passed but column order is wrong. The order bug is REAL and CONFIRMED. The ent1 fullfield-editor question requires owner judgment.

FIX-LIST: P1-column-order-swap-px1

