# חוזה · חוט need-label
**תפקיד:** מזהה-צורך מאשף-ההרשמה (SIGNUP3, שלב-הצרכים) ⇒ התווית העברית
לתצוגה. מזהה שלא נמצא בקטלוג ⇒ מוחזר המזהה עצמו (נפילה-רכה — הפרופיל
שנזרע ל-platformRequests תמיד ניתן-להצגה).
**שקעים (חוק-1 — קבוע-שכן הוזרק כפרמטר):**
- ‏orgNeeds — מערך ‏{id:string, emoji:string, label:string} (במקור: ORG_NEEDS —
  7 צרכים: crm/billing/schedule/inventory/reports/multi/backup).
**קלט:** ‏id (מחרוזת) + השקע orgNeeds. **פלט:** תווית (מחרוזת).
**דוגמאות מחייבות** (עם orgNeeds-המקור):
1. ‏'crm' ⇒ ‏'ניהול לקוחות ואנשי קשר'.
2. ‏'billing' ⇒ ‏'גבייה, תשלומים וקבלות'.
3. ‏'backup' ⇒ ‏'גיבוי ואבטחת מידע'.
4. ‏'nosuch' ⇒ ‏'nosuch' (לא בקטלוג ⇒ המזהה עצמו).
5. עם ‏orgNeeds=[] ⇒ ‏'crm' ⇒ ‏'crm' (קטלוג ריק ⇒ נפילה-רכה למזהה).
**מוצא:** maor/src/lib/signupWizard.ts:94-97 (‏needLabel). ‏ORG_NEEDS הפך לשקע.
