# Plan: Add `קרוב` computed field to person entity in panuy.txt

## Goal (1 line)
Add a text field `קרוב` to the person entity that displays "קרוב" when distance-squared < 100, "רחוק" otherwise.

## 10-Step Decomposition

1. **Examine current panuy.txt structure** — understand how entity fields are declared, especially computed fields like `מרחק בקמ`
2. **Find the right insertion point** — add `קרוב` field after other distance-related computed fields (semantic grouping)
3. **Determine field type and syntax** — confirm field should be text (not bool) and use generator's ternary or if-else syntax
4. **Write the spec line** — add `קרוב = (מרחק בריבוע < 100) ? "קרוב" : "רחוק"` or equivalent generator syntax
5. **Run generator** — `node machtzev/one.mjs --genmax` to regenerate Dart from spec
6. **Check for compilation errors** — `flutter analyze` in buildsmart (if available, or parse tool output)
7. **Verify field is in generated output** — grep new/dart-gen-bs for generated `קרוב` field + getter
8. **Verify no hand-edits in generated files** — machine check: `node police-bench.mjs --task M06`
9. **Check gates pass** — police report shows all gates green (byte-identical, no Hebrew in engine, math sane)
10. **Write claims.json** — record successful field addition with proof of byte-identical files

## What could break:
- Syntax error in spec (malformed ternary)
- Generated Dart has type mismatch
- Existing tests fail (regression)
- Field name collision with existing code
