# חוזה · חוט tour-steps
**תפקיד:** בניית צעדי-הסיור לתצוגה: סינון לפי מודולים פעילים (צעד בלי `module`
תמיד נשאר) + מיתוג-מחדש של כיתובים/עוגנים דרך termOf. בלי config ⇒ הנוסח
המקורי מילה-במילה, והצעד מוחזר **זהה-זהות** (אותו אובייקט, אפס-העתקה).
ההחלפות: 'מאתר המשפחות'⇒'מאתר ה'+T(nav.families) · 'מאתר החוגים'⇒'מאתר
ה'+T(nav.courses) · 'חיזוי חוגים'⇒'חיזוי '+T(nav.courses) · עוגן 'מצא
חוג'⇒'מצא '+T(entity.course).
**שקעים (חוק-1 — במקור היו שכנים):** ‏steps — מערך-הצעדים המוזרק (במקור הקבוע
TOUR_STEPS) · ‏isModuleOn ‏(module)⇒boolean · ‏termOf ‏(config,key,fallback)⇒string
(נקרא רק כש-config נמסר).
**קלט:** ‏steps · ‏isModuleOn · ‏termOf · ‏config? — צעד = ‏{view, caption,
anchorText?, module?}. **פלט:** מערך-צעדים מסונן וממותג.
**דוגמאות מחייבות (steps: בית בלי-module · משפחות 'מאתר המשפחות'/'סינון מורחב' ·
חוגים 'מאתר החוגים'/'מצא חוג' · חוגים 'חיזוי חוגים: רק תואמים'):**
1. הכול-דלוק, בלי config ⇒ 4 צעדים, כל אחד ===‎ לצעד-המקור (זהות נשמרת).
2. ‏isModuleOn: courses=false ⇒ נשארים 2 (בית + משפחות).
3. ‏config עם terms ‏{nav.courses:'סדנאות', entity.course:'סדנה'} ⇒
   ‏caption 'מאתר הסדנאות' · ‏anchorText 'מצא סדנה' · ‏'חיזוי סדנאות: רק תואמים'.
4. באותו config, ‏nav.families חסר ⇒ נפילה ל-fallback: 'מאתר המשפחות' נשאר.
**מוצא:** maor/src/lib/tour.ts:64-75 (‏tourSteps); התוספת היחידה: שיקוע
TOUR_STEPS/termOf.
