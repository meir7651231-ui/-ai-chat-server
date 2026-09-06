# ✅ CLOSED · GENMAX · G18–G19 — מנוע-הלוגיקה נבחר לפי ייעוד + עטיפת-חתימה מוכחת (6.9.2026)

> המשך הכרעה-25 ("צעד-3 חייב להיות מנוע מלא") לשכבת-הלוגיקה: עד היום כל פעולת-לוגיקה של מנוע-ההרכבה (`compose-engine.mjs` טבלת-ATOM: match⇒smartFilter · serialize⇒toCsv · balance⇒payBal …) הייתה **הצהרה ידנית**. מהיום `auto-logic.mjs` מדרג את **כל 848 מנועי-הלוגיקה** באינדקס-האמת לכל פעולה.

## איך המנוע מדרג (אפס מילון)
1. **חוזה** = חתימת המנוע-של-הזהב (argc · טיפוסי-פרמטרים · החזרה). מועמד = כל מנוע תואם-חתימה (`dynamic` תואם הכל; טיפוס מפורש חייב שוויון).
2. **הסכמת-טיפוסים** — פרמטר מפורש-ושווה = +1 (לא "יותר טיפוסים" — זה תגמל פונקציות זרות).
3. **חפיפת-ייעוד** — הביקוש = הערות-ה-import של הזהב (`// יתרה = totalDue + carryBalance − שולם`) + שמות-החלקיקים; ההיצע = כותרת-ה-doc של המנוע במקור (`payBal — יתרת-חוב על שיבוץ`). משוקלל **idf** (טוקן שמופיע בהרבה מנועים = boilerplate ⇒ משקל אפסי) עם נרמול-מורפולוגי קל (פיצול ב-'-', הסרת אות-שימוש בראש). כותרת ×2.
4. **מוצא משותף** (`מוצא: maor/src/.../lib.ts`) = אחים מאותו מודול-JS: +1.5.
5. שוויון ⇒ המנוע-של-הזהב (חוק-4: הקוד-החלוץ קדוש).
6. **החלפה** מוצעת רק כשהמועמד ≡ בחתימה ומנצח בניקוד, ו**מיושמת** (`logicPass` ב-retarget/skin-golden) רק אחרי **הוכחה**: מודול-הזהב עם ההחלפה עובר את בדיקות-הזהב שלו (`--prove`). לא-מוכח ⇒ הזהב נשאר (§20-ג, §22 אפס-באגים).

## התוצאה על 30 פעולות-הלוגיקה של הזהב
| פעולה | המנוע-של-הזהב | דירוג | מועמדים | top-3 (ניקוד · ≡ = חתימה-זהה) |
|---|---|---|---|---|
| match | `smartFilter` | ✓ | 34 | smartFilter:32.14≡ · supScore:10.27 · runAudit:7.49 |
| predicate | `finderMatches` | ✓ | 12 | finderMatches:24.35≡ · startCampaign:6.75 · sup12m:3.11 |
| serialize | `toCsv` | ✓ | 233 | toCsv:13.94≡ · cockpitCsvRows:13.94 · minToHM:10.71 |
| role | `roleOf` | ✓ | 87 | roleOf:25.75≡ · matchAssistantCategory:16.42 · teacherIdOf:10.5 |
| grant | `canGrantedAction` | ✓ | 5 | canGrantedAction:21.7≡ · taskStatsFor:6.82 · courseFitsMember:1 |
| expiry | `expiringIntakes` | ✓ | 5 | expiringIntakes:16.29≡ · spotlightBox:10.71 · stepScale:0 |
| capital | `warehouseValue` | ✓ | 29 | warehouseValue:30.88≡ · setAllowedPurposes:3.01 · paidOf:2.83 |
| queue | `cockpitQueue` | ✓ | 3 | cockpitQueue:68.09≡ · smartFilter:4.34 · waPaymentText:4.34 |
| progress | `cockpitProgress` | ✓ | 24 | cockpitProgress:55.69≡ · ruleSkeleton:8.69 · supportPreview:4.44 |
| sheet | `sheetSummary` | ✓ | 233 | sheetSummary:21≡ · sheetRoster:21 · presentsInMonth:11.4 |
| makeup | `pendingMakeups` | #2 | 20 | sheetSummary:11.4 · pendingMakeups:4.5≡ · supportUnread:2.61 |
| balance | `payBal` | ✓ | 21 | payBal:34.69≡ · sanitizeSupportText:3.11 · waitlistFor:3.11 |
| paidstatus | `enrollmentPaidStatus` | ✓ | 11 | enrollmentPaidStatus:4≡ · sup12m:3.11 · ruleTypo:0 |
| hok | `hokDue` | ✓ | 5 | hokDue:23.27≡ · supAvgDon:8.25 · spotlightBox:0 |
| clash | `scheduleClashText` | ✓ | 6 | scheduleClashText:56.21≡ · waPaymentText:16.31 · distributionListLines:1 |
| slots | `buildSlots` | ✓ | 1 | buildSlots:75.85≡ |
| block | `blockReason` | ✓ | 3 | blockReason:49.85≡ · smartFilter:0 · waPaymentText:0 |
| holiday | `holidayOf` | ✓ | 4 | holidayOf:27.35≡ · staleBoxes:6.43 · smartScore:0 |
| weekly | `weeklyRoomSessions` | ✓ | 6 | weeklyRoomSessions:33.15≡ · spotlightBox:3.75 · lessonsInTerm:1 |
| sessions | `sessionsOf` | ✓ | 209 | sessionsOf:34.71≡ · defaultPrices:10.53 · defaultCourseDates:9.1 |
| enrol | `enrollCount` | ✓ | 40 | enrollCount:11.21≡ · waitlistFor:10.7 · coursesOfTeacher:9.59 |
| wait | `waitlistFor` | ✓ | 233 | waitlistFor:16.46≡ · coursesOfTeacher:16.2≡ · isSizeToken:7.49 |
| byteacher | `coursesOfTeacher` | ✓ | 233 | coursesOfTeacher:19.78≡ · cockpitCsvRows:11.72 · cockpitWorkListText:8.69 |
| whoami | `teacherIdOf` | #4 | 233 | isAdminUser:27.43 · coursesOfTeacher:19.31≡ · cockpitCsvRows:15.76 |
| cert | `certExpiryStatus` | ✓ | 20 | certExpiryStatus:16.19≡ · coursesOfTeacher:0 · nameIndex:0 |
| contact | `waLink` | #3 | 146 | importableContacts:16.8 · setAuditContext:9.09≡ · waLink:8.88≡ |
| recipients | `bulkWaRecipients` | ✓ | 20 | bulkWaRecipients:16.44≡ · sitePalette:5.85 · coursesOfTeacher:5.11 |
| template | `renderTemplate` | ✓ | 5 | renderTemplate:16.09≡ · spotlightBox:0 · stepScale:0 |
| parse | `parseCsv` | #2 | 21 | supUsd:6.97 · parseCsv:2≡ · monthLabel:0 |
| trendengine | `trendFromScan` | ✓ | 24 | trendFromScan:94.21≡ · sortSupportThreads:7.49 · orgSlugFromUrl:3.11 |

**26/30 — הזהב מאושר כטוב-ביותר.** ב-4 הפעולות שהמנוע לא אישר (makeup · whoami · contact · parse) המועמד-העליון **אינו ≡ בחתימה** (חתימות-`dynamic` מהמרת-JS מרחיבות את המועמדים ל-233), ולכן **0 החלפות מוצעות, 0 מוכחות** — הקוד-המחולל לא השתנה. זה ממצא כן: המנגנון בוחר, הזהב עומד.

## מדדים
שער `autologic` (≡ טרי · L73-מקביל: החלפה רק מוכחת) · `ship.regen` כולל `auto-logic` · analyze 0 · 165/165.

## G19 · עטיפת-חתימה למועמדים שאינם זהים-בחתימה (הכרעת-בעלים "תמשיך גם את עטיפת-החתימה")
כשהמועמד-העליון אינו ≡, המנוע מייצר **adapter** בשם המנוע-של-הזהב ובחתימתו **האמיתית מהמקור** (`sigOf`: כולל `[אופציונלי]`/`{named}` — האינדקס משטח אותם, וזה הפיל את הניסיון הראשון בשגיאת-קומפילציה "Too few positional arguments"), שמעביר למועמד פוזיציונית עם `as`-cast; עודף-פרמטרים של הזהב נשמט; named-חובה בלי מקור ⇒ "אין עטיפה כשרה" (§20-ג). ה-import של הזהב מוחלף ב-import של המועמד + ה-adapter; הקריאות בקוד לא נוגעות.
**לפני ההוכחה — מוטציית-רגישות:** stub שזורק במקום המנוע. אם בדיקות-הזהב עדיין ירוקות, הן לא מפעילות את המנוע ⇒ הוכחה בלתי-אפשרית. שגיאת-קומפילציה בכל שלב = לא-מסקנה (לא "רגיש", לא "מוכח").

| פעולה | החלפה מוצעת | אופן | רגישות (ירוק/סה"כ עם stub) | הוכחה (ירוק/סה"כ עם adapter) | פסק-דין |
|---|---|---|---|---|---|
| makeup | `pendingMakeups` ⇒ `sheetSummary` | adapter | 0/5 | 0/5 | נכשל-בבדיקות-הזהב |
| whoami | `teacherIdOf` ⇒ `isAdminUser` | adapter | 0/28 | 0/28 | נכשל-בבדיקות-הזהב |
| contact | `waLink` ⇒ `isSendableSupportText` | adapter | 24/29 | 24/29 | נכשל-בבדיקות-הזהב |
| parse | `parseCsv` ⇒ `supUsd` | adapter | 5/6 | 5/6 | נכשל-בבדיקות-הזהב |

**כל 4 העטיפות התקמפלו, כל 4 הבדיקות היו רגישות, וכל 4 נכשלו בבדיקות-הזהב ⇒ נדחו; מנועי-הזהב נשארו.** זו בדיוק ההוכחה שהמנגנון עובד: הדירוג-לפי-ייעוד הציע, העטיפה אפשרה, בדיקות-הזהב הכריעו — אפס-באגים (§22) בלי אדם בלולאה.

## מה נשאר
- כותרות-doc חסרות/גנריות ב-4 המנועים הנ"ל מורידות את דירוגם — תיקון = במקור (הכותרת), לא במנוע.
- מנועים בחתימת-`dynamic` (119 מהמרת-JS) — הידוק-טיפוסים במנוע-ההמרה יחדד את החוזה ויקטין את 233–588 המועמדים.
- הוכחה יקרה (2 ריצות-בדיקה לכל מודול-משתמש): נשמרת ב-`auto-logic.json` ורצה מחדש רק ב-`--prove`; ש"ח-בדיקות מדויק יותר = כיסוי-פונקציה (roadmap).
