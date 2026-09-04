# ✅ CLOSED · GENMAX · G11b — אתר: האפליקציה-ממשפטים נבנית ורצה כאתר (§22 "אפליקציה+אתר") (4.9.2026)

> שלב G11b של `PLAN-GENERATOR-MAX-2026-09-04.md`. מנוע, לא נחיל (הכרעה-24). כלים: `app-from-sentences.mjs` (`gen_main_<name>.dart` · `--build`) · `machtzev/tools/site-shot.mjs` (ראיה) · `new/dart-ui-bs/ds/ds.dart` (`fontBody`).

## מה נבנה
1. **נקודת-כניסה לאתר** לכל אפליקציה: `gen_main_<name>.dart` = `void main() => runApp(const <N>App());` (הרכזת נשארת ווידג׳ט לבדיקות; ה-main נפרד). שער `appgen` מאמת גם אותו ≡ טרי.
2. **`appgen --build`** (אופציונלי, כבד ~35s/אפליקציה — ראיה ידנית, לא בטבעת-push): `flutter build web --release --no-web-resources-cdn -t lib/genesis/dart-gen-bs/gen_main_<name>.dart -o build/web-<name>` ומדווח גודל `main.dart.js`.
3. **ראיית-אתר** `machtzev/tools/site-shot.mjs <name> <Title> [port]`: מגיש את ה-build ב-http.server, מאתחל ב-Chromium headless (playwright-core מ-node_modules של מאור/גלובלי), **מחכה ש-MaterialApp יקבע `document.title`** ושיש `flutter-view`, מצלם ל-`machtzev/audit/goals/gen_app_<name>_web.png`, ומדפיס אתחול·זמן·שגיאות-רשת.
4. **תיקון-DS (L69):** `DsTokens.fontBody = 'Heebo'` (מצורף ב-pubspec של בנייה-חכמה, כמו `fontHead`) — ערכת-הרכזת: `ThemeData(fontFamily: DsTokens.fontBody)` ⇒ טקסט-ברירת-מחדל לא תלוי ב-Roboto-מ-gstatic.

## מה נמדד (אמת)
| אתר | build | main.dart.js | אתחול (headless) | מה נראה בצילום |
|---|---|---|---|---|
| Kehila | ✓ | 3.2 MB | title=Kehila · flutter-view · ~16s | 5/5 מסכים · 8 מתנדבים · 8 תרומות · 2 לא-זמינים · 1 סיכון-גבוה · 1 ללא-מורה · חיפוש · 5 אריחי-ניווט עם מונים |
| Tzedaka | ✓ | 3.4 MB | title=Tzedaka · ~16s | 7 אריחים · KPI |
| Studio | ✓ | 3.3 MB | title=Studio · ~16s | 6 אריחים · KPI |
- `flutter analyze lib/genesis`: **0 errors** · בדיקות-האפליקציות **13/13 · 17/17 · 16/16** (ערכת-הגופן לא שינתה התנהגות) · `appgen` ≡ (רכזות+מודולים+נקודות-כניסה).
- שגיאת-רשת יחידה בסביבה: `fonts.gstatic.com/…roboto…woff2 ERR_CONNECTION_RESET` (הסביבה מנותקת) — האתר שלם בזכות הגופן-המצורף.

## מה נתפס בדרך (L69)
שלושה סבבי-ראיה: (1) `--screenshot` של Chromium לפני אתחול-המנוע ⇒ דף-לבן "קיים" (3.4KB); (2) המתנה אמיתית ⇒ `Failed to fetch` — CanvasKit מ-CDN חסום; (3) `--no-web-resources-cdn` ⇒ אותחל אבל **כל טקסט בלי fontFamily נעלם** (Roboto מ-CDN), בעוד טקסט ב-`fontHead` רונדר — האבחנה: DsSection (fontHead) הופיע, DsNavTile (בלי fontFamily) לא. הראיה נבדקה **בעין** (Read של ה-PNG) בכל סבב — bytes>0 לא היה ראיה.

## כנות / מה לא אומת
- **אמוג׳י = ריבועים** בצילום — אין גופן-אמוג׳י-צבעוני בסביבה (Chromium headless בקונטיינר); בדפדפן אמיתי מוצג. לא באג-קוד.
- הגופן-המצורף חל דרך `ThemeData` של **הרכזת**; מודול-retarget שמורץ לבד (בלי MaterialApp של הרכזת) עדיין יורש Roboto-מ-CDN. תיקון-שורש (fontFamily בזהב/DS-scaffold) = שינוי-זהב — לא נעשה.
- `--build` לא בטבעת-push (3×35s + צילומים ≈ +3 דק׳) — הכרעת-עלות; הראיות ב-`audit/goals` + הדוח הזה. ה-build מבוצע ב-buildsmart (build/ מתעלם ב-git) — הפלט לא נשמר בריפו.
- לא נבדקה אינטראקציה באתר (רק אתחול+רנדר); האינטראקציה מאומתת ב-`flutter test` (hero-jump · חיפוש · הזרקה · ניווט).

## הבא (G11c)
הכרעות-בעלים · תפר-הזרקה למודולים בלי `db` · חציבת KPI-מקומיים ל-getters · (אופציונלי) אינטראקציה באתר דרך playwright (טאפ-hero ⇒ כרטיס).
