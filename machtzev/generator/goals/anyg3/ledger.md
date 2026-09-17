# לדג'ר-מטרה · anyg3

> אחרי כל ביקור בית לתעד מה נמצא, לסמן משפחות שלא ביקרנו אצלן מעל 60 יום, ולשלוח למתנדב את הכתובת והטלפון

`node machtzev/generator/behavior-plan.mjs --goal ../../../tmp/claude-0/-home-user--ai-chat-server/30f5158b-7d41-5ed6-a2fa-5d7012d773a9/scratchpad/g3.txt --ns anyg3` · 2026-09-17 23:05:14 · 230.3s

## שמונת הצעדים

| # | צעד | מצב | מדידה |
|---|---|---|---|
| 1 | פסק (yeshiva/purpose) על טקסט-המטרה | ✓ עבר | 37 מקורות · 10 מתגים · חובה 0 · רשות 0 · תחום — · rule: לא נקרא (אין goal.spec) |
| 2 | פירוק (מטרה ⇒ חלקיקים) | ✓ עבר | 3 תביעות ⇒ 4 צרכים נגזרו · 3 מתגי-בעלים · דוגמאות מ-9785 ליטרלי-רשומה בריפו |
| 3 | אפס-המצאה לכל צורך | ✓ עבר | גלאי-ההמצאה על צרכים: 4 נבדקו · 4/4 המשיכו להוכחה |
| 4 | חיפוש-לפי-מטרה + הוכחה-בריצה + בחירה |  ∅ | סבב 1: 2/4 נפתרו · g2.predicate.recordCreatedAtOver60, g2.collection.createdAtOver60List ∅ |
| 5 | שימוש-חוזר (התנהגות-מוכחת = אטום לצורך הבא) |  ∅ | סבב 2: 2 התנהגויות במדף ⇒ 0/2 |
| 6 | חיווט ⇒ Dart (behavior-compose --plan) | ✓ עבר | new/dart-gen-bs/gen_goal_anyg3.dart · 2 התנהגויות מוכחות (bhCreatedAtDays, bhCreatedAtOver60) · ∅ 2 · הוכחה: new/dart-gen-bs/gen_goal_anyg3_proof.dart (9 דוגמאות) |
| 7 | משטרה בתוך הריצה | ✓ עבר | dart analyze: עבר · dart run --enable-asserts (הוכחת-ההרכבה): עבר · no-fakers-check: עבר · flutter analyze (מראה): לא-זמין |
| 8 | כתיבת-הלדג'ר | ✓ עבר | machtzev/generator/goals/anyg3/ledger.json · machtzev/generator/goals/anyg3/ledger.md |

## הצרכים

| צורך | מצב | נבחר | צמתים | תיקו | דוגמאות-חלשות | עומק | שקעים | סבב |
|---|---|---|---|---|---|---|---|---|
| g2.clock.createdAtDays | ✓ עבר | `cockpitDaysSince(p0,now)` | 1 | 2 | כן | 1 | clock | 1 |
| g2.predicate.createdAtOver60 | ✓ עבר | `cmpGeStr(now,addDaysIso(p0,60))` | 2 | 8 | כן | 2 | clock,literal | 1 |
| g2.predicate.recordCreatedAtOver60 |  ∅ | — | — | — | לא | 3 | — | 2 |
| g2.collection.createdAtOver60List |  ∅ | — | — | — | לא | 3 | — | 2 |

## משטרה

| בדיקה | מצב | פלט |
|---|---|---|
| dart analyze | ✓ עבר | Analyzing gen_goal_anyg3.dart... / No issues found! |
| dart run --enable-asserts (הוכחת-ההרכבה) | ✓ עבר | ✓ 9 דוגמאות · 2 התנהגויות |
| no-fakers-check | ✓ עבר | ✓ no-fakers: 0 מזייפים ב-SSOT (הכרעה-26 — כל אטום שמציג ערך קיבל שקע) · השער עומד לחוב עתידי |
| flutter analyze (מראה) | 🟡 לא-זמין | buildsmart=— · flutter=— |

## סיכום

- צרכים: **2/4** נפתרו · 0 נפסלו · 2 סבבים
- פלט: `new/dart-gen-bs/gen_goal_anyg3.dart` + `new/dart-gen-bs/gen_goal_anyg3_proof.dart`
- לדג'ר: `machtzev/generator/goals/anyg3/ledger.json`
