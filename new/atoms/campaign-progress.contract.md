# חוזה · חוט campaign-progress
**תפקיד:** מדדי-התקדמות של מבצע-קופות: הסכום שנאסף למבצע, היעד, ואחוז-
ההתקדמות — מעוגל (Math.round) וקטום ל-100 לכל היותר. יעד חסר/0 ⇒ ‏pct=0
(אין חלוקה-באפס). טהור, קריאה-בלבד.
**שקעים (חוק-1 — קריאת-השכן הוזרקה כפרמטר שלישי):**
- ‏campaignTotal(boxes, campaignId)⇒number — סכום כל הריקונים המשויכים למבצע
  על-פני כל הקופות (במקור: השכן campaignTotal ב-tzedaka/lib.ts:68-73 —
  קיים תחת ‏quarry/campaign-total; החיבור בקופסה).
**קלט:** ‏campaign ‏{id, goal?} · ‏boxes (מועבר לשקע כמות-שהוא) · השקע.
**פלט:** ‏{sum, goal, pct} — ‏pct שלם 0–100.
**דוגמאות מחייבות** (עם שקע-campaignTotal בסמנטיקת-המקור — סכימת
‏collections שבהן ‏campaignId תואם):
1. יעד 1000, נאסף 250 (קופה 100+150 ועוד ריקון של מבצע-אחר) ⇒ ‏{sum:250, goal:1000, pct:25}.
2. נאסף 1500 מול יעד 1000 ⇒ ‏pct=100 (קטום — לא 150).
3. ‏goal חסר (undefined) ⇒ ‏{sum:250, goal:0, pct:0}.
4. עיגול: ‏sum=333/goal=1000 ⇒ ‏pct=33; ‏sum=335 ⇒ ‏pct=34 (round, לא floor).
5. בלי קופות כלל ⇒ ‏{sum:0, goal:500, pct:0}.
**מוצא:** maor/src/components/tzedaka/lib.ts:149-154 (‏campaignProgress).
