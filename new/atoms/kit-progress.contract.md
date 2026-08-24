# חוזה · חוט kit-progress
**תפקיד:** התקדמות צ'ק-ליסט ערכת-התקנה/מסירה של פרויקט (AyinCase.kit,
ורטיקל-הסטודיו): כמה סומנו-הושלמו (done) מתוך כמה (total) + אחוז מעוגל
(Math.round) + ‏ready = הכול-סומן (רק כשיש פריטים!). תיק ‏null/undefined או
בלי kit ⇒ ריק 0/0, ‏pct=0, ‏ready=false — אפס-קריסה על נתונים ישנים
(additive-only, אפס-מיגרציה).
**קלט:** ‏a — תיק עם ‏kit?: {done?}[] (או null/undefined).
**פלט:** ‏{done, total, pct 0–100, ready}.
**דוגמאות מחייבות:**
1. ‏kit של 5 שסומנו 3 ⇒ ‏{done:3, total:5, pct:60, ready:false}.
2. ‏kit של 3 שסומנו 3 ⇒ ‏{done:3, total:3, pct:100, ready:true}.
3. ‏kit של 3 שסומנו 1 ⇒ ‏pct=33 — ‏33.33… מעוגל מטה (Math.round).
4. ‏kit של 3 שסומנו 2 ⇒ ‏pct=67 — ‏66.66… מעוגל מעלה.
5. ‏{kit:[]} ⇒ ‏{done:0, total:0, pct:0, ready:false} — ריק אינו "מוכן".
6. ‏null וגם ‏undefined וגם ‏{} (בלי kit) ⇒ אותו פלט-ריק כמו 5.
**מוצא:** maor/src/lib/installKit.ts:17-24 (‏kitProgress — מנוע install-kit).
