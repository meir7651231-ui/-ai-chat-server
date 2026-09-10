# Inspection Report: Sort cases by price (H06)

## Task Coverage
- Entity list: ✅ תיק (case) entity has מחיר (price) field as numeric
- Particle table: ✅ [טבלה] particle on line 10 of peruk12.txt modified with sorting
- Hub: ✅ App shell and navigation unaffected
- Report: ✅ Diachronic data report (כרטיס = מחיר) preserved

## Money Numeric
- ✅ Price field type is inferred as numeric by spec-lang (word "מחיר" triggers type='num')
- ✅ Sort engine uses num.tryParse() to detect numeric values (sort-cmp.mjs:10)
- ✅ Numeric comparison via compareTo() not text comparison
- ✅ Example prices in content: 42,000 ₪, 3,000 ₪ (parsed correctly by Dart)

## Edge Cases
- ✅ Empty prices sort last (sort-cmp.mjs:11 handles isEmpty)
- ✅ Mixed numeric/text values: numeric wins, text fallback works
- ✅ Single sort field (מחיר עולה) — no secondary sort needed

## State Leakage
- ✅ Sorting defined at spec level, not in runtime app state
- ✅ Table rendering is deterministic based on sort function lambda
- ✅ Particle definition is stateless

## Navigation
- ✅ List view (מה פתוח עכשיו) shows sorted table by price
- ✅ Detail view (כרטיס) not affected
- ✅ No modal/panel state changes

## Text Parity
- ✅ Hebrew spec syntax preserved: עולה (ascending)
- ✅ Field name מחיר matches entity schema (line 7 of peruk12.txt)
- ✅ Sort direction matches task requirement: "cheapest first" = עולה

## Verification
✅ Machine report: DONE
✅ All checks passed (regen_ok, byte_identical_others, gates_pass, compiles)
✅ Numeric sorting confirmed (numeric info: 2×)
✅ No compilation errors (compile: 0 errors)

## VERDICT: GO
Task complete. Cases table now sorted by price (numeric, ascending).
