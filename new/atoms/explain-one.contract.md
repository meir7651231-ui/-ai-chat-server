# חוזה · חוט explain-one
**תפקיד:** תיאור-שיחה יחיד (המשתמש מנסה מספר/שעה ספציפיים): בונה tenant גולמי
מקונפיג-הטלפוניה, מאמת, ואם תקין — מריץ את מסביר-השיחה עם עוגן-היום וחלון-לוח
‎400 יום. תצורה לא-תקינה ⇒ הודעת-שגיאה מרוכזת בלי להריץ סימולציה כלל.
**שקעים (חוק-1 — קריאות-לשכנים הוזרקו כפרמטרים):**
- ‏telephonyToTenant(tc, orgName, tenantId) ⇒ tenant גולמי (אובייקט).
- ‏validateTenant(raw) ⇒ ‏{ok:boolean, errors:string[], tenant?} — האימות.
- ‏explainCall(tenant, call, opts) ⇒ ‏{summary, outcome, reason} — הסימולטור.
- ‏anchorToday() ⇒ מחרוזת ISO של היום (מוזרק ⇒ האטום דטרמיניסטי).
**קלט:** tc (קונפיג-טלפוניה) · orgName · tenantId · call (תיאור-השיחה) · 4 השקעים.
**פלט:** ‏{summary:string, outcome:string, reason:string}.
**דוגמאות מחייבות:**
1. אימות נכשל — ‏validateTenant ⇒ ‏{ok:false, errors:['אין שלוחות','חסר מספר']} ⇒
   הפלט ‏{summary:'⚠️ תצורה לא-תקינה: אין שלוחות · חסר מספר', outcome:'invalid', reason:''}.
2. בנכשל — ‏explainCall ו-anchorToday **לא נקראים כלל** (0 קריאות).
3. אימות עבר — ‏explainCall ⇒ ‏{summary:'ניתוב לשלוחה 1', outcome:'route', reason:'שעות-פעילות'}
   ⇒ הפלט זהה שדה-שדה (העברה 1:1, בלי שדות נוספים).
4. ‏explainCall מקבל בדיוק: את ‏v.tenant (לא את ה-raw!), את ה-call כמו-שהוא,
   ואת ‏{anchorDate: anchorToday(), calendarWindow: 400} — עם ‏anchorToday()='2026-08-24'
   מוזרק ⇒ ‏opts.anchorDate==='2026-08-24' ו-‏opts.calendarWindow===400.
5. ‏telephonyToTenant נקרא עם ‏(tc, orgName, tenantId) כלשונם, והתוצר raw מועבר
   ל-validateTenant ללא-שינוי (זהות-הפניה).
**מוצא:** maor/src/components/telephony/lib.ts:199-206 (‏explainOne — "מריץ
תיאור-שיחה יחיד"). ‏anchorToday במקור קורא ‎new Date()‎ — הוזרק כשקע כדי לשמור
על טוהר דטרמיניסטי (חוק-5).
