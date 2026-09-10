# Task Report: Add Computed Field מרחק אבסולוטי

## What was done
Added a new computed field `מרחק אבסולוטי` (absolute distance) to the `אדם` entity in `machtzev/generator/specs-ds/panuy.txt`.

**Changes made:**
1. **Entity definition (line 4):** Added field formula `מרחק אבסולוטי = abs(הפרש רוחב)` at the end of the ישות definition. This computes the absolute value of the existing `הפרש רוחב` field using the `abs()` function.

2. **Particle definition (line 12):** Added `חלקיק אדם: מרחק אבסולוטי` to display the field in the UI particle.

## How it was verified
- Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin` successfully. Output confirmed:
  - ✨ אפליקציה (מערכת-עיצוב) חוללה — 6 מסכים
  - 1 ישויות · 1 דשבורדים · 3 מערכת · 1 לוח

- Ran `node machtzev/police.mjs --fast` all core gates passed:
  - ✓ חוקי-החשמלאי: 7537 קבצים — אפס הפרות-חיווט
  - ✓ חוק-החוזה: 1239 אטומים בחוזה ירוקה
  - ✓ מחצבה ריקה
  - ✓ תוהר-דאטה / תוהר-עומק
  - ✓ assembly: 46 קופסאות אפס-נסיגה

- Verified the updated spec file contains both the entity formula and particle line correctly.

## Summary
✅ Computed field successfully added. Formula `abs(הפרש רוחב)` follows existing pattern (like `sqrt(מרחק בריבוע)`). No rules broken, app regenerates cleanly.
