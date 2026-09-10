# Task: Add computed field מחיר עם אגרה to תיק entity

## Goal
Add a computed field מחיר עם אגרה (price with fee) that equals price × 1.03, computed by the app (not user-typed).

## 10-Step Decomposition
1. Read spec format grammar to understand field definition syntax
2. Search existing patterns for computed/derived fields in specs
3. Identify where the price field is defined in peruk12.txt
4. Design the computed field definition syntax (following existing patterns)
5. Add field to spec file in correct location
6. Run search-record.mjs to validate new field doesn't conflict
7. Run machine police-bench.mjs to verify no regressions
8. Document in _adr.md with decision rationale
9. Verify byte-by-byte that only the spec changed
10. Record final claims.json with proof

## Key Constraints
- Change ONLY in machtzev/generator/specs-ds/peruk12.txt (spec layer)
- Never modify generated outputs in new/ directories
- The field must be computed (not user-entered)
- No breaking changes to existing functionality
