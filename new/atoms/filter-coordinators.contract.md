# חוזה · חוט filter-coordinators
**תפקיד:** סינון+מיון רכזי-הקופות: ‏onlyActive ⇒ רק ‏active; חיפוש q דרך
שקע-smartFilter על השם — המונחים: השם המלא **וגם כל מילה בנפרד** (כדי
ששגיאת-כתיב במילה אחת תיתפס — levenshtein פר-מילה); מיון לפי sort:
- ‏'name' — ‏localeCompare עברית עולה.
- ‏'score' — ציון יורד.
- ‏'total' — סך-הריקונים יורד (שקע-coordinatorTotal על כל קופות-הרכז).
- ‏'stale' — ריקון-אחרון עולה (‏localeCompare; '' = מעולם-לא ⇒ ראשון) —
  מי שדורש דחיפה למעלה.
המיון על עותק (‏[...list]) — הקלט לא משתנה.
**שקעים (חוק-1 — קריאות-שכן הוזרקו):**
- ‏smartFilter(q, list, getTerms) ⇒ ‏list — חיפוש-חכם (האטום smart-filter;
  ‏q ריק ⇒ עותק-הכול).
- ‏coordinatorTotal(boxes, coordId) ⇒ ‏number — סך-הריקונים של הרכז
  (מקור: tzedaka/lib.ts:60).
- ‏coordinatorLastCollection(boxes, coordId) ⇒ ‏iso|'' — הריקון האחרון
  על-פני כל קופותיו ('' כשאין; מקור: tzedaka/lib.ts:161-169).
**קלט:** ‏coords {id,name,active,score}[] · boxes · q · onlyActive ·
sort ('name'|'score'|'total'|'stale') · שלושת השקעים. **פלט:** רכזים מסוננים-ממוינים.
**דוגמאות מחייבות** (‏coords: ‏c1{'רבקה כהן',active,score:5} ·
‏c2{'שרה לוי',לא-active,score:9} · ‏c3{'לאה מזרחי',active,score:7};
שקעים: ‏coordinatorTotal⇒{c1:300,c2:500,c3:0} ·
‏coordinatorLastCollection⇒{c1:'2026-03-01',c2:'2026-01-15',c3:''} ·
‏smartFilter=עותק כש-q ריק / הכלה-במונח אחרת):
1. ‏onlyActive=true, sort='name' ⇒ ‏['c3','c1'] (לאה < רבקה; ‏c2 נופל).
2. ‏onlyActive=false, sort='score' ⇒ ‏['c2','c3','c1'] (9,7,5 יורד).
3. ‏sort='total' ⇒ ‏['c2','c1','c3'] (500,300,0 יורד).
4. ‏sort='stale' ⇒ ‏['c3','c2','c1'] — מעולם-לא ('') ראשון, אחריו הישן.
5. ‏q='כהן' (שקע-ההכלה; מילת-השם בנפרד היא מונח) ⇒ ‏['c1'].
6. הקלט לא השתנה: סדר ‏coords המקורי נשמר אחרי קריאת-מיון.
**מוצא:** maor/src/components/tzedaka/lib.ts:174-202 (‏filterCoordinators,
UX סינון גל B½). שלוש קריאות-השכן שוקעו (חוק-1).
