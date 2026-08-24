# חוזה · חוט group-palette-results
**תפקיד:** קיבוץ תוצאות-הפלטה לדליי-סוג — מיון **יציב** לפי דלי (סדר-הדליים
של השקע), שמירת סדר-הרלוונטיות בתוך כל דלי, וכותרת `section` על הפריט הראשון
של כל קבוצת-כותרת. שני דליים עם אותה כותרת ('nav-'/'act-' בלגאסי) — הכותרת
לא מוכפלת. פריט שלא נופל לאף דלי ⇒ ממוין אחרון, ‏section=undefined.
**שקעים (חוק-1 — קריאות-שכנים הוזרקו כפרמטרים):**
- ‏buckets(config?) ⇒ ‏[prefix,label][] — סדר-הדליים והכותרות; ‏config עובר
  אליו כמות-שהוא (במקור הכותרות עוברות termOf פר-עסק — paletteGroups.ts:23-39).
- ‏bucketOf(key) ⇒ מספר-דלי — אינדקס הקידומת הראשונה ש-key מתחיל בה;
  אין-התאמה ⇒ אורך-המערך (במקור: paletteGroups.ts:41-45, לא תלוי config).
**קלט:** ‏items (מערך ‏{key,…}) · ‏config (מועבר לשקע) · שני השקעים.
**פלט:** מערך חדש — הפריטים עם ‏section על ראשון-בכל-קבוצה (השאר undefined).
**דוגמאות מחייבות** (עם buckets = ‏[['nav-','ניווט ופעולות'],['act-','ניווט ופעולות'],['fam-','משפחות']] ו-bucketOf חוזי):
1. מיון-לדליים + כותרות: ‏[{key:'fam-1'},{key:'nav-a'}] ⇒
   ‏[{key:'nav-a',section:'ניווט ופעולות'},{key:'fam-1',section:'משפחות'}].
2. כותרת משותפת לא מוכפלת: ‏[{key:'nav-a'},{key:'act-b'}] ⇒
   ‏[{key:'nav-a',section:'ניווט ופעולות'},{key:'act-b',section:undefined}].
3. יציבות בתוך דלי: ‏[{key:'fam-b'},{key:'fam-a'}] ⇒ הסדר נשמר —
   ‏fam-b (עם ‏section:'משפחות') לפני ‏fam-a (‏section:undefined).
4. לא-מזוהה אחרון ובלי כותרת: ‏[{key:'zzz'},{key:'nav-a'}] ⇒
   ‏[{key:'nav-a',section:'ניווט ופעולות'},{key:'zzz',section:undefined}].
5. ריק ⇒ ‏[].
**מוצא:** maor/src/lib/paletteGroups.ts:51-64 (‏groupPaletteResults — ratchet
מהלגאסי legacy-main-script.js:2373: תוצאות-חיפוש מקובצות תחת כותרות-סוג);
השכנים buckets+bucketOf הפכו לשקעים (חוק-1).
