# לדג'ר-מטרה · anyg6

> בסוף כל חודש לסכם כמה תרומות התקבלו, לזהות תורמים שלא תרמו מעל 90 יום, ולשלוח להם מכתב תודה

`node machtzev/generator/behavior-plan.mjs --goal ../../../tmp/claude-0/-home-user--ai-chat-server/30f5158b-7d41-5ed6-a2fa-5d7012d773a9/scratchpad/g6.txt --ns anyg6` · 2026-09-17 23:09:14 · 239.8s

## שמונת הצעדים

| # | צעד | מצב | מדידה |
|---|---|---|---|
| 1 | פסק (yeshiva/purpose) על טקסט-המטרה | ✓ עבר | 31 מקורות · 12 מתגים · חובה 0 · רשות 0 · תחום — · rule: לא נקרא (אין goal.spec) |
| 2 | פירוק (מטרה ⇒ חלקיקים) | ✓ עבר | 3 תביעות ⇒ 4 צרכים נגזרו · 3 מתגי-בעלים · דוגמאות מ-9785 ליטרלי-רשומה בריפו |
| 3 | אפס-המצאה לכל צורך | ✓ עבר | גלאי-ההמצאה על צרכים: 4 נבדקו · 4/4 המשיכו להוכחה |
| 4 | חיפוש-לפי-מטרה + הוכחה-בריצה + בחירה |  ∅ | סבב 1: 2/4 נפתרו · g2.predicate.recordDateOver90, g2.collection.dateOver90List ∅ |
| 5 | שימוש-חוזר (התנהגות-מוכחת = אטום לצורך הבא) | ✓ עבר | סבב 2: 2 התנהגויות במדף ⇒ 1/2 (g2.predicate.recordDateOver90) · סבב 3: 3 התנהגויות במדף ⇒ 1/1 (g2.collection.dateOver90List) |
| 6 | חיווט ⇒ Dart (behavior-compose --plan) | ✓ עבר | new/dart-gen-bs/gen_goal_anyg6.dart · 4 התנהגויות מוכחות (bhDateDays, bhDateOver90, bhRecordDateOver90, bhDateOver90List) · ∅ 0 · הוכחה: new/dart-gen-bs/gen_goal_anyg6_proof.dart (18 דוגמאות) |
| 7 | משטרה בתוך הריצה | ✓ עבר | dart analyze: עבר · dart run --enable-asserts (הוכחת-ההרכבה): עבר · no-fakers-check: עבר · flutter analyze (מראה): לא-זמין |
| 8 | כתיבת-הלדג'ר | ✓ עבר | machtzev/generator/goals/anyg6/ledger.json · machtzev/generator/goals/anyg6/ledger.md |

## הצרכים

| צורך | מצב | נבחר | צמתים | תיקו | דוגמאות-חלשות | עומק | שקעים | סבב |
|---|---|---|---|---|---|---|---|---|
| g2.clock.dateDays | ✓ עבר | `cockpitDaysSince(p0,now)` | 1 | 2 | כן | 1 | clock | 1 |
| g2.predicate.dateOver90 | ✓ עבר | `cmpGeStr(now,addDaysIso(p0,90))` | 2 | 8 | כן | 2 | clock,literal | 1 |
| g2.predicate.recordDateOver90 | ✓ עבר | `bhDateOver90(fieldOf(p0,'date'),now)` | 2 | 1 | לא | 2 | literal,clock | 2 |
| g2.collection.dateOver90List | ✓ עבר | `whereList(p0,λbhRecordDateOver90(_,now))` | 2 | 1 | לא | 1 | clock | 3 |

## משטרה

| בדיקה | מצב | פלט |
|---|---|---|
| dart analyze | ✓ עבר | Analyzing gen_goal_anyg6.dart... / No issues found! |
| dart run --enable-asserts (הוכחת-ההרכבה) | ✓ עבר | ✓ 18 דוגמאות · 4 התנהגויות |
| no-fakers-check | ✓ עבר | ✓ no-fakers: 0 מזייפים ב-SSOT (הכרעה-26 — כל אטום שמציג ערך קיבל שקע) · השער עומד לחוב עתידי |
| flutter analyze (מראה) | 🟡 לא-זמין | buildsmart=— · flutter=— |

## סיכום

- צרכים: **4/4** נפתרו · 0 נפסלו · 3 סבבים
- פלט: `new/dart-gen-bs/gen_goal_anyg6.dart` + `new/dart-gen-bs/gen_goal_anyg6_proof.dart`
- לדג'ר: `machtzev/generator/goals/anyg6/ledger.json`
