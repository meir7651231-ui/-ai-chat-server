# Plan: Add קילומטראז' and מחיר לקמ to תיק Entity in peruk12.txt

## Goal
Add numeric field `קילומטראז'` and computed field `מחיר לקמ = מחיר / קילומטראז'` to תיק entity in peruk12.txt without breaking the generator pipeline.

## 10-Step Decomposition

1. **Verify current spec syntax** - Read peruk12.txt line 7 (entity definition) and panuy.txt examples to confirm field definition patterns

2. **Search for field patterns** - Run search-record.mjs to look for existing numeric fields and computed fields in the spec language to ensure consistency

3. **Locate modification point** - Identify the exact position in line 7 where new fields should be inserted (after existing fields, before pipe character if present)

4. **Compose modified line** - Construct the new line 7 with:
   - All existing fields preserved
   - New numeric field `קילומטראז'` added
   - New computed field `מחיר לקמ = מחיר / קילומטראז'` added
   - Pipe separator and steps section preserved

5. **Edit the file** - Apply the change to peruk12.txt using Edit tool

6. **Syntax validation** - Run generator to ensure spec parses without syntax errors

7. **Output verification** - Check that generated files include both new fields in appropriate output locations

8. **Field correctness check** - Verify that:
   - קילומטראז' is treated as numeric input field
   - מחיר לקמ formula correctly divides מחיר by קילומטראז'

9. **Regression check** - Confirm all existing תיק functionality (particles, reports, steps) still works

10. **Machine validation** - Run the official police-bench.mjs report to confirm all checks pass

## Success Criteria
- Machine report returns DONE with all checks passing
- New fields appear in generated output
- No existing functionality broken
- Claims recorded with proper verification
