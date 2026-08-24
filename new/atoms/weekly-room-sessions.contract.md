# חוזה · חוט weekly-room-sessions
**תפקיד:** ניצולת שבועית של חדר — סכום המפגשים-השבועיים של כל החוגים המשויכים
לחדר ש**לא הסתיימו** נכון ל-iso: חוג נספר כאשר ‏roomId שלו זהה **וגם**
(אין לו ‏end **או** ‏iso ≤ end — יום-הסיום עצמו עדיין נספר). לכל חוג נספר
‏sessionsOf(c).length. טהור ודטרמיניסטי — התאריך מוזרק, בלי שעון פנימי.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏sessionsOf(course) ⇒ מערך-המפגשים-בפועל של החוג (שכן מ-courses/lib;
  אטום נפרד sessions-of — כולל הנפילה למפגש-יחיד מהשדות הראשיים).
**קלט:** ‏db (עם ‏courses) · ‏roomId · ‏iso (תאריך-ייחוס 'YYYY-MM-DD') ·
השקע sessionsOf. **פלט:** מספר (0 ומעלה).
**דוגמאות מחייבות** (‏sessionsOf = ‏(c)=>c.sessions||[]; ‏iso='2026-08-24';
חוגים: ‏c1{roomId:'r1', sessions:[{day:1},{day:3}]} · ‏c2{roomId:'r1',
end:'2026-06-30', sessions:[{day:2}]} · ‏c3{roomId:'r2', sessions:[{day:4}]} ·
‏c4{roomId:'r1', end:'2026-08-24', sessions:[{day:5}]}):
1. ‏('r1') ⇒ **3** — ‏c1 (בלי end, ‏2 מפגשים) + ‏c4 (‏end==iso — נכלל, מפגש 1);
   ‏c2 הסתיים (‏2026-06-30 < iso) ו-c3 בחדר אחר — לא נספרים.
2. ‏('r2') ⇒ **1** — רק ‏c3.
3. ‏('r9') ⇒ **0** — אין חוגים בחדר; גם ‏db.courses=[] ⇒ 0.
4. ‏iso='2026-06-30' (יום-הסיום של c2) ⇒ ‏('r1') = **4** — ‏c2 חוזר להיספר
   (‏iso ≤ end), לצד c1 ו-c4.
5. חוג בלי מערך-sessions נספר לפי מה שהשקע מחזיר: עם
   ‏sessionsOf=(c)=>c.sessions&&c.sessions.length?c.sessions:[{day:c.weekday}]
   (התנהגות האטום sessions-of), ‏c5{roomId:'r3', weekday:2} ⇒ ‏('r3') = **1**.
**מוצא:** maor/src/components/diary/lib.ts:237-243 (‏weeklyRoomSessions —
"ניצולת שבועית" ביומן-החדרים). השכן ‏sessionsOf הפך לשקע (חוק-1).
