# INSP-SECHIRUT-01 — Cases table sort by rent descending

**Date:** 2026-09-10
**Task:** Sort sechirut cases table (תיק particle) by rent (שכירות), highest first
**Diff scope:** `machtzev/generator/specs-ds/sechirut.txt` (1 line modified)

## Changes Made

Modified line 22 in sechirut.txt:
```diff
- חלקיק תיק: [טבלה]
+ חלקיק תיק: [טבלה] | מיון: שכירות יורד
```

This adds the sort directive using spec-lang syntax: sort by שכירות (rent) field in descending (יורד) order.

## Audit Against Checklist

### Task Coverage
- ✅ **Cases table:** Line 22 (תיק particle) is the cases table — confirmed by spec structure
- ✅ **Rent field:** Line 7 defines `שכירות*` (rent, required) — field exists and is numeric
- ✅ **Sort direction:** `יורד` (descending) = highest first — matches requirement

### Money Numeric
- ✅ Rent (שכירות) is a numeric field; sort uses numeric comparison (via `nx.compareTo(ny)`)
- ✅ Null safety: generated code uses `num.tryParse()` with fallback to string comparison

### Edge Crash
- ✅ Empty records handled: `(x.isEmpty != y.isEmpty) ? ... : ...` guards empty strings
- ✅ Non-numeric values fallback to string comparison
- ✅ Generated code adds to existing sort pipeline without new exceptions

### State Leakage
- ✅ No state mutation (table is rendered immutably from store records)
- ✅ Sort is applied per-render via `.toList()..sort()` (temporary list, not persisted)
- ✅ No cache poisoning or observer pollution

### Navigation
- ✅ Sort does not affect routing (table is within תיק particle)
- ✅ No new drill/dial/screen created
- ✅ Table remains on same screen with new ordering

### Text Parity
- ✅ No Hebrew text changes (spec already existed; only sort directive added)
- ✅ All labels/fields remain verbatim

## Machine Report

Machine (police-bench.mjs) returned **DONE**:
- ✅ regen_ok: Generator ran successfully
- ✅ byte_identical_others: All other app outputs unchanged
- ✅ no_orphans: No dangling gen_app_* files
- ✅ gates_pass: All structural gates passed
- ✅ no_hebrew_in_engine: No Hebrew added to engine logic
- ✅ dart_math_sane: Generated Dart math is sound (numeric sort, no sqrt/min/max needed)
- ✅ compiles: Zero analyzer errors in generated Dart
- ✅ sort: Sort logic detected in px1 (✅)
- ✅ desc: Descending modifier detected in px1 (✅)

## No Breaking Changes

- ✅ Other apps (balagan, balagan-paper, etc.) byte-identical
- ✅ No hand edits to new/ files
- ✅ Spec-only change; engine unmodified
- ✅ No new thresholds or gates needed

## VERDICT: GO

All checklist items pass. Sort is correctly implemented in generated Dart.
Cases table will display sorted by rent highest-first on app load.
