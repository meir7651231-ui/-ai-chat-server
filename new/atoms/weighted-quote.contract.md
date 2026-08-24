# חוזה · חוט weighted-quote
**תפקיד:** תמחור-משוקלל לחוג פר-שיעור — מרכיב מחיר-לשיעור × מספר-שיעורים לתקופה
לכדי הצעת-מחיר: ‏`lessons` מעוגל ל**חצי-שיעור** לתצוגה (‏round(raw×2)/2),
‏`total` מעוגל ל**שקל שלם** (round(raw×perLesson) — על ה-raw, לא על המעוגל!),
‏`perLesson` מוחזר כפי שהשקע החזירו.
**שקעים (חוק-1 — שכני-הקובץ הוזרקו כפרמטרים):**
- ‏lessonPriceForTier(c, tier) ⇒ מספר — מחיר-לשיעור לפי רמת-ההנחה (במקור: שכן באותו קובץ).
- ‏lessonsInTerm(freq, unit, term, months) ⇒ מספר — מספר-השיעורים בתקופה (שכן).
**קלט:** ‏c (חוג) · ‏opts {freq, unit, term, months?, tier} · שני השקעים.
**פלט:** ‏{ lessons, perLesson, total }.
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. העברת-ארגומנטים מדויקת: ‏opts={freq:1, unit:'week', term:'monthly', months:3, tier:'2'}
   ⇒ ‏lessonPriceForTier נקרא עם ‏(c,'2') ו-lessonsInTerm עם ‏(1,'week','monthly',3).
2. ‏raw=13/3 (שיעור-שבועי לחודש: 52/12), ‏perLesson=80 ⇒
   ‏lessons=4.5 (‏26/3≈8.67⇒9⇒4.5) · ‏total=347 (‏1040/3≈346.67⇒347) · ‏perLesson=80.
3. ‏raw=1 (term='once'), ‏perLesson=100 ⇒ ‏{lessons:1, perLesson:100, total:100}.
4. ‏raw=26/3 (פעמיים-בשבוע לחודש), ‏perLesson=45 ⇒ ‏lessons=8.5 (‏52/3≈17.33⇒17⇒8.5)
   · ‏total=390 (‏390 בדיוק — העיגול על ה-raw ⇒ אין סחף-חצאים).
5. ‏raw=0 (תדירות-אפס), ‏perLesson=200 ⇒ ‏{lessons:0, perLesson:200, total:0}.
**מוצא:** maor/src/components/courses/lib.ts:288-295 (‏weightedQuote — תמחור-משוקלל,
מרתון-החוגים). השכנים lessonPriceForTier/lessonsInTerm הפכו לשקעים (חוק-1).
