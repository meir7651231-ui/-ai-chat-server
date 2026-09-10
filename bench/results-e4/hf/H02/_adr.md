# ADR-SECHIRUT-01 — Sort cases table by rent descending

**Status:** In Progress
**Date:** 2026-09-10

## Context
The sechirut.txt (rental contract review app) has a cases table (תיק particle screen) that currently displays all cases in an unsorted order. The product requirement is to sort this table by rent (שכירות) from highest to lowest, so cases with higher rent appear first.

## Decision
Modify the spec-lang declaration in sechirut.txt line 22 from:
```
חלקיק תיק: [טבלה]
```
to:
```
חלקיק תיק: [טבלה] | מיון: שכירות יורד
```

This uses the spec-lang `מיון:` (sort) directive with the field name `שכירות` and the descending modifier `יורד` (from high).

## Rationale
1. The spec language (SPEC-LANG.md line 17) supports sorting via: `[טבלה] columns | מיון: field עולה/יורד`
2. Rent (שכירות) is a numeric field defined on line 7 of the spec, making it naturally sortable
3. Highest first (descending) matches typical UX: most expensive/important cases show first
4. The change is minimal: one line, spec-only, no engine modification required
5. This is within spec-lang capability; no Dart changes needed

## Alternatives rejected
- Hand-editing generated Dart: Violates protocol (no edits to new/dart-gen-bs)
- Engine logic change: Overkill; spec-lang already supports sorting
- Numeric sorting workaround: Unnecessary; rent is already a number field

## Consequences
- Generated apps will have the cases table sorted by rent highest first
- All byte-identical checks for other apps pass (change only affects sechirut generated files)
- No new thresholds or gates needed (spec-lang feature already gated)

## Verification
- Byte-verify the generated sechirut Dart files contain the sort logic
- Run machine police-bench.mjs to confirm all checks pass
- Verify other app outputs remain byte-identical
