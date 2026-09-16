# 2א · תשתית — hooks · workflows · box-drafts · server-gen · yeshiva

**34/34 מנועים ממופו** · מיפוי בלבד — לא חובר, לא נבנה, לא תוקן, לא שונה קוד.

הרשימה נגזרה מהפקודה, לא מפרוזה:
```bash
node machtzev/census/engine-index.mjs --connected --list | grep '○' | sed 's/.*○ //' \
  | grep -E '^(\.githooks/|\.github/workflows/|\.claude/hooks/|box-drafts/|server-gen/balagan/|yeshiva/)'
# ⇒ 34
```

| מנוע | s22 | connectAt | תמצית |
| --- | :-: | --- | --- |
| `.github/workflows/gen.yml` | 3 | machtzev/generator/regen.mjs — כשלב-פרסום; או הפוך: .github/workflows/gen.yml:53-62 להחליף node gen/build.mjs ב-node machtzev/generator/regen.mjs. זו  | זהו הצינור היחיד בריפו שמממש «משפט בעברית ⇒ אתר» מקצה-לקצה בלי אדם באמצע, כולל טופס workflow_dispatch עם שדה «המשפט בעברית» |
| `.githooks/pre-commit` | 2 | machtzev/generator/regen.mjs — שלב-אימות אחרי הפליטה. היום הקשר הפוך ולא-מוצהר: machtzev/generator/genesis-gen.mjs:638 כותב ל-new/atoms, ו-.githooks/p | טבעת-commit מלאה: הגנה-עצמית ⇒ staging ⇒ מנועי-hook ⇒ ראצ׳ט ⇒ משטרה ⇒ ledger |
| `box-drafts/buildsmart-seed/start-barcode-scanner@app_src_lib_barcode_ts.mjs` | 2 | machtzev/generator/ — כאטום-הצבה בדגם ds_voice (חוק-6): ds_barcode.dart + _web + _stub, ואז שקע בספק. **זהו הפער היחיד-האמיתי מבין 19 הטיוטות שלי** | מחזיק את לולאת-סריקת-הברקוד המלאה: יצירת גלאי עם 5 פורמטים (ean_13 · ean_8 · code_128 · code_39 · qr_code), פתיחת מצלמה, לולאת detect על requestAnimationFrame, וסגירת ה-stream |
| `yeshiva/gate.mjs` | 2 | machtzev/generator/regen.mjs — לא השער עצמו (שער נשאר משטרה), אלא **טענת-הקבלה שבתוכו**: yeshiva/gate.mjs:110-115 («אפס שם-לא-עברי בספק שיצא מהפסק») ש | אוכף **טריות**: מצלם את yeshiva/psak ו-yeshiva/out, מריץ read.mjs --all ו-apply.mjs --all מחדש, ומשווה — פסק ישן בדיסק הוא ירוק-חלול (L27) |
| `.claude/hooks/pre-tool.sh` | 1 | machtzev/census/engine-index.mjs — מקור ל«מה מחולל». היום רשימת-GENERATED ב-.claude/hooks/pre-tool.sh:28 היא מחרוזת-יד (TRUTH.md\|WIRING.md\|atom-inde | tripwire על Bash/Edit/Write/MultiEdit/NotebookEdit — כל כלי אחר יוצא 0 מיד |
| `.claude/hooks/session-start.sh` | 1 | machtzev/generator/regen.mjs — שלב-כשירות בפתיחה. :18-31 (Dart) ו-:38-41 (typescript vendored) הם תנאי-הריצה של המחולל עצמו: בלי Dart אין logic-proof  | מפעיל את הפרוטוקול: מכוון את שכבת-ההפעלה ל-.githooks · chmod +x · merge-driver regen — אידמפוטנטי ואפס-רשת |
| `.githooks/pre-push` | 1 | ∅ לחיבור-למחולל. הנקודה הכנה היחידה הפוכה: .githooks/pre-push:47-48 (פתרון BUILDSMART) מחזיק את הידע ששער-שרץ-בלי-buildsmart מדווח ירוק-שקר — ידע ששיי | סקופ לפי יעד-הדחיפה (remote_ref) ולא לפי הענף המקומי, וקורא את שורות-ה-stdin שגit מזרים |
| `.github/workflows/police.yml` | 1 | ∅ לחיבור-למחולל בהגדרת connected(). machtzev/generator/regen.mjs אינו רץ ב-CI הזה כלל; הצינור נבנה סביב truth/police/verify-independent | «עד, לא חומה»: non-required, מדווח — רץ על כל ענף, על PR ועל workflow_dispatch, בלי cancel-in-progress |
| `box-drafts/buildsmart-seed/is-barcode-supported@app_src_lib_barcode_ts.mjs` | 1 | נלווה ל-start-barcode-scanner: אם ייבנה ds_barcode כאטום-הצבה, זו בדיוק פונקציית-ה-stub שמחזירה false בפלטפורמה שאינה תומכת | מחזיר אמת רק אם גם בנאי-הגלאי קיים וגם navigator.mediaDevices.getUserMedia זמין — בדיקת-כשירות כפולה |
| `box-drafts/io-wiring/fetch-outbox-issues@src_lib_cloud_ts.mjs` | 1 | new/boxes/lib-cloud.mjs — כתוספת לקופסה הקיימת (היעד הטבעי: לצד fetchIncomingPayments ב-:578), **לא** כאטום עצמאי | סורק שני תאי-יוצא (sms · mail), אוסף את הרשומות בסטטוס error לכדי רשימת-תקלות, וסופר את הממתינות |
| `box-drafts/io-wiring/retry-outbox-item@src_lib_cloud_ts.mjs` | 1 | new/boxes/lib-cloud.mjs — יחד עם fetch-outbox-issues, כזוג אחד (הן שכנות במקור: cloud.ts:787-804 ו-805-809) | מחזיר פריט-יוצא ל-pending ומוחק את שדה-השגיאה (deleteField) — כדי שה-Function הדקתית תרים אותו שוב |
| `.githooks/commit-msg` | 0 | ∅ | פוסל הודעה מתחת ל-15 תווים (תווים ולא בייטים — locale מוזרק כי ב-hook אין LANG) |
| `.githooks/post-commit` | 0 | ∅ | מוסיף ל-index את TRUTH.md · WIRING.md · CLAUDE.md רק אם הם כבר זהים ל-HEAD |
| `.githooks/post-rewrite` | 0 | ∅ לחיבור-למחולל | אחרי rebase/amend מוסיף שורה (חותמת+סוג) ל-.git/REGEN_NEEDED ומדפיס הודעה |
| `.githooks/pre-applypatch` | 0 | ∅ | exec ישיר ל-.githooks/pre-commit דרך הנתיב המוחלט של שורש-הריפו |
| `.githooks/pre-merge-commit` | 0 | ∅ | exec ישיר ל-.githooks/pre-commit |
| `box-drafts/buildsmart-seed/is-voice-supported@app_src_lib_voice_ts.mjs` | 0 | ∅ | מחזיר אמת אם בנאי-זיהוי-הדיבור קיים — שורת-קוד אחת |
| `box-drafts/buildsmart-seed/search-exact@app_src_lib_search_ts.mjs` | 0 | ∅ מעשית — החיפוש-הסלחן של המחולל כבר נפתר ממקור אחר. G35 (CLAUDE.md) בנה את bhSearchForgiving מ-ruleExact · ruleContains · damerauLevenshtein, ו-new/d | חיפוש-קידומת-והכלה על אינדקס-מילות-מפתח: לכל פגיעה נבחר המיקום הטוב ביותר מבין מילות-המפתח, והתוצאות מופרדות ל-prefix ול-contains |
| `box-drafts/buildsmart-seed/search-fuzzy@app_src_lib_search_ts.mjs` | 0 | ∅ לחיבור. שווה לרשום כ**שאלת-הכרעה** ולא כחיבור: שתי נוסחאות-סובלנות שונות לאותה מטרה חיות בריפו | חיפוש-מרחק-עריכה עם סובלנות נגזרת-אורך: floor(len/3)+1 |
| `box-drafts/buildsmart-seed/start-voice-recognition@app_src_lib_voice_ts.mjs` | 0 | ∅ — היכולת כבר מחוברת. ds_voice נצרך ע"י machtzev/generator/balagan.mjs ומופיע ב-new/dart-gen-bs/gen_balagan_home.dart ו-gen_balagan_ask.dart | עוטף זיהוי-דיבור של הדפדפן: קובע lang='he-IL', continuous=false, ומחווט onTranscript/onError/onEnd |
| `box-drafts/io-wiring/audit-writer-email@src_lib_cloud_ts.mjs` | 0 | ∅ | מחזיר את כתובת-הדואר של כותב-הביקורת — return בודד |
| `box-drafts/io-wiring/donation-split-active@src_lib_cloud_ts.mjs` | 0 | ∅ לקוד. הערך היחיד הוא ההערה :8-11 — ידע-אבטחה על סינון-שאילתה לפי הרשאה | מחזיר את דגל פיצול-התרומה — return בודד |
| `box-drafts/io-wiring/hebrew-closed-windows@src_lib_telephony_engine_ts.mjs` | 0 | ∅ | ייצוא-מחדש בשורה אחת: hebrewClosedWindows = rawHebrewClosedWindows (חלונות-סגירה לפי לוח עברי) |
| `box-drafts/io-wiring/mark-incoming-payment@src_lib_cloud_ts.mjs` | 0 | ∅ | מסמן תשלום-נכנס כמטופל: status='handled' + handledAt בזמן-ISO |
| `box-drafts/io-wiring/pull-all@src_lib_cloud_ts.mjs` | 0 | ∅ — new/boxes/lib-cloud.mjs (29,924 בתים) עם lib-cloud.contract.md ו-lib-cloud.test.mjs לצידו הוא הקידום שהכותרת ביקשה, והוא כבר בוצע | משיכת-מצב מלאה מ-Firestore: קריאת מסמך-המטא, ואז מעבר על האוספים עם פענוח-מסמך (decryptDoc) לפי מפתח-הצפנה (dek) |
| `box-drafts/io-wiring/score-term@src_lib_search_ts.mjs` | 0 | ∅ — **הטיוטה מוחלפת כבר בפועל**. הלוגיקה פורקה ל-6 אטומי-Dart ב-new/dart-maor/: rule-exact · rule-prefix · rule-plural · rule-contains · rule-skeleton | מדרג התאמת-מונח לשאילתה בשישה מדרגים: זהות 100 · קידומת 80 · גזע-ריבוי 70 · הכלה 62 · שלד-ללא-אמות-קריאה 58 · שגיאת-כתיב 52-4d |
| `box-drafts/io-wiring/simulate-call@src_lib_telephony_engine_ts.mjs` | 0 | ∅ | ייצוא-מחדש בשורה אחת: simulateCall = rawSimulateCall |
| `box-drafts/io-wiring/subscribe-all@src_lib_cloud_ts.mjs` | 0 | ∅ | האזנה-חיה לכל האוספים עם קילוף מפתח-תומך (stripSupKey) באוספים-נאכפים בלבד — אכיפת-נתונים דורמנטית |
| `box-drafts/io-wiring/validate-tenant@src_lib_telephony_engine_ts.mjs` | 0 | ∅ | ייצוא-מחדש בשורה אחת: validateTenant = rawValidateTenant |
| `box-drafts/io-wiring/watch-all-support-threads@src_lib_cloudConfig_ts.mjs` | 0 | ∅ | האזנה-חיה לאוסף-שיחות-התמיכה, ממפה כל מסמך ל-{uid, ...data} ובולע שגיאות ב-noop |
| `box-drafts/io-wiring/watch-auth@src_lib_cloud_ts.mjs` | 0 | ∅ | עוטף onAuthStateChanged ומצמצם את המשתמש ל-{uid, email} או null |
| `server-gen/balagan/functions/index.js` | 0 | ∅ — וזו התשובה המהותית, לא היעדר-תשובה. הקובץ הוא **פלט** של מנוע מחובר (server.mjs ⇒ regen.mjs:23), ולכן «לחבר אותו למחולל» היה מעגלי | שלוש פונקציות-ענן: oauthCallback (code ⇒ refresh_token) · oauthToken (מחזיר access_token קצר בלבד) · pushDue (תזמון כל 15 דקות, שולח FCM למועדים שהגיע זמנם) |
| `server-gen/balagan/rules.test.mjs` | 0 | ∅ לחיבור (תוצר, כמו שכנו). הנקודה הכנה היחידה היא **המנגנון**, לא הקובץ: machtzev/generator/server.mjs:239 (תבנית RULES_TEST) — הדפוס «כלל-גישה מוכח מ | מוכיח את כללי-הגישה מול **אמולטור-Firestore אמיתי** (127.0.0.1:8181) ולא מצהיר עליהם — 15 טענות assertSucceeds/assertFails |
| `yeshiva/detach.mjs` | 0 | ∅ — ובמכוון. זהו מנוע **אנטי-חיבור**: תפקידו להוכיח שהתיקייה נתיקה, ולכן חיבורו לצינור יסתור את עצמו (הוא סופר רישום ב-regen.mjs ככשל, :31-33) | מוכיח **נתיקות**: שאף קובץ מחוץ ל-yeshiva/ אינו מזכיר את נתיביה, ושאף קובץ בתוכה אינו מייבא מבחוץ (לא יחסית ולא חבילה) |

## פיזור-הציונים
- **s22=3** — 1 מנועים
- **s22=2** — 3 מנועים
- **s22=1** — 7 מנועים
- **s22=0** — 23 מנועים

אחוז-הראיה: 34/34 מנועים עם סעיף (6) מלא. פריט בלי ראיה אינו פריט.
