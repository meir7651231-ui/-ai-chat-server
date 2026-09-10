# ADR: Add בדיקה (Inspection) Entity to peruk12.txt

## Opening Question
**מה:** הוספת ישות בדיקה (inspection) ל-app "קניית רכב יד שנייה — לפני העברה"

**מקור:** מסמך משימה (task) — לא מפרוטו או preact קיים

**תרגום ל-dial:** 
- בדיקה לא תוצג כ-full screen, רק כ-dial עם:
  - שדה בחירת תיק (link)
  - שדה טקסט למה נבדק (required)
  - שדה בחירה תקין (yes/no)
  - table screen (dial עם שורות)
  - dashboard counter (מונה אי-תקינות)

**helper נדרש:** 
- `countFailedInspections(case)` — ספירת בדיקות שלא תקינות (תקין = לא)
- `filterInspectionsByStatus(inspections, status)` — סינון לפי תקין/לא תקין

**מחרוזות verbatim:** 
- בדיקה (inspection)
- תיק (case)
- מה נבדק (what was inspected)
- תקין (pass/OK) / לא תקין (failed/not OK)

**חסום (⛔):** שום דבר — הכל ממומשות בגנסיס

## Assumed Answer
- בדיקה היא ישות חדשה, בת-קשר לתיק (link חובה)
- יוצגת בטבלה + בדשבורד כמונה של הכשלים
- שלא תשנה את התנהגות תיק או משהו אחר בקיים
