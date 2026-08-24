# חוזה · חוט deliveries-csv-rows
**תפקיד:** שורות-CSV של כל מסירות-החלוקה (SHOP7) — כותרת ‏['תאריך',
<מונח-משפחה>, 'כתובת', 'מתנדב', 'סטטוס', 'הערה'] ואז שורה פר-מסירה, בסדר
‏db.deliveries. שקיפות מלאה: מסירות שטרם נמסרו מופיעות בסטטוסן, לא מוסתרות.
פתירת-מזהים מקומית: תאריך מ-distributionDays לפי dayId · שם-משפחה וכתובת
מ-families לפי familyId (כתובת = ‏[address, city] כל אחד ב-trim, ריקים
מסוננים, מחוברים ב-', ') · שם-מתנדב מ-volunteers לפי volunteerId; מזהה
שלא נמצא ⇒ '' (לא קריסה). הערה חסרה ⇒ ''. תצוגה בלבד — אפס כסף/S-.
**שקעים (חוק-1 — קריאות-שכן הוזרקו כפרמטרים):**
- ‏termOf(config, key, fallback) — מילון-המונחים; נקרא **רק כש-config סופק**
  (config חסר ⇒ ה-fallback ישירות, השקע לא מופעל).
- ‏statusLabel(status) — תווית-סטטוס לתצוגה (במקור: pickup='איסוף' ·
  enroute='בדרך' · delivered='נמסר').
**קלט:** ‏db ({deliveries, distributionDays, families, volunteers}) · ‏config
(אופציונלי) · שני השקעים. **פלט:** מערך-מערכים ‏(string|number)[][].
**דוגמאות מחייבות** (בכולן ‏statusLabel כבמקור; ‏termOf=(c,k,fb)=>c.terms?.[k]??fb;
‏db הבסיסי: ‏distributionDays=[{id:'d1',date:'2026-08-01'}] ·
‏families=[{id:'f1',name:'כהן',address:' הרצל 3 ',city:'צפת'},{id:'f2',name:'לוי',address:'',city:''}] ·
‏volunteers=[{id:'v1',name:'משה'}] ·
‏deliveries=[{dayId:'d1',familyId:'f1',volunteerId:'v1',status:'pickup',note:'דחוף'},{dayId:'dX',familyId:'f2',volunteerId:'vX',status:'delivered'}]):
1. עם ‏config={terms:{'entity.family':'לקוח'}} — שורת-הכותרת:
   ‏['תאריך','לקוח','כתובת','מתנדב','סטטוס','הערה'] (המונח דרך termOf).
2. שורת המסירה הראשונה: ‏['2026-08-01','כהן','הרצל 3, צפת','משה','איסוף','דחוף']
   — הכתובת עברה trim וחוברה ב-', '.
3. שורת המסירה השנייה: ‏['','לוי','','','נמסר',''] — יום/מתנדב לא-נמצאים ⇒ '',
   כתובת ריקה ⇒ '' (לא ', '), note חסר ⇒ ''.
4. בלי config (undefined) — הכותרת ‏['תאריך','משפחה','כתובת','מתנדב','סטטוס','הערה']
   ושקע-termOf לא נקרא כלל (גם termOf שזורק — לא מופעל).
5. ‏deliveries=[] ⇒ מוחזרת שורת-הכותרת בלבד (אורך 1).
6. סה"כ ב-db הבסיסי: 3 שורות (כותרת + 2 מסירות), בסדר db.deliveries.
**מוצא:** maor/src/components/shop7/lib.ts:114-135 (‏deliveriesCsvRows —
CONNECT ייצוא + גל ב׳ עמודת-כתובת). השכנים termOf (lib/config) ו-statusLabel
(אותו lib.ts) הפכו לשקעים (חוק-1).
