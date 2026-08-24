# חוזה-אפיון · חוט supporter-visible-for-designations
**שיטה:** Golden — 12 זוגות קלט⇒פלט הוקלטו מהרצת קוד-המקור עצמו (דטרמיניסטי, הורץ פעמיים).
**התחייבות:** הפלט זהה-ביט להקלטה לכל קלט מוקלט.
**פונקציה:** supporterVisibleForDesignations (2 ארגומנטים). **מוצא:** maor/src/components/supporters/lib.ts:55-74 (20 שורות) · תורגם TS→JS מכונה. · קודם במנוע-האוטומטי.

| קלט | פלט |
|---|---|
| "", "" | true |
| "", "אבג" | false |
| "", "כהן לוי" | false |
| "", "abc" | false |
| "", "a@b.com" | false |
| "", "2026-08-24" | false |
| "", "2026-08-24T12:00:00" | false |
| "", "0501234567" | false |
