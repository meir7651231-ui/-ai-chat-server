# Inspection Audit: Unsent Findings Counter

## Task Coverage
- [x] Dashboard counter: Added `מונה(ממצא: נשלח=לא)` to line 11 (לוח בקרה)
- [x] Findings screen particle: Added `חלקיק ממצא: לא נשלחו = מונה(נשלח=לא)` on line 21
- [x] Field exists: `נשלח{כן|לא}` confirmed in line 9 (entity ממצא)
- [x] Pattern consistency: Matches payment particle `לא שולם` pattern (line 20)

## Money Numeric
- Not applicable to this change (no financial calculations added)
- Existing numeric fields (שכירות, סכום) unchanged
- Dashboard still displays `סכום(תשלום.סכום)` correctly

## Edge Crash
- No new fields added to entities (uses existing `נשלח` field)
- No new conditions that could cause null/undefined
- Counter mechanism uses proven `מונה(entity: field=value)` syntax
- Empty findings case handled by existing empty-state particles

## State Leakage
- No state mutations introduced
- No cross-entity field dependencies
- Counter is derived only from `נשלח=לא` query
- Particle scope limited to ממצא entity

## Navigation
- Dashboard counter is read-only (counting, not navigation)
- Findings particle `לא נשלחו` on findings screen (same entity scope)
- No new screens or navigation paths added
- Existing hierarchies preserved

## Text Parity
- Dashboard line: Hebrew only (matching existing counters)
- Particle name `לא נשלחו` matches Hebrew naming convention
- No English mixed in
- Text is descriptive, not truncated

## VERDICT: GO
All surface areas covered. Changes are minimal, spec-only (no code generation needed
at engine layer beyond parser). Pattern precedent exists (payment counter).
No breaking changes to entity definitions or navigation.
