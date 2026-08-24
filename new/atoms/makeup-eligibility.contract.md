# חוזה · חוט makeup-eligibility
**תפקיד:** זכאות-השלמה לחיסור (באג #7, הכרעת בעלים "תלוי אם מוצדק או רשלנות").
No-Show לעולם לא זכאי; ביטול מוצדק זכאי תמיד; ביטול מוקדם (≥48 שעות מראש) זכאי גם בלי
סימון "מוצדק". `dropsPunch` = אי-זכאות מורידה ניקוב מהכרטיסייה.
**קלט:** kind ‏('cancel'|'noshow') · justified ‏(boolean) · rawHrs ‏(שעות-מראש, מספר או null).
**פלט:** `{ eligible, dropsPunch }` — תמיד הפוכים זה מזה למעט no-show (שם שניהם נובעים מאי-זכאות).
**דוגמאות מחייבות:**
‏('noshow', true, 100) → `{eligible:false, dropsPunch:true}` (רשלנות — גם מוצדק+מוקדם לא מציל) ·
‏('cancel', true, 2) → `{eligible:true, dropsPunch:false}` (מוצדק מנצח גם מתחת ל-48) ·
‏('cancel', false, 48) → `{eligible:true, dropsPunch:false}` (גבול ה-48 בדיוק — זכאי) ·
‏('cancel', false, 47.5) → `{eligible:false, dropsPunch:true}` ·
‏('cancel', false, null) → `{eligible:false, dropsPunch:true}` (אין שעות ⇒ אין ביטול-מוקדם) ·
‏('cancel', true, null) → `{eligible:true, dropsPunch:false}`
**מוצא:** maor/src/components/diary/lib.ts:67-76 — ביט-זהה, אפס שקעים.
