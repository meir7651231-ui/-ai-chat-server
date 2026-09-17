# לדג'ר-מטרה · anyg1

> כל בוקר לדעת אילו תשלומי הורים באיחור מעל 30 יום, כמה הם חייבים בסך הכל, ולשלוח לכל אחד תזכורת בוואטסאפ עם הסכום

`node machtzev/generator/behavior-plan.mjs --goal ../../../tmp/claude-0/-home-user--ai-chat-server/30f5158b-7d41-5ed6-a2fa-5d7012d773a9/scratchpad/g1.txt --ns anyg1` · 2026-09-17 23:01:24 · 249.4s

## שמונת הצעדים

| # | צעד | מצב | מדידה |
|---|---|---|---|
| 1 | פסק (yeshiva/purpose) על טקסט-המטרה | ✓ עבר | 7 מקורות · 13 מתגים · חובה 0 · רשות 0 · תחום — · rule: לא נקרא (אין goal.spec) |
| 2 | פירוק (מטרה ⇒ חלקיקים) | ✓ עבר | 2 תביעות ⇒ 5 צרכים נגזרו · 2 מתגי-בעלים · דוגמאות מ-9785 ליטרלי-רשומה בריפו |
| 3 | אפס-המצאה לכל צורך | ✓ עבר | גלאי-ההמצאה על צרכים: 5 נבדקו · 5/5 המשיכו להוכחה |
| 4 | חיפוש-לפי-מטרה + הוכחה-בריצה + בחירה |  ∅ | סבב 1: 3/5 נפתרו · g1.predicate.recordDateOver30, g1.collection.dateOver30List ∅ |
| 5 | שימוש-חוזר (התנהגות-מוכחת = אטום לצורך הבא) | ✓ עבר | סבב 2: 3 התנהגויות במדף ⇒ 1/2 (g1.predicate.recordDateOver30) · סבב 3: 4 התנהגויות במדף ⇒ 1/1 (g1.collection.dateOver30List) |
| 6 | חיווט ⇒ Dart (behavior-compose --plan) | ✓ עבר | new/dart-gen-bs/gen_goal_anyg1.dart · 5 התנהגויות מוכחות (bhDateDays, bhDateOver30, bhRecordDateOver30, bhDateOver30List, bhSumAmount) · ∅ 0 · הוכחה: new/dart-gen-bs/gen_goal_anyg1_proof.dart (21 דוגמאות) |
| 7 | משטרה בתוך הריצה | ✓ עבר | dart analyze: עבר · dart run --enable-asserts (הוכחת-ההרכבה): עבר · no-fakers-check: עבר · flutter analyze (מראה): לא-זמין |
| 8 | כתיבת-הלדג'ר | ✓ עבר | machtzev/generator/goals/anyg1/ledger.json · machtzev/generator/goals/anyg1/ledger.md |

## הצרכים

| צורך | מצב | נבחר | צמתים | תיקו | דוגמאות-חלשות | עומק | שקעים | סבב |
|---|---|---|---|---|---|---|---|---|
| g1.clock.dateDays | ✓ עבר | `cockpitDaysSince(p0,now)` | 1 | 2 | כן | 1 | clock | 1 |
| g1.predicate.dateOver30 | ✓ עבר | `cmpGtStr(now,addDaysIso(p0,30))` | 2 | 4 | כן | 2 | clock,literal | 1 |
| g1.predicate.recordDateOver30 | ✓ עבר | `bhDateOver30(fieldOf(p0,'date'),now)` | 2 | 1 | לא | 2 | literal,clock | 2 |
| g1.collection.dateOver30List | ✓ עבר | `whereList(p0,λbhRecordDateOver30(_,now))` | 2 | 1 | לא | 1 | clock | 3 |
| g2.measure.sumAmount | ✓ עבר | `sumBy(p0,λfieldOf(_,'amount'))` | 2 | 1 | לא | 1 | literal | 1 |

## משטרה

| בדיקה | מצב | פלט |
|---|---|---|
| dart analyze | ✓ עבר | Analyzing gen_goal_anyg1.dart... / No issues found! |
| dart run --enable-asserts (הוכחת-ההרכבה) | ✓ עבר | ✓ 21 דוגמאות · 5 התנהגויות |
| no-fakers-check | ✓ עבר | ✓ no-fakers: 0 מזייפים ב-SSOT (הכרעה-26 — כל אטום שמציג ערך קיבל שקע) · השער עומד לחוב עתידי |
| flutter analyze (מראה) | 🟡 לא-זמין | buildsmart=— · flutter=— |

## סיכום

- צרכים: **5/5** נפתרו · 0 נפסלו · 3 סבבים
- פלט: `new/dart-gen-bs/gen_goal_anyg1.dart` + `new/dart-gen-bs/gen_goal_anyg1_proof.dart`
- לדג'ר: `machtzev/generator/goals/anyg1/ledger.json`
