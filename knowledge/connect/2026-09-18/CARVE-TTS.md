# חציבת ה-TTS — טבלת-מוצא לכל שורה

18.9.2026 · `voiceSpeak` ב-`new/dart-ui-bs/ds/ds_voice_web.dart` · אח של `voiceListen`

**למה טבלה ולא קוד:** הבריף אסר «לכתוב אטום-TTS ביד» והורה לחצוב מהמקור.
לכן כל החלטה בקובץ נושאת כאן `file:line`. מה שאין לו שורה — אינו בקובץ.

## שני המקורות

| # | קובץ | שורות | קצב |
|---|---|---|---|
| א | `knowledge/assets/screens/hamecholel.html` | 227-233 | `u.rate=1.03` |
| ב | `knowledge/assets/screens/siha-im-hamecholel.html` | 212-224 | `u.rate=1.02` |

## הפסק על כל החלטה

| החלטה בקובץ | מקור | פסק |
|---|---|---|
| `speakSupported` = יש `speechSynthesis` ו-ctor | א:228 `if('speechSynthesis' in window)` · ב:214 | **חד שיעורא** |
| לא-נתמך ⇒ `false` מיד, בלי לזרוק | א:229 `{cb&&cb();return;}` · ב:216 | **חד שיעורא** |
| `SpeechSynthesisUtterance(text)` | א:230 · ב:217 | **חד שיעורא** |
| `if (voice != null) u.voice = voice` | א:230 `if(VOICE)u.voice=VOICE` · ב:218 | **חד שיעורא** |
| `u.lang = lang` (פרמטר) | א:230 `u.lang='he-IL'` · ב:218 | **חד שיעורא** — ‏he-IL עובר כארגומנט, בדיוק כמו ב-`voiceListen(lang)` |
| **`u.rate = rate` (פרמטר)** | א:230 `1.03` · ב:218 `1.02` | **פליגא ⇒ שקע** |
| `u.pitch` — לא נקבע | ב:218 `u.pitch=1.0` · א: אינו קובע | **חד שיעורא בפועל** — 1.0 הוא ברירת-המחדל של התקן; שתי הצורות מתנהגות זהה, ולכן **אינו שקע** |
| בחירת-קול: קידומת-`lang` | א:227 `v.find(x=>/^he/i.test(x.lang))` | חד שיעורא |
| בחירת-קול: נפילה ל-`name` מכיל Hebrew | ב:213 `\|\|vs.find(v=>/Hebrew/i.test(v.name))` | **על-קבוצה, לא סתירה** ⇒ §20-ב «אין-יחיד ⇒ שלב כמה» — שולב |
| `onend`/`onerror` ⇒ משלימים | א:232 `u.onend=u.onerror=…` · ב:222 | חד שיעורא |
| `onerror ⇒ false` (ולא true) | — | **הרחבת-חוזה מפורשת**: ל-callback במקור אין ערך-החזרה. ההבחנה נגזרת מעקרון-השקע עצמו (`ds_voice.dart`: «null ⇒ הודעה כנה, לא המצאה»). מסומן, לא מוברח |
| `cancel()` לפני `speak()`, ‏catch ⇒ כישלון | א:233 · ב:223 | חד שיעורא |
| **אין `timeout`** | לשני המקורות אין | נמנע במכוון. ל-`voiceListen` יש 15 שנ׳ כי המשתמש שותק; לדיבור אורך-הטקסט אינו חסום מראש, וקיצוב היה **המצאה** |

## מה במקורות ולא נחצב, ולמה

| דבר | מקור | למה לא |
|---|---|---|
| דגל-השתקה `SPEAK` | ב:211,216 | החלטת-**קורא** (להשמיע או לא), לא של גבול-הפלטפורמה. אטום-הצבה אינו מחזיק העדפת-משתמש |
| `document.body.dataset.mode='talk'` | א:231 · ב:219 | מצב-**תצוגה** של המוקאפ. שייך למסך, לא לאטום |
| ‏cache של `VOICE` + `onvoiceschanged` | א:226-228 · ב:211-214 | המקור מטמין כי `getVoices()` ריק עד אירוע-הטעינה. `_pickVoice` קורא **טרי בכל קריאה** — אותה תוצאה בלי מצב-גלובלי ובלי מאזין. פישוט משמר-התנהגות, מסומן כאן |

## אימות

```
dart analyze ds_voice_stub.dart   ⇒ No issues found!
dart analyze ds_voice_web.dart    ⇒ 1 issue: package:web URI doesn't exist
```

השגיאה היחידה היא הייבוא `package:web` **שהיה בקובץ לפני הנגיעה** ואינו נפתר
כי `BUILDSMART=/tmp/wt-bs-gen/app_flutter` אינו קיים בקונטיינר הזה ו-flutter חסר.
‏`dart:js_interop` **כן** נפתר, ולכן כל הקריאות החדשות
(`callAsConstructor` · `setProperty` · `callMethod` · `JSArray.toDart` · `toJS`) עברו בדיקת-טיפוסים.

זהות-חתימות בין שתי גדות השקע — נמדדה, 4/4:

```
voiceListen(String lang) ⇒ Future<String?>          · voiceSupported ⇒ bool
voiceSpeak(String, String, double) ⇒ Future<bool>   · speakSupported ⇒ bool
```

**לא נבדק ונאמר במפורש:** לא הושמע קול. אין flutter ואין דפדפן בקונטיינר הזה,
ולכן אין «הוכחה בריצה» — רק בדיקת-טיפוסים וזהות-חתימות.
