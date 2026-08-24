# חוזה · חוט enrollment-quote
**תפקיד:** תמחור-משוקלל מתוך שדות-שיבוץ שמורים: שער-הכניסה בודק שהחוג
פר-שיעור ושכל שדות-התדירות קיימים — אחרת null; כשעוברים — מאציל לשקע
weightedQuote עם ‏{freq, unit:freqUnit, term, months:termMonths, tier:e.tier||''}
(tier חסר/ריק ⇒ '' = מחיר-מלא). החוט אינו מחשב בעצמו — הוא שער+נירמול.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏weightedQuote(c, {freq, unit, term, months?, tier}) ⇒ ‏{lessons, perLesson, total}
  — התמחור-המשוקלל של maor: ‏total = round(שיעורים-בתקופה × מחיר-לשיעור-אחרי-הנחה).
**קלט:** c — חוג עם ‏perLesson? · e — שיבוץ עם ‏freq?/freqUnit?/term?/termMonths?/tier?
· השקע weightedQuote. **פלט:** ‏WeightedQuote או null.
**דוגמאות מחייבות (weightedQuote-לבדיקה מחזיר {lessons:8, perLesson:50, total:400} ומתעד את קריאתו):**
1. ‏c={perLesson:false, lessonPrice:50}, e={freq:2, freqUnit:'week', term:'monthly'} ⇒ null (החוג אינו פר-שיעור) — השקע כלל לא נקרא.
2. ‏c={perLesson:true}, e={freqUnit:'week', term:'monthly'} (בלי freq) ⇒ null.
3. ‏c={perLesson:true}, e={freq:2, freqUnit:'week'} (בלי term) ⇒ null.
4. ‏c={perLesson:true}, e={freq:2, freqUnit:'week', term:'months', termMonths:3, tier:'1'} ⇒ ‏{lessons:8, perLesson:50, total:400}; השקע נקרא עם ‏(c, {freq:2, unit:'week', term:'months', months:3, tier:'1'}).
5. ‏c={perLesson:true}, e={freq:1, freqUnit:'month', term:'year'} (בלי tier) ⇒ השקע נקרא עם ‏tier:'' ו-months:undefined.
**מוצא:** maor/src/components/courses/lib.ts:298-303 (‏enrollmentQuote, "תמחור
משוקלל מתוך שדות-שיבוץ שמורים (או null...)"); ‏weightedQuote — שכן מאותו קובץ —
הפך לשקע (חוק-1).
