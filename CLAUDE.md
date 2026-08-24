# Genesis (Orbit) — הוראות לכל סשן
> **זה שער-הכניסה. כל מה שנלמד בדם — כבר כתוב. אל תלמד מחדש, קרא.**

## מה הריפו הזה
הבנייה-מחדש הנקייה של האימפריה (maor · buildsmart · yoman) — "המחצב":
הקוד הישן פורק ל-51K+ אטומים רשומים; כאן נבנה העץ החדש מחוטים-טהורים
וקופסאות-חיווט, לקראת **המחולל** (משפט-בעברית ⇒ פיצ'ר מורכב מהקטלוג).
ענף-העבודה: `claude/mah-kora-0by8kw`. אין push ל-main של הריפו הישנים בלי אישור-בעלים.

## 📖 סדר-קריאה חובה (לפני כל עבודה)
1. `LAW.md` — 7 חוקי-החשמלאי (חוקת-הבעלים: אטום-טהור, קופסה, לוח-אם, חוזה-קודם, טוהר, אפס-סודות, החלפה-הפיכה)
2. `machtzev/LEARNINGS.md` — 20+ לקחים; כל בריחה הופכת לחוק כאן, באותו סשן
3. `machtzev/AGENT-CODE.md` — המגילה שכל סוכן-גל לובש (עשרת-הדיברות)
4. `machtzev/CURRICULUM.md` — תורת-האימפריה המזוקקת (מה לאמץ ומתי)
5. `WIRING.md` — מפת-החיווט החיה (מחוללת — אל תערוך ידנית)

## 🚨 המשטרה (חובה ירוקה לפני כל commit)
```bash
node machtzev/police.mjs --fast   # לכל commit: חיווט+חוזה+מחצבה+pins (שניות)
node machtzev/police.mjs          # לסוף-גל: + selftest + mutation (דקות)
```
‏6 שערים עם ran-ledger (מרשם: machtzev/gates.tsv) · 10 קבצים נעולי-חתימה
(pins.sha256; עדכון-שוטר = `node machtzev/pins-check.mjs --write` באותו commit).
פסק-דין רק על עץ נח (L14). קופסה גמורה רק עם: חוטים+חוזים+בדיקות+מגן-הכרעה+רתמת-זהב.

## 🏭 המפעל (המכונות — הכול ב-maor-system/machtzev, ענף הסשן)
```bash
node machtzev/run.mjs             # (במאור) מפקד+מחלצים+זיקוק+משטרה — פר-גל
node machtzev/run.mjs --fast      # משטרה בלבד
node machtzev/factory/gen-wires.mjs <genesis> maor    # חציבת-טיוטות
node machtzev/promote-auto.mjs    # (בגנסיס) קידום-חינם: צילום/Golden
node machtzev/gen-wiring-doc.mjs  # (בגנסיס) חילול מפת-החיווט
```
מרשם-האטומים: maor-system/machtzev/registry/ · טיוטות: quarry/ · תוכניות-קופסה: box-drafts/

## 🌊 גלי-נחיל (קידום/קופסאות)
פרומפט-גל = "לבש את המגילה: machtzev/AGENT-CODE.md. המשימה: …" + schema מובנה.
רשימות-עבודה תמיד מ-ls (L5), חלוקה לקבצים-זרים, אפס-git לסוכנים, מאמת-עוין
צמוד (bytes-not-prose), משטרה בסוף. תבנית-workflow: promotion-engine-wave1*.js.

## 🗺️ מפת-הדרך
מחצבה-ריקה ⇒ גלי-קופסאות (60 box-drafts, כל אחת+זהב) ⇒ שכבת-מסכים (מניפסטים)
⇒ רתמת-זהב מלאה ⇒ cutover לפי חוק-7 (טוען-לצד, דגל-הפיך) ⇒ המחולל.
היעד העסקי: NORTH-STAR + ATOMS-K0 ב-maor-system/knowledge/.

## ⚠️ אזהרות שנקנו ביוקר
- הקוד-החלוץ קדוש; חוזה מתכופף למקור (L4) · בודק-נכשל ⇒ חשוד בבודק (L1)
- ‏buildsmart: קו-האמת = main (יושר 23.8); אינו multi-tenant (L16) — הכרעת-איחוד
- זהות/סודות = חיווט-הצבה, לעולם לא אטום (חוק-6, אזעקת-אבטחה 24.8)
- אין sleep/polling; רשתות-ביטחון ב-send_later; commit+push כל נחיתה
