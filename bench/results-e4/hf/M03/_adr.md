# Opening Question & Decision

## Context
Task M03: Add to the case report (דוח תיק) in sechirut.txt a section named סיכום, built from three new content lines, one of which must be exactly "הבטוחות ייבדקו מול התקרה".

## Opening Question
Should the סיכום section be added as a content group (תוכן סיכום) with three content items, referenced by a new דוח תיק line?

## Assumed Answer
Yes. The spec language allows `דוח <ישות>: <שם> = [תוכן <קבוצה>]` to reference a content group. I will:
1. Create `תוכן סיכום: <line1>`, `תוכן סיכום: <line2>`, `תוכן סיכום: <line3>`
2. Add `דוח תיק: סיכום = [תוכן סיכום]` to render the section
3. One line must be exactly "הבטוחות ייבדקו מול התקרה"

## Rationale
- The spec language shows `דוח תיק` with references to content groups (line 40–41 show `[תוכן לא נבדק]` and `[תוכן הסתייגות]`)
- Content groups allow logical grouping of text items that render as a section
- This preserves the structure and doesn't break existing functionality

## Verification
Machine will check: `regen_ok`, `no_hand_edit`, `byte_identical_others`, `gates_pass`, `no_hebrew_in_engine`, `dart_math_sane`, plus task checks.
