# 2a · `machtzev/*.mjs` (שורש) — מיפוי חיבור-למחולל

**31/51 מנועים ממופים** · 2260 שורות נקראו · פיזור s22: 0⇒12 · 1⇒11 · 2⇒7 · 3⇒1

הגדרת «מחובר» = `machtzev/census/engine-index.mjs:319-333` (נגיש בייבוא טרנזיטיבי מ-6 נקודות-הכניסה, או מורץ-בשם מ-regen/ship). שערים אינם מחוברים — הם שומרים.
מדידה: `node machtzev/census/engine-index.mjs --connected` ⇒ `57 · 279 · 336`.

| מנוע | s22 | connectAt | תמצית |
|---|:--:|---|---|
| `deep-purity-scan.mjs` | 3 | machtzev/generator/regen.mjs:22-23 — אחרי balagan.mjs/server.mjs, כשלב-אימות על new/dart-gen-bs; ובפועל: deepFindings (שורות 107-131) מופעל על פלט-המחולל | מחלקה א׳ — טוהר: סורק אטומי-מנגנון ב-new/atoms ו-new/boxes ב-AST של TypeScript ומסווג ל-4 קטגוריות משוקללות: heb(×4) · table(×3) · domstr(×2) · magic(×1) |
| `box-proofs-check.mjs` | 2 | machtzev/generator/behavior-plan.mjs:98 / machtzev/generator/auto-logic.mjs:151 — בורר-המועמדים | מריץ בפועל `dart run --enable-asserts` על כל קובץ *-proof.dart ב-new/dart-boxes, ומסמן כאדומה כל קופסה שההרצה שלה נכשלה |
| `coverage-gate.mjs` | 2 | machtzev/generator/genesis-gen.mjs:115-122 — לולאת-בורר-הלבנים | מודד ארבעה צירי-יכולת ומפיל על נסיגה בכל אחד: widgetsFillable · enginesRunnable · essence · dataTwinned |
| `ds-critic.mjs` | 2 | machtzev/generator/regen.mjs:24 — כשלב-אימות אחרון בצינור (אחרי server.mjs), במקום one.mjs:161 | **סורק את פלט-המחולל** — SCAN = R.outDir() = new/dart-gen-bs (או GEN_OUT מהסביבה); זהו אחד המעטים בקבוצה שמסתכל על מה שהמחולל ייצר |
| `ds-pure.mjs` | 2 | machtzev/generator/regen.mjs:7 — לצד ds-forge.mjs, בראש הצינור | קורא את אטום-הזרע new/atoms/pure-look.mjs (PURE_LOOK) ומחולל דטרמיניסטית את ds_pure.dart — נייטרל · סמנטי · ערכות-אקצנט · fontSets · themeOf() |
| `empire-coverage.mjs` | 2 | machtzev/generator/regen.mjs:24 — כשלב-דיווח בסוף הצינור, ורק סעיף wiredSection (שורות 124-146) | מודד כיסוי מול שלוש מערכות-האימפריה (maor TS · buildsmart Dart · yoman JS) — כמה מיכולות-הלוגיקה של המקור כבר נחצבו למדף |
| `goal-card.mjs` | 2 | machtzev/generator/app-from-sentences.mjs (regen.mjs:16) — פליטת-כרטיס פר-מסך-מחולל | כותב כרטיס-מטרה חתום ל-machtzev/audit/goals/<מסך>.json: goal · models · atoms · accept · picture + screenSha + pictureSha + sig |
| `goal-proof-check.mjs` | 2 | machtzev/generator/regen.mjs:16-22 — הסרת ההחרגה GENOUT, ברגע שהמחולל פולט כרטיסים (ראה goal-card) | שער pre-commit: כל מסך/לוח ב-staged חייב כרטיס-מטרה תקף — והבדיקה היא בבייטים, לא שיפוט |
| `box-assemble.mjs` | 1 | ∅ (מותנה) | ממיר קובץ-מקור TS של maor ל-JS דרך ts.transpileModule (מסיר טיפוסים ו-import type, משאיר import-ערך) |
| `box-data-lift.mjs` | 1 | ∅ | סורק ב-AST אמיתי של TypeScript את הצהרות-המשתנה ברמת-המודול של קופסה ואוסף רק מאתחלים שהם ליטרל-דאטה טהור רקורסיבי |
| `box-magic-lift.mjs` | 1 | ∅ | מוצא ב-AST כל ליטרל-מספרי בקופסה ומרים אותו לאטום-דאטה <base>-nums.mjs תחת מפתח אנונימי M.m0/M.m1 |
| `box-purify.mjs` | 1 | ∅ | מרים מחרוזות-עברית ו-enum-לטיני מקופסה לאטום-דאטה <base>-strings.mjs תחת מפתחות S.k0/S.k1, וכותב חוזה+בדיקת-צילום |
| `chisel-all.mjs` | 1 | ∅ | בוחר מועמדים: כל .ts תחת maor/src עם ≥1 יצוא-פונקציה שאינו כבר במדף, שאינו בדיקה/d.ts, ושאינו «אימפיורי-מתוכנן» |
| `contract-check.mjs` | 1 | ∅ | אוכף לכל אטום/קופסה ב-new/: קיים <base>.contract.md באורך ≥100 תווים **וגם** <base>.test.mjs, והבדיקה חייבת לצאת 0 |
| `dart-bin.mjs` | 1 | כבר מחובר בפועל דרך machtzev/generator/synth.mjs:15 — ראוי רק להכיר בכך | מפרק-נתיב יחיד לבינארי Dart בסדר קבוע: DART_BIN ⇒ $HOME/dart-sdk/bin/dart ⇒ /home/user/flutter/bin/dart ⇒ command -v dart |
| `data-purity-check.mjs` | 1 | ∅ — ובמתכוון | מסמן אטום כ«מעורב» אם יש בו ליטרל-עברי **וגם** הוא אינו בצורת-דאטה-טהורה — אינווריאנט הכרעה-16: אין דאטה במנגנון |
| `ds-tokens.mjs` | 1 | ∅ | קורא זרע קומפקטי (new/dart-ui-bs/ds/design-seed.json) ומרחיב אותו ל-7 מחלקות-טוקן ב-ds_scale.dart: DsType · DsSpace · DsRadii · DsElev · DsGradient · DsMotion · DsDark |
| `lib-ts.mjs` | 1 | כבר מחובר בפועל דרך machtzev/emit/ast-js-to-dart.mjs:4 — ראוי רק להכיר בכך | פותר-typescript אחד לכל הכלים: machtzev/node_modules (vendored) ⇒ נפילה ל-maor-system |
| `mutation-check.mjs` | 1 | ∅ — כי היכולת כבר הועתקה לתוך המחולל | לכל אטום: מחליף את הקובץ בגוף-חלול, מריץ את הבדיקה (חייבת להאדים), משחזר, מריץ שוב (חייבת להוריק) — שני התנאים יחד |
| `allow-check.mjs` | 0 | ∅ | מפרסר trailers מסוג `Allow: <kind>[:<scope>] <סיבה>` מהודעת-commit ומחזיר {allows,bad} |
| `atom-count-check.mjs` | 0 | ∅ | סופר קבצים רקורסיבית לכל תיקייה ישירה תחת new/ ומחזיר {אזור: מספר} |
| `audit-gates.mjs` | 0 | ∅ | פותח worktree זמני מנותק על HEAD עם core.hooksPath=.githooks, מזריע הפרה, ומנסה `git commit` אמיתי — הראיה היא commit שנכשל |
| `chisel.mjs` | 0 | ∅ | מריץ ארבעה שלבים: חילוץ (gen-wires של maor) ⇒ ניקוי-טיוטות ⇒ promote-auto ⇒ מסנן-שערים |
| `cross-source-check.mjs` | 0 | ∅ | לכל אטום **חדש** ב-staged: בונה אינדקס-שמות מכל new/ ומחפש שם-מנורמל זהה בתיקייה אחרת; מצא ⇒ 🔴 «המצאה-מחדש» |
| `ds-graphics.mjs` | 0 | ∅ | מחולל ds_graphics.dart — 5 CustomPainter דטרמיניסטיים (אורורה/מש/גלים/רשת-נקודות/זוהר) מתוך מפרט-דאטה בקובץ |
| `ds-motion.mjs` | 0 | ∅ — אבל עם הערה שראוי להביא לבעלים | מחולל ds_anim.dart — 5 עוטפי-מושן-כניסה דרך TweenAnimationBuilder (חד-שוט, בלי controller) |
| `ds-variants.mjs` | 0 | ∅ לחיבור; אבל יש כאן ממצא-שער שראוי לדווח | מחולל ds_surface.dart — עוטפי-כרטיס פר-תא-מטריצה (מוגבה · מתאר · זכוכית · גרדיאנט), כשהעיצוב מגיע מטוקנים והווידג'ט עיוור |
| `index-check.mjs` | 0 | ∅ | אוכף שכל .mjs תחת machtzev/ מופיע ב-INDEX.md — סקריפט חדש בלי שורה ⇒ אדום |
| `learn-check.mjs` | 0 | ∅ | parity: כל `## L…` ב-LEARNINGS.md חייב שורת `GATE:` עם מזהה מוכר (מ-gates.tsv ∪ 21 שערי-hook קשיחים) |
| `learn-draft.mjs` | 0 | ∅ | --record: לכל (שער-כושל × קובץ-staged ב-new/) כותב רשומה ל-audit/retry.jsonl עם ts · attempt · gate · path · sha · blob_before |
| `merge-regen.mjs` | 0 | ∅ לחיבור; אבל הרשימה בשורות 14-15 היא מועמדת-הרחבה אמיתית | ‏merge-driver של git לקבצים מחוללים: במקום מיזוג-טקסט הוא **מחדש את הקובץ מהעץ** ומחזיר אותו כתוצאת-המיזוג |
