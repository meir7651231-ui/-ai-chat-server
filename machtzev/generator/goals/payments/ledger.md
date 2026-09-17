# לדג'ר-מטרה · payments

> כל בוקר לדעת אילו תשלומי הורים באיחור מעל 30 יום, כמה הם חייבים בסך הכל, ולשלוח לכל אחד תזכורת בוואטסאפ עם הסכום

`node machtzev/generator/behavior-plan.mjs --goal ../../../tmp/gp/goal.json --ns payments` · 2026-09-17 21:20:37 · 209.9s

## שבעת הצעדים

| # | צעד | מצב | מדידה |
|---|---|---|---|
| 1 | פסק (yeshiva/purpose) על טקסט-המטרה |  ∅ | 0 מקורות · 3 מתגים · חובה 0 · רשות 0 · תחום — · rule: לא נקרא (אין goal.spec) |
| 2 | אפס-המצאה לכל צורך | 🟡 לא-זמין | גלאי-ההמצאה על צרכים לא זמין (הפלט אינו JSON — --needs עוד לא נתמך (usage: node hamtzaa.mjs [--gate/--ratchet/--peruks/--nl/--peruk N/--file <in> <spec>] [--l)) ⇒ בדיקה-מבנית בלבד · 7/7 המשיכו להוכחה |
| 3 | חיפוש-לפי-מטרה + הוכחה-בריצה + בחירה |  ∅ | סבב 1: 5/7 נפתרו · g3a.predicate.recordOverdue30, g3.collection.overdueList ∅ |
| 4 | שימוש-חוזר (התנהגות-מוכחת = אטום לצורך הבא) | ✓ עבר | סבב 2: 5 התנהגויות במדף ⇒ 1/2 (g3a.predicate.recordOverdue30) · סבב 3: 6 התנהגויות במדף ⇒ 1/1 (g3.collection.overdueList) |
| 5 | חיווט ⇒ Dart (behavior-compose --plan) | ✓ עבר | new/dart-gen-bs/gen_goal_payments.dart · 7 התנהגויות מוכחות (bhOverdueDays, bhOverdue30, bhRecordOverdue30, bhOverdueList, bhTotalDue, bhReminder, bhSendReminder) · ∅ 0 · הוכחה: new/dart-gen-bs/gen_goal_payments_proof.dart (22 דוגמאות) |
| 6 | משטרה בתוך הריצה | ✓ עבר | dart analyze: עבר · dart run --enable-asserts (הוכחת-ההרכבה): עבר · no-fakers-check: עבר · flutter analyze (מראה): לא-זמין |
| 7 | כתיבת-הלדג'ר | ✓ עבר | machtzev/generator/goals/payments/ledger.json · machtzev/generator/goals/payments/ledger.md |

## הצרכים

| צורך | מצב | נבחר | צמתים | תיקו | דוגמאות-חלשות | עומק | שקעים | סבב |
|---|---|---|---|---|---|---|---|---|
| g1.clock.overdueDays | ✓ עבר | `cockpitDaysSince(p0,now)` | 1 | 2 | כן | 1 | clock | 1 |
| g2.predicate.overdue30 | ✓ עבר | `cmpGtStr(now,addDaysIso(p0,30))` | 2 | 4 | כן | 2 | clock,literal | 1 |
| g3a.predicate.recordOverdue30 | ✓ עבר | `fieldPred(p0,'due',λbhOverdue30(_,now))` | 2 | 1 | לא | 1 | literal,clock | 2 |
| g3.collection.overdueList | ✓ עבר | `whereList(p0,λbhRecordOverdue30(_,now))` | 2 | 1 | לא | 1 | clock | 3 |
| g4.measure.totalDue | ✓ עבר | `sumBy(p0,λfieldOf(_,'amount'))` | 2 | 1 | לא | 1 | literal | 1 |
| g5.format.reminder | ✓ עבר | `pp(p1,p0)` | 1 | 2 | כן | 1 | — | 1 |
| g6.world.sendReminder | ✓ עבר | `addTo(w,addDyn(p0,p1))` | 2 | 4 | כן | 2 | world | 1 |

## משטרה

| בדיקה | מצב | פלט |
|---|---|---|
| dart analyze | ✓ עבר | Analyzing gen_goal_payments.dart... / No issues found! |
| dart run --enable-asserts (הוכחת-ההרכבה) | ✓ עבר | ✓ 22 דוגמאות · 7 התנהגויות |
| no-fakers-check | ✓ עבר | ✓ no-fakers: 0 מזייפים ב-SSOT (הכרעה-26 — כל אטום שמציג ערך קיבל שקע) · השער עומד לחוב עתידי |
| flutter analyze (מראה) | 🟡 לא-זמין | buildsmart=— · flutter=— |

## סיכום

- צרכים: **7/7** נפתרו · 0 נפסלו · 3 סבבים
- פלט: `new/dart-gen-bs/gen_goal_payments.dart` + `new/dart-gen-bs/gen_goal_payments_proof.dart`
- לדג'ר: `machtzev/generator/goals/payments/ledger.json`
