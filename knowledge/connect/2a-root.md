# 2a · `machtzev/*.mjs` (שורש) — מיפוי חיבור-למחולל

**15/51 מנועים ממופים** · 996 שורות נקראו · פיזור s22: 0⇒5 · 1⇒8 · 2⇒2 · 3⇒0

הגדרת «מחובר» = `machtzev/census/engine-index.mjs:319-333` (נגיש בייבוא טרנזיטיבי מ-6 נקודות-הכניסה, או מורץ-בשם מ-regen/ship). שערים אינם מחוברים — הם שומרים.
מדידה: `node machtzev/census/engine-index.mjs --connected` ⇒ `57 · 279 · 336`.

| מנוע | s22 | connectAt | תמצית |
|---|:--:|---|---|
| `box-proofs-check.mjs` | 2 | machtzev/generator/behavior-plan.mjs:98 / machtzev/generator/auto-logic.mjs:151 — בורר-המועמדים | מריץ בפועל `dart run --enable-asserts` על כל קובץ *-proof.dart ב-new/dart-boxes, ומסמן כאדומה כל קופסה שההרצה שלה נכשלה |
| `coverage-gate.mjs` | 2 | machtzev/generator/genesis-gen.mjs:115-122 — לולאת-בורר-הלבנים | מודד ארבעה צירי-יכולת ומפיל על נסיגה בכל אחד: widgetsFillable · enginesRunnable · essence · dataTwinned |
| `box-assemble.mjs` | 1 | ∅ (מותנה) | ממיר קובץ-מקור TS של maor ל-JS דרך ts.transpileModule (מסיר טיפוסים ו-import type, משאיר import-ערך) |
| `box-data-lift.mjs` | 1 | ∅ | סורק ב-AST אמיתי של TypeScript את הצהרות-המשתנה ברמת-המודול של קופסה ואוסף רק מאתחלים שהם ליטרל-דאטה טהור רקורסיבי |
| `box-magic-lift.mjs` | 1 | ∅ | מוצא ב-AST כל ליטרל-מספרי בקופסה ומרים אותו לאטום-דאטה <base>-nums.mjs תחת מפתח אנונימי M.m0/M.m1 |
| `box-purify.mjs` | 1 | ∅ | מרים מחרוזות-עברית ו-enum-לטיני מקופסה לאטום-דאטה <base>-strings.mjs תחת מפתחות S.k0/S.k1, וכותב חוזה+בדיקת-צילום |
| `chisel-all.mjs` | 1 | ∅ | בוחר מועמדים: כל .ts תחת maor/src עם ≥1 יצוא-פונקציה שאינו כבר במדף, שאינו בדיקה/d.ts, ושאינו «אימפיורי-מתוכנן» |
| `contract-check.mjs` | 1 | ∅ | אוכף לכל אטום/קופסה ב-new/: קיים <base>.contract.md באורך ≥100 תווים **וגם** <base>.test.mjs, והבדיקה חייבת לצאת 0 |
| `dart-bin.mjs` | 1 | כבר מחובר בפועל דרך machtzev/generator/synth.mjs:15 — ראוי רק להכיר בכך | מפרק-נתיב יחיד לבינארי Dart בסדר קבוע: DART_BIN ⇒ $HOME/dart-sdk/bin/dart ⇒ /home/user/flutter/bin/dart ⇒ command -v dart |
| `data-purity-check.mjs` | 1 | ∅ — ובמתכוון | מסמן אטום כ«מעורב» אם יש בו ליטרל-עברי **וגם** הוא אינו בצורת-דאטה-טהורה — אינווריאנט הכרעה-16: אין דאטה במנגנון |
| `allow-check.mjs` | 0 | ∅ | מפרסר trailers מסוג `Allow: <kind>[:<scope>] <סיבה>` מהודעת-commit ומחזיר {allows,bad} |
| `atom-count-check.mjs` | 0 | ∅ | סופר קבצים רקורסיבית לכל תיקייה ישירה תחת new/ ומחזיר {אזור: מספר} |
| `audit-gates.mjs` | 0 | ∅ | פותח worktree זמני מנותק על HEAD עם core.hooksPath=.githooks, מזריע הפרה, ומנסה `git commit` אמיתי — הראיה היא commit שנכשל |
| `chisel.mjs` | 0 | ∅ | מריץ ארבעה שלבים: חילוץ (gen-wires של maor) ⇒ ניקוי-טיוטות ⇒ promote-auto ⇒ מסנן-שערים |
| `cross-source-check.mjs` | 0 | ∅ | לכל אטום **חדש** ב-staged: בונה אינדקס-שמות מכל new/ ומחפש שם-מנורמל זהה בתיקייה אחרת; מצא ⇒ 🔴 «המצאה-מחדש» |
