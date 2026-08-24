# חוזה · חוט can-granted-action
**תפקיד:** הרשאת פעולה-הרסנית/מוגבלת אחידה (הכרעת-בעלים 23.8 במקור: "מנהל
תמיד · הדלקה-פר-עובד"): מנהל-ארגון ⇒ תמיד מותר; אחרת אדמין (לפי השקע) ⇒
מותר; אחרת רק אם הדגל הודלק במפורש ‏features[key]===true (שוויון קשיח —
מחרוזת 'true' או truthy אחר לא נחשבים).
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏isAdminUser(config, email)⇒boolean — בורר-האדמין השכן (במקור: רשימת
  adminEmails ריקה=כולם-אדמין). קיצור-חישוב: כש-isManager=true השקע לא נקרא.
**קלט:** ‏config (עם ‏features?) · ‏email · ‏isManager (boolean) · ‏key
(שם-דגל) · השקע isAdminUser. **פלט:** boolean.
**דוגמאות מחייבות:**
1. ‏isManager=true ⇒ true — והשקע isAdminUser כלל לא נקרא (קיצור-חישוב).
2. ‏isManager=false, השקע מחזיר true ⇒ true.
3. ‏isManager=false, אדמין=false, ‏features={'x.del':true}, key='x.del' ⇒ true.
4. כנ״ל אבל ‏features={'x.del':'true'} (מחרוזת) ⇒ false (‏===true קשיח).
5. ‏features חסר לגמרי ⇒ false.
6. ‏features={'x.del':false} ⇒ false.
**מוצא:** maor/src/lib/config.ts:687-696 (‏canGrantedAction — משטח-הרשאה
יחיד לכל המסכים). השכן isAdminUser הפך לשקע (חוק-1).
