# 📋 מפרט-הענף (MPRAT) — מה יש בכל קובץ
> נגזר מכותרות-הקבצים עצמן (2026-09-01). המדף האוטומטי (new/·screens-seed/)
> = אלפי אטומים בשם-לפי-מוסכמה — מוסבר בחוק-השמות בסוף, לא קובץ-קובץ.
> מקרא: ⚙️ סקריפט-Node · 🎯 Dart · 📦 דאטה/JSON · 📄 מסמך · 📝 קלט-טקסט

## שורש
| קובץ | תפקיד |
|---|---|
| · `.gitignore` | רישום-חציבה — פלט-מחלץ מתחדש (נבנה מחדש בכל הרצה), לא מקור |
| 📄 `CLAUDE.md` | Genesis (Orbit) — הוראות לכל סשן |
| 📄 `LAW.md` | ⚡ חוקי-החשמלאי — חוקת הבנייה-מחדש (הכרעת-בעלים 24.8.2026) |
| 📄 `MPRAT.md` | 📋 מפרט-הענף (MPRAT) — מה יש בכל קובץ |
| 📄 `PURPOSE.md` | 🎯 PURPOSE — מטרת-הטיהור (נעולה · הכרעת-בעלים 28.8.2026) |
| 📄 `README.md` | 🏛️ Orbit Genesis — הבנייה-מחדש הנקייה |
| 📄 `WIRING.md` | WIRING — מפת-החיווט החיה של Genesis |

## machtzev/ — כניסות + כלים בודדים
| קובץ | תפקיד |
|---|---|
| 📄 `AGENT-CODE.md` | ⚖️ מגילת-סוכן-המחצב — נלבשת ע"י כל סוכן-גל לפני העבודה |
| 📄 `CURRICULUM-RAW.md` | 🧠 חומר-הגלם של נחיל-הלמידה (שוחזר מיומן-הריצה, 24.8.2026) |
| 📄 `CURRICULUM.md` | 🎓 CURRICULUM — תורת-האימפריה המזוקקת (154 לקחים, 24.8.2026) |
| 📄 `DECISIONS.md` | ⚖️ DECISIONS — פנקס-הכרעות-הבעלים (ממוספר, רציף, מצוטט) |
| 📄 `INDEX.md` | 🗂️ machtzev · קטלוג-הכלים (INDEX) |
| 📄 `LEARNINGS.md` | מחצב — LEARNINGS |
| 📄 `ONE-STATUS.md` | ⚡ מחצב · לוח-המצב של המנוע-האחד |
| 📄 `PLAN-100.md` | 🎯 מבצע-המאה — הדרך ל-100% בכל הצירים (רישום-צמוד חי) |
| 📄 `VERIFY-LAWS.md` | 🔒 חוקי-האמת — חוקת-האימות של הסוכן (חרוט · חובה לפני כל טענה) |
| ⚙️ `census.mjs` | מחצב · שלב 0 — מִפְקָד (census). |
| ⚙️ `contract-check.mjs` | מחצב · משוואה 5 — חוק-החוזה: לכל אטום/קופסה יש contract.md + test.mjs ירוק. |
| 📦 `data-purity-baseline.json` | (דאטה) |
| ⚙️ `data-purity-check.mjs` | 🧪 שער-טוהר-דאטה (הכרעה 16) — סורק אטומי-מנגנון עם דאטה-צרובה ("מעורבים"). |
| 📦 `deep-purity-baseline.json` | (דאטה) |
| ⚙️ `deep-purity-scan.mjs` | 🔬 מחצב · סורק-טוהר-עומק (הכרעה 19: גם קבועים ושמות-דומיין הם דאטה). |
| · `gates.tsv` | מחצב — מרשם-השערים (מקור-אמת יחיד; נלמד מ-protocol-v10 gates.tsv) |
| ⚙️ `mutation-check.mjs` | מחצב · בודק-המוטציה (מ-THE-LAW של buildsmart): "בדיקה שעוברת גם על קוד שבור |
| ⚙️ `one.mjs` | ⚡ מחצב · המנוע-האחד (one) — לוח-האם של כל מנועי-הפירוק-וההרכבה. |
| ⚙️ `pins-check.mjs` | מחצב · נעילת-השוטרים (נלמד מ-protocol/pins.sha256 של buildsmart): |
| · `pins.sha256` | feac0b99ae5a4c52  LAW.md |
| ⚙️ `police-selftest.mjs` | מחצב · selftest-המשטרה — מוכיח שכל חוק יורה (נלמד מ-catalog_qa של buildsmart: |
| ⚙️ `police.mjs` | מחצב · המשטרה-המאוחדת עם ran-ledger (K3 מ-protocol-v10): |
| 📦 `purity-baseline.json` | (דאטה) |
| ⚙️ `quarry-check.mjs` | משטרת-המחצבה — כל טיוטת-חוט חייבת: כותרת-מוצא + parse-תקין. קלה מדרגת-חוזה. |
| ⚙️ `run.mjs` | מחצב · המפעיל — פקודה אחת: מפקד ← מחלצים ← משטרה ← לוח-מצב. |
| ⚙️ `wiring-check.mjs` | מחצב · משוואה 4 — אכיפת חוקי-החשמלאי על העץ החדש (new/). ריק = עובר. |

## machtzev/purity/ — טוהר והמרה-מחדש
| קובץ | תפקיד |
|---|---|
| ⚙️ `ast-purify-interp.mjs` | 🎯 מנהל מכונת-ה-AST · דה-הרדקוד מדויק לכל צורות-הקוד. |
| ⚙️ `ast-purify.mjs` | 🎯 מנהל מכונת-ה-AST · דה-הרדקוד מדויק לכל צורות-הקוד. |
| ⚙️ `const-normalize.mjs` | 🔩 מנרמל-const · ממיר אטום-const-דאטה לפונקציה-אפס-ארג (שומר שם מדויק), כדי ש-ast-purify |
| ⚙️ `dehardcode.mjs` | 🎯 כלי-דה-הרדקוד · מחליף שמות-צרובים במנוע במפתחות-מטרה + מזריק את השמות. |
| ⚙️ `gen-data-dart.mjs` | מנוע-דאטה · gen-data-dart — ממיר אטומי-קבוע (JS const טהור) ל-Dart מכנית. |
| ⚙️ `independence-check.mjs` | 🧩 מגן-עצמאות — מוכיח ש"מערכת אחת שיכולה לחיות אחד בלי השני": |
| ⚙️ `purify-engine.mjs` | 🧼 מחצב · מנוע-הטיהור (הכרעה 19 — "תשדרג את המנוע, לא גל-נחילים"). |
| ⚙️ `purify-hard.mjs` | 🗿 מחצב · מנוע-הקשיחים (הכרעת-בעלים: "תקח את הכי קשים מכולם, תבנה עליהם את המנוע, |
| ⚙️ `purify.mjs` | 🧽 מכונת-הטיהור · מחלצת דאטה-צרובה ממנועים — דטרמיניסטי, לא נחיל. |
| ⚙️ `purity-data.mjs` | מחצב · סורק-טוהר-דאטה — הכרעת-הבעלים "אטומים נקיים ללא דאטה בכלל" (28.8). |
| ⚙️ `reconvert-data.mjs` | 🔁 מחצב · מנוע-ההמרה-מחדש — שלב-הדאטה (reconvert-data). |

## machtzev/dedup/ — כפליות
| קובץ | תפקיד |
|---|---|
| ⚙️ `dedup-atoms.mjs` | 🔍 בודק-כפליות למדף-החוזה (הכרעה 5) — שלוש עדשות: |
| ⚙️ `dedup-cross-dart.mjs` | 🌐 בודק-כפליות חוצה-ענפים (Dart↔Dart) — עכשיו שמאור עובר ל-Dart, אפשר להשוות |
| ⚙️ `dedup-cross.mjs` | 🌐 בודק-כפליות חוצה-מערכות — מאור (new/atoms, JS) מול בנייה-חכמה (new/dart, Dart). |
| ⚙️ `dedup-deep.mjs` | מחצב · כפילויות ברזולוציית-הפירוק-המלא: גופי-פונקציה זהים, שמות-כפולים, |
| ⚙️ `dedup.mjs` | מחצב · שלב 2ב — הכרעת-כפילויות: קבוצות ⇒ קנוני-מנצח או תוכנית-שילוב ("הכל-הכל"). |
| ⚙️ `reconcile.mjs` | מחצב · 🚨 המשטרה — משוואות-השלמות. כל הפרה = exit 1 אדום. |

## machtzev/census/ — מפקד ואינדקס
| קובץ | תפקיד |
|---|---|
| ⚙️ `atom-census.mjs` | atom-census.mjs — מפקד-האטומים · המצע להרכבה-חופשית. |
| ⚙️ `atom-index.mjs` | atom-index.mjs — אינדקס-האמת האחד לכל אטום (מונע פספוס-חוצה-סוכנים). |
| ⚙️ `logic-census.mjs` | logic-census.mjs — מפקד אטומי-הלוגיקה (הכרעה 21: המחולל מחובר גם ללוגיקה). |

## machtzev/mahulal/ — קבלת-המחולל
| קובץ | תפקיד |
|---|---|
| ⚙️ `generator-ratchet.mjs` | generator-ratchet.mjs — נועל את יכולות-המחולל שנבנו (הכרעות 20+21). |
| ⚙️ `nl-quality.mjs` | nl-quality.mjs — יַרְד-מידה §22: מודד את **איכות** חילוץ-הישויות ממשפט-חופשי |
| ⚙️ `nl-smoke.mjs` | nl-smoke.mjs — רצפת-§22: כל משפט-חופשי (nl-smoke.txt) ⇒ אפליקציה נבנית בלי-קריסה. |
| ⚙️ `spec-acceptance.mjs` | spec-acceptance.mjs — יַרְד-מידה "מערכת-מלאה" (§22 · הכרעה 23): אפיון-עשיר |

## machtzev/tools/ — כלֵי-עזר
| קובץ | תפקיד |
|---|---|
| ⚙️ `box-coverage.mjs` | 📏 מד-מוכנות-קופסאות — לכל תוכנית-קופסה (box-drafts/): כמה מחוטיה כבר |
| ⚙️ `dart-test.mjs` | מריץ כל בדיקות-ה-Dart בדרגת-חוזה (new/dart/*_test.dart) דרך dart --enable-asserts. |
| ⚙️ `gen-wiring-doc.mjs` | מחצב · מחולל-מפת-החיווט — WIRING.md נגזר מהעץ עצמו (imports אמיתיים), |
| ⚙️ `promote-auto.mjs` | מפעל · מנוע-הקידום-האוטומטי — בלי נחיל, בלי טוקנים: |
| ⚙️ `refine.mjs` | מחצב · שלב 2 — זיקוק: איתור מנועים-תאומים בין ריפו + ריכוז מחרוזות-קשיחות. |

## machtzev/generator/ — ליבת-המחולל
| קובץ | תפקיד |
|---|---|
| 📝 `acceptance-space.txt` | ישות חללית עם שם!, דגם, דלק(0..100)*, מהירות(0..1000), מיקום, סטטוס{בעגינה|פעילה|תחזוקה} |
| ⚙️ `app-ds.mjs` | app-ds.mjs — הדלת-האחת על מערכת-העיצוב: אפיון ⇒ אפליקציה שלמה מעוצבת-פרימיום. |
| 📦 `app-inventory.json` | (דאטה) |
| ⚙️ `app.mjs` | app.mjs — הדלת-האחת של המחולל: אפיון ⇒ אפליקציה שלמה |
| 📦 `atlas.json` | (דאטה) |
| ⚙️ `atlas.mjs` | 🗺️ מחצב · אטלס-המדף המלא (atlas) — מנגנון-סריקה טהור, אפס-דאטה (חוק-1). |
| 📦 `atom-census.json` | (דאטה) |
| 📦 `atom-index.json` | (דאטה) |
| 📦 `chrome.data.json` | אטום-דאטה · אוצר-מילות-הכרום של המחולל (§19). המנוע עיוור — כל מחרוזת-UI קבועה + מילון-הצב |
| ⚙️ `chrome.mjs` | chrome.mjs — טוען אוצר-מילות-הכרום (§19). המנוע-עיוור קורא `L.<role>` במקום |
| ⚙️ `compose.mjs` | compose.mjs — ההרכבה-ההפוכה של המחולל (הדקומפוזר, אחורה · טהור) |
| 📦 `entities.json` | (דאטה) |
| ⚙️ `entities.mjs` | entities.mjs — קורפוס-הישויות (הפירוק של schema.mjs, כדאטה לצריכה) |
| ⚙️ `entity.mjs` | entity.mjs — מנוע-הישויות (ההפוך של schema.mjs · טהור) |
| ⚙️ `genesis-gen.mjs` | 🧬 מחצב · המחולל (genesis-gen) — הכרעות 17+18: בקשה ⇒ בחירת-אטומים ⇒ חיווט ⇒ מסך עובד. |
| ⚙️ `intent.mjs` | intent.mjs — שכבת-הכוונה (הכרעה 23): משפט-חופשי ⇒ פרופיל-יכולות, נגזר |
| 📦 `logic-census.json` | (דאטה) |
| ⚙️ `match.mjs` | match.mjs — מנוע-האחזור של המחולל (למידה-מהאטומים, אפס-כללים-ידניים) |
| 📦 `nl-lang.data.json` | אטום-דאטה · ידע-שפה למחולל (§19: דאטה חיה באטום, לא במנוע). כל מילה-עברית שהמחולל צריך להב |
| 📝 `nl-quality.txt` | מערכת לניהול מרפאה עם מטופלים, תורים ורופאים |
| 📝 `nl-smoke.txt` | מערכת לניהול מרפאה עם מטופלים, תורים ורופאים |
| ⚙️ `nl-spec.mjs` | nl-spec.mjs — צפן §22: משפט-בעברית-חופשית ⇒ אפיון-מובנה (ישות … עם …). |
| ⚙️ `nl.mjs` | nl.mjs — דלת-הכניסה החופשית של המחולל (הבנה בלמידה-מהאטומים · טהור) |
| ⚙️ `render-ds.mjs` | render-ds.mjs — מנוע-רינדור על מערכת-העיצוב (ds/ds.dart). מקבל סכמה מובנית |
| 📦 `spec-lang.data.json` | אטום-דאטה · אוצר-מילות דקדוק-האפיון + רמזי-הטיפוס של מנוע-הישויות (§19-ד: אפס-מילון-במנוע) |
| ⚙️ `synth.mjs` | 🧪 מחצב · מנוע-הסינתזה (הכרעת-בעלים: "תביא יכולות שאין — והוא יהיה חייב לחבר |
| ⚙️ `teach.mjs` | teach.mjs — למידה-מהשימוש: קושר מילה/ביטוי לאטום (דאטה, לא מנוע). |
| ⚙️ `twins.mjs` | 🤝 רתמת-התאומים — הרצת אטומי-JS חיים (כולל מטוהרים: שקעי-הדאטה נקראים מהעטיפה |

## machtzev/assemble/ — הרכבה
| קובץ | תפקיד |
|---|---|
| 📄 `BOARD-GEN-CONTRACT.md` | חוזה · מחולל-הלוחות (board-gen) — חיווט המסכים-המורכבים למקורות-החיים |
| 📄 `BOX-AUDIT-CONTRACT.md` | חוזה · מנוע-ביקורת-ההרכבה (box-audit) — 28.8.2026 |
| 📄 `DATA-LIFT-CONTRACT.md` | חוזה · מנוע-הליטוש-האוטומטי (data-lift) — ליטוש-מכונה של widgets מלוכלכים |
| 📄 `GEN-MANIFEST-CONTRACT.md` | חוזה · מנוע-המניפסטים (gen-manifest) — הוראות-הרכבה אוטומטיות לכל מסך |
| 📄 `GEN-SCREEN-CONTRACT.md` | חוזה · המנוע-המרכיב (gen-screen) — 29.8.2026 |
| 📄 `SHELF-LIFT-CONTRACT.md` | חוזה · מנוע-המדף (shelf-lift) — הרמה-דטרמיניסטית של widgets נקיים-מלידה |
| ⚙️ `board-gen.mjs` | 🔌 מחצב · מחולל-הלוחות (board-gen) — חוזה: BOARD-GEN-CONTRACT.md. |
| ⚙️ `box-audit.mjs` | מחצב · מנוע-ביקורת-ההרכבה — חוזה: BOX-AUDIT-CONTRACT.md (5 חובות). |
| 📦 `box-coverage-baseline.json` | (דאטה) |
| ⚙️ `data-lift.mjs` | 🧽 מחצב · מנוע-המטרות v3 (data-lift) — חוזה: DATA-LIFT-CONTRACT.md. |
| ⚙️ `gen-manifest.mjs` | 📋 מחצב · מנוע-המניפסטים (gen-manifest) — חוזה: GEN-MANIFEST-CONTRACT.md. |
| ⚙️ `gen-screen.mjs` | 🏗️ מחצב · המנוע-המרכיב (gen-screen) — חוזה: GEN-SCREEN-CONTRACT.md. |
| ⚙️ `gen-theme.mjs` | מחצב · מחולל קופסת-הערכה — פיגמנטים טהורים (אטום) + חיווט תפקיד⇒פיגמנט (קופסה). |
| ⚙️ `lift-lib.mjs` | 🔧 מחצב · lift-lib — אטום-עזר טהור משותף למנועי-ההרמה (shelf-lift · data-lift). |
| ⚙️ `shelf-lift.mjs` | 🛗 מחצב · מנוע-המדף v2 (shelf-lift) — חוזה: SHELF-LIFT-CONTRACT.md. |
| ⚙️ `tokens-roundtrip.mjs` | מחצב · שלב 3 (חלוץ) — הוכחת round-trip: מהאטומים בלבד משחזרים כל שורת-הגדרה |

## machtzev/extract/ — מחלצי-L
| קובץ | תפקיד |
|---|---|
| ⚙️ `actions.mjs` | מחצב · מחלץ L2 — כל לחיצה/פעולה: handlers ברכיבים, פעולות-store, פקודות-פלטה. |
| ⚙️ `components.mjs` | מחצב · מחלץ L1+L3 — כל רכיב מיוצא; קובצי-מסך מקבלים סימון screen + מניפסט-גס |
| ⚙️ `consts.mjs` | מחצב · מחלץ L9 — מספרי-קסם: ספים/תקרות/השהיות = החלטות-עסקיות קבורות. |
| ⚙️ `engines.mjs` | מחצב · מחלץ L6 — כל מנוע-לוגיקה: קובץ בתחום engines ⇒ אטום עם ה-exports שלו. |
| ⚙️ `flags.mjs` | מחצב · מחלץ L4 — כל דגלי-היכולות + מודולים + הרחבות מ-types. |
| ⚙️ `functions.mjs` | מחצב · מחלץ L6b — פירוק-מקסימום: כל פונקציה מיוצאת = חוט נפרד, |
| ⚙️ `icons.mjs` | מחצב · מחלץ L11 — אימוג'י-כאייקון: כל סמל = אטום עם מוני-שימוש. |
| ⚙️ `knowledge.mjs` | מחצב · מחלץ L8 — אטום פר-מסמך-ידע: סוג, תאריך, כותרת, גודל (פילוסופיית kb_engine). |
| ⚙️ `regexes.mjs` | מחצב · מחלץ L12 — תבניות-regex: אטומי-ידע (ת"ז, טלפון, תאריך…). |
| ⚙️ `schema.mjs` | מחצב · מחלץ L10 — כל שדה בכל ישות = אטום: הרזולוציה המלאה של מודל-הנתונים. |
| ⚙️ `strings.mjs` | מחצב · מחלץ L5b — כל מחרוזת עברית קשיחה שעוקפת את מערכת-המונחים (termOf). |
| ⚙️ `styles.mjs` | מחצב · מחלץ L0b — עיצוב מולחם בתוך רכיבים: כל זוג מאפיין:ערך = אטום |
| ⚙️ `terms.mjs` | מחצב · מחלץ L5 — כל מונחי-השפה (TERM_DEFS). |
| ⚙️ `tokens.mjs` | מחצב · מחלץ L0 — אטום-עיצוב אחד פר-שם; ריבוי-ערכים (ערכות/מצבים) נאגד פנימה. |
| ⚙️ `verticals.mjs` | מחצב · מחלץ L7 — פיצול לפי מיקומי-id (עמיד להערות בין בלוקים). |

## machtzev/emit/ — JS↔Dart
| קובץ | תפקיד |
|---|---|
| 📄 `DART-PORTING-RULES.md` | 🔤 כללי-המרה JS→Dart שנלמדו בדם (מהזרימה-המשולבת + אימות-עוין) |
| 📄 `DEEP-PURITY-FINDINGS.md` | 🔬 ממצאי טוהר-עומק (הכרעה 19) — דאטה בתוך מנגנון |
| 📄 `FREE-REF-FINDINGS.md` | 🔎 סריקת-הפניות-חופשיות · 681 אטומי-מאור (24.8.2026) |
| 📄 `README.md` | 🔤 מנוע-פליטה Dart→JS · prototype (24.8.2026) |
| 📄 `RULES-DIGEST.md` | תקציר 18 חוקי-ההמרה (שורה-תחתונה בלבד; המלא: DART-PORTING-RULES.md) |
| ⚙️ `ast-js-to-dart.mjs` | 🌳 מנוע-מורכב · JS→Dart מבוסס-AST (מפרש-TypeScript) — לא רגקס אלא הליכה על עץ- |
| ⚙️ `dart-to-js.mjs` | 🔤 מנוע-פליטה · Dart → JS (prototype, ניב-האטומים) — לא מהדר-כללי, אלא תמורות |
| ⚙️ `free-ref-scan.mjs` | 🔎 סורק-הפניות-חופשיות — מוצא בכל אטום-JS מזהה שנקרא אך לא-מוגדר (לא פרמטר/מקומי/ |
| ⚙️ `fuzz-parity.mjs` | 🎯 פאזר-דיפרנציאלי JS↔Dart — מריץ את שני האטומים על קורפוס-קצה עשיר ומשווה כל |
| 🎯 `js-compat-reference.dart` | ⚙️ js_compat — ספריית-תאימות JS↔Dart מרוכזת (הכרעת-בעלים 26.8 "הטוב ביותר"). |
| ⚙️ `js-to-dart.mjs` | 🔤 מנוע-החלפת-שפה · JS → Dart (ניב-האטומים) — הכיוון הקשה (חסר-טיפוס → מטופס). |
| ⚙️ `parity-ast.mjs` | import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; |
| ⚙️ `parity-check.mjs` | 🥇 אימות-פליטה · לכל אטום-Dart: פלוט אטום+בדיקה ל-JS, הרץ ב-node. הבדיקה נושאת |
| ⚙️ `parity-js-dart.mjs` | import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; |

## machtzev/carve/ — חצב-AST
| קובץ | תפקיד |
|---|---|
| 📄 `README.md` | חצב-AST · מנוע-חציבה דטרמיניסטי (Dart→אטום) |
| 📄 `SCREEN-DECOMP-CONTRACT.md` | חוזה · מנוע-פירוק-מסכים (screen-decomp) — 28.8.2026 |
| 🎯 `ast_carve.dart` | 🔨 חצב-AST · מוציא פונקציה-בודדת ממקור לאטום-טהור (analyzer אמיתי). |
| 🎯 `ast_dehardcode.dart` | 🎯 מכונת-AST · דה-הרדקוד מדויק — מנתח-תחביר Dart אמיתי (package:analyzer). |
| 🎯 `ast_dehardcode_interp.dart` | 🎯 מכונת-AST · דה-הרדקוד לאינטרפולציה — מרחיב את הקרוב-הבסיסי לקטעי-מחרוזת-מוטבעים. |
| ⚙️ `carve-land.mjs` | 🔨 פולט+מאמת · לוקח תוצאת-חצב (trivial) → מנחית אטום + בדיקת-Golden ב-new/dart, |
| ⚙️ `screen-decomp.mjs` | מחצב · מנוע-פירוק-מסכים — קלט: קובץ-מסך Flutter ⇒ פלט: מניפסט-שכבות JSON. |
| ⚙️ `screen-lift.mjs` | מחצב · מנוע-חילוץ-תוכן (screen-lift) — הכרעה-11: מנוע עדיף על נחיל. |
| ⚙️ `widget-dedup.mjs` | מחצב · דדופ-widgets (הכרעה-5: דדופ אחרי הפירוק) — לפני גל-הליטוש. |

## machtzev/behavioral/ — זהב-התנהגות
| קובץ | תפקיד |
|---|---|
| 📄 `README.md` | 🏅 רתמת-זהב · בדיקות-התנהגות (golden) |
| 🎯 `gen_store_behavior_test.dart` | בדיקת-התנהגות · AppStore (מוח-הריצה של אפליקציה-מחוללת) — מוכיח ש"מתקמפל"="עובד". |
| 🎯 `gen_widget_behavior_test.dart` | בדיקת-התנהגות · לולאת טופס→שמירה→טבלה (בדיוק דפוס-המסך-המחולל) על אטומי-ה-DS האמיתיים. |
| ⚙️ `run.mjs` | 🏅 רתמת-זהב · בדיקות-התנהגות על אפליקציה-מחוללת ("מתקמפל"≠"עובד"): מזריקה את |

## engine/ — המחולל כחבילה עצמאית
| קובץ | תפקיד |
|---|---|
| · `.gitignore` | out/screens/gen_*.dart |
| 📄 `README.md` | המחולל · מנוע נקי (Sentence → UI Engine) |
| ⚙️ `atlas.mjs` | ── engine/atlas.mjs — סורק-הקטלוג (אטלס) ── |
| 📦 `engine.config.json` | (דאטה) |
| ⚙️ `generate.mjs` | engine/generate.mjs — המחולל · מנוע נקי (אפס-דאטה) |
| ⚙️ `lib.mjs` | ── engine/lib.mjs — עזרי-סריקה טהורים (אפס-דאטה, אפס-תלות בפרויקט) ── |
| 🎯 `example_banner.dart` | אטום-דוגמה · ExampleBanner — פס-הודעה. אפס-דאטה: הטקסט מוזרק. |
| 🎯 `example_button.dart` | אטום-דוגמה · ExampleButton — כפתור. אפס-דאטה: תווית+פעולה מוזרקים. |
| 🎯 `example_card.dart` | אטום-דוגמה · ExampleCard — כרטיס כותרת+תת-כותרת. אפס-דאטה: הטקסט מוזרק. |
| 🎯 `example_header.dart` | אטום-דוגמה · ExampleHeader — כותרת-סקציה. אפס-דאטה: הטקסט מוזרק. |
| 🎯 `example_stat.dart` | אטום-דוגמה · ExampleStat (KpiBox) — מדד: ערך גדול + תווית. אפס-דאטה. |
| 🎯 `tokens.dart` | אטום-דאטה לדוגמה: טוקני-עיצוב. החלף בטוקנים של מערכת-העיצוב שלך. |

## runtime/ — גשר web
| קובץ | תפקיד |
|---|---|
| 🎯 `engine_api.dart` | 🌉 גשר-המנוע · חושף את האטומים האמיתיים ל-JS (רנטיים-web). |
| · `engine_api.js` | (function dartProgram(){function copyProperties(a,b){var t=Object.keys(a) |

## box-drafts/ — תוכניות-קופסה
| קובץ | תפקיד |
|---|---|
| 📄 `ANALYSIS-BOX-WIRING-2026-08-26.md` | 🔌 ניתוח מלא · איך משלבים את קופסת-החיבורים (26.8.2026) |
| 📄 `BUILD-ORDER-EMPOWERMENT-2026-08-26.md` | 🧱 תוכנית-בנייה לקופסאות — מה מתחיל להשתלב עם מה (26.8.2026) |
| 📄 `CLUSTERS.md` | 🧩 אשכולות-תלות — עבודת-יד לגל-הסוגר (לא ניתנות לחציבה אוטומטית) |
| 📄 `READINESS.md` | 📏 מוכנות-הקופסאות (מחולל — node machtzev/tools/box-coverage.mjs) |
| 📄 `components-courses-reenroll-lib.box-draft.md` | 📦 טיוטת-קופסה · components-courses-reenroll-lib |
| 📄 `components-courses.box-draft.md` | 📦 טיוטת-קופסה · components-courses |
| 📄 `components-diary.box-draft.md` | 📦 טיוטת-קופסה · components-diary |
| 📄 `components-families.box-draft.md` | 📦 טיוטת-קופסה · components-families |
| 📄 `components-platform.box-draft.md` | 📦 טיוטת-קופסה · components-platform |
| 📄 `components-reports.box-draft.md` | 📦 טיוטת-קופסה · components-reports |
| 📄 `components-shop.box-draft.md` | 📦 טיוטת-קופסה · components-shop |
| 📄 `components-shop7.box-draft.md` | 📦 טיוטת-קופסה · components-shop7 |
| 📄 `components-supporters.box-draft.md` | 📦 טיוטת-קופסה · components-supporters |
| 📄 `components-telephony.box-draft.md` | 📦 טיוטת-קופסה · components-telephony |
| 📄 `components-tzedaka.box-draft.md` | 📦 טיוטת-קופסה · components-tzedaka |
| 📄 `lib-a11y.box-draft.md` | 📦 טיוטת-קופסה · lib-a11y |
| 📄 `lib-ai.box-draft.md` | 📦 טיוטת-קופסה · lib-ai |
| 📄 `lib-annualReport.box-draft.md` | 📦 טיוטת-קופסה · lib-annualReport |
| 📄 `lib-audit.box-draft.md` | 📦 טיוטת-קופסה · lib-audit |
| 📄 `lib-ayin.box-draft.md` | 📦 טיוטת-קופסה · lib-ayin |
| 📄 `lib-callerId.box-draft.md` | 📦 טיוטת-קופסה · lib-callerId |
| 📄 `lib-cloud-diff.box-draft.md` | 📦 טיוטת-קופסה · lib-cloud-diff |
| 📄 `lib-cloud-merge.box-draft.md` | 📦 טיוטת-קופסה · lib-cloud-merge |
| 📄 `lib-cloud.box-draft.md` | 📦 טיוטת-קופסה · lib-cloud |
| 📄 `lib-cloudConfig.box-draft.md` | 📦 טיוטת-קופסה · lib-cloudConfig |
| 📄 `lib-cloudCrypto.box-draft.md` | 📦 טיוטת-קופסה · lib-cloudCrypto |
| 📄 `lib-config.box-draft.md` | 📦 טיוטת-קופסה · lib-config |
| 📄 `lib-crypto.box-draft.md` | 📦 טיוטת-קופסה · lib-crypto |
| 📄 `lib-csvx.box-draft.md` | 📦 טיוטת-קופסה · lib-csvx |
| 📄 `lib-customExport.box-draft.md` | 📦 טיוטת-קופסה · lib-customExport |
| 📄 `lib-date-util.box-draft.md` | 📦 טיוטת-קופסה · lib-date-util |
| 📄 `lib-dedup.box-draft.md` | 📦 טיוטת-קופסה · lib-dedup |
| 📄 `lib-dialer.box-draft.md` | 📦 טיוטת-קופסה · lib-dialer |
| 📄 `lib-donationPartition.box-draft.md` | 📦 טיוטת-קופסה · lib-donationPartition |
| 📄 `lib-exportGate.box-draft.md` | 📦 טיוטת-קופסה · lib-exportGate |
| 📄 `lib-exportRows.box-draft.md` | 📦 טיוטת-קופסה · lib-exportRows |
| 📄 `lib-guide.box-draft.md` | 📦 טיוטת-קופסה · lib-guide |
| 📄 `lib-hebdate.box-draft.md` | 📦 טיוטת-קופסה · lib-hebdate |
| 📄 `lib-hebrew.box-draft.md` | 📦 טיוטת-קופסה · lib-hebrew |
| 📄 `lib-ics.box-draft.md` | 📦 טיוטת-קופסה · lib-ics |
| 📄 `lib-icsFeed.box-draft.md` | 📦 טיוטת-קופסה · lib-icsFeed |
| 📄 `lib-imagePick.box-draft.md` | 📦 טיוטת-קופסה · lib-imagePick |
| 📄 `lib-lock.box-draft.md` | 📦 טיוטת-קופסה · lib-lock |
| 📄 `lib-navhist.box-draft.md` | 📦 טיוטת-קופסה · lib-navhist |
| 📄 `lib-nedarimSync.box-draft.md` | 📦 טיוטת-קופסה · lib-nedarimSync |
| 📄 `lib-netcheck.box-draft.md` | 📦 טיוטת-קופסה · lib-netcheck |
| 📄 `lib-photoGallery.box-draft.md` | 📦 טיוטת-קופסה · lib-photoGallery |
| 📄 `lib-pricing.box-draft.md` | 📦 טיוטת-קופסה · lib-pricing |
| 📄 `lib-publicSite.box-draft.md` | 📦 טיוטת-קופסה · lib-publicSite |
| 📄 `lib-pwa.box-draft.md` | 📦 טיוטת-קופסה · lib-pwa |
| 📄 `lib-receipt.box-draft.md` | 📦 טיוטת-קופסה · lib-receipt |
| 📄 `lib-search.box-draft.md` | 📦 טיוטת-קופסה · lib-search |
| 📄 `lib-signupWizard.box-draft.md` | 📦 טיוטת-קופסה · lib-signupWizard |
| 📄 `lib-smtpUrl.box-draft.md` | 📦 טיוטת-קופסה · lib-smtpUrl |
| 📄 `lib-supportChat.box-draft.md` | 📦 טיוטת-קופסה · lib-supportChat |
| 📄 `lib-supporterPartition.box-draft.md` | 📦 טיוטת-קופסה · lib-supporterPartition |
| 📄 `lib-telephony-engine.box-draft.md` | 📦 טיוטת-קופסה · lib-telephony-engine |
| 📄 `lib-templates.box-draft.md` | 📦 טיוטת-קופסה · lib-templates |
| 📄 `lib-tour.box-draft.md` | 📦 טיוטת-קופסה · lib-tour |
| 📄 `lib-validate.box-draft.md` | 📦 טיוטת-קופסה · lib-validate |
| 📄 `lib-vcardImport.box-draft.md` | 📦 טיוטת-קופסה · lib-vcardImport |
| 📄 `lib-verticalPacks.box-draft.md` | 📦 טיוטת-קופסה · lib-verticalPacks |
| 📄 `lib-wa.box-draft.md` | 📦 טיוטת-קופסה · lib-wa |
| 📄 `lib-worktasks.box-draft.md` | 📦 טיוטת-קופסה · lib-worktasks |

## design/ — עיצוב
| קובץ | תפקיד |
|---|---|
| · `capabilities-showcase.html` | <title>מאור · חדר-הראווה</title> |
| · `orbit-covenant.html` | <title>Orbit · Covenant</title> |
| · `orbit-final.html` | <title>Orbit · פלטפורמת האתרים</title> |
| · `orbit-generator.html` | <title>Orbit · המחולל</title> |
| · `orbit-genesis.html` | <title>Orbit · Genesis</title> |
| · `orbit-landing.html` | <title>Orbit · פלטפורמת האתרים</title> |
| · `orbit-master.html` | <title>Orbit · פלטפורמת האתרים</title> |
| · `orbit-message.html` | <title>Orbit · הבטחה</title> |
| · `orbit-nothinglost.html` | <title>Orbit · שאף אחד לא ייפול</title> |
| · `orbit-supernova.html` | <title>Orbit · Supernova</title> |
| · `orbit-system.html` | <title>Orbit · המערכת</title> |
| · `orbit-wordmark.html` | <title>Orbit · Wordmark</title> |

## knowledge/ — דוחות וידע
| קובץ | תפקיד |
|---|---|
| 📄 `ATOM-CENSUS-2026-08-31.md` | מפקד-האטומים — המצע להרכבה-חופשית (2026-08-31) |
| 📄 `ATOM-TRUTH-INDEX-2026-08-31.md` | אינדקס-האמת של האטומים — קרא לפני כל טענה על אטום |
| 📄 `BUILD-ORDER-INTENT-2026-08-31.md` | סדר-בנייה · המסלול החדש: כוונה⇒מטרה⇒הרכבה (הכרעה 23) |
| 📄 `CLOSED-CHROME-PURITY-2026-08-31.md` | סגירה · טוהר-כרום במנוע-הרינדור (§19 · P4) — 2026-08-31 |
| 📄 `CLOSED-COMPOSER-2026-08-31.md` | CLOSED · מנוע-ההרכבה של המחולל (2026-08-31) |
| 📄 `CLOSED-ENGINE-GAPMAP-2026-08-31.md` | CLOSED · סגירת מפת-הפערים של המנוע (המחולל) — 2026-08-31 |
| 📄 `DESIGN-STACK-READY-2026-08-26.md` | 🎨 מוכן-לפעולה · stack העיצוב של האימפריה (26.8.2026) |
| 📄 `HANDOFF-MASTER.md` | 🤝 HANDOFF-MASTER — מסירת-הפרויקט-כולו (לא רק ההמרה) |
| 📄 `INVENTORY-EMPIRE-RAW-MATERIAL-2026-08-31.md` | INVENTORY · חומר-הגלם של האימפריה + תובנת-התפר — 2026-08-31 |
| 📄 `LOGIC-CENSUS-2026-08-31.md` | מפקד אטומי-הלוגיקה — שכבה 2 של המצע (2026-08-31) |
| 📄 `SESSION-LOG-2026-09-01.md` | יומן-סשן · 2026-09-01 — המחולל: spec⇒app, התנהגות, §21-יסוד (+לקחי-אמת) |
| 📄 `STATE-NL-EXTRACTION-2026-08-31.md` | מצב · חילוץ-ישויות ממשפט-חופשי (§22) — 2026-08-31 |
| 📄 `WIREABILITY-CEILING-2026-08-31.md` | תקרת-החיווט — כמה אטומים באמת ניתנים-לחיווט-חופשי (2026-08-31) |

## knowledge/archive/ — דוחות היסטוריים
| קובץ | תפקיד |
|---|---|
| 📄 `BOX-BACKLOG-BUILDSMART-2026-08-26.md` | 📦 Backlog-קופסה · בנייה-חכמה (26.8.2026) — 45 טיוטות שנדחו-במכוון מקידום-עלה |
| 📄 `CLOSED-BUILDSMART-PROMOTE-2026-08-26.md` | ✅ CLOSED · קידום מחצבת בנייה-חכמה (26.8.2026) |
| 📄 `CLOSED-CLEANUP-2026-08-28.md` | 🧹 סגירת-ניקוי · מחצבה + דדופ (28.8.2026) |
| 📄 `CLOSED-DUAL-LANG-BOXES-2026-08-26.md` | 🎯 סגירה · גל-הקופסאות הדו-לשוני (JS↔Dart) — 26.8.2026 |
| 📄 `CLOSED-MAOR-DART-2026-08-26.md` | 🏁 CLOSED · המרת-מאור ל-Dart הושלמה (26.8.2026) |
| 📄 `DART-ATOM-BUGS-2026-08-26.md` | באגי-אטום חוצי-שפות שנמצאו בגל-הקופסאות הדו-לשוני (26.8.2026) |
| 📄 `HANDOFF-DART-CONVERSION.md` | 🤝 מסירה · לולאת-המרת-Dart (מצב: 26.8.2026 — 🏁 מאור-הלוגיקה גמור; הבא: 197 בנייה-חכמה) |
| 📄 `HANDOFF-DECOMPOSE-RECENT-MAOR-2026-08-26.md` | 🔻 HANDOFF · פירוק+המרה של העדכונים-האחרונים של מאור (26.8.2026) |
| 📄 `README.md` | 📦 knowledge/archive — דוחות היסטוריים (עידן-ההמרה 26–28.8) |
| 📄 `UNIFIED-BOARD-ROUTING-2026-08-26.md` | 🔌 מפת-הניתוב · הלוח-האם המאוחד — איפה כל אחד נכנס (26.8.2026) |
| 📄 `VERIFY-FULL-2026-08-28.md` | 🔍 ווידוא-מלא · כל הענפים, כל המקורות, כל המסכים (28.8.2026) |

## 📦 המדף האוטומטי — חוק-השמות (במקום קובץ-קובץ)
אלפי קבצים; כל שם מספר מה בפנים:
| דפוס-שם | מה זה | # |
|---|---|---|
| `new/atoms/<שם>.mjs` | חוט-JS טהור (מנוע-maor). דאטה מוזרקת-בשקע. | 2224 |
| `new/atoms/<שם>.contract.md` | חוזה-האטום | — |
| `new/atoms/<שם>.test.mjs` | בדיקת-זהב (JS) | — |
| `new/atoms/<שם>-data.mjs` / `-strings` / `-terms` | אטום-דאטה (חולץ בטיהור §19) | — |
| `new/dart-maor/<שם>.dart` | אותו מנוע מומר ל-Dart | 1246 |
| `new/dart-data-maor/<שם>-*.dart` | תאום-דאטה-Dart טהור | 454 |
| `new/dart-gen-bs/gen_app_*.dart` | פלט-המחולל | 142 |
| `new/boxes/` · `dart-boxes/` | קופסאות-חיווט JS · Dart | 128 · 124 |
| `new/dart-ui-bs/` · `dart-screens-bs/` · `dart-boards-bs/` | widgets · מסכים · לוחות | 94 · 81 · 80 |
| `screens-seed/machine/*.json` | פירוק-מסך גולמי | 254 |
| `screens-seed/content/*` | תוכן-מסך מורם | — |
