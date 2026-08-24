# חוזה · קופסת-חיבורים "ניווט-אחורה + נפתחו-לאחרונה" (navhist)
**תפקיד:** הקופסה של פיצ'ר `shell.navhist` (P1.5) — מחסנית "↩ חזרה" של 20 צעדים
ו"נפתחו לאחרונה" עד 6. כל מה שהיה מולחם בין `src/lib/navhist.ts` ל-store
(`useApp.ts go/selectFamily/selectCourse/goBack`) — מחווט כאן במקום אחד.
מקור-האמת (L4): `maor-system/src/lib/navhist.ts` + החיווט החי ב-`useApp.ts`.

## חוטים (אך-ורק מ-new/atoms)
| חוט | עוגן-מקור |
|---|---|
| `nav-hist-max` (20) | navhist.ts:19 · legacy-main-script.js:166 |
| `recent-max` (6) | navhist.ts:20 · legacy:344-346 |
| `same-loc` | navhist.ts:23-25 |
| `push-nav` | navhist.ts:28-31 |
| `push-recent` | navhist.ts:34-36 |

## חשיפה (הכול טהור — state מוזרק, אפס DOM/store)
- `NAV_HIST_MAX` · `RECENT_MAX` — התקרות, מיוצאות מהחוטים.
- `BACK_LABEL='↩ חזרה'` · `BACK_TITLE='חזרה למסך הקודם'` — מילון-הקופסה (App.tsx:635,639).
- `navStep(hist, prev, next) ⇒ hist'` — **הכרעה 1:** מעבר לאותו מיקום אינו נרשם
  כצעד: `sameLoc(prev, next) ? hist : pushNav(hist, prev)` (useApp.ts:1366).
- `goTo({ hist, prev, view }) ⇒ { view, hist }` — מעבר-מסך; הבחירות אינן משתנות,
  ה-next נגזר מ-prev עם ה-view החדש (useApp.ts:1362-1367).
- `openFamily({ hist, recentIds, prev, id }) ⇒ { view:'families', selFamilyId, hist, recentIds }` —
  **הכרעה 2:** רק פתיחת-כרטיס אמיתית (id truthy) מקדמת את "נפתחו לאחרונה";
  ניקוי-בחירה (id ריק/null) לא (useApp.ts:1377 — `id ? pushRecent : {}`).
- `openCourse({ hist, prev, id }) ⇒ { view:'courses', selCourseId, hist }` —
  ללא recent (useApp.ts:1380-1389).
- `goBack(hist) ⇒ null | { loc, hist }` — **הכרעה 3:** החזרה עצמה אינה נרשמת
  כצעד (useApp.ts:1392-1405 · legacy:3147 `_navBack`); מחסנית ריקה ⇒ `null`
  (useApp.ts:1396 `if (!p) return {}`).
- `canGoBack(hist) ⇒ boolean` — "↩ חזרה" מוצג רק כשיש היסטוריה
  (App.tsx:630 `navHistLen > 0` · legacy:3146 `showBack`).

**שקעי לוח-אם (לא בקופסה):** גידור הדגל `featureOn(config,'shell.navhist')` ·
עדכון ה-store בפועל · ה-DOM של הכפתור.

## דוגמאות מחייבות
- ‏25 מעברי-מסך שונים ⇒ hist באורך 20 בדיוק, הישן ביותר נזרק (הראשון שנשאר: הצעד ה-6).
- ‏goTo לאותו מיקום ⇒ hist מוחזר ללא-שינוי (אותו מערך).
- ‏openFamily על 7 מזהים ⇒ recentIds אורך 6, האחרון-שנפתח ראשון; פתיחה-חוזרת של
  קיים ⇒ קידום-לראש בלי כפילות; `id:null` ⇒ recentIds ללא-שינוי.
- ‏goBack על `[A]` ⇒ `{ loc:A, hist:[] }`; ‏goBack על `[]` ⇒ `null`.
- ‏canGoBack: `[]`⇒false · `[A]`⇒true.

## DoD (נכתב לפני הקוד — דיבר 12)
```
node new/boxes/navhist.test.mjs                                ⇒ exit 0, שורת ✓
node /home/user/maor-system/machtzev/parity/navhist.parity.mjs ⇒ exit 0, שורת 🥇 אפס-סטייה
```
