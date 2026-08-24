# חוזה · חוט leaderboard
**תפקיד:** לוח-המובילים של רכזי-הקופות — **רכזים פעילים בלבד** (‎c.active),
כל שורה = ‏{coordinator, total (דרך השקע), boxCount (אורך תוצאת-השקע השני)},
ממוין: ‏score יורד, ותיקו-score מוכרע בסכום (total) יורד.
**שקעים (חוק-1 — קריאות-לשכנים הוזרקו כפרמטרים):**
- ‏coordinatorTotal(boxes, coordId) ⇒ number — סך-הריקונים של רכז (במחסן:
  החוט coordinator-total).
- ‏coordinatorBoxes(boxes, coordId) ⇒ Box[] — קופות-הרכז (במחסן: החוט
  coordinator-boxes).
**קלט:** ‏coordinators · boxes · שני השקעים. **פלט:** ‏TzLeaderRow[].
**דוגמאות מחייבות** (רכזים: ‏c1{score:50, active} · c2{score:80, active} ·
c3{score:99, ‏active:false} · c4{score:50, active}; שקעים חוזיים:
‏totals={c1:300, c2:100, c4:700}, ‏boxCounts={c1:2, c2:1, c4:3}):
1. הסדר: **c2 (score 80) → c4 (50, ‏total 700) → c1 (50, ‏total 300)** —
   ‏score קודם; תיקו-50 הוכרע בסכום.
2. ‏c3 (score 99, לא-פעיל) **לא מופיע כלל** — למרות ה-score הגבוה ביותר.
3. שורת-c4: ‏{total:700, boxCount:3} — הערכים מהשקעים כלשונם.
4. ‏coordinators ריק ⇒ ‏[] (והשקעים לא נקראים כלל).
**מוצא:** maor/src/components/tzedaka/lib.ts:142-148 (‏leaderboard — מנוע
קופות-הצדקה); השכנים coordinatorTotal+coordinatorBoxes הפכו לשקעים (חוק-1).
