# חוזה · קופסת-חיבורים "שער-יציאת-המידע" (export-gate)
**תפקיד:** נקודת-החנק היחידה לפני כל הורדה/הדפסה/העתקה (בקשת-בעלים 13.8
"כפתור שמבטל לעובד כל הוצאת מידע" — exportGate.ts:2-3). המנהל מכבה
`core.export` בכרטיס-העובד ⇒ App קורא `setExportBlocked` ⇒ כל נתיב-יציאה
שואל `guardExport`/`exportAllowed` ועוצר. הקופסה מחווטת את שלושת החוטים
ומחזיקה את **המצב** שבמקור היה שני משתני-מודול (exportGate.ts:15-16).

**החיווט (גרף-המקור):**
- ‏set-export-blocked — מחשב את אובייקט-המצב ‏{blocked, notify} ‏(ts:19-22).
- ‏export-allowed — הכרעה טהורה ‏!blocked ‏(ts:25-27).
- ‏guard-export — חסום ⇒ ‏notify?.() + ‏false; מותר ⇒ ‏true ‏(ts:33-39).

**הכרעות שחיות בקופסה (לא בחוטים):**
1. **לידה-מותרת:** ‏blocked=false · notify=null ‏(ts:15-16 — "ברירת-המחדל
   כאן = מותר, כך שכל הבדיקות והמשתמשים הרגילים אינם מושפעים", ts:11-12;
   חוזה-הדגלים: חסר=מותר, רק false חוסם).
2. **החזקת-המצב:** ההשמה למשתני-המודול של המקור ⇒ סגירת-מצב בקופסה;
   כל `setExportBlocked` **מחליף** את שניהם יחד (גם התרעה חסרה מוחקת את
   הקודמת — ‏`?? null`, ‏ts:21).
3. **מופע-מודול-יחיד:** כמו במקור — ‏`gate` יחיד + שלוש פונקציות-מודול
   בחתימות-המקור; ‏`createExportGate()` נחשף גם הוא (ריבוי-שערים = חיווט
   עתידי של לוח-האם, המצב לא דולף בין מופעים).

**שקעי-IO:** ‏onBlocked (ה-toast) הוא פרמטר-מוזרק — הקופסה לעולם לא נוגעת
ב-DOM/toast בעצמה; ההורדה/ההדפסה עצמן נשארות אצל הקוראים (לוח-האם).

**חשיפה:** ‏createExportGate() ⇒ ‏{setExportBlocked(isBlocked, onBlocked?),
exportAllowed():boolean, guardExport():boolean} · ‏gate (המופע-היחיד) ·
‏setExportBlocked/exportAllowed/guardExport (פונקציות-מודול על ‏gate).

**דוגמאות מחייבות:**
1. שער טרי: ‏exportAllowed() ⇒ ‏true · ‏guardExport() ⇒ ‏true (לידה-מותרת).
2. ‏setExportBlocked(true, spy) ⇒ ‏exportAllowed() ⇒ ‏false; ‏guardExport()
   ⇒ ‏false ו-spy נקרא **בדיוק פעם אחת** לכל קריאת-guard; ‏exportAllowed
   **אינו** מריץ את ה-spy (הכרעה שקטה — ts:25-27).
3. ‏setExportBlocked(false) אחרי חסימה ⇒ שניהם ‏true, ה-spy לא נקרא עוד.
4. ‏setExportBlocked(true) בלי התרעה ⇒ ‏guardExport() ⇒ ‏false בלי קריסה
   ‏(?.‏, ts:35).
5. החלפת-התרעה: ‏set(true, spy1) ואז ‏set(true, spy2) ⇒ guard מריץ spy2
   בלבד; ‏set(true, undefined) אחרי spy ⇒ ההתרעה **נמחקה** (spy לא נקרא).
6. שני ‏createExportGate() ⇒ מצבים בלתי-תלויים (חסימת-אחד לא נוגעת בשני).

**DoD (נכתב לפני הקוד):** ‏node new/boxes/export-gate.test.mjs ⇒ exit 0 ·
‏node /home/user/maor-system/machtzev/parity/export-gate.parity.mjs ⇒ exit 0
(רתמת-זהב: המקור מתורגם-חי ≡ הקופסה על קורפוס-LCG seed=20260824, אפס-סטייה).

**מוצא:** maor/src/lib/exportGate.ts (כל הקובץ, 39 שורות): מצב ‏ts:15-16 ·
‏setExportBlocked ‏ts:19-22 · ‏exportAllowed ‏ts:25-27 · ‏guardExport ‏ts:33-39.
