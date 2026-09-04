# ✅ CLOSED · GENMAX · G5c — retarget: שבר-זהב ⇒ ישות אחרת מהסכמה — המנוע חולל מודולים לישויות שלא היו (4.9.2026)

> שלב 5c של `PLAN-GENERATOR-MAX-2026-09-04.md`. הצעד שהופך את המנוע מ"מרכיב-מחדש" ל"מחולל": קלט = מודול-זהב + שם-ישות מהסכמה (54 ישויות · 492 שדות); פלט = מודול חדש, מתקמפל **ורונדר-בפועל**. מנוע, לא סוכן (L51). קוד: `machtzev/generator/retarget.mjs` · שער `retarget` (commit) · הרנדר בשער `genverify`.

## איך (דטרמיניסטי · §20-ד · אפס מילון)
1. **הישות-הראשית של המודול** = רשימת-המפות ה-`const` הראשונה במחלקת-הדאטה (הזרע: `rooms`/`roster`) ⇒ מפתחות + טיפוס-משוער מהערך-הליטרלי (Id/string/number/boolean/IsoDate/TimeHM/list/map).
2. **מיפוי מפתח ⇒ שדה-ישות:** (א) **שם-זהה** (עובדה מבנית: `id`·`name`·`active`·`notes`) · (ב) **אותה צורת-טיפוס** לפי סדר-ההצהרה בסכמה, כל שדה פעם-אחת · (ג) לא-ממופה ⇒ נשאר מפתח-מקור **ומדווח** (מקום-שמור, חוק-7). שדות-ישות בלי מקור מדווחים גם הם.
3. **שכתוב:** ליטרלי `'srcKey'` ⇒ `'dstKey'` מחוץ להערות · שמות-המחלקות (`RoomsScreen`⇒`VolunteerScreen`, `_RoomsData`⇒`_VolunteerData`) · ערכי-הזרע נשמרים כ**זרע-הצבה מוצהר** של מודול-המקור (לא ערך-מומצא לשקע; מוצהר בכותרת-הקובץ).
4. **הרכבה** compose+declared (המסך-השלם, G4a) ⇒ `gen_retarget_<e>_from_<tag>.dart`.

## מדידה
| retarget | מיפוי | analyze | רנדר-בפועל (G5b) |
|---|---|---|---|
| rooms ⇒ **Volunteer** | id·name·active (שם) · slot⇒maxDeliveries · location⇒phone · notes⇒area (טיפוס) · cap/from/to/access/eq מקום-שמור · note/createdAt בלי-מקור | **0** | ✓ `VolunteerScreen` · 10 אטומי-תצוגה · 2,129 widgets · `audit/goals/gen_retarget_volunteer_from_rm.png` |
| teachers ⇒ **Supporter** | id·name·notes (שם) · 13 לפי-טיפוס · 8 מקום-שמור | **0** | ✓ `SupporterScreen` · 14 אטומי-תצוגה · 2,537 widgets |

## מה לא אומת (כנות — וזה הפער הבא)
- **סמנטיקה של מיפוי-לפי-טיפוס:** `location⇒phone`, `status⇒address`, `role⇒phone` — נכון בצורה, לא במשמעות. הדרך (ללא מילון): **ערוץ-המונחים** — שמות-שדות בעלי ערוץ-מוצהר ב-G2 (phone/email/address = name-hint declared) מקבלים עדיפות-ערוץ על סדר-הצהרה, ומפתח-מקור באותו ערוץ ממופה רק אליו; אחרת מקום-שמור. = **G5d**.
- **תוויות-UI** (כותרות-עמודות, מונחים "חדרים"/"מורים") נשארו של מודול-המקור. הדרך: `termOf`/strings של המדף לישות ולשדות; אין-מונח ⇒ שם-השדה (הצבה). = G5d.
- **בחירת מודול-המקור** נעשתה ביד (rooms⇒Volunteer). הדרך: `entityOps(E)` (G2) מול ops של כל מודול-זהב ⇒ המודול בעל הכיסוי-המקסימלי; ואז retarget. = G5e (module-picker).
- הרנדר מוכיח "עובד"; "נכון-למטרה" (אסרטות פר-op) עדיין לא.

## אימות
`retarget.mjs --gate` ✓ (2 ≡) · analyze 0/2 · `gen-verify --only` 2/2 · police --fast ירוק (ראה commit).
