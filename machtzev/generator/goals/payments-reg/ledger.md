# לדג'ר-מטרה · payments-reg

> כל בוקר לדעת אילו תשלומי הורים באיחור מעל 30 יום, כמה הם חייבים בסך הכל, ולשלוח לכל אחד תזכורת בוואטסאפ עם הסכום

`node machtzev/generator/behavior-plan.mjs --goal ../../../tmp/claude-0/-home-user--ai-chat-server/30f5158b-7d41-5ed6-a2fa-5d7012d773a9/scratchpad/reg-payments.json --ns payments-reg` · 2026-09-17 22:56:13 · 82.6s

## שמונת הצעדים

| # | צעד | מצב | מדידה |
|---|---|---|---|
| 1 | פסק (yeshiva/purpose) על טקסט-המטרה | ✓ עבר | 7 מקורות · 13 מתגים · חובה 0 · רשות 0 · תחום — · rule: לא נקרא (אין goal.spec) |
| 2 | פירוק (מטרה ⇒ חלקיקים) |  לא-נדרש | הצרכים הגיעו בקובץ-המטרה (7) — הפירוק לא רץ |
| 3 | אפס-המצאה לכל צורך | ⛔ נפסל | גלאי-ההמצאה על צרכים: 7 נבדקו · 5/7 המשיכו להוכחה · נפסלו: g3a.predicate.recordOverdue30, g3.collection.overdueList |
| 4 | חיפוש-לפי-מטרה + הוכחה-בריצה + בחירה | ✓ עבר | סבב 1: 5/5 נפתרו |
| 5 | שימוש-חוזר (התנהגות-מוכחת = אטום לצורך הבא) | ✓ עבר | אין צורך לא-פתור — סבב שני לא נדרש |
| 6 | חיווט ⇒ Dart (behavior-compose --plan) | ✓ עבר | new/dart-gen-bs/gen_goal_payments-reg.dart · 5 התנהגויות מוכחות (bhOverdueDays, bhOverdue30, bhTotalDue, bhReminder, bhSendReminder) · ∅ 0 · הוכחה: new/dart-gen-bs/gen_goal_payments-reg_proof.dart (15 דוגמאות) |
| 7 | משטרה בתוך הריצה | ✓ עבר | dart analyze: עבר · dart run --enable-asserts (הוכחת-ההרכבה): עבר · no-fakers-check: עבר · flutter analyze (מראה): לא-זמין |
| 8 | כתיבת-הלדג'ר | ✓ עבר | machtzev/generator/goals/payments-reg/ledger.json · machtzev/generator/goals/payments-reg/ledger.md |

## הצרכים

| צורך | מצב | נבחר | צמתים | תיקו | דוגמאות-חלשות | עומק | שקעים | סבב |
|---|---|---|---|---|---|---|---|---|
| g1.clock.overdueDays | ✓ עבר | `cockpitDaysSince(p0,now)` | 1 | 2 | כן | 1 | clock | 1 |
| g2.predicate.overdue30 | ✓ עבר | `cmpGtStr(now,addDaysIso(p0,30))` | 2 | 4 | כן | 2 | clock,literal | 1 |
| g3a.predicate.recordOverdue30 | ⛔ נפסל | המצאה: [object Object], [object Object] | — | — | לא | — | — | — |
| g3.collection.overdueList | ⛔ נפסל | המצאה: [object Object], [object Object] | — | — | לא | — | — | — |
| g4.measure.totalDue | ✓ עבר | `sumBy(p0,λfieldOf(_,'amount'))` | 2 | 1 | לא | 1 | literal | 1 |
| g5.format.reminder | ✓ עבר | `pp(p1,p0)` | 1 | 2 | כן | 1 | — | 1 |
| g6.world.sendReminder | ✓ עבר | `addTo(w,addDyn(p0,p1))` | 2 | 4 | כן | 2 | world | 1 |

## משטרה

| בדיקה | מצב | פלט |
|---|---|---|
| dart analyze | ✓ עבר | Analyzing gen_goal_payments-reg.dart... / No issues found! |
| dart run --enable-asserts (הוכחת-ההרכבה) | ✓ עבר | ✓ 15 דוגמאות · 5 התנהגויות |
| no-fakers-check | ✓ עבר | ✓ no-fakers: 0 מזייפים ב-SSOT (הכרעה-26 — כל אטום שמציג ערך קיבל שקע) · השער עומד לחוב עתידי |
| flutter analyze (מראה) | 🟡 לא-זמין | buildsmart=— · flutter=— |

## סיכום

- צרכים: **5/7** נפתרו · 2 נפסלו · 1 סבבים
- פלט: `new/dart-gen-bs/gen_goal_payments-reg.dart` + `new/dart-gen-bs/gen_goal_payments-reg_proof.dart`
- לדג'ר: `machtzev/generator/goals/payments-reg/ledger.json`
