# PLAN — Sort sechirut cases table by rent descending

**Goal:** Make the תיק (cases) table sort by שכירות (rent), highest first.

## 10-Step Decomposition

1. **Verify current state:** Read sechirut.txt line 22 (确认particle definition)
2. **Identify field name:** Confirm "שכירות" is the rent field name in line 7 of sechirut.txt
3. **Identify sort syntax:** Confirm SPEC-LANG.md line 17 shows sort syntax: `| מיון: field יורד`
4. **Modify spec:** Change line 22 from `[טבלה]` to `[טבלה] | מיון: שכירות יורד`
5. **Regenerate app:** Run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
6. **Byte-check generated Dart:** Grep generated files for sort logic (`.sort(`, `compareTo`)
7. **Verify other apps unchanged:** Run machine police-bench with byte-identical check
8. **Audit against checklist:** FND-01 (analyze), OPS-01/OPS-02 (compile), no hand edits
9. **Write inspection report:** 4 lenses (task-coverage, edge-crash, state-leakage, navigation)
10. **Run final police:** Execute police-bench.mjs, verify DONE status, commit claims.json

## Key Files
- **Spec:** `machtzev/generator/specs-ds/sechirut.txt` (line 22)
- **Reference:** `machtzev/generator/specs-ds/SPEC-LANG.md` (line 17)
- **Generator:** `machtzev/generator/app-ds.mjs`
- **Generated output:** `new/dart-gen-bs/gen_sechirut_*.dart` (case/table sorting logic)
- **Verification:** police-bench.mjs (machine report)

## Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Typo in field name | Grep sechirut.txt for exact "שכירות" string |
| Sort syntax wrong | Copy-paste from SPEC-LANG.md example |
| Breaking other apps | Machine byte-identical check catches it |
| Missing verb (עולה/יורד) | SPEC-LANG explicitly requires one; test runs detect it |

## Success Criteria
- ✅ sechirut app table displays cases sorted by rent highest→lowest
- ✅ All other app outputs byte-identical
- ✅ No hand edits to new/ files
- ✅ `flutter analyze` → 0 errors (if compiled)
- ✅ police-bench.mjs returns DONE
