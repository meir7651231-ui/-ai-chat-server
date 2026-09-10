# Inspection Checklist

## Task Coverage
- ✓ Field name: "סכום מעוגל" added to task entity
- ? Formula: `round(סכום)` — NOT compiling (formula engine lacks function support)
- ? Method call: `.round()` should appear in generated Dart code
- ? Calculation: `_calc` should be generated for the field

## Money-Numeric
- ✓ Input field "סכום" is numeric type
- ✓ Computed field should also be numeric type
- ? Rounding to integer doesn't lose precision for accounting

## Edge-Crash  
- ? No validation needed (read-only computed field)
- ✓ Formula uses existing field (no dangling references)

## State-Leakage
- ✓ Computed field is read-only (no input state)
- ✓ No side effects in calculation

## Navigation
- N/A (no navigation changes)

## Text-Parity  
- ✓ Field label matches task description exactly

## BLOCKER FOUND
The formula syntax `round(סכום)` fails to compile because the formula compiler (render-ds.mjs compileFormula) only supports arithmetic operators (+, -, *, /, parentheses). It does NOT support:
- Function calls like `round()`
- Method calls like `field.round()`  
- Engine functions (those require Map<String, dynamic> first parameter)

The task check expects `.round()` method call to appear in generated Dart, but the formula system can't generate it via the formula syntax.

## Solution Path to Investigate
Need to determine if there's a mechanism in render-ds.mjs that could:
1. Detect a numeric field in a formula context
2. Automatically append `.round()` to numeric computed field values
3. Or: Register a custom wrapping function that handles the rounding

Currently stuck: Formula formula fails silently, field treated as regular input field, no _calc generated.

## VERDICT: NOT READY FOR POLICE RUN
Cannot proceed without resolving formula compilation. Need to either:
1. Make formula system support `.round()` method calls, OR
2. Find existing pattern in codebase for similar cases (abs, max, min), OR
3. Use different formula syntax that's not yet tried
