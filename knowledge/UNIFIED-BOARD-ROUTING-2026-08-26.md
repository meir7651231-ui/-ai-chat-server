# 🔌 מפת-הניתוב · הלוח-האם המאוחד — איפה כל אחד נכנס (26.8.2026)

**ההכרעה:** מאור ובנייה-חכמה **מחוברים יחד** בלוח-אם אחד. הריצה-המאוחדת היא
**Dart (Flutter)** — שם מנוע-מאור (מוכח זהה-ביט ל-JS) נפגש עם דומיין-בנייה-חכמה.

```
                    ⚡ board.dart — לוח-האם המאוחד (קובץ יחיד, חוק-3)
                    IO/זהות מוזרקים פעם-אחת: שעון · config · rate
        ┌───────────────────────────────┴───────────────────────────────┐
   קופסאות-מאור (12, מוכחות זהה-ביט JS↔Dart)          קופסאות-בנייה-חכמה (דומיין)
   ─────────────────────────────────────              ──────────────────────────
   config · date-util · supporters · empowerment      bs-matching (fuzzy) ✅
   dedup · search · families · diary · reports         bs-workflow (wf/trigger)
   hebrew · wa · audit                                 bs-actions (action/scope)
                                                        bs-assistant (AI-routing)
        └───────────────────────────────┬───────────────────────────────┘
                          שכבת-האטומים (טהורים, Dart)
              new/dart-maor/ (658, מ-מאור)   ·   new/dart/ (161, מ-בנייה-חכמה)
```

## איפה כל אשכול-בנייה-חכמה נכנס (161 אטומי new/dart/)

| אשכול | # | קופסה-יעד | נכנס ללוח כ- | סטטוס |
|---|---|---|---|---|
| **fuzzy / match** | 15 | `bs-matching` | `board.bsFuzzyMatch/Score` | ✅ חובר |
| **wf / trigger / condition** | 10 | `bs-workflow` | `board.bsWorkflow*` | 🔄 בבנייה |
| **action / catalog / scope** | 11 | `bs-actions` | `board.bsAction*` | 🔄 בבנייה |
| **assistant** | 4 | `bs-assistant` | `board.bsAssistant*` | 🔄 בבנייה |
| **valid / str / field** | 19 | **יסוד-משותף** | ← ראה "החיבור" למטה | ⏳ |
| **invoice / contractor / bore / size** | 11 | `bs-projects` | `board.bsProject*` | ⏳ |
| **studio / product / manager** | 10 | `bs-studio` | `board.bsStudio*` | ⏳ |
| **config / template / rule** | 8 | `bs-config` (או מיזוג ל-config) | — | ⏳ |
| **audit / can (הרשאות)** | 5 | `bs-security` | `board.bsSecurity*` | ⏳ |

## 🔗 החיבור האמיתי — היכן מאור ובנייה-חכמה נפגשים (לא רק "יחד בלוח")

**1. יסוד-משותף (הזדמנות-איחוד):** לשתי המערכות יש אטומי-יסוד מקבילים:
- מאור: `norm-search` · בנייה-חכמה: `norm_search` — **אותה יכולת, שני שמות.**
- מאור: `levenshtein` · בנייה-חכמה: `damerau_levenshtein` + `fuzzy_*` — **בנייה-חכמה
  היא שדרוג** (Damerau = גם-שחלוף-אותיות). מועמד לשמש **גם את dedup/search של מאור**.
- **הכיוון:** יסוד-משותף אחד (validate/dedup/search) ששתי מערכות-הדומיין מזריקות
  ממנו — כאן "מה-נכנס-לאיפה" הופך ל"מי-משתף-את-מי".

**2. ה-fuzzy של בנייה-חכמה משדרג את מאור:** `board.bsFuzzyMatch` כבר בלוח —
אפשר לחווט אותו כשקע-חלופי ל-`dedup.findSupporterDupGroups` של מאור (התאמת-שמות
מטושטשת במקום מדויקת). זו הפגישה הראשונה: **יכולת-בנייה-חכמה מזינה קופסת-מאור.**

**3. workflow מכליל משפכי-מאור:** מנוע ה-`wf_*` של בנייה-חכמה (שלבים/מעברים/תנאים)
הוא הכללה של משפכי-מאור (signup→approve, funnel-התורמים). קופסת `bs-workflow`
תוכל להניע גם את זרימות-מאור.

## סדר-ההצתה (המשך-החיבור)
1. ✅ bs-matching בלוח (בוצע).
2. 🔄 bs-workflow · bs-actions · bs-assistant (גל-סוכנים רץ) → חיווט ל-board.dart.
3. ⏳ bs-projects · bs-studio · bs-security (דומיין-הבנייה הכבד).
4. ⏳ **איחוד-היסוד:** norm-search≡norm_search, ו-fuzzy כשקע-שדרוג ל-dedup-מאור —
   הפגישה האמיתית בשכבת-האטומים.

## שורה-תחתונה
**לוח-אם אחד. שני דומיינים. יסוד-משותף.** board.dart כבר מריץ 12 קופסאות-מאור
+ קופסת-בנייה-חכמה יחד (32 טענות ירוקות). ההרחבה: עוד קופסאות-בנייה-חכמה +
איחוד-היסוד שבו fuzzy-בנייה-חכמה משדרג את dedup-מאור.
