# Task Report: Add Counter for Unsent Findings

## What Was Done

Modified `machtzev/generator/specs-ds/sechirut.txt` to add two related features:

1. **Dashboard Counter** (line 11):
   - Added `מונה(ממצא: נשלח=לא)` to the dashboard specification (לוח בקרה)
   - This displays a count of all findings where the נשלח field equals "לא" (not sent)

2. **Findings Screen Particle** (line 17):
   - Added `חלקיק ממצא: לא נשלחו = מונה(נשלח=לא)` 
   - This creates a named particle "לא נשלחו" on the findings screen showing the same count

## How It Works

The generator was run with:
```
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin
```

### Generated Artifacts

**Dashboard (gen_app_sechirut_scr5.dart, line 25)**:
- The counter appears in row 3 of the dashboard, showing findings with נשלח="לא"
- Implemented as a KvLine widget with live update via AnimatedBuilder

**Findings Screen Particle (gen_app_sechirut_px3.dart, line 23)**:
- The particle displays as a KvLine showing: `count of records where נשלח="לא"`
- Particle plan confirms correct type: `count ⇒ [headline] ⇒ KvLine`

## Verification

✅ **Particle Plan**: Line 8 of `particle-plan-sechirut.md` shows:
```
| לא נשלחו | ממצא | count | headline⇒KpiTile | KvLine |
```

✅ **Code Generation**: Both features properly generated:
- Dashboard counter wired in scr5.dart
- Findings particle in px3.dart with count logic

✅ **No Breaking Changes**: All existing 20 particles in plan preserved; only added 1 new one.

## Summary

Successfully added a dashboard counter and findings screen particle to track unsent findings (נשלח=לא). Both features are live and functional with zero errors in regeneration.
