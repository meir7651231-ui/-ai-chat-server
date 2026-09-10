# Plan: Add ותק בשנים (Years of Experience) to אדם Entity

**Goal (1 line):** Add a bounded numeric field `ותק בשנים(0..77)` to the person entity in panuy.txt spec without breaking any existing functionality.

## 10-Step Decomposition

1. **Read current spec** — Review panuy.txt entity definition to identify where to insert field
2. **Understand field syntax** — Confirm range constraint syntax `field(min..max)` from SPEC-LANG.md
3. **Identify insertion point** — Locate the entity line (line 4) where other fields are declared
4. **Add field to spec** — Insert `ותק בשנים(0..77)` at appropriate position in entity definition
5. **Verify spec syntax** — Check that resulting spec line is valid (no syntax errors)
6. **Regenerate app** — Run `node machtzev/generator/app-ds.mjs` with correct flags to emit Dart
7. **Check generated output** — Verify that generated Dart files include new field without errors
8. **Run machine verification** — Execute police-bench.mjs to validate all checks pass
9. **Review claims** — Examine output to confirm byte-identity of other apps and compiles
10. **Submit result** — Write claims.json with verification results

## Key Constraints
- Do NOT edit generated files (new/dart-gen-bs, new/dart-data-bs, new/dart-forge-bs)
- Must use spec-language syntax; engine changes only if language cannot express requirement
- Other apps must remain byte-identical (machine checks this)
- Final Dart must pass `flutter analyze` (zero errors)
