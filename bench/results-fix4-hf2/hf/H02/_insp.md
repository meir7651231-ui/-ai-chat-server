# INSPECTION — Sort Cases by Rent (Highest First)

## Audit Checklist

**Task coverage:** Cases table (תיק particle) now displays with rent (שכירות) sorted descending ✅

**Entity list:** תיק entity with fields: לקוח, טלפון, עיר, שכירות, חודשים, מועד חתימה, מתווך, אופציה, החלטה — all accessible ✅

**Particle table:** [טבלה] with sort applied; sort column verified as c19 = 'שכירות' ✅

**Hub/Report:** No changes to דוח תיק (report) — task is sorting only ✅

**Numeric field:** שכירות field is numeric; sort uses `compareTo()` on parsed numbers (desc) ✅

**Edge case:** Empty rent values handled by sort logic (empty treated as lowest) ✅

**Navigation:** No new screens or nav changes; table embedded in px1 particle screen ✅

**Text parity:** No new strings added; only spec line 22 changed with sort directive ✅

## Verification Points

- Spec line 22: `חלקיק תיק: [טבלה] | מיון: שכירות יורד` ✅
- Generated code line 3 comment: `טבלה מיון שכירות יורד = [טבלה] | מיון: שכירות יורד ⇒ table` ✅
- Sort logic line 34: `return -c;` (negative = descending) ✅
- Column definition verified: `gen_app_sechirut_px1_c19 = 'שכירות'` ✅
- Dart compiles with 0 errors ✅
- Other apps byte-identical ✅

## VERDICT: GO

All checks pass. Task complete with no breaking changes.
