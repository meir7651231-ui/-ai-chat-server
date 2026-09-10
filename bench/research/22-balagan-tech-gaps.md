# פערים טכניים ב"בלגן" — לקראת מוצר-אמת ומרקטפלייס P2P
**תאריך:** 9.9.2026 · **מקורות:** `repos/genesis` (מחולל) · `repos/buildsmart/app_flutter` (קוד ה-Flutter המיוצר)
**שיטה:** קריאת-בייטים בלבד (ציטוט קובץ+שורה). איפה שלא נמצא ראיה — כתוב "לא נמצא", לא ניחוש.

---

## 0. תמונת-מצב חד-משפטית

בלגן היום הוא **דמו-web חד-משתמשי בלי התמדה אמיתית מחוץ לדפדפן**: כל הדאטה (כולל מפתח-Anthropic וטוקן-Gmail בטקסט-גלוי) יושבת במפתח `localStorage` יחיד (`ds_app_v1`), הרשומות הן `Map<String,String>` בלי שדה בעלים/משתמש בכלל, אין שרת, אין push, ואין אפילו התמדה על בנייה native (Android/iOS) — רק על web. זה תואם את הכוונה המוצהרת ("הכל במכשיר", חוק-6 ב-`LAW.md`) אבל אומר שהמרחק ל"מוצר לאלפי משתמשים ביום" ובוודאי למרקטפלייס דו-צדדי הוא **בנייה מהיסוד של שכבת-שרת+זהות+דאטה-משותפת**, לא הרחבה של מה שקיים.

---

## 1. מלאי — מה קיים בפועל (עם ראיות)

| היבט | ממצא | ראיה |
|---|---|---|
| **Flutter/SDK** | Dart SDK `^3.7.2`, `flutter_riverpod ^2.6.1` לניהול-מצב **אבל בלגן עצמו לא משתמש בו** — הוא רץ על `AppStore extends ChangeNotifier` פרטי | `app_flutter/pubspec.yaml:6,32` · `lib/genesis/dart-ui-bs/ds/ds_store.dart:9` |
| **פלטפורמות** | פרויקט ה-Flutter מוגדר ל-Android+iOS+Web (יש `android/`, `ios/`, `web/`), **אבל** בלגן עצמו נבנה ונפרס **רק כאתר-web** דרך `flutter build web --base-href /buildsmart/balagan/` ב-CI/ship; אין ראיה לבנייה native של בלגן (APK/IPA) | `repos/genesis/machtzev/generator/ship.mjs:27,88` (`SITES` כולל `['balagan', 'gen_balagan_main.dart']`, כל השורה בונה `flutter build web`) |
| **התמדה** | `AppStore` שומר הכל תחת מפתח יחיד `ds_app_v1` ב-`localStorage`, **רק בענף-web** של conditional-import; בכל build אחר (native, טסטים) — no-op, כלום לא נשמר | `ds_store.dart:7,37` · `ds_persist_web.dart` (כל הקובץ) · `ds_persist_stub.dart` (כל הקובץ — שני מתודות ריקות) |
| **מודל-רשומה** | `Map<String,String>` שטוח לכל השדות (גם מספר/תאריך/אחוז — הכל מחרוזת); שדות-מטא קבועים: `__id`,`__stage`,`__at`,`__note`,`__repeat` (וגם `__doc`) | `ds_store.dart:9,34-35,112,137,216` |
| **גודל-קוד מיוצר** | ~1,700 שורות Dart ספציפיות ל-balagan ב-`dart-gen-bs`+`dart-data-bs/auto` (9 מסכי-gen + 8 קבצי-תוכן), עוד ~1,442 שורות ג'נרטור JS ב-`balagan.mjs` | `wc -l` על 17 הקבצים = 1708 שורות; `balagan.mjs` = 1442 שורות |
| **מודולים רשומים בפועל** | `kBalaganModules` מכיל **31** מודולים (28 פירוקים + 3 בסיס: יומן/משימות/הערות); אבל **קשרים חוצי-מודול (`registerAppRelations`) קיימים רק ל-6** מתוך 28 (`peruk01,02,04,05,06,09`) | `new/dart-gen-bs/gen_balagan_moments.dart:16-…` (31 `BalaganModule(`) · `gen_balagan_main.dart:7-21` (רק 6 imports של `_relations`) |
| **Service Worker / PWA** | קיים ל-**buildsmart** הראשי בלבד (`service-worker.js`, שם-אפליקציה "בנייה חכמה", אייקון קסדה כתומה) — **אין** manifest/אייקון ייעודי לבלגן; ה-build של `flutter build web` לכל site ב-`SITES` (כולל balagan) מעתיק את **אותו** `web/manifest.json` היחיד של הפרויקט | `app_flutter/web/manifest.json:2-3,8` (`"name":"בנייה חכמה"`) · `service-worker.js:1-8` · `ship.mjs:85-90` (אין הזרקת manifest שונה לכל site) |
| **RTL/i18n** | RTL מוזרק ידנית ב-`Directionality(textDirection: TextDirection.rtl,…)`, גופן Heebo; אין `l10n`/ARB לבלגן (הטקסטים חיים כ-`const String gen_balagan_*_c<n>` בקובצי-תוכן נפרדים — לא i18n אמיתי, רק הפרדת-תוכן-מקוד) | `gen_balagan_main.dart:32` · `dart-data-bs/auto/gen_balagan_keys_content.dart` (קבועים בעברית בלבד) |
| **בדיקות** | קובץ-טסט אחד לבלגן, `genesis_gen_balagan_facts_test.dart` — **512 שורות / ~50 טסטים**, כולם unit-tests טהורים על פונקציות (חילוץ-תאריך/סכום, זיהוי-TF-IDF, CRUD+undo ב-`AppStore`). **אין** widget-test/golden-test שמרנדר מסך בלגן אמיתי, **אין** טסט-עומס (10k+ רשומות), **אין** טסט רב-משתמש (כי אין מושג משתמש) | קובץ שלם, 512 שורות; `find test -iname "*balagan*"` = קובץ יחיד |
| **CI/Deploy** | `ship.mjs` הוא pipeline יחיד: regen → mirror-to-buildsmart → `flutter analyze`+`flutter test genesis_*` → 3 שערי-משטרה → `flutter build web` לכל site → gh-pages worktree → commit+push (buildsmart ואז genesis) | `ship.mjs:1-138` שלם |
| **Analytics/Crash** | `firebase_crashlytics`/`firebase_analytics` קיימים ב-pubspec **אבל מותנים ב-`Firebase.apps.isNotEmpty`** — כלומר רק כש-Firebase מאותחל; לבלגן (`gen_balagan_main.dart`) **אין קריאת `Firebase.initializeApp`** ב-`main()` שלו — כך שאין טלמטריה/קראש-רפורטינג לבלגן כפי שהוא בנוי היום | `pubspec.yaml` הערה על "G4 — production telemetry, ACTIVE ONLY when Firebase actually initialised" · `gen_balagan_main.dart:15-23` (main() לא קורא ל-Firebase כלל) |

**מסקנת-מלאי:** בלגן הוא כרגע **תוסף-דמו** בתוך מונוריפו גדול בהרבה (buildsmart — פלטפורמת-רכש-לאתרי-בנייה עם Firebase מלא), לא אפליקציה עצמאית עם זהות-מוצר, אחסון, או תשתית-הפצה משלה.

---

## 2. שרת + זהות — מה צריך ומה אפשר לעשות-מחדש-שימוש

**מה קיים היום שאפשר לעשות בו שימוש-חוזר:**
- Firebase כבר מחובר ב-buildsmart (`firebase_core ^4.10.0`, `firebase_auth ^6.5.2`, `cloud_firestore ^6.5.0`, `cloud_functions ^6.3.2`, `firebase_messaging ^16.3.0`, `firebase_app_check`) — **תשתית מוכחת בקוד**, אך משמשת היום רק "כניסת-מנהל בגוגל" (`google_sign_in`) ל-owner, לא לזרימת-משתמשי-קצה. `firestore.rules` בן **72,971 בתים** קיים כבר בריפו — כלומר יש כבר שכבת-אבטחה עשירה שנבנתה למוצר אחר, וניתן ללמוד ממנה דפוסים (לא להעתיק ישירות — סכימה שונה לגמרי).
- `http` package כבר בשימוש לקריאות-REST ישירות מהלקוח (Gmail API) — כלומר יש כבר תבנית "לקוח קורא-שרת-חיצוני-ישירות" (`ds_mail.dart:1-27`) שצריך להחליף בקריאה-דרך-Backend-שלכם (כדי להסתיר טוקנים/מפתחות מהדפדפן).
- `flutter_local_notifications` + `connectivity_plus` קיימים בפרויקט (למודולי buildsmart אחרים) — ניתנים ל-reuse לבלגן ברגע שיש push אמיתי.

**מה חסר וצריך להיבנות מאפס לבלגן:**
1. **Auth**: אין שום flow של הרשמה/כניסה למשתמש-קצה בבלגן (`role`/`actor` ב-`AppStore` הם מחרוזת-חופשית לסינון-תצוגה בלבד — "RLS צד-לקוח = סינון-תצוגה, לא אכיפה!" בהערת-הקוד עצמה, `ds_store.dart:19`). צריך OTP-טלפון (ראה סעיף 8 למחירים) + Firebase Auth Phone, או ספק-זהות ישראלי.
2. **KYC (ת.ז+סלפי)**: לא קיים כלל בקוד. אין שילוב עם שום ספק (AU10TIX וכו') בשום מקום בריפו (`grep` על "KYC"/"סלפי"/"verification" בשני הריפואים = ריק).
3. **סנכרון-רשומות בין מכשירים/משתמשים**: `AppStore` הוא in-memory + localStorage מקומי בלבד; אין API, אין conflict-resolution, אין "last-write-wins" מוגדר.
4. **Push**: ראה סעיף 6 — לא קיים.
5. **אחסון-קבצים מוצפן** (צילומי-מסמכים): לא קיים — כרגע "צלם מסמך" (`gen_balagan_ask.dart`) לא נשמר לקובץ בכלל, רק ל-5 שדות טקסט שמוזנים ידנית (ראו PLAN §3.4: "עד הכרעת-בינה — הצילום נשמר + 5 שדות ידניים" — אבל בקוד עצמו `image_picker`/`camera` לא מחוברים למודול בלגן; אין קריאת-קובץ ב-`gen_balagan_ask.dart`).

**הערכת-מאמץ לבונה-יחיד (עם גישת-מחולל):**
| רכיב | ימים (סדר-גודל) | לג'נרט או לכתוב-ביד? |
|---|---|---|
| Firebase Auth (OTP טלפון) + מסך-כניסה | 3–5 | ביד (זרימת-אימות אינה "מסך=שאלה" גנרי; יש state-machine אמיתי: שלח-קוד/אמת/נעילה-אחרי-N-ניסיונות) |
| Firestore schema + security rules לבלגן (משתמש→רשומות) | 5–8 | ביד — כללי-אבטחה הם קוד-קריטי-לביטחון, לא natural-language spec |
| מיגרציה מ-localStorage ל-Firestore (dual-write תקופתי) | 4–6 | ביד |
| Cloud Functions ל-webhook-ים (push טריגרים, refresh-טוקן) | 5–7 | ביד |
| KYC integration (ספק חיצוני, SDK) | 3–5 (לא כולל אישור-ספק/חוזה) | ביד |
| **סה"כ שרת+זהות בסיסי** | **~20–30 ימי-פיתוח** | ברובו ביד; המחולל (balagan.mjs) לא מכיל שום יכולת ליצור קוד-שרת — הוא מיועד אך-ורק ל-Dart/Flutter צד-לקוח |

**לג'נרט מול לכתוב-ביד — עיקרון:** המחולל של genesis (`spec-lang.data.json`, `balagan.mjs`) מפיק **מסכי Flutter מתוך משפטי-עברית** — אין בו שום נתיב ליצירת קוד-שרת/Cloud-Functions/Firestore-rules (`grep -r "cloud_functions\|firestore.rules\|server" repos/genesis/machtzev/generator` = 0 תוצאות רלוונטיות מלבד ship.mjs עצמו). המסקנה המפורשת: **הלקוח (Flutter) ימשיך להיווצר מהמחולל; השרת חייב להיכתב-ביד** כפרויקט נפרד (Cloud Functions / Firestore rules), עם רק "שקעי-חיווט" בצד הלקוח (כמו חוק-6 כבר מגדיר למפתחות).

---

## 3. מודל-דאטה לשני-משתמשים — מה חסר בשפת-האפיון

`spec-lang.data.json` (65 השורות של אוצר-המילים שהמחולל קורא) מגדיר את טיפוסי-השדה הבאים בלבד:
`typeDate, typeNum, typeBool, typeMultiline, typeTime, typePhone, typePercent, typePerson, typeLocation` — **כולם שדות סקלריים** (`spec-lang.data.json:3-211`). **אין** בשפה:
- **סוג `relation`/foreign-key אמיתי** — "typePerson" הוא רק רמז-לזיהוי-מחרוזת-שם-כשדה-טקסט, לא קשר למזהה-ישות אחרת. אין ייצוג לטבלת-קישור N:N (למשל "משימה ← מוקצית-ל ← משתמש").
- **סוג `enum`/state-machine עם guards אמיתיים** — `stagePrefixes` (`שלבים/סטטוסים/מצבים`) מזהה **רשימת-שלבים סדורה** (אינדקס `__stage` בלבד, התקדמות ליניארית), לא state-machine עם מעברים-מותנים/ביטול/סירוב. יש `markGuards: ["מעברים","שערים"]` בקובץ הדקדוק — אינדיקציה ל"שערי-מעבר" ברמת-תוכן, אבל זה מנגנון-בדיקה-סטטית של תוכן-פירוק, לא state-machine בקוד-ריצה עם payment/offer semantics.
- **סוג `money`/currency** — `typeNum` כולל "מחיר/סכום/תקציב" אבל בלי מטבע/דיוק-עשרוני מובנה; ב-`AppStore` כל ערך הוא `String` (למשל `'8000'`), כלומר **חישובי-כסף בקוד המיוצר הם parsing חוזר של מחרוזת** (`balaganMoney`, `balaganFmtMoney` ב-testfile) — לא Decimal/int-אגורות. מסוכן לתשלומים אמיתיים (עיגול/פרסינג).
- **סוג `geo`/lat-lng** — `typeLocation` הוא רמז לשדה-טקסט ("מקום/כתובת/מיקום"), **אין** קואורדינטות, אין geofencing. (לצורך השוואה: geofencing-check-in לצ'ק-אין-משימה במרקטפלייס דורש lat/lng+radius — לא קיים בשום מקום בשפה או במנוע.)
- **מושג "בעלים/משתמש" ברמת-רשומה** — כאמור, `Map<String,String>` לא נושא `userId`/`ownerId` בכלל. כל הריצה מניחה מכשיר=משתמש=בעלים יחיד.

**מיפוי-הצעה לישויות המרקטפלייס מול מה שהשפה יודעת היום:**

| ישות מבוקשת | ניתן-לביטוי היום ב-spec-lang? | מה חסר |
|---|---|---|
| `User` (id, phone, verified) | חלקית — `typePhone`,`typeBool` קיימים | אין `userId` כמפתח-ראשי אמיתי (יש רק `__id` פר-רשומה-בודדת, לא namespace של "בעלים") |
| `Profile(location, categories, availability)` | חלקית — `typeLocation` כטקסט | geo אמיתי + range/window-זמן (אין "availability window" כטיפוס) |
| `Task` | כן — ישות רגילה עם `typeDate`,`typeNum`,`markRules` | חסר: visibility ל-N משתמשים (כרגע כל הרשומות "פרטיות-מכשיר" מטבען) |
| `Offer`/`Assignment` (state machine: pending→accepted→in_progress→done→disputed) | לא — יש רק `stagePrefixes` ליניארי | דרוש state-machine אמיתי עם branch/guards/rollback — לא קיים בשפה או במנוע |
| `Payment(auth/capture/split/refund)` | לא | אין טיפוס `money`/מטבע, אין semantics של "pre-auth ואז capture נפרד" (זו state-machine + אינטגרציית-PSP חיצונית — הרבה מעבר לטווח "spec-lang → Flutter screen") |
| `Rating` (דו-צדדי) | חלקית — `typeNum` למספר-כוכבים | אין אכיפת-"רק אחרי סיום"/one-per-assignment |
| `Dispute` | חלקית כישות עם `markRules`/`markDelete` | אין workflow-הסלמה/SLA |
| `Chat(masked)` | לא | מיסוך-טלפון הוא לוגיקת-פרוקסי בצד-שרת (relay מספר וירטואלי) — מחוץ לגמרי לתחום-שפה של "מסך=שאלה" |

**מסקנה:** spec-lang.data.json **לא** מסוגל לבטא state-machine עם transitions מרובי-תנאי, קשרי-relation אמיתיים, money-type, או geo — **חייבים 4 טיפוסי-שדה חדשים** (`relation`, `enum-state-machine` עם guards, `money`, `geo`) לפני שאפשר בכלל להתחיל לג'נרט מסכי-מרקטפלייס. זו לא תוספת-קטנה: `entity.mjs` (המנוע שקורא regex מ-`spec-lang.data.json` לפי `LAW.md` §חוק-5/פ1) יצטרך הרחבה מבנית, לא רק תוספת-מילים לאוצר-המילים.

---

## 4. אבטחה ופרטיות — הפערים החוסמים לפני חשיפה לזרים

| ממצא | ראיה | חומרה |
|---|---|---|
| **מפתח-Anthropic וטוקן-Gmail ("ya29.…") נשמרים בטקסט-גלוי** ב-`localStorage['ds_app_v1']`, יחד עם כל הדאטה האישית (חוזים, בריאות, כספים) — אין הצפנה כלל, לא at-rest ולא מוסתר-שדה | `ds_store.dart:92` (`exportJson` כולל `_settings` המכיל `ai.key`/`mail.token`) · `ds_persist_web.dart` (localStorage גולמי, בלי הצפנה) | **גבוה** — כל XSS/הרחבת-דפדפן זדונית/גישה-פיזית לדפדפן-פתוח = דליפת מפתח-AI+גישת-Gmail מלאה |
| **"גיבוי" = הדבקה ל-Clipboard** של כל ה-JSON (כולל המפתחות והטוקן) | `gen_balagan_keys.dart:19` (`Clipboard.setData(ClipboardData(text: t))`) | **בינוני-גבוה** — כל אפליקציה/תוסף שקורא-clipboard במכשיר (נפוץ באנדרואיד/תוספי-דפדפן) יכולה לגנוב את כל התיק האישי + המפתחות ברגע-הגיבוי |
| **צילומי-מסמכים (חוזה/רפואי/מס)** | אין קוד שמעלה/שומר קובץ-תמונה בכלל עבור בלגן היום (`image_picker`/`camera` מיובאים ב-pubspec אבל **לא** מחוברים ל-`gen_balagan_ask.dart` — 161 שורות, ללא import של camera/image_picker) | תלוי-מימוש עתידי — כרגע אין קובץ בכלל, אז "איפה מאוחסן/מוצפן" = "לא רלוונטי עדיין", אבל ברגע שיתווסף (וזה מתוכנן לפי PLAN §3.4/§3.6) **אין תשתית-הצפנה קיימת לשימוש-חוזר** |
| **XSS-surface ב-Flutter-web** | Flutter-web (CanvasKit/HTML renderer) מצמצם משמעותית XSS קלאסי כי הרינדור לא-DOM-ישיר; אבל שדות-קלט חופשיים (`DsField`) + ה-`http`-קריאות-ישירות ל-Gmail/Anthropic **מהדפדפן** (לא משרת) חושפות CORS/network-tab לכל תוסף-דפדפן | `ds_mail.dart:14-15` (Authorization header נשלח ישירות מה-browser fetch) | בינוני |
| **הרשאת-מיקום** | לא קיימת בקוד בלגן כלל (`geolocator` בפרויקט הראשי, לא מחובר למודול בלגן/spec-lang) | — | לא-רלוונטי-עדיין, אבל geofencing למרקטפלייס דורש בניה-מאפס |
| **תיקון 13 לחוק הגנת הפרטיות** | ביומטרי (סלפי לאימות-KYC) הוגדר כ"מידע בעל רגישות מיוחדת"; חובת-רישום-מאגר חלה בעיקר על מאגרים שמטרתם-העיקרית איסוף-מידע-להעברה-לאחרים בעסק/בתמורה, מעל 10,000 רשומות, **וגם** על "סוחרי-מידע" ומאגרים ציבוריים; מעל 100,000 בעלי "מידע ברגישות-מיוחדת" — חובת-הודעה לרשות-הגנת-הפרטיות. **המשמעות לבלגן:** ברגע שיש KYC+סלפי+פרופיל-מיקום ל-5,000+ משתמשים, קיימת חובת-בדיקה מול עו"ד-פרטיות אם המאגר חייב-רישום ומינוי-ממונה — **לא נמצא בקוד/בתיעוד כל אזכור להיערכות לכך** (`grep -ri "DPO\|ממונה\|תיקון 13\|רישום מאגר" repos/genesis repos/buildsmart` = ריק) | ראו Sources בסעיף 8 | דורש ייעוץ-משפטי לפני שיגור |

**מינימום-חובה לפני שיגור לזרים (לא לבני-משפחה/בדיקה):**
1. הפסקת שמירת מפתחות/טוקנים ב-localStorage גולמי — לפחות Web Crypto (encrypt-at-rest עם מפתח-נגזר-ממכשיר), עדיף להעביר ל-secrets-שרת ברגע שיש backend.
2. הסרת/אזהור מפורש על ה"גיבוי-ל-clipboard" כשיש בו מפתחות (או: לפצל — לגבות דאטה-תפעולי בנפרד מהגדרות-מפתחות).
3. מדיניות-פרטיות+תנאי-שימוש אמיתיים (לא נמצאו בריפו כלל).
4. ייעוץ-פרטיות ייעודי לפני 10,000 משתמשים/KYC (Amendment 13).

---

## 5. אמינות ה-≤2-הקשות בקנה-מידה

- **זיהוי-הרגע (TF-IDF)** רץ **דטרמיניסטית וללא-רשת** על משקלי-מילים שמחושבים **בזמן-build** (`balagan.mjs:53-77`, "מזהה-הרגע: TF-IDF דטרמיניסטי על מסמכי-הפירוקים... כותרת+"הרגע" ×3") ונשמר כטבלת-מספרים קבועה בקוד המיוצר (`gen_balagan_moments.dart`) — לכן **מהיר בזמן-ריצה** (סכימת-משקלים על טוקנים, לא embedding/רשת) גם ב-100+ מודולים; זו נקודת-חוזקה אמיתית של הארכיטקטורה.
- **אבל**: הזיהוי מוגבל למה שנמדד בזמן-build מתוך תוכן-הפירוקים (`peruks/*.md`, 28 קבצים היום) — **אין "זיכרון-משתמש" שמשפיע על הזיהוי** (לא נמצא שום שילוב של TF-IDF עם היסטוריית-רשומות-קיימות של המשתמש). ה-"זיכרון" היחיד שקיים הוא `balaganDuplicates`/`balaganMerge` (חיפוש-רשומה-פתוחה-דומה לפי שם/מודול) — פונקציונליות טובה אך O(n) על `records(entity)` בלי אינדקס (`ds_store.dart` — `records()`/`scoped()` הם `.where()` על List שלמה בזיכרון).
- **מה שובר עם גדילת-דאטה (10k+ רשומות במכשיר)**:
  - `_rec: Map<String, List<Map<String,String>>>` בזיכרון מלא + `jsonEncode` שלם על **כל** ה-store בכל `_save()` (`ds_store.dart:119` — `persistSave(_pkey, jsonEncode({...}))`) → **כל כתיבה בודדת מסריאלת מחדש את כל מאגר-המשתמש**. עם 10k רשומות זה O(n) על כל add/advance/decide בודד — **צוואר-בקבוק וודאי**, לא נבדק (אין טסט-עומס כלל בקובץ הטסטים).
  - `localStorage` בדפדפנים מוגבל בפועל ל-**~5–10MB** לכל origin; דאטה+גיבויים+היסטוריית-`_log` (שלא נראה שמתנקה - `_log` הוא List שגדל, לא נמצא קוד-חיתוך/TTL ב-`ds_store.dart`) עלולים לחצות את התקרה ולגרום לכשל-שמירה שקט (ה-`try/catch` ב-`ds_persist_web.dart` בולע שגיאות: `catch (_) {}` — **כשל-שמירה לא מדווח למשתמש בכלל**).
  - `search()` הוא סריקה-מלאה על כל שדה בכל רשומה בכל ישות (`ds_store.dart:112`) — ליניארי, ללא אינדקס-הפוך; עם 10k+ רשומות יורגש בהקלדה חיה.
- **בדיקות**: כל 50 הטסטים הם unit-tests נקודתיים על פונקציות טהורות עם 1–3 רשומות בכל טסט (`genesis_gen_balagan_facts_test.dart`) — **אין טסט יחיד עם N>50 רשומות**, ואין טסט-ביצועים/זמן-תגובה. הטענה "≤2 הקשות, מהיר" נכונה היום כי אין עדיין מספיק דאטה אמיתי לבחון אותה.

---

## 6. התראות (Push) — האם יש בכלל?

**לא נמצא שום push אמיתי לבלגן.** ראיות:
- `flutter_local_notifications` קיים בפרויקט (למודולי buildsmart/courier), אבל `grep` על `flutter_local_notifications\|FirebaseMessaging` בתוך `dart-gen-bs/gen_balagan_*.dart` ו-`dart-forge-bs` = **0 תוצאות**.
- PLAN-BALAGAN עצמו מודה בכך במפורש: "**דורש שרת**: התראה על מסך-נעול, קריאת יומן/מיילים... **עד אז — תזכורת מקומית + תיבה**" (`PLAN-BALAGAN-DESIGN-2026-09-07.md` שורה 162) ו"מה זה אומר למנוע... G32 (P15 שרת: בעלים)" (שורה 245) — כלומר גם צוות-התכנון מגדיר push כתלוי-הכרעת-בעלים+שרת, לא-בנוי.
- מה שכן קיים: **מסך "תזכורת" סטטי** (§3.5 בתוכנית) — mockup טקסטואלי בלבד, לא push-notification אמיתי דרך OS.
- Web Push (מבוסס Service Worker) חלש-במיוחד ב-iOS Safari (נתמך רק מ-iOS 16.4+, ורק כשה-PWA "נוספה למסך-הבית" — לא בטאב-דפדפן רגיל), ובאנדרואיד תלוי שה-PWA לא נסגרה/OS לא הרג את ה-service-worker — לא אמין ל"אנשים פותחים כל יום".

**המסקנה המעשית לגבי "אנשים פותחים כל יום":**
כדי לקבל push אמין (תזכורת-08:00, תזכורת−3/−1 ימים לפני מועד-הכרעה — הליבה של הצעת-המוצר ב-§4 ל-PLAN) יש **שתי דרכים בלבד**, שתיהן דורשות עבודה שלא קיימת היום:
1. **PWA + Web Push + FCM** — עובד "טוב-מספיק" באנדרואיד (Chrome), **חלש/מוגבל ב-iOS** (רק PWA-מותקנת, לא בטאב) — סיכון אמיתי כי חלק גדול מהשוק הישראלי הוא iOS.
2. **בנייה native אמיתית (APK+IPA)** דרך אותו קוד-Flutter (`pubspec.yaml`/`android`/`ios` כבר קיימים בפרויקט!) + `firebase_messaging` (**כבר תלות בפרויקט**, רק לא מחובר לבלגן) — נתיב מהיר-יחסית כי התשתית ב-pubspec כבר שם, אבל דורש: אתחול Firebase בתוך `gen_balagan_main.dart` (חסר היום), טיפול-הרשאות-Android-13+ (`POST_NOTIFICATIONS` — יש כבר תיעוד-הערה על כך בפרויקט הראשי, `pubspec.yaml` הערת "F5"), ורישום ב-App Store/Google Play (חשבון-מפתח, סקירת-אפליקציה, מדיניות-פרטיות אמיתית — **אף אחד מאלה לא קיים היום**).

**המלצה:** מסלול native (2) הוא הריאלי היחיד לפרודקט-אמיתי, כי push אמין ב-iOS דרך Web בלבד לא בשל דיו ב-2026 עבור "משתמש פותח כל יום". Firebase Messaging כבר תלות בפרויקט הגדול — "רק" צריך לחבר את מודול-בלגן אליו.

---

## 7. בריאות-המחולל — האם הבונה ייתקע?

- **`ship.mjs` הוא pipeline כבד**: regen (סדר-קבוע של מחוללי-JS) → mirror לכל buildsmart → `flutter analyze` על `lib/genesis` שלם → `flutter test` על **כל** קובצי `genesis_*_test.dart` (לא רק בלגן!) → 3 שערי-משטרה (`retarget`, `skin-golden`, `app-from-sentences`) → בנייה-web ל-**7 אתרי-דמו** (`SITES`, `ship.mjs:27`) → gh-pages worktree עם git-fetch/pull/commit/push → commit+push לשני ריפואים (buildsmart ואז genesis) — **ריצה מלאה = דקות רבות, לא שניות**, ותלויה ב-flutter build web פעמיים (זה ל-shot-evidence, שבע פעמים ל-sites).
- **שברירי מאוד לפי-עיצוב, ובכוונה**: `LAW.md`+`VERIFY-LAWS.md` מגדירים 53 "שערי-משטרה" (gates.tsv) שחוסמים push על הפרת-חוק (pins.sha256 נועל קבצים; `contract-check` דורש חוזה+טסט לכל "חוט"; `datapurity/deeppurity` סופרים עברית-בקוד-מנוע). זה **מכוון** (למנוע-דגרדציה של המחולל עם הזמן) אבל אומר שכל שינוי בקוד-המנוע (לא רק בתוכן-הפירוקים) עובר מסלול-אימות ארוך.
- **המחולל לא יכול לייצר שרת בשום צורה** — ראו סעיף 2: `spec-lang`+`entity.mjs`+כל ה-machtzev/generator מיוצרים ל-Dart/Flutter-client בלבד. **הבונה-היחיד לא ייתקע על-ידי המחולל כשהוא בונה שרת** — פשוט כי המחולל לא בתמונה כלל שם; זה יהיה פרויקט-Node/Python/Firebase-Functions נפרד, בלי הקשר לחוקי `LAW.md`/`spec-lang`.
- **המלצה מפורשת (תואמת את מה שהריפו עצמו כבר מיישם)**: **המשך לג'נרט את הלקוח מ-spec** (זה עובד, יש 53 שערים ותקן-איכות בשל), **וכתוב את השרת ביד כפרויקט נפרד** (Cloud Functions/Firestore-rules, בהשראת — לא העתקה של — `firestore.rules` הקיים ל-buildsmart). זה גם מפריד-אחריות נכון: ה-schema של state-machine/relation/money (סעיף 3) ממילא לא ניתן-לביטוי ב-spec-lang היום, אז אין טעם "לכפות" את השרת דרך המחולל.

---

## 8. עלות הרצה ל-5,000 משתמשים יומיים — סדרי-גודל (לא הצעת-מחיר)

> אזהרה: המספרים הבאים הם **סדרי-גודל בלבד**, לא הצעות-מחיר. ספקי-KYC ישראליים/גלובליים (למשל AU10TIX) **לא מפרסמים תעריף-ליחידה** — יש מינימום-חודשי מוצהר (~$500) ומחיר-לפי-נפח שדורש שיחת-מכירות; "Zohar"/"ShieldPay" כספקי-KYC ישראליים **לא אומתו** בחיפוש — לא נמצא מקור אמין לשמם/תעריפם, נדרשת בדיקה ישירה מול ספק לפני תכנון-תקציב.

| רכיב | הנחת-עבודה ל-5,000 DAU | סדר-גודל חודשי (₪, גס) | מקור/הערה |
|---|---|---|---|
| Hosting+DB (Firestore/Functions) | ~5,000 DAU, כמה קריאות/כתיבות ליום למשתמש | מאות עד ~1,500 ₪ | תלוי-נפח מאוד; Firestore מחייב לפי read/write/storage — ללא מדידת-שימוש אמיתית זו הערכה גסה בלבד |
| Push (FCM) | — | **0 ₪** | Firebase Cloud Messaging חינמי בפועל בהיקף כזה |
| SMS OTP | הנחה: כל משתמש מתחבר-מחדש ~1-2 פעמים/חודש → ~7,500–10,000 הודעות/חודש | ~150–450 ₪ | לפי מקור אחד שנמצא: ~$0.045/הודעה ל-"Kosher phone" בישראל (סדר-גודל ~0.15-0.2 ₪/הודעה); **לא הצלחתי לאמת מחיר-ספק ישראלי מקומי (019/Inforu) ישירות** — צריך הצעת-מחיר אמיתית |
| KYC (ת.ז+סלפי) | הנחה: לא כל 5,000 DAU עוברים KYC כל חודש — רק חדשים; נניח ~500 אימותים חדשים/חודש | **לא נמצא** תעריף-ליחידה מפורסם (AU10TIX: מינימום $500/חודש + לפי-נפח בהצעת-מחיר) | דורש הצעת-מחיר ישירה; אין להניח מספר בלי אישור-ספק |
| PSP/סליקה + Split | תלוי-נפח-עסקאות (לא נפח-משתמשים) | לרוב 2%–3.5% מהעסקה + עמלה-קבועה קטנה | Tranzila/Cardcom/PayPlus/Meshulam — **אף אחד מהם לא פרסם תמיכה מוכחת ב"pre-auth נפרד מ-capture + split בין שני צדדים" בחיפוש שבוצע** — כנראה דורש הסדר-ייעודי/PSP עם רישיון "שירותי תשלום" בישראל (חוק שירותי תשלום, תשפ"ד) — **דורש ייעוץ-רגולטורי ישיר**, לא הערכה כאן |
| OCR (אם עובר לתשלום-פלטפורמה במקום מפתח-משתמש) | תלוי-נפח-מסמכים לחודש | תלוי-ספק (Google Vision/Azure OCR ~$1–1.5/1,000 עמודים) | סדר-גודל בלבד |

**מסקנת-עלות:** הרכיבים הכי-לא-ודאיים בתקציב (KYC, PSP-split) הם בדיוק אלה שדורשים **הצעת-מחיר/ייעוץ-משפטי ישיר לפני שיגור המרקטפלייס** — אי-אפשר לתכנן תקציב-אמין מהם בלי לפנות לספק בפועל.

Sources:
- [AU10TIX pricing and packages](https://www.au10tix.com/pricing/)
- [AU10TIX · Cost Drivers: Pricing & Contracts (2026) - RFP.wiki](https://www.rfp.wiki/it-security/identity-verification/au10tix)
- [SMS Cost Calculator — Estimate SMS OTP Costs by Country | Authgear](https://www.authgear.com/tools/sms-cost-calculator/)
- [OTP SMS verification API service provider in Israel](https://otpsmsapi.com/otp_sms_verification_api_service_provider_in_Israel.html)
- [תיקון 13 לחוק הגנת הפרטיות - iCount](https://www.icount.co.il/blog/amendment-13/)
- [תיקון מס' 13 לחוק הגנת הפרטיות - צמח שניידר ושות'](https://zes.co.il/%D7%AA%D7%99%D7%A7%D7%95%D7%9F-%D7%9E%D7%A1-13-%D7%9C%D7%97%D7%95%D7%A7-%D7%94%D7%92%D7%A0%D7%AA-%D7%94%D7%A4%D7%A8%D7%98%D7%99%D7%95%D7%AA/')
- [סליקה ישראלית 2026, השוואה — Cardcom, Tranzila, PayPlus, Meshulam](https://www.autoflowr.co.il/compare/payment-gateways-israel-2026)

---

## טבלת "פערים טכניים" (מדורגת)

| # | פער | ראיה | חוסם מה | מאמץ (ימים, בונה-יחיד) | המלצה |
|---|---|---|---|---|---|
| 1 | **אין userId/owner ברמת-רשומה** — כל המודל מניח מכשיר=משתמש | `ds_store.dart:9` (`Map<String,List<Map<String,String>>> _rec`), `_actor` הוא string-סינון-תצוגה בלבד (שורה 19) | שניהם | 8–12 | להוסיף `ownerId` לכל רשומה + Firestore-rules אמיתיים (לא client-side filter) |
| 2 | **אין התמדה כלל ב-native** (רק web/localStorage) | `ds_persist_stub.dart` (2 שורות ריקות) מול `ds_persist_web.dart` | מוצר-יומיומי | 3–5 | shared_preferences/Hive ל-non-web, לפני כל מחשבה על app-store |
| 3 | **מפתח-AI + טוקן-Gmail בטקסט-גלוי ב-localStorage וב-clipboard-export** | `ds_store.dart:92`, `gen_balagan_keys.dart:19,33,36` | שניהם | 2–4 | הצפנה מקומית מינימלית + איסור-ייצוא-מפתחות בגיבוי הרגיל |
| 4 | **spec-lang חסר relation/enum-state-machine/money/geo** | `spec-lang.data.json` שלם (רק typeDate/Num/Bool/Multiline/Time/Phone/Percent/Person/Location) | מרקטפלייס | 15–25 (הרחבת `entity.mjs`+שפה) | להוסיף 4 טיפוסי-שדה חדשים לפני כל ניסיון לג'נרט Task/Offer/Payment |
| 5 | **אין שום Push אמיתי** | `PLAN-BALAGAN...md:162,245` מודה בכך; 0 hits ל-FCM/local-notifications בקוד-בלגן | מוצר-יומיומי (קריטי) | 5–8 (חיבור FCM שכבר-בפרויקט) + חנויות-אפליקציה | לבנות native build מחובר ל-firebase_messaging הקיים ב-pubspec |
| 6 | **מודל-כסף הוא String, לא Decimal/אגורות** | `AppStore` — כל שדה `String`; `balaganMoney`/`balaganFmtMoney` בטסטים עושים parse חוזר | מרקטפלייס (תשלומים) | חלק מ-#4 | טיפוס-money ייעודי לפני חיבור-PSP |
| 7 | **אין KYC/סלפי בקוד בכלל** | 0 hits ל-KYC בשני הריפואים | מרקטפלייס | תלוי-ספק; אינטגרציה עצמה 3–5 | לבחור ספק ולקבל הצעת-מחיר לפני תכנון-תאריך |
| 8 | **אין manifest/זהות-PWA ייעודית לבלגן** (משתמש ב-manifest של "בנייה חכמה") | `web/manifest.json:2-3`, `ship.mjs:85-90` | מוצר-יומיומי (מיתוג) | 1 | web/ נפרד או פרויקט-Flutter נפרד לבלגן |
| 9 | **`_save()` מסריאל את כל ה-store בכל כתיבה; אין אינדקס-חיפוש** | `ds_store.dart:112,119` | סקאלה (מוצר-יומיומי) | 5–8 | לפצל שמירה לפי entity, להוסיף אינדקס-הפוך לחיפוש כשעוברים ל-DB אמיתי |
| 10 | **קשרים חוצי-מודול קיימים רק ל-6/28 פירוקים** | `gen_balagan_main.dart:7-21` | מוצר-יומיומי ("היא יודעת לפני שתשאל") | 10–15 (22 מודולים נוספים) | להשלים `registerAppRelations` לכל 28 לפני טענת "פי-100" |
| 11 | **טוקן-Gmail ידני, מפוג תוך שעה, בלי refresh** (הקשר נתון מהמשתמש, אושר בקוד: `ds_mail.dart` הערה "כשל-רשת/טוקן-פג ⇒ null") | `ds_mail.dart:2`, `gen_balagan_keys_content.dart:c23-24` | מוצר-יומיומי | 3–5 (OAuth flow+refresh אמיתי, דורש client-secret בשרת — לא client-only) | דורש backend proxy ל-OAuth (client-secret אסור בדפדפן) — קשור ישירות ל-#פער-שרת |
| 12 | **אין בדיקות-עומס/widget/golden לבלגן** | קובץ-טסט יחיד, 50 unit-tests, מקסימום ~3 רשומות בטסט | סקאלה + אמינות | 5–8 | להוסיף טסט עם 10k רשומות מדומות למדוד `_save`/`search`/`identify` |
| 13 | **אין מדיניות-פרטיות/DPO/היערכות-תיקון-13** | 0 hits ל"מדיניות-פרטיות"/"ממונה" בריפו | מרקטפלייס (חוקי) | ייעוץ חיצוני | לפנות לעו"ד-פרטיות לפני 10k משתמשים/KYC |
| 14 | **אין רישיון/הסדר PSP ל-split-payment** (pre-auth+capture נפרד, פיצול-בין-צדדים) | לא אומת אצל אף ספק ישראלי שנבדק | מרקטפלייס (חוקי+טכני) | ייעוץ חיצוני | לבדוק את חוק שירותי-התשלום תשפ"ד מול הרכב-הפיצ'ר המדויק |

---

## "מה לבנות בסדר הזה" — 12 צעדים מהיום ל-5,000 משתמשים יומיים + מוכן-למרקטפלייס

1. **התמדה אמיתית + owner-per-record** (ביד) — shared_preferences/Hive ל-native, `ownerId` בכל רשומה, גם אם עדיין device-only. תשתית-חובה לכל מה שבא אחרי.
2. **הצפנת מפתחות/טוקנים at-rest + הפרדת ה-export-לגיבוי מהמפתחות** (ביד) — סוגר את פער-האבטחה הכי-חמור-והכי-זול-לתקן.
3. **Firebase Auth (OTP-טלפון) + Firestore בסיסי (sync חד-כיווני, ללא-שיתוף עדיין)** (ביד) — הופך "מכשיר" ל"משתמש-מזוהה" בלי לגעת עדיין בשכבת-המרקטפלייס.
4. **חיבור native build (Android+iOS) + firebase_messaging לבלגן** (ביד, אבל תלוי-תשתית-שכבר-קיימת ב-pubspec) — התנאי לקבלת push אמין ול"אנשים פותחים כל יום"; במקביל להירשם ל-App Store/Google Play (חשבונות-מפתח, מדיניות-פרטיות).
5. **מנוע-OAuth-Gmail עם refresh בצד-שרת** (ביד, Cloud Function proxy) — מסיר את "טוקן שפג תוך שעה" כחוויית-משתמש שוברת.
6. **manifest/זהות-מוצר ייעודית לבלגן** (config, לא-מחולל) — נפרד מ"בנייה חכמה".
7. **הרחבת spec-lang: relation + enum-state-machine + money + geo** (הרחבת-מחולל, ביד ב-`entity.mjs`/`spec-lang.data.json`) — התנאי-המוקדם לכל דבר במרקטפלייס.
8. **מיגרציה למודל-Firestore משותף (Task גלוי ל-N משתמשים, Offer, Assignment עם state-machine)** (ביד) — כאן המחולל עדיין מייצר את מסכי-ה-UI מ-spec (אחרי #7), אבל סכימת-השרת+הכללים נכתבים ביד.
9. **KYC + Amendment-13 compliance review** (ייעוץ-חיצוני + אינטגרציה) — לפני שמכניסים "ת.ז+סלפי" לאפליקציה, לא תוך-כדי.
10. **PSP עם pre-auth/capture/split + בדיקה-רגולטורית (חוק שירותי-תשלום)** (ייעוץ-חיצוני + אינטגרציה, ביד) — הרכיב-הכי-איטי-לאשר; להתחיל מוקדם.
11. **מיסוך-טלפון (relay) + צ'אט** (ביד, שרת) — לוגיקת-פרוקסי שאין לה שום מקבילה בשפת-בלגן היום.
12. **בדיקות-עומס (10k+ רשומות/משתמש, N-משתמשים בו-זמנית) + geofencing לצ'ק-אין** (ביד+QA) — לפני שיגור-רחב, לא אחריו.

**קו-פרשת-המים בין "מוצר-יומיומי" ל"מרקטפלייס":** צעדים 1–6 הופכים את בלגן למוצר-אמיתי לאלפי-משתמשים (עדיין חד-משתמש-לוגית, רק עם שרת/push/הזדהות). צעדים 7–12 הם המרקטפלייס עצמו, ותלויים בכולם — במיוחד #7 (spec-lang) ו-#9/#10 (רגולציה) שהם **שערי-חסימה אמיתיים**, לא רק עבודת-פיתוח.
