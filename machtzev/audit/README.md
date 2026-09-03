# 🔬 pixel-forge-audit — מנוע-ביקורת-פיקסל אוטומטי (ORIG ↔ FORGE)

במקום להשוות אטומי-Pure ידנית אחד-אחד — המנוע סורק את **כל** האטומים, מודד סטיית-פיקסל
מול המקור, מדרג מהגרוע-לטוב, ומייצר גיליון-הפרשים חזותי (ORIG | FORGE | heatmap) לכל חשוד.

## הרצה
```bash
node machtzev/audit/run.mjs            # הכל (353 אטומים) — ~10 דק'
node machtzev/audit/run.mjs text status  # משפחות נבחרות
```
פלט: `machtzev/audit/shots/report.md` (דירוג) + `shots/diff/NNN_<atom>.png` (גיליונות).

## שלבים (גם בנפרד)
1. `gen-orig.mjs [families…]` — Playwright מצייר כל אטום-מקור (מסגרת 438px · pad16 · #08080A · 2x),
   כותב `shots/orig/<family>__<slug>.png` + `shots/index.json`. אטומי-תאטרון = **מצב-ראשון** (כמו ה-FORGE).
2. `gen-forge-dart.mjs` — מ-index.json מחולל `buildsmart/app_flutter/test/zz_pixel_audit_test.dart`
   (ייבוא-ממוספר פר-משפחה למניעת התנגשות-שמות), שמצייר כל `Forge<Pascal>()` באותו מסגור.
3. `flutter test test/zz_pixel_audit_test.dart` (ב-buildsmart) — כותב `shots/forge/<key>.png`.
   אטום שנכשל-בפריסה (unbounded) נבלע → נרשם כ-`no-forge` (ממצא).
4. `diff.mjs` — דיף-אפור פר-פיקסל בדפדפן, דירוג, `report.md`+`report.json`, וגיליונות ל-TOPN.

## מקור-אמת יחיד
`lib.mjs` מייבא את חציבת-התאים מ-`ds-forge.mjs` (אותו `cells`/`theaterStates`/`pascal`/`snake`) —
כך שקבוצת-האטומים והמסגור **זהים** לצד-ה-FORGE, ולא נוצר סחף בין המנועים.

## קריאת-המספרים
- **raw%** = הפרש-פיקסל-אפור (סף 32). ⚠️ טקסט עברי/לטיני נותן **רצפה ~5-7%** בגלל רסטור שונה
  בין דפדפן ל-Flutter — זה **לא באג**. חריגה גבוהה מעל-הרצפה, או גוש-אדום-רציף ב-heatmap = באג-אמיתי.
- **struct%** = אחרי הקטנה ×0.25 (משני).
- **הכלי-המכריע הוא ה-heatmap** (`shots/diff/`), לא המספר לבדו: אדום-על-שולי-אות = AA;
  אדום-בגוש/מיקום-שונה/צבע-שונה = פער-אמיתי.
- **no-forge** = האטום לא-צויר עצמאית (בעיית-פריסה) — ממצא בפני-עצמו.

## 🩺 תיקון-עצמי מוגן (self-heal)
```bash
node machtzev/audit/heal.mjs text__gradient_text   # אמת תיקון-מנוע (עץ-העבודה) מול baseline
node machtzev/audit/heal.mjs --suspects            # כל החשודים (raw≥8%)
```
מנגנון: אחרי עריכת-מנוע (ידנית או ע"י אסטרטגיה), `heal` **מרנדר את המטרות + 12 קנרים**, מודד,
ומכריע — **קידום** (השארת השינוי) אם המטרות השתפרו **ואף קנרי לא-נסוג**, אחרת **ביטול-אוטומטי**
(`git checkout ds-forge.mjs` + regen + mirror). כל תיקון-מנוע נעשה בטוח ואוטו-מתבטל ברגרסיה.
בקידום — `baseline.json` מתעדכן למטרות (מעקב עתידי מהמצב-החדש). דוגמה שהוכחה: `background-clip:text`
(gradient_text) ‏17.2%→5.5% · אפס-רגרסיה · קודם אוטומטית.

## 📈 מעקב (baseline + היסטוריה)
- `baseline.json` (נשמר בגיט) = חוזה-האיכות: diff% פר-אטום. כל ריצת-diff משווה מולו ⇒ מסמנת
  🔴 **רגרסיות** · 🟢 **שיפורים** · 💥 **נשבר-render** · ✅ **תוקן-render** בראש ה-report.md.
- `node machtzev/audit/diff.mjs --baseline` (או `run.mjs`… ואז diff --baseline) — מקבע baseline חדש.
- `history.jsonl` — שורת-מגמה פר-ריצה (mean · clean · suspect · regressed · improved).

## 🔎 אבחון (feature-fingerprint)
`features.mjs` מסמן לכל אטום אילו תכונות-CSS-קשות הוא משתמש (`background-clip:text` · `transform-3d` ·
`object-fit` · `clip-path` · `conic-gradient` · `bg-image-url` …). מופיע בעמודת **feats** ב-report ⇒
"‏diff 17% · background-clip:text" = אבחון-שורש מיידי + כיוון-ל-heal.

## תלויות
Playwright (מערכתי), flutter (buildsmart), פונטים מקומיים ב-`fonts/` (Fraunces · Frank Ruhl Libre ·
Space Grotesk · Heebo · JetBrains Mono). `shots/` ב-.gitignore (מתחדש).
