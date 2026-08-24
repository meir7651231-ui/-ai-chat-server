# חוזה · חוט site-campaign-progress
**תפקיד:** מדדי-קמפיין של האתר-הציבורי (שונה מ-`campaign-progress` של הקופות):
מחשב יעד (`goal`), נאסף (`raised`), אחוז-התקדמות **חסום ל-0–100 ומעוגל**,
מטבע, ימים-נותרים לספירה-לאחור, ודגל-הצגה (`show`). טהור; ‏`nowMs` מוזרק
(שקע-זמן — אפס Date.now).
**שקעים (חוק-1):**
- `nowMs`⇒number — חותמת-הזמן העכשווית במילישניות (מוזרקת, ל-ספירה-לאחור).
  isFinite הפנימי הוא Number.isFinite (שפה).
**קלט:**
- `c` ‏{goal?, raised?, end?, currency?} או undefined — נתוני-הקמפיין מהקונפיג.
- `nowMs` — השקע.
**פלט:** `{goal, raised, pct, currency, daysLeft, show}`:
- `goal`/`raised` — מספר, רק אם >0, אחרת 0.
- `pct` — שלם 0–100 (חסום גם בחריגה, מעוגל Math.round); goal 0 ⇒ 0.
- `currency` — `c.currency` או ברירת-מחדל `'₪'`.
- `daysLeft` — ‏ceil((חצות-end − nowMs)/יום); עבר ⇒ 0; אין end/תאריך-שבור ⇒ null.
- `show` — ‏goal>0.
**דוגמאות מחייבות** (nowMs = חצות-מקומי של 2026-09-01):
1. `{goal:1000, raised:250}` ⇒ `pct:25, goal:1000, raised:250, currency:'₪', daysLeft:null, show:true`.
2. `{goal:1000, raised:1500}` ⇒ `pct:100` (חסום — לא 150).
3. `{goal:1000, raised:250, end:'2026-09-11'}` ⇒ `daysLeft:10` (קלנדרי: 1.9→11.9=10, לא 11).
4. `{goal:1000, end:'2026-08-01'}` (עבר) ⇒ `daysLeft:0`.
5. `{raised:250}` (בלי goal) ⇒ `goal:0, pct:0, show:false`.
6. `{goal:1000, raised:250, currency:'$'}` ⇒ `currency:'$'`.
7. `undefined` ⇒ `{goal:0, raised:0, pct:0, currency:'₪', daysLeft:null, show:false}`.
8. `{goal:1000, raised:250, end:'זבל'}` (תאריך-שבור) ⇒ `daysLeft:null`.
9. עיגול: `{goal:1000, raised:335}` ⇒ `pct:34` (round, לא floor); `raised:333` ⇒ `pct:33`.
**מוצא:** maor/src/lib/publicSite.ts:218-236 (‏campaignProgress).
