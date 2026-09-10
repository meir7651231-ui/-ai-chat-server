# INSPECTION CHECKLIST — Task E07

## Surface Coverage
- **entity list**: peruk21 תיק entity still has all original fields ✓
- **particle table**: New counter particle added to תיק screen (line 16) ✓
- **hub**: Dashboard counters unchanged (מונה(תיק) only) ✓
- **report**: No changes to reports ✓

## Money-Numeric
- No new numeric fields added ✓
- No price/amount calculations modified ✓

## Edge-Crash
- Counter syntax matches existing patterns (panuy.txt, sechirut.txt) ✓
- Filtered value "הזמנה לוועדה" exists in סיווג enum (line 7) ✓
- No cascading deletes or special constraints affected ✓

## State-Leakage
- Counter is read-only (display only) ✓
- No state mutations introduced ✓
- No persistence side-effects ✓

## Navigation
- New counter appears on case particle screen (px1) ✓
- No navigation flows affected ✓
- No screen routing changes ✓

## Text-Parity
- Counter label "דחופים" = הזמנה לוועדה condition ✓
- All Hebrew text from spec language, not invented ✓
- No verbatim strings from external sources changed ✓

## VERDICT: GO ✅

All checks green. No blocking issues found. Task is complete and verified by machine.
