# חוזה · חוט size-label
**תפקיד:** ‏id של גודל-ארגון (מאשף-ההרשמה) ⇒ תווית קריאה לתצוגה בלוח-הבקרה.
‏id מוכר ⇒ ה-label שלו; ‏id לא-מוכר ⇒ ה-id עצמו (עמידות לנתון ישן);
‏id חסר (undefined/null) ⇒ "—". תאום של החוט industry-label.
**שקעים (חוק-1 — הקבוע-השכן הוזרק כפרמטר-נתונים):**
- ‏sizes — מערך ‏{id, label, …} (במקור: ‏ORG_SIZES מ-signupWizard —
  ‏3 גדלים small/medium/large; החיווט מזריק את הרשימה החיה).
**קלט:** id (מחרוזת או undefined) · sizes. **פלט:** מחרוזת-תווית.
**דוגמאות מחייבות** (sizes = ערכי-האמת מ-maor/src/lib/signupWizard.ts:18-22 —
‏[{id:'small',label:'קטן'},{id:'medium',label:'בינוני'},{id:'large',label:'גדול'}]):
‏('small')→"קטן" · ‏('medium')→"בינוני" · ‏('large')→"גדול" ·
‏('no-such')→"no-such" (לא-מוכר ⇒ ה-id) · ‏(undefined)→"—" ·
‏('')→"" (נאמן-למקור: ‏?? תופס רק null/undefined — מחרוזת-ריקה אינה
נמצאת ברשימה וחוזרת כמו-שהיא, לא "—")
**מוצא:** maor/src/lib/signupWizard.ts:91-93 (‏sizeLabel, "תווית
התחום/הגודל לתצוגה (לוח הבקרה) — id → תווית קריאה").
