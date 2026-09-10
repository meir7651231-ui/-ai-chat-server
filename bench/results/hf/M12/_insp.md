# Inspection Audit: M12 Task

## Task Coverage Verification
- ✅ task-coverage: Added ממוצע(תיק.סכום הפיקדון) to control board (לוח בקרה) in peruk02.txt. Board displays on case screen via דוח תיק. All required surfaces touched.
- ✅ money-numeric: The formula uses סכום הפיקדון (numeric field with ₪ values), properly aggregated with ממוצע (average) function.
- ✅ edge-crash: No edge cases break the code; aggregation over empty record set returns 0 per standard generator behavior.
- ✅ state-leakage: No state changes to other files; board definition is isolated to לוח בקרה line.
- ✅ navigation: Board appears on case detail screen (דוח תיק: לוח = לוח); navigation unchanged.
- ✅ text-parity: Label "ממוצע פיקדון" matches task requirement; displayed as board metric.

## Implementation Details
- Modified: machtzev/generator/specs-ds/peruk02.txt line 8
- Added metric: `ממוצע(תיק.סכום הפיקדון)` to the board definition
- Verified: regen_ok ✅, gates_pass ✅, avg_code ✅, byte_identical_others ✅
- No files outside spec modified (no_hand_edit ✅)

## Machine Report Results
- ✅ regen_ok: Code regenerated successfully
- ✅ byte_identical_others: No unintended file changes
- ✅ gates_pass: All gates passed
- ✅ no_hebrew_in_engine: No Hebrew in engine code
- ✅ dart_math_sane: Dart math correct
- ✅ no_hand_edit (info): Entity definition edited (expected)
- ✅ label: 2× ממוצע פיקדון found in generated code
- ✅ avg_code: 1× average code in spec

## VERDICT: ✅ DONE
Task completed successfully. Average deposit metric "ממוצע פיקדון" added to case screen showing average of סכום הפיקדון over all cases.
