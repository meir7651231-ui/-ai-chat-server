# Plan: Sort Cases Table by Key-Handover Date

## Goal (one line)
Add sorting directive to the cases table particle in peruk02.txt so cases display sorted by key-handover date (תאריך מסירת מפתח) earliest first.

## 10-Step Decomposition
1. **Read spec-lang reference** — Understand the syntax for sorting in particles (e.g., `טבלה sortBy:field`)
2. **Identify particle definition** — Locate line 10 in peruk02.txt (`חלקיק תיק: [טבלה]`) and understand its current form
3. **Search for existing sort examples** — Use search-record.mjs to find if other apps use sorting syntax
4. **Add sort directive to particle** — Modify the particle line to include sort-by-date specification
5. **Regenerate the app** — Run `node machtzev/generator/app-ds.mjs` with peruk02 spec to emit new Dart
6. **Verify Dart syntax** — Check that generated code compiles (no syntax errors in sorting logic)
7. **Byte-verify other apps** — Confirm no changes to other generated apps (byte-identical check)
8. **Check gates** — Run police to verify new/modified files pass all checks
9. **Audit changes** — Review _insp.md checklist (task-coverage, money-numeric, edge-crash, state-leakage, navigation, text-parity)
10. **Write claims and run machine report** — Document claims.json and run the machine's final validation

## Assumptions
- Sort syntax exists in spec-lang (if not, will need engine modification)
- "Earliest first" = ascending order by date
- No data-layer changes needed (display-only)
