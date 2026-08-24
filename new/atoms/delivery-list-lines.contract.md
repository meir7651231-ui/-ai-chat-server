# חוזה · חוט delivery-list-lines
**תפקיד:** שורות תדפיס ליום-חלוקה, מקובצות פר-מתנדב: כותרת
`🦺 <מתנדב> (<N> מסירות)` ואז שורה-פר-מסירה
`  • <משפחה> · <תווית-סטטוס>` + ‏` · 📍 <כתובת>` (רק כשיש address) +
‏` · <הערה>` (רק כשיש note). סדר-הקיבוץ = סדר-ההופעה-הראשונה של כל מתנדב
(Map). ‏familyName/volunteerName/address מוזרקים ב-caller. טהור, תצוגה בלבד.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏statusLabel(status)→string — תווית-הסטטוס לתצוגה (במקור: 'pickup'→'איסוף' ·
  'enroute'→'בדרך' · 'delivered'→'נמסר').
**קלט:** ‏rows = מערך {familyName, volunteerName, status, address?, note?} + השקע.
**פלט:** string[].
**דוגמאות מחייבות (rows=[
{familyName:'כהן',volunteerName:'דוד',status:'pickup'},
{familyName:'לוי',volunteerName:'שרה',status:'delivered',address:'הרצל 3'},
{familyName:'מזרחי',volunteerName:'דוד',status:'enroute',note:'קומה 2'}],
statusLabel כנ"ל):** אורך=5 ·
‏[0]='🦺 דוד (2 מסירות)' · ‏[1]='  • כהן · איסוף' ·
‏[2]='  • מזרחי · בדרך · קומה 2' (הערה בלי 📍) ·
‏[3]='🦺 שרה (1 מסירות)' · ‏[4]='  • לוי · נמסר · 📍 הרצל 3' (כתובת עם 📍).
**דוגמת ריק:** ‏rows=[] ⇒ [].
**מוצא:** חולץ כלשונו מ-maor/src/components/shop7/lib.ts:86-113 (גל ב׳ —
דף-מסלול למתנדב); השכן statusLabel שוקע (חוק-1).
