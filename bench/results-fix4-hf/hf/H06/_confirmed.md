# Validator Report — peruk12 Price Sort Task

## Findings Verification

**ent1-table-unsorted** · FALSE-POSITIVE · `gen_app_peruk12_ent1.dart:171` — `items: rs.map(...)` · The entity screen is not required to sort by the spec; task requirement ("make the cases table sorted") refers specifically to the particle (px1) defined in spec line 10 (`חלקיק תיק: [טבלה] | מיון: מחיר עולה`), which is correctly sorted. Entity screen is a secondary editing interface not mentioned in sorting spec.

---

## Machine Report Validation

Audited against _police.md and generated files:

| Claim | Evidence | Status |
|-------|----------|--------|
| Generator pipeline OK | regen_ok ✅ | CONFIRMED |
| px1 sorts by price numeric | new/dart-gen-bs/gen_app_peruk12_px1.dart:25 `num.compareTo()` | CONFIRMED |
| px1 sorts ascending | Line 25: `nx.compareTo(ny)` negatives→first; `50.compareTo(100)=-1` → price 50 first | CONFIRMED |
| Fallback to lexical safe | Line 25 else clause: `x.compareTo(y)` for non-numeric | CONFIRMED |
| No unintended changes | byte_identical_others ✅ | CONFIRMED |
| All gates pass | gates_pass ✅ | CONFIRMED |

---

## Final Sweep

- **Null safety**: px1 uses `?? ''` null-coalesce; ent1 uses `?? ''` in map; both safe ✓
- **Field mapping**: gen_app_peruk12_px1_c7 = 'מחיר' (price) ✓
- **Spec compliance**: px1 implements "מיון: מחיר עולה" (sort: price ascending); no sorting required elsewhere in spec
- **Task scope**: "make the cases table sorted" → particle px1 only; entity ent1 is separate component

---

**FIX-LIST: none**

All task requirements verified complete and correct. Auditor finding is out-of-scope.
