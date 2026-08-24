# חוזה · חוט industry-label
**תפקיד:** ‏id של תחום-עסק (מאשף-ההרשמה) ⇒ תווית קריאה לתצוגה בלוח-הבקרה.
‏id מוכר ⇒ ה-label שלו; ‏id לא-מוכר ⇒ ה-id עצמו (עמידות לנתון ישן);
‏id חסר (undefined/null) ⇒ "—".
**שקעים (חוק-1 — הקבוע-השכן הוזרק כפרמטר-נתונים):**
- ‏industries — מערך ‏{id, label, …} (במקור: ‏WIZARD_INDUSTRIES —
  נגזר מ-VERTICAL_PACKS, ‏13 חבילות; החיווט מזריק את הרשימה החיה).
**קלט:** id (מחרוזת או undefined) · industries. **פלט:** מחרוזת-תווית.
**דוגמאות מחייבות** (industries = ‏[{id:'chesed',label:'עמותת חסד'},
{id:'clinic',label:'קליניקה'}] — ערכי-אמת מ-verticalPacks):
‏('chesed')→"עמותת חסד" · ‏('clinic')→"קליניקה" ·
‏('no-such')→"no-such" (לא-מוכר ⇒ ה-id) · ‏(undefined)→"—" ·
‏('')→"" (נאמן-למקור: ‏?? תופס רק null/undefined — מחרוזת-ריקה אינה
נמצאת ברשימה וחוזרת כמו-שהיא, לא "—")
**מוצא:** maor/src/lib/signupWizard.ts:88-90 (‏industryLabel, "תווית
התחום/הגודל לתצוגה (לוח הבקרה) — id → תווית קריאה").
