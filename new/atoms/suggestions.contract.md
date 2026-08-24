# חוזה · חוט suggestions
**תפקיד:** מנוע מקדים-הצורך (SHOP8) — סורק אירועי-חיים שכבר במערכת ומעלה
**הצעות** (המלצות, לא פעולות), לפי 4 כללים: ‏A חג מתקרב (≤30 יום, מודול shop)
⇒ מתנת-חג לכלל המשפחות הפעילות · ‏B ילד בגיל 5–6 ⇒ ערכת בית-ספר · ‏C תינוק
(גיל 0) ⇒ ערכת תינוק · ‏D כרטיסייה פעילה שנותרו בה ‎0–2‎ ניקובים (מודול courses)
⇒ חידוש. משפחות שאינן ‏'active' מדולגות; הורים (isParent) מדולגים.
מפתחות-'sug:' יציבים (פטורים מגיזום-30-הימים): החג עם שנה עברית, בית-ספר עם
הגיל, חידוש עם purchased (סמן-דור-מילוי). בלי config ⇒ הכול פעיל וה-fallback
של המונחים בשימוש (חוזה-הדגלים).
**שקעים (חוק-1 — קריאות-שכן הוזרקו כפרמטרים):**
- ‏termOf(config, key, fb)⇒string — מונח-ארגוני (נקרא רק כש-config קיים).
- ‏moduleOn(config, m)⇒boolean — האם מודול פעיל (נקרא רק כש-config קיים).
- ‏upcomingHoliday(todayIso, windowDays)⇒{name,inDays,hebYear}|null — החג הקרוב.
- ‏ageAt(birth, todayIso)⇒number|null — גיל בשנים מלאות, דטרמיניסטי.
**קלט:** ‏db {families, enrollments, courses}‏ · ‏todayIso · ‏config? · 4 השקעים.
**פלט:** ‏Suggestion[]‏ — ‏{key, emoji, title, detail, famId?, courseId?, act}.
**דוגמאות מחייבות (שקעי-בדיקה דטרמיניסטיים):**
1. חג: ‏upcomingHoliday⇒{name:'פסח',inDays:12,hebYear:5786}, ‏2 משפחות פעילות,
   בלי config ⇒ הצעה ‏key='sug:holiday:פסח:5786', ‏emoji='🎁',
   ‏title='מתנת-חג · פסח בעוד 12 ימים', ‏detail מתחיל ב-'2 משפחות', ‏act='shop'.
2. בית-ספר: ילד ‏{id:'m1',first:'יוסי'} בגיל 6 במשפחה ‏'כהן' (id:'f1') ⇒
   ‏key='sug:school:m1:6', ‏emoji='🎒', ‏famId='f1', ‏act='families' (וגם גיל 5 מציף).
3. תינוק: גיל 0 ⇒ ‏key='sug:baby:<memberId>', ‏emoji='👶', ‏act='families';
   הורה (isParent:true) בגיל 0 — לא מציף.
4. חידוש: ‏enrollment ‏{id:'e1',plan:'punch',status:'active',purchased:10,used:8}
   ⇒ ‏key='sug:renew:e1:10', ‏detail='נותרו 2 ניקובים'; ‏used:10 ⇒ ‏detail='הכרטיסייה
   נגמרה'; ‏used:7 (נותרו 3) ⇒ אין הצעה.
5. גידור-מודולים: עם config ש-moduleOn⇒false ל-'shop' — אין הצעת-חג; ‏false
   ל-'courses' — אין הצעות-חידוש (ה-enrollments כלל לא נסרקים).
6. משפחה ‏status:'closed' — ילדיה לא מציפים דבר, ובלי משפחות פעילות אין הצעת-חג
   גם כשיש חג בחלון.
**מוצא:** maor/src/components/shop8/lib.ts:62-139 (‏suggestions) — חולץ כלשונו,
כולל תיקוני swarm-audit (מפתח-חג פר-שנה-עברית · הגיל במפתח-בית-ספר ·
‏purchased כסמן-דור); השכנים termOf/moduleOn/upcomingHoliday/ageAt הפכו לשקעים.
