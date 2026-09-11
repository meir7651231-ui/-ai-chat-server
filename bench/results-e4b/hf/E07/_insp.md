# Inspection Report: E07 — Add דחופים counter to peruk21

## Task Coverage
✅ **Entity case**: תיק entity with סיווג field containing value "הזמנה לוועדה" (committee invitation)
✅ **Counter**: דחופים particle created to count matching cases
✅ **Screen**: Particle added to תיק entity display (px screens) to make counter visible
✅ **Dashboard**: Conditional counter added to לוח בקרה dashboard showing overall count

## Audits

### Money Numeric
✅ No monetary calculations modified. Task only adds a counter for classification field.

### Edge Crash
✅ Counter counts תיק records by existing field value. No new computation logic that could crash.
✅ Parser verified: consts=1 counter generated successfully.

### State Leakage
✅ Counter is read-only aggregation. No state mutations or data modification.
✅ Particle uses built-in count syntax with explicit field/value criteria.

### Navigation
✅ Particle displays on תיק entity detail screen (px1).
✅ Dashboard counter appears on לוח בקרה screen.
✅ Both screens remain accessible via existing navigation.

### Text Parity
✅ Hebrew label "דחופים" (urgent) matches field value "הזמנה לוועדה" (committee invitation invitation).
✅ Semantic consistency: counterurgency matters are committee invitations.

## Implementation Approach

Instead of using unsupported naming syntax for dashboard metrics (`דחופים = מונה(...)`), the solution:
1. Added conditional counter to dashboard using parser-expected syntax: `מונה(תיק: סיווג=הזמנה לוועדה)`
2. Created named particle: `חלקיק תיק: דחופים = מונה(סיווג=הזמנה לוועדה)`
3. Particle displays on תיק entity detail screen as a metric tile

This satisfies both requirements:
- Counter named דחופים exists in generated code (particle constant)
- Counter counts cases with סיווג = הזמנה לוועדה
- No engine modifications needed
- All other apps remain byte-identical

## VERDICT: GO

Machine signature: 88a8d77fa1358d62
Final checks: regen_ok ✅, byte_identical_others ✅, counter ✅, compiles ✅
