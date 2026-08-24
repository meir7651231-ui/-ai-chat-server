# חוזה · קופסת-חיבורים "משימות-העבודה" (worktasks)
**תפקיד:** מנוע משימות-העבודה (WORKPREP) — סינון-פר-עובדת, מיון-עדיפות,
דין-איחור, סטטיסטיקת-מנהל, תוויות-עדיפות ובניית-שיבוץ-המוני מתורמים-שעבר-יעדם.
כל 7 החוטים שהיו מולחמים ב-`maor/src/lib/worktasks.ts` — מחווטים כאן במקום אחד.

**החיווט (חי בקופסה, זו המשמעות):** האטומים טהורים ומזריקים שכן-כשקע —
הקופסה מחליטה איזה: `openTasks`/`doneToday`/`contactDrafts` ← `taskIdentity`;
`stats` ← `taskIdentity` + `taskOverdue`.

**שקע-IO (מוזרק, לא ממומש):** `todayIso` (YYYY-MM-DD של "היום") — מלוח-האם
(isoToday), לעולם לא Date.now (מקור-האמת דטרמיניסטי).

## חשיפה
- `identityOf(email)` ⇒ מחרוזת — נרמול-זהות (trim+lowercase; ריק/undefined ⇒ `'מקומי'`).
- `openTasks(tasks, identity)` ⇒ משימות-פתוחות ממוינות: עדיפות ⇒ יעד-קרוב ⇒ ותיקה-קודם.
- `doneToday(tasks, identity, todayIso)` ⇒ מונה — כמה נסגרו היום ע"י העובדת.
- `isOverdue(t, todayIso)` ⇒ boolean — יש due לפני-היום והמשימה עוד פתוחה.
- `stats(tasks, identity, todayIso)` ⇒ `{open, overdue, done, doneWeek}` (מונים).
- `PRI_LABELS` ⇒ `{1:'🔴 דחוף', 2:'🟡 רגיל', 3:'⚪ בהמשך'}` · `priLabel(pri)` ⇒ התווית.
- `contactDrafts(supporters, existing, assignee, todayIso)` ⇒ טיוטות-משימה
  `{assignee,title,ref,pri:1,due}` לתורמים-שעבר-יעדם, דדופ מול קיימות-פתוחות.

## דוגמאות מחייבות (today='2026-08-24')
1. `identityOf(' A@X.co ')` ⇒ `'a@x.co'`; `identityOf('')` ⇒ `'מקומי'`;
   `identityOf(null)` ⇒ `'מקומי'`.
2. מיון `openTasks`: משימות pri 2/1/1(due=25/08)/1(due=20/08) של `'a@x.co'`
   + פתוחה של `'b@x.co'` + סגורה (doneAt) של `'a@x.co'` ⇒ מוחזרות רק 3 הפתוחות
   של a, בסדר: pri1+due20/08, pri1+due25/08, pri2. (עדיפות ⇒ יעד ⇒ יצירה.)
3. `doneToday(tasks, 'a@x.co', '2026-08-24')`: שתי משימות a עם
   doneAt `'2026-08-24T09:00'` + doneAt `'2026-08-23T…'` + אחת של b ב-24/08 ⇒ `1`.
4. `isOverdue({due:'2026-08-20'}, '2026-08-24')` ⇒ `true`;
   `isOverdue({due:'2026-08-20', doneAt:'…'}, …)` ⇒ `false` (סגורה);
   `isOverdue({}, …)` ⇒ `false` (אין due).
5. `stats([], 'a', today)` ⇒ `{open:0,overdue:0,done:0,doneWeek:0}`.
6. `stats` עבור `'a@x.co'`: פתוחה-בלי-יעד · פתוחה due='2026-08-20' (איחור) ·
   doneAt='2026-08-23T09:00' · doneAt='2026-08-10T09:00' · ומשימת `'b@x.co'`
   (מסוננת) ⇒ `{open:2, overdue:1, done:2, doneWeek:1}`.
   גבול-שבוע: doneAt='2026-08-18' ⇒ doneWeek=1 (diff=6); '2026-08-17' ⇒ 0 (diff=7);
   doneAt עתידי '2026-08-25' ⇒ done=1 אבל doneWeek=0 (diff שלילי).
7. `priLabel(1)` ⇒ `'🔴 דחוף'`; `priLabel(3)` ⇒ `'⚪ בהמשך'`.
8. `contactDrafts([{id:'s1',name:'ראובן',nextDate:'2026-08-20'}], [], 'A@x.co', today)`
   ⇒ `[{assignee:'a@x.co', title:'📞 להתקשר — ראובן',
   ref:{kind:'supporter',id:'s1'}, pri:1, due:'2026-08-24'}]`.
   nextDate=היום ⇒ נכלל; מחר ⇒ לא; חסר ⇒ לא. דדופ: קיימת-פתוחה על s1 של אותה
   עובדת מדלגת אותו; סגורה / עובדת-אחרת / ref.kind='family' אינן חוסמות.

**מוצא:** maor/src/lib/worktasks.ts — taskIdentity (9-12) · openTasksFor (15-25) ·
doneTodayFor (28-31) · taskOverdue (34-36) · taskStatsFor (45-62) ·
PRI_LABELS (65) · overdueContactTaskDrafts (72-93).
