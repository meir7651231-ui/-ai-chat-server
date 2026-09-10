# Inspection Checklist

## ✓ task-coverage
- Entity: משימה (task)
- Particle: [טבלה] (table) with sorting
- Generated: gen_app_tasks_px1.dart (new particle screen file)
- Spec: Added `חלקיק משימה: [טבלה] | מיון: מועד עולה` to tasks.txt
- Field being sorted: מועד (due date)
- All surfaces covered ✓

## ✓ money-numeric
- Field סכום (amount) exists but is not being sorted
- Only מועד (date) is being sorted
- No new numeric/money fields added
- No breakage of existing סכום functionality ✓

## ✓ edge-crash
- Sorting by מועד (date field) is valid per field schema
- Empty dates are handled (placed last)
- Numeric comparisons attempted (for date values)
- No null pointer issues ✓

## ✓ state-leakage
- Sorting is purely display/UI layer
- Sort happens in the table particle screen rendering
- No state mutations, no side effects
- AppStore records remain unchanged ✓

## ✓ navigation
- Particle screen is [טבלה], not a full screen/dial
- No new navigation paths added
- Table is embedded in shell, no modal/navigation changes ✓

## ✓ text-parity
- Hebrew spec syntax only: `חלקיק משימה: [טבלה] | מיון: מועד עולה`
- No Hebrew literals in engine code
- Generator handles the spec correctly ✓

## Summary
All inspection dimensions passed. No issues found.

## VERDICT: GO
