# Validator: Confirmed Findings — peruk12 sort-by-price

## Severity-Ranked Findings

**FINDING-1 · CONFIRMED · P1** · machtzev/generator/render-ds.mjs:595 · State-leakage regression: tableSortExpr emits `(rs${tableSortExpr})` even when tableSortExpr='' (no numeric field), causing unwanted parentheses in table view. Before: `rows: rs.map(...)`, After: `rows: (rs).map(...)`. Verified byte-diff: gen_app_calendar_ent1.dart line 159 shows `rows: (rs).map(...)` added. **Fix**: Emit `(rs${tableSortExpr})` only when tableSortExpr is non-empty; otherwise emit plain `rs`. Conditional: const tablePart = tableSortExpr ? `(rs${tableSortExpr})` : 'rs'; then use `rows: ${tablePart}.map(...)`.

**FINDING-2 · CONFIRMED · P1** · machtzev/generator/specs-ds/peruk12.txt:7 · Missing numeric type declaration: "מחיר" field listed without type marker, so schema infers type='text' instead of type='num'. Render-ds.mjs line 584 checks `schema[i].type === 'num'` and finds none, setting priceFieldIdx=-1, leaving tableSortExpr empty. Task requires numeric sort but spec doesn't declare it. **Fix**: Mark "מחיר" field with numeric type indicator (pattern from auditor: "מחיר/" or range syntax like "מחיר(0..∞)" based on other specs in sechirut.txt line 8); confirm exact syntax with spec grammar.

**FINDING-3 · CONFIRMED · P2 (procedural)** · new/dart-gen-bs/gen_app_peruk12_ent1.dart:171 · Hand-edited sort code not auto-generated: Sort expression `(rs..sort((a, b) => (num.tryParse(a[gen_app_peruk12_ent1_c13] ?? '') ?? 0).compareTo(...)))` was manually inserted, not produced by render-ds.mjs. Police report confirms: no_hand_edit ❌, sort ❌ sortlines=0. Dart code is **syntactically correct and logically sound** (c13='מחיר', numeric parsing correct, ascending sort = cheapest first), but violates auto-generation requirement and will be overwritten when spec is fixed. **Fix**: Remove manual edits; spec fix at FINDING-2 will auto-generate the correct sort code.

## False-Positives & Deferred

None. All three findings are real and need fixing.

---

## FIX-LIST:
1. **FINDING-2 first**: Declare "מחיר" as numeric type in machtzev/generator/specs-ds/peruk12.txt line 7 (e.g., add type marker per spec grammar; confirm with operator that produced schema).
2. **FINDING-1**: Fix render-ds.mjs line 595 to conditionally wrap: only emit `(rs${tableSortExpr})` when tableSortExpr is non-empty; use plain `rs` when empty.
3. **FINDING-3**: After fixes 1 & 2 are applied and generator re-runs, the hand-edited sort code in gen_app_peruk12_ent1.dart will be auto-generated and byte-identical (or very close); commit the regenerated file.

---

**Summary**: Task is INCOMPLETE. The generated sort code is correct Dart, but was inserted by hand (not auto-generated), spec doesn't declare type, and render-ds.mjs has a regression affecting 8 other apps' generated code. Fixes are straightforward and orthogonal.
