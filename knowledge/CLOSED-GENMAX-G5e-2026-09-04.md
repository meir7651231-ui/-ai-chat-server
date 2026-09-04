# ✅ CLOSED · GENMAX · G5e — module-picker: ישות ⇒ מודול-הזהב הקרוב ⇒ retarget אוטומטי — הלולאה ישות⇒מודול סגורה (4.9.2026)

> שלב 5e של `PLAN-GENERATOR-MAX-2026-09-04.md`. עם G5c/G5d זה סוגר את הלולאה **"תן שם-ישות מהסכמה ⇒ קבל מודול מתקמפל שרונדר"** — בלי סשן, בלי מילון, בלי LLM. קוד: `retarget.mjs pickModule/picksTable` · CLI `retarget.mjs --entity <E>` · שער `retarget` (טבלת-הבחירה ל-49 ישויות-דומיין ≡ טרייה).

## איך הבורר מחליט (§20-ד · עובדות-מבנה בלבד)
לכל מודול-זהב: הזרע-הראשי (G5d) ⇒ (א) **מספר שמות-שדה זהים** עם הסכמה של E · (ב) **דמיון-פרופיל-טיפוסים** (קוסינוס על ספירת-קטגוריות Id/string/number/boolean/IsoDate/TimeHM/list/map/enum) · תיקו ⇒ סדר-המודולים. עוצמה: `strong` ≥4 שמות · `medium` 2–3 · `weak` ≤1 — **מוצהרת בפלט**, לא מוסתרת.

## מה נמדד לפני שנבחר (הכנות)
- **G2-ops מול ops-הזהב אינם מבחינים:** אוצר-ה-ops של shape-ops (aggregate/balance/broadcast/calendar…) ואוצר-ה-ops של ops-map (collection/format/summary/table…) שונים ⇒ כיסוי 20–40% אחיד ו"students" זוכה תמיד (הסט הגדול). זו אותה תהום שכיסה `OPFAM` הידני ב-G3 — נרשמת כפער-שפה בין G1 ל-G2 (איחוד-אוצרות = משימת-המשך, לא כאן).
- **שמות+צורה מבחינים:** Family⇒students (19 שמות · 0.96) · Course⇒courses (23 · 0.96) · Room⇒rooms (11 · 0.99) · Supporter⇒fees (11 · 0.98) · Member⇒students (16 · 0.91) · Payment/Donation/Hok⇒fees · WorkTask⇒dashboard.

## מדידה (49 ישויות-דומיין; Db/UiPrefs/NotifPrefs/ReportPrefs/SecurityCfg מוחרגות)
| עוצמה | ישויות |
|---|---|
| strong (≥4 שמות) | 25 |
| medium (2–3) | 19 |
| weak (≤1) | 5 (FamilyCred · KitItem · MatEntry · AyinCase · AuditEntry) |
`retarget.mjs --entity WorkTask` ⇒ dashboard ⇒ `gen_retarget_worktask_from_dash.dart` — analyze 0 · רונדר-בפועל (ראה commit). טבלת-הבחירה: `machtzev/generator/retarget-picks.json`.

## מה לא אומת (כנות)
- "הקרוב-ביותר" ≠ "הנכון-למטרה": הבורר מודד קרבה-מבנית לזרע, לא התאמה למשפט-הבעלים; ממשפט-בעברית (§22) עדיין חסר הצעד: משפט ⇒ ישות (קיים ב-`app-ds` `entity.interpret`) ⇒ **חיבור ל-pickModule** — G5f.
- ישויות `weak` יקבלו מודול עם מיפוי כמעט-ריק (הכול מקום-שמור) — מסך שעובד אך כמעט לא מציג את E; מוצהר.
- פער-השפה G1↔G2 (שני אוצרות-ops) נשאר פתוח — הוא מה שמונע בחירה לפי **פעולות-היסוד של המטרה** (L49) במקום לפי צורת-הזרע.

## אימות
`retarget.mjs --gate` ✓ (4 פלטים + טבלת-בחירה ≡) · analyze 0 · gen-verify (ראה commit) · police --fast ירוק.
