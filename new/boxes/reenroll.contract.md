# 📇 חוזה · קופסת-החיבורים `reenroll` (רישום-לשנה-הבאה)

מקור-אמת (L4): `maor-system/src/components/courses/reenroll-lib.ts`.
הקופסה מחווטת 14 אטומי-רישום-מחדש + 2 אטומי-כספים (pay-bal/paid-of), ומולידה
בתוכה את שלוש הכרעות-השכן שבמקור היו פונקציות-פרטיות: `atNoon`, `toIso`, `findMember`.
מייבאת אך-ורק מ-`new/atoms` (חוק-2/3). דטרמיניסטי מלא — ה"היום" מוזרק, אפס `Date.now`.

## הכרעות שחיות בקופסה (verbatim מהמקור)
- **`atNoon`** — `reenroll-lib.ts:15-17`: `new Date(\`${iso}T12:00:00\`)` (צהריים-מקומי, בלי היסט-UTC).
- **`toIso`** — `reenroll-lib.ts:18-23`: `\`${y}-${m}-${dd}\`` עם `padStart(2,'0')` על חודש/יום.
- **`findMember`** — `reenroll-lib.ts:110-116`: סריקת `db.families`, המופע-הראשון של `members[id]` זוכה, `family = f.name || ''`; לא-נמצא ⇒ `{ member: null, family: '' }`.
- **סדר-החיווט (קסקדת-הכספים)** — `paidOf ⇒ payBal ⇒ enrollSummary`; ותאריכים `atNoon/toIso ⇒ academicYearLabel/nextYearDates`.

## חשיפה (API — מראה את reenroll-lib.ts)

| חוט | חתימה | שקעים-שהולחמו | עוגן-מקור |
|-----|--------|----------------|-----------|
| `academicYearLabel(startIso)` | `string` | `atNoon` | `:26-33` |
| `nextYearDates(start, end)` | `{start,end}` | `atNoon,toIso` | `:35-42` |
| `renewOf(e)` | `RenewDecision` | — | `:47-49` |
| `isRenewed(e)` | `boolean` | — | `:52-54` |
| `enrollSummary(e)` | `EnrollSummary` | `payBal,paidOf` | `:81-96` |
| `buildReenrollRows(db, filter?)` | `ReenrollRow[]` | `isRenewed,renewOf,enrollSummary,findMember` | `:134-172` |
| `reenrollCounts(rows)` | `ReenrollCounts` | — | `:184-196` |
| `renewTargets(rows)` | `ReenrollRow[]` | — | `:198-200` |
| `freshNextYearEnrollment(src, courseId, newId, todayIso, group?)` | `Enrollment` | — | `:207-242` |
| `nextYearCourseDraft(src, newId)` | `Course` | `nextYearDates,academicYearLabel` | `:243-254` |
| `studentHistory(db, memberId)` | `StudentHistoryEntry[]` | `academicYearLabel,enrollSummary` | `:279-304` |
| `studentHistoryText(entries)` | `string` | — | `:306-317` |
| `reenrollCsvRows(rows)` | `string[][]` | — | `:319-336` |
| `reenrollListText(rows)` | `string` | — | `:338-342` |

## דוגמאות מספריות (מוכחות ב-reenroll.test.mjs)

1. **academicYearLabel** — `'2026-09-01' ⇒ '2026/27'` (ספט׳=חודש 8 ⇒ שנה-נוכחית); `'2026-06-01' ⇒ '2025/26'` (לפני ספט׳ ⇒ שנה-קודמת).
2. **nextYearDates** — `('2026-09-01','2027-06-30') ⇒ {start:'2027-09-01', end:'2028-06-30'}` (שומר יום/חודש).
3. **renewOf** — `{renew:'yes'} ⇒ 'yes'`; `{} ⇒ ''`.
4. **isRenewed** — `{renewedToId:'x'} ⇒ true`; `{} ⇒ false`.
5. **enrollSummary** — `presents:['2026-01-05','2026-01-01']`, `absences:[{noshow:true},{}]`, `totalDue:200`, `payments:[{amount:120}]` ⇒
   `{presents:2, absences:2, noshow:1, balance:80, paid:120, statusLabel:'פעיל', lastPresent:'2026-01-05'}` (lastPresent = הגדול לקסיקוגרפית).
6. **buildReenrollRows** — ממויין לפי `memberName` בעברית; `filter.decision:'undecided'` ⇒ רק `renew===''`; `includeRenewed:false` מסנן `renewedToId`; `q` רב-מילתי (כל מילה חייבת להימצא ב-`memberName+family+courseName`).
7. **reenrollCounts** — 3 שורות `yes/no/undecided` (אחת מהן `renewed`) ⇒ `{total:3, yes:1, no:1, hold:0, undecided:1, renewed:1}`.
8. **renewTargets** — רק `decision==='yes' && !renewed`.
9. **freshNextYearEnrollment** — מאפס `purchased/used/absences/payments`, `status:'active'`, `enrolledAt:todayIso`, `dueDate:''`; שומר `plan/totalDue/group` (או `groupOverride`) + שדות-תמחור אופציונליים אם קיימים במקור.
10. **nextYearCourseDraft** — `start/end` מוזזים שנה, `year=academicYearLabel(start)`, `prevYearId=src.id`, שאר-השדות משוכפלים.
11. **studentHistory** — ממויין מהחדש-לישן לפי `course.start` (שובר-שוויון `enrolledAt`); `fromRenewal` אם מישהו הצביע אליו ב-`renewedToId`; `renewedForward` אם יש לו `renewedToId`.
12. **reenrollCsvRows** — כותרת בת-10 עמודות; `decWord`: `yes⇒'ממשיך' no⇒'לא ממשיך' hold⇒'בהמתנה' ''⇒''`.
13. **reenrollListText** / **studentHistoryText** — שורה-לתלמיד/ה, מופרדות `\n`; ב-listText החלטה-ריקה ⇒ `'טרם הוחלט'`, ו-`renewed` ⇒ `' ✓נרשם'`.

## אכיפה (חוק-4)
`node new/boxes/reenroll.test.mjs ⇒ exit 0` (13 קבוצות-קצה + מגן-הכרעה fs).
רתמת-זהב: `node maor-system/machtzev/parity/reenroll.parity.mjs ⇒ exit 0` (ישן≡חדש, 300 סבבי-LCG seed=20260824).
