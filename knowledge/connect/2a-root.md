# 2a · `machtzev/*.mjs` (שורש) — מיפוי חיבור-למחולל

**10/51 מנועים ממופים** · 740 שורות נקראו · פיזור s22: 0⇒4 · 1⇒5 · 2⇒1 · 3⇒0

הגדרת «מחובר» = `machtzev/census/engine-index.mjs:319-333` (נגיש בייבוא טרנזיטיבי מ-6 נקודות-הכניסה, או מורץ-בשם מ-regen/ship). שערים אינם מחוברים — הם שומרים.
מדידה: `node machtzev/census/engine-index.mjs --connected` ⇒ `57 · 279 · 336`.

| מנוע | s22 | connectAt | תמצית |
|---|:--:|---|---|
| `box-proofs-check.mjs` | 2 | machtzev/generator/behavior-plan.mjs:98 / machtzev/generator/auto-logic.mjs:151 — בורר-המועמדים | מריץ בפועל `dart run --enable-asserts` על כל קובץ *-proof.dart ב-new/dart-boxes, ומסמן כאדומה כל קופסה שההרצה שלה נכשלה |
| `box-assemble.mjs` | 1 | ∅ (מותנה) | ממיר קובץ-מקור TS של maor ל-JS דרך ts.transpileModule (מסיר טיפוסים ו-import type, משאיר import-ערך) |
| `box-data-lift.mjs` | 1 | ∅ | סורק ב-AST אמיתי של TypeScript את הצהרות-המשתנה ברמת-המודול של קופסה ואוסף רק מאתחלים שהם ליטרל-דאטה טהור רקורסיבי |
| `box-magic-lift.mjs` | 1 | ∅ | מוצא ב-AST כל ליטרל-מספרי בקופסה ומרים אותו לאטום-דאטה <base>-nums.mjs תחת מפתח אנונימי M.m0/M.m1 |
| `box-purify.mjs` | 1 | ∅ | מרים מחרוזות-עברית ו-enum-לטיני מקופסה לאטום-דאטה <base>-strings.mjs תחת מפתחות S.k0/S.k1, וכותב חוזה+בדיקת-צילום |
| `chisel-all.mjs` | 1 | ∅ | בוחר מועמדים: כל .ts תחת maor/src עם ≥1 יצוא-פונקציה שאינו כבר במדף, שאינו בדיקה/d.ts, ושאינו «אימפיורי-מתוכנן» |
| `allow-check.mjs` | 0 | ∅ | מפרסר trailers מסוג `Allow: <kind>[:<scope>] <סיבה>` מהודעת-commit ומחזיר {allows,bad} |
| `atom-count-check.mjs` | 0 | ∅ | סופר קבצים רקורסיבית לכל תיקייה ישירה תחת new/ ומחזיר {אזור: מספר} |
| `audit-gates.mjs` | 0 | ∅ | פותח worktree זמני מנותק על HEAD עם core.hooksPath=.githooks, מזריע הפרה, ומנסה `git commit` אמיתי — הראיה היא commit שנכשל |
| `chisel.mjs` | 0 | ∅ | מריץ ארבעה שלבים: חילוץ (gen-wires של maor) ⇒ ניקוי-טיוטות ⇒ promote-auto ⇒ מסנן-שערים |
