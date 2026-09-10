# ADR: Table Column Restriction in panuy App

## Context
The panuy app (people availability tracker) displays a table with all fields of the אדם (person) entity. The task requires showing only 4 specific columns in a fixed order: שם (name), זמין (available), מרחק בקמ (distance in km), מחיר לשעה (price per hour).

## Opening Question (Protocol §ג.1)
**Q: Can the spec language express which columns a table displays, or does this require engine changes?**

**A (assumed):** The spec language already supports column selection via the syntax `[טבלה] עמודה, עמודה, …` as documented in SPEC-LANG.md §16 line 17. No engine changes needed.

## Decision
Modify the panuy.txt spec to use column-restricted table syntax instead of the full-table syntax.

**Change:**
- **File:** machtzev/generator/specs-ds/panuy.txt
- **Line 6 before:** `חלקיק אדם: [טבלה]`
- **Line 6 after:** `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`

## Rationale
1. **Spec language supports this:** SPEC-LANG.md §16 explicitly documents the syntax for column-restricted tables.
2. **Engine already implements it:** The generator recognizes and processes the column list syntax.
3. **No collateral damage:** Other apps remain unaffected (machine validates `byte_identical_others`).
4. **Spec-first approach:** Fix in the correct layer (spec, not engine) per protocol §ג.2(a).
5. **All columns exist:** Verified that all 4 required columns are defined in the אדם entity.

## Alternatives Rejected
1. **Hand-edit the generated Dart:** Violates protocol (never edit generated files, always regenerate from spec).
2. **Engine changes:** Not needed; spec language already supports this.
3. **Wrapper/hide-column logic:** Overengineered; spec syntax is simpler and cleaner.

## Consequences
- Table shows exactly 4 columns in the specified order.
- Column names are Hebrew (שם, זמין, מרחק בקמ, מחיר לשעה) — no translation needed.
- No sorting specification; engine uses defaults (acceptable per task scope).
- All other particles and the dashboard remain unchanged.
- Dart compilation clean (zero analyzer errors).

## Verification
Machine validation (police-bench) confirms:
- ✅ regen_ok: App regenerated successfully
- ✅ byte_identical_others: No other apps affected
- ✅ four_columns: Table displays exactly 4 columns
- ✅ compiles: Zero Dart analyzer errors
- ✅ has_km: מרחק בקמ field present in output
- ✅ VERDICT: DONE

## Related Entries
- **SPEC-LANG.md §16 line 17:** Syntax definition for column-restricted tables
- **LEARNINGS.md L2026-09-10:** Documentation of this feature for future reference
- **panuy.txt line 6:** The implemented spec change
