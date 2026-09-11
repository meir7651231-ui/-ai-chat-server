# Inspection Audit — H06 (peruk12 table sort by price)

**Checklist lenses:**

- **task-coverage**: Entity (תיק) with price field ✓, particle table with sorting ✓, numeric sort direction (מהנמוך) ✓ — all surfaces named by task covered
- **money-numeric**: Price field treated as numeric by engine (word "מחיר" in name triggers numeric type per SPEC-LANG) ✓, sort compares numbers not text ✓ (machine check numeric✓ 2×)
- **edge-crash**: Table with zero records handled by existing `[ריק]` particle ✓, single record sort ✓, price-only rows handled ✓
- **state-leakage**: Sort order deterministic (مachineᵏᵏ check ✓), no hidden state mutation, only table render ✓
- **navigation**: Table particle only; no routing change, no page transition ✓, case link (onOpen) preserved ✓
- **text-parity**: Hebrew field names (לקוח, טלפון, מחיר) identical in spec and render ✓, table headers localized by engine ✓

**Verification:**
- Machine report: DONE (all 8 checks ✓ + 2 info checks ✓)
- Byte-identical-others: ✓ (no other app modified)
- Compiles: ✓ (0 analyzer errors)
- Police gates: ✓ (all 5 gates passed)
- Sort gate: ✓ (1 pixel/check passed)

**VERDICT: GO** — No issues found, task complete and verified.
