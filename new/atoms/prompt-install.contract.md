# חוזה · חוט prompt-install
**תפקיד:** הפעלת דיאלוג-ההתקנה של PWA (הכפתור המפורש, לא הבאנר-האוטומטי):
מקבל את אירוע-ההתקנה-הדחוי, מריץ את הדיאלוג ומחזיר האם המשתמש אישר.
בלי אירוע (null) ⇒ ‏false מיידי, אפס תופעות-לוואי. אסינכרוני.
**שקעים (חוק-1 + חוק-5 — מצב-הדפדפן הוזרק, לא נשמר באטום):**
- ‏d — אירוע-ההתקנה-הדחוי (‏beforeinstallprompt שנלכד), או ‏null. צורתו:
  ‏{prompt: ()⇒Promise<void>, userChoice: Promise<{outcome: string}>}.
  במקור d היה מצב-מודול (‏deferredInstall) שנלכד ממאזין-window ואופס אחרי
  שימוש — **הלכידה והאיפוס הם חיווט-קופסה** (ה-DOM נשאר מחוץ לאטום).
**קלט:** ‏d (או null). **פלט:** ‏Promise<boolean> — האם ‏outcome==='accepted'.
**דוגמאות מחייבות:**
1. ‏d=null ⇒ ‏false — ואף שקע לא הופעל.
2. ‏userChoice⇒{outcome:'accepted'} ⇒ ‏true.
3. ‏userChoice⇒{outcome:'dismissed'} ⇒ ‏false.
4. ‏outcome זר ('unknown') ⇒ ‏false — רק 'accepted' מחזיר true.
5. סדר-הפעולות: ‏d.prompt() נקרא **בדיוק פעם אחת**, לפני ההמתנה ל-userChoice.
**מוצא:** maor/src/lib/pwa.ts:37-43 (‏promptInstall — כפתור-ההתקנה המפורש).
מצב-המודול deferredInstall הפך לפרמטר-שקע; האיפוס-אחרי-שימוש עבר לקופסה.
