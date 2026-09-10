# Task M11: Add WhatsApp export to peruk25 case report

## Goal
Add an export line `[ייצוא] שליחה בוואטסאפ = טלפון` to the "דוח תיק" section of peruk25.txt case report.

## Decomposition (≤10 steps)
1. Search existing code for export pattern (ייצוא) to understand format
2. Verify current state of peruk25.txt - check if export line exists
3. Verify phone field exists on the case entity (תיק)
4. Determine exact placement of export line in report section
5. Add or fix the export line syntax if needed
6. Run search-record.mjs to record the addition
7. Verify file is in correct layer (spec .txt, not generated outputs)
8. Test with police run to ensure no breakage
9. Audit changes against protocol checklist (_insp.md)
10. Run final machine report and collect verdict

## Current State
- peruk25.txt exists at line 22 with: `דוח תיק: [ייצוא] שליחה בוואטסאפ = טלפון, קישור לפתיחת שיחה`
- The line appears to already exist - need to verify if this is the desired state or if modifications needed
