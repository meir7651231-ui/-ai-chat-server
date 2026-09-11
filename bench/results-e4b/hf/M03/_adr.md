# ADR-M03: Add Summary Section to Sechirut Case Report

## Opening Question
**Q:** Where should the new "סיכום" (summary) section be placed in the report structure, and should it reference an existing content group or create a new one?

**Assumed Answer:** 
- Create a new content group "סיכום" (not an existing category like בדיקה/חוק)
- Add it as a new report section: `דוח תיק: סיכום = [תוכן סיכום]`
- Place it logically between existing sections (likely after חישוב בטוחות, before בקשות לשינוי)
- Add exactly three content lines to the סיכום group
- Ensure one line reads exactly: "הבטוחות ייבדקו מול התקרה"

## Rationale
- A "סיכום" (summary) is a distinct type of report section, different from חוק (law), בדיקה (checks), etc.
- By creating a new group, it avoids mixing concerns and makes the report structure clearer
- Three summary lines provide balanced coverage without bloating the report
- The required line about ceiling checks is a natural summary point about guarantee validation
