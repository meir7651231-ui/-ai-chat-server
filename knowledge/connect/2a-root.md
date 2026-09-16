# 2a · `machtzev/*.mjs` (שורש) — מיפוי חיבור-למחולל

**5/51 מנועים ממופים** · 358 שורות נקראו · פיזור s22: 0⇒3 · 1⇒2 · 2⇒0 · 3⇒0

הגדרת «מחובר» = `machtzev/census/engine-index.mjs:319-333` (נגיש בייבוא טרנזיטיבי מ-6 נקודות-הכניסה, או מורץ-בשם מ-regen/ship). שערים אינם מחוברים — הם שומרים.
מדידה: `node machtzev/census/engine-index.mjs --connected` ⇒ `57 · 279 · 336`.

| מנוע | s22 | connectAt | תמצית |
|---|:--:|---|---|
| `box-assemble.mjs` | 1 | ∅ (מותנה) | ממיר קובץ-מקור TS של maor ל-JS דרך ts.transpileModule (מסיר טיפוסים ו-import type, משאיר import-ערך) |
| `box-data-lift.mjs` | 1 | ∅ | סורק ב-AST אמיתי של TypeScript את הצהרות-המשתנה ברמת-המודול של קופסה ואוסף רק מאתחלים שהם ליטרל-דאטה טהור רקורסיבי |
| `allow-check.mjs` | 0 | ∅ | מפרסר trailers מסוג `Allow: <kind>[:<scope>] <סיבה>` מהודעת-commit ומחזיר {allows,bad} |
| `atom-count-check.mjs` | 0 | ∅ | סופר קבצים רקורסיבית לכל תיקייה ישירה תחת new/ ומחזיר {אזור: מספר} |
| `audit-gates.mjs` | 0 | ∅ | פותח worktree זמני מנותק על HEAD עם core.hooksPath=.githooks, מזריע הפרה, ומנסה `git commit` אמיתי — הראיה היא commit שנכשל |
