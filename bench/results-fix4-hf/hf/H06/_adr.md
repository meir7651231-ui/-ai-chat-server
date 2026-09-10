# ADR: Sort Cases Table by Price (Numeric, Ascending)

## Context
The peruk12 spec (used car purchase app) has a cases table particle with no sort specification. The task requires sorting by price (מחיר) as cheapest first, using numeric comparison rather than text.

## Decision
Add sort specification to the table particle in peruk12.txt, line 10:
```
חלקיק תיק: [טבלה] | מיון: מחיר עולה
```

The keyword "עולה" means ascending (lowest to highest), aligning with "cheapest first" requirement.

## Rationale
1. **Correct layer**: The spec file (machtzev/generator/specs-ds/peruk12.txt) is the input source, not generated output (new/ directory).
2. **Engine already supports numeric sorting**: The sort-cmp.mjs engine (line 10) uses `num.tryParse()` to detect numeric values and applies numeric comparison when both values parse as numbers.
3. **Field type auto-detection**: The "מחיר" field name is automatically recognized as numeric type by the schema (SPEC-LANG.md line 11 lists "מחיר" under numeric field keywords).
4. **Spec syntax validated**: The table syntax with sort follows the documented grammar: `[טבלה] | מיון: <field> עולה/יורד` (SPEC-LANG.md line 17).

## Alternatives Rejected
- **Hand-editing generated Dart code**: Protocol forbids hand-edits in new/ (layer violation; breaks regeneration).
- **Modifying sort engine code**: Not needed; numeric comparison already implemented in sort-cmp.mjs.
- **Adding a data transform**: Unnecessary; spec-driven generation is the correct approach.

## Consequences
- Cases table rows will be ordered by price numerically, lowest first.
- No other apps or specs affected (byte-identical check passed).
- All gates and police checks passed (regen_ok, gates_pass, sort, numeric).

## Verification
Machine report (police-bench) confirms:
- ✅ regen_ok: Generator pipeline successful
- ✅ sort: Sorting check passed (px1 = 1 particle affected)
- ✅ numeric: Numeric comparison verified (2× indicates dual-check)
- ✅ byte_identical_others: No unintended side effects
- ✅ gates_pass: All police gates passed
