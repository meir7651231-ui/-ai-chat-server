# חוזה · קופסת-חיבורים "tour" (הסיור-המודרך)
**תפקיד:** הסיור-המודרך (spotlight) על המסכים האמיתיים — תסריט-הלגאסי מילה-במילה,
מסונן לפי מודולים פעילים, ממותג-מחדש פר-עסק (termOf), עם ניווט הבא/הקודם
וגאומטריית חלון-spotlight צמוד-viewport.

**מקור-האמת (L4):** ‏maor/src/lib/tour.ts —
כפתור-עצירה: ‏tour.ts:33 · תסריט TOUR_STEPS ‏(14 צעדים): ‏tour.ts:36-57 ·
‏tourSteps: ‏tour.ts:64-75 · ‏tourAdvance: ‏tour.ts:80-85 · ‏spotlightBox: ‏tour.ts:98-108.

**חיווט (כל התלות כאן, לא בחוטים):**
tour-stop-label · tour-steps(steps, isModuleOn, termOf, config?) ← term-of ·
tour-advance · spotlight-box.

**הכרעות-הקופסה (חיות כאן):**
1. **מילון-התסריט TOUR_STEPS** — 14 צעדים, כיתובים מילה-במילה מכיתובי-ההדמיה של
   הלגאסי (script:1133-1256), בסדר-הלגאסי; העמודות-המבודדות (tzedaka ⇒ shop)
   לפני settings (tour.ts:36-57 verbatim). באטום tour-steps זה שקע (`steps`) —
   התוכן הוכרע לקופסה.
2. **מילון-המיתוג** — termOf מחווט לתוך tourSteps; בלי config ⇒ הנוסח המקורי
   וזהות-אובייקט נשמרת (tour.ts:65,72).
3. **ריפוד ברירת-מחדל** ‏pad=10 — נשמר מהמקור דרך האטום (tour.ts:98).

**שקעי-IO מוזרקים (לא מימוש):**
· ‏isModuleOn ‏(module)⇒boolean — מצב-המודולים חי ב-store/config של המארח;
  מוזרק לכל קריאת ‏steps().
· המלבן ‏rect + ‏vw/vh — מדידת-DOM ‏(getBoundingClientRect/viewport) של המארח;
  מוזרקים כנתונים ל-‏spotlight() (חוק-1: אפס DOM בקופסה).

**חשיפה:**
‏TOUR_STOP_LABEL · ‏TOUR_STEPS · ‏steps(isModuleOn, config?) ·
‏advance(index, delta, length) · ‏spotlight(rect, vw, vh, pad?).

**דוגמאות מחייבות (קצה-לקצה דרך הקופסה):**
1. ‏TOUR_STOP_LABEL === '■ עצירת הדמיה (Esc)' · ‏TOUR_STEPS.length === 14 ·
   הצעד הראשון: '👋 הדמיה מלאה — המערכת מדגימה את עצמה, על הנתונים האמיתיים'.
2. ‏steps(הכול-דלוק) בלי config ⇒ 14 צעדים, כל אחד ===‎ (זהות) לצעד-המקור.
3. ‏steps(m ⇒ m !== 'courses') ⇒ 12 (שני צעדי-החוגים נשרו).
4. ‏steps(הכול-כבוי) ⇒ 6 — רק צעדים בלי module ‏(home×5 + settings).
5. ‏config עם terms ‏{nav.courses:'סדנאות', entity.course:'סדנה'} ⇒
   ‏'🎡 מאתר הסדנאות' · עוגן 'מצא סדנה' · 'חיזוי סדנאות: רק תואמי גיל ומגדר';
   ‏nav.families חסר ⇒ 'מאתר המשפחות' נשאר וזהות-הצעד נשמרת.
6. דריסת-מונח רווחים-בלבד ('  ') ⇒ fallback, זהות-הצעד נשמרת (term-of).
7. ‏advance: ‏(0,+1,14)=1 · ‏(0,−1,14)=0 · ‏(13,+1,14)=null · ‏(3,−1,14)=2 ·
   ‏(0,+1,0)=null.
8. ‏spotlight(null,…)=null · מידות-0 ⇒ null ·
   ‏rect {left:5,top:5,width:50,height:20}, vw=100, vh=100 ⇒
   ‏{left:0, top:0, width:70, height:40} (נצמד ל-0, מוגבל ל-viewport) ·
   ‏pad=0 ⇒ המלבן עצמו.

**DoD (נכתב לפני הקוד — דיבר 12):**
· `node new/boxes/tour.test.mjs` ⇒ exit 0 (כולל מגן-הכרעה על מקור-הקופסה)
· `node /home/user/maor-system/machtzev/parity/tour.parity.mjs` ⇒ exit 0,
  אפס-סטייה ישן≡חדש על קורפוס-LCG ‏seed=20260824.

**הבטחה:** ניתוק כל חוט מהקופסה לא נוגע באף חוט אחר.
