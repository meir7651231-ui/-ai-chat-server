# 🔻 HANDOFF · פירוק+המרה של העדכונים-האחרונים של מאור (26.8.2026)

**הכרעת-בעלים 26.8:** "צריך לפרק ולהמיר את העדכונים האחרונים" — מאור-החי התפתח
מאז החציבה; יש להביא את היכולות-החדשות למחצב (אינווריאנט-על: אפס-אובדן-יכולת).
נעצרנו ב-91% טוקנים; חידוש מאושר-מראש בעוד ~3 שעות.

## מצב-רקע (מה כבר גמור)
- **מאור-הלוגיקה הישנה = גמור:** 625 אטומי-Dart בחוזה · 1 בהסגר (waitlist-for = שקע-קולציה). דוח: `CLOSED-MAOR-DART-2026-08-26.md`.
- **בנייה-חכמה גל-1 נחת:** new/dart 26→33 (7 אטומים). נותרו 173 טיוטות ב-dart-quarry. מנוע: `workflows/scripts/dart-promote.js` (promote-only, שער-נחיתה עצמי). **זה משני עכשיו** — קדימות למאור-החדש.
- הכול committed+pushed לענף `claude/mah-kora-0by8kw` (HEAD=06f7b71 באזור).

## 🎯 המשימה: פרק+המר את המנועים-החדשים של מאור
מקור: **/home/user/maor-system** (ריפו-חי; אין בו machtzev). המנועים החדשים **טהורים כבר**
(אפס store/DOM; מייבאים שכנים מ-`./lib`). ‏0 אטומים ב-Genesis להם (למעט nedarim/hok חלקי):

| קובץ-מקור (maor) | exports | סטטוס ב-Genesis |
|---|---|---|
| `src/components/supporters/cockpit.ts` | 14 | 0 — חדש לגמרי |
| `src/components/supporters/intel.ts` | 7 | 0 |
| `src/components/supporters/segments.ts` | 5 | 0 |
| `src/components/supporters/portfolio.ts` | 4 | 0 |
| `src/components/supporters/commands.ts` | 2 | 0 |
| `src/components/supporters/constellation.ts` | 1 | 0 |
| `src/lib/dialer.ts` | 10 | 0 |
| `src/lib/nedarimSync.ts` | 10 | חלקי — דדופ מול הקיימים (ראה למטה) |

**סה"כ ~43 חדשים + דלתת-nedarimSync.** קיימים כבר ב-Genesis (לדדופ מול nedarimSync):
detect-recurring-hok · plan-nedarim-sync · pull-nedarim · fetch-nedarim-donors ·
with-nedarim-hok · hok-cat · hok-due · hok-effectively-active · hok-method-label ·
hok-monthly-total · hok-recorded-this-month.

**נקודת-מפתח — שקעי-קוקפיט כבר-אטומים:** cockpit.ts מייבא מ-`./lib` את
hokDue · hokMonthlyTotal · orgCalEntries · supCount · supIls · supLast · supUsd —
**כולם כבר אטומי-Genesis** (hok-due/hok-monthly-total/org-cal-entries/sup-count/sup-ils/
sup-last/sup-usd). כלומר הם שקעים-מוכרים: בפירוק, הזרק אותם כפרמטרי-deps (חוק-1), אל תשכפל.

## הזרימה (פר-אטום, שני שלבים)
**שלב א׳ · פירוק (TS→JS-atom):** לכל פונקציה-מיוצאת ⇒ אטום-JS עצמאי ב-`new/atoms/<name>.mjs`:
- הפשט טיפוסי-TS; הפוך private-helpers ל-`_`-inline; שכני-`./lib` ⇒ פרמטרי-שקע (deps).
- כתוב `<name>.contract.md` + `<name>.test.mjs` (golden — הרץ node, הקלט פלטים דטרמיניסטיים).
- דדופ מול הקיים (`node machtzev/dedup-atoms.mjs`); אטום-שקול-קיים ⇒ דלג.
**שלב ב׳ · המרה (JS→Dart):** הפעל את צינור-ההמרה הקיים (release.js / swarm) עם **אימות-עוין
מול Node** (bytes-not-prose) — בדיוק כמו כל מאור. js-compat-reference מוטבע inline לפי-צורך.
משטרה 7/7 · commit+push כל נחיתה.

## נתיבים/כלים
- DART=`/tmp/claude-0/-home-user/65886fc0-dc27-5a35-9058-e6a50b9adaff/scratchpad/dart-sdk-dl/dart-sdk/bin/dart` (הורד מחדש אם המכולה התאתחלה: אותו נתיב, dart-sdk 3.5.4).
- אימות-עוין: node (אורקל, ‏import מ-new/atoms/<n>.mjs) מול probe-Dart, diff JSON.
- משטרה: `node machtzev/police.mjs --fast`.
- ⚠️ **המכולה מתאתחלת** בין סשנים — re-clone + הורד Dart-SDK אם צריך; הכול על הענף.

## סדר-עבודה מומלץ בחידוש
1. התחל ב-**cockpit.ts** (14, השקעים כבר-אטומים ⇒ הקל ביותר לפירוק) — פרק 5–7/גל.
2. intel/portfolio/segments/commands/constellation (19 — נגזרות-תורם דומות).
3. dialer.ts (10) · nedarimSync.ts (דלתא בלבד אחרי דדופ).
4. אחרי כל אטום-JS: המר ל-Dart עם אימות-עוין. commit+push.
5. כשנגמר: `dedup-atoms` + `dedup-cross-dart` + עדכן HANDOFF-DART §5 + דוח CLOSED.
6. רק אז חזור לבנייה-חכמה (173 טיוטות, dart-promote.js).
