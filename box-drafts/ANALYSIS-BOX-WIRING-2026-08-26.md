# 🔌 ניתוח מלא · איך משלבים את קופסת-החיבורים (26.8.2026)

> "שום דבר לא תלוי בשום דבר עד שמחברים בקופסה; והקופסאות לא תלויות זו בזו
> עד שמחברים בלוח-האם." — LAW.md, הכרעת-בעלים 24.8

**המצב:** 722 אטומים במחסן · 62 טיוטות-קופסה · 2 קופסאות כבר-מחווטות (dialer · nedarim).
27 אטומי-ההעצמה (cockpit·intel·segments·portfolio·commands·constellation) **עדיין בורגים בודדים** —
המסמך הזה מתאר את **המנגנון** שהופך אותם לקופסה אחת, צעד-אחר-צעד.

---

## 0 · העיקרון-על — למה בכלל יש "קופסה"

באטום אין חיווט. `cockpitDaysSince(iso, todayIso)` יודע רק לחשב ימים — לא מאיפה
בא `todayIso`, לא מי קורא לו, לא מה קורה עם התוצאה. זה **חוק-1** (טוהר מוחלט)
ו**חוק-5** (אפס ידע-הקשר). האטום תקין, נבדק וזמין — גם אם אף אחד לא מחבר אותו.

הקופסה היא **המקום היחיד** שבו הבורגים האלה הופכים למכונה. שם, ורק שם:
- מזריקים לכל אטום את השקעים שלו (מי מספק לו את הנתונים),
- קובעים את **סדר** ההפעלה (מי מזין את מי),
- מחברים את גבול ה-IO (store / DOM / רשת) — שאסור לו לגעת באטום.

**זה כל ההבדל:** אטום = פונקציה טהורה. קופסה = תוכנית-חיווט של פונקציות טהורות.
"שילוב" אף פעם לא אומר "למזג שני אטומים למנוע אחד" — אלא "לחווט אותם יחד בקופסה".

---

## 1 · מהי "תוכנית-חיווט" — הפורמט

כל קופסה מתחילה מ**טיוטה** (`*.box-draft.md`) שחוללה אוטומטית מגרף-הקריאות של
הקוד-המקור. הליבה שלה היא הכותרת `## תוכנית-החיווט` ואחריה שורת-חוט לכל אטום.
דוגמה אמיתית מ-`lib-nedarimSync.box-draft.md`:

```
· chargeToHist (22ש) ← פנימי: chargeToHist,providerClearer ← שקעים-חיצוניים: curOf
· attachChargeTo (22ש) ← פנימי: attachChargeTo,chargeDedupKey,withNedarimHok,
                                  fillCardFromCharge,chargeToHist ← שקעים-חיצוניים: histDedupKey
· candidateSupportersForCharge (24ש) ← חוטי-מודולים-אחרים: nameSortKey ← שקעים-חיצוניים: keysOf
```

כל שורה מפרקת אטום לשלושה סוגי-תלות — **וזו כל מפת-ההרכבה:**

| סוג-התלות | פירוש | מאיפה מגיע בזמן-ההרכבה |
|---|---|---|
| **פנימי** | אטום-אח באותה קופסה | נכרך (bound) בתוך הקופסה ומוזרק |
| **חוטי-מודולים-אחרים** | אטום שחי בקופסה אחרת (`nameSortKey`, `normPhone`) | **שקע חיצוני** — מסופק בזמן-הצבה, לא יבוא-ישיר |
| **שקעים-חיצוניים** | ספק שאינו אטום (store/config/`curOf`) | גבול ה-IO — מוזרק מלוח-האם |

**מפתח:** גם אטום מקופסה-אחרת (`nameSortKey`) נכנס כ**שקע**, לא כ-import.
זה מה שאוכף **חוק-2**: `boxes/**` שמייבא `boxes/**` ⇒ 🚨 exit 1.

---

## 2 · מנגנון-ההזרקה — איך שקע נהיה ספק-קונקרטי

לאטום יש שקעים (פרמטרים-של-פונקציה). הקופסה **כורכת** אותם. שלוש דרכים:

**(א) שקע ← אטום-אח (bound-then-injected).** האטום המורכב `intelDonorIntel`
מצפה לקבל `rfm`, `churn`, `forecast` מוכנים. הקופסה כורכת אותם *מראש* ומזריקה
את העטיפה:
```js
// בתוך הקופסה (לא באטום!):
const rfm      = (d) => intelRfm(d);            // אטום-אח, נכרך
const churn    = (d) => intelChurn(d, today);   // שקע 'today' כבר סגור
const donorIntel = (d) => intelDonorIntel(d, { rfm, churn, forecast });
```
כך `intelDonorIntel` נשאר טהור — הוא **מקבל** את שכניו, לא **מייבא** אותם.
(זה בדיוק הבאג שתוקן: קופסה-מורכבת מזריקה שכנים-כרוכים, לא שמות-חשופים.)

**(ב) שקע ← גבול-IO.** `cockpitDaysSince` צריך `todayIso`. הוא לא קורא ל-`Date.now()`
(זה יפר דטרמיניזם + חוק-5). הקופסה מזריקה את היום כפרמטר — היום מגיע מגבול-ה-IO
של הקופסה, שנקבע בלוח-האם. **כל ה-state וה-IO חיים בקופסה, לעולם לא באטום** (חוק-6).

**(ג) שקע ← קופסה-אחרת (דרך לוח-האם).** `candidateSupportersForCharge` צריך
`nameSortKey` שחי בקופסת-`lib-validate`. הקופסה **לא מייבאת** את lib-validate.
היא מכריזה עליו כשקע-חיצוני, ולוח-האם מחבר: `nameSortKey` של קופסה-א → שקע של קופסה-ב.

---

## 3 · הדוגמה המלאה — קופסת-ההעצמה (27 אטומים)

זו הקופסה הבאה-לבנייה. כך היא נשלבת בפועל:

### 3.1 · השקעים-החיצוניים — כולם כבר קיימים ✅
הקופסה מקבלת **8 שקעים** מקופסאות שכבה-1, וכולם כבר אטומים-בחוזה:
```
sup-count · sup-last · sup-ils · sup-usd · sup-tier   ← lib-supporterPartition
hok-due · hok-monthly-total                            ← hok-*
org-cal-entries                                        ← lib-org-cal
```
**זה מה שהופך אותה ל"הכי-מוכנה-לבנייה עכשיו":** אין שקע חסר.

### 3.2 · החיווט-הפנימי — מי-מזין-את-מי (סדר-ההצתה)
```
                          ┌─ intel-rfm ───┐
intel-donor-scan  ───────▶┼─ intel-churn ─┼──▶ intel-donor-intel
(בסיס-הכל, ראשון)         ├─ intel-forecast┤
                          └─ intel-trend ──┘──▶ portfolio-* (3) + constellation
                                                    [+ sup-tier משכבה-1]

cockpit-days-since ──▶ cockpit-at-risk ──▶ cockpit-calls / cockpit-kpis / cockpit-queue ──▶ segments-* (2)

commands-* (2): טהורים, אפס-שקע — עצמאיים לגמרי
```
**חוק-הסדר:** בונים מלמטה-למעלה. `intel-donor-scan` נכרך ראשון (אין לו תלות-אח),
ואז הוא מוזרק ל-rfm/churn/forecast/trend, ואלה מוזרקים ל-donor-intel. במקביל,
שרשרת-הקוקפיט: days-since → at-risk → calls/kpis/queue → segments. `commands`
לא תלוי באיש — אפשר לכרוך בכל רגע.

### 3.3 · קוד-החיווט המושגי של הקופסה
```js
// boxes/empowerment.mjs — מייבא אך ורק מ-atoms/ (חוק-2)
import { intelDonorScan } from '../atoms/intel-donor-scan.mjs';
import { cockpitDaysSince } from '../atoms/cockpit-days-since.mjs';
// ... 27 האטומים

export function makeEmpowermentBox(io) {
  // io = גבול ה-IO: { today, supCount, supLast, supIls, supUsd,
  //                   supTier, hokDue, hokMonthlyTotal, orgCalEntries }
  // ↑ כל אלה שקעים-חיצוניים — לוח-האם מזריק אותם, לא הקופסה יוצרת אותם

  // -- שכבה-פנימית 1: בסיסים ללא-תלות-אח --
  const scan   = (sups) => intelDonorScan(sups, io.today);
  const daysSince = (iso) => cockpitDaysSince(iso, io.today);

  // -- שכבה-פנימית 2: נגזרות שמקבלות את הבסיס כרוך --
  const atRisk = (sup) => cockpitAtRisk(sup, { daysSince, hokDue: io.hokDue });
  const rfm    = (sups) => intelRfm(scan(sups));
  // ... churn/forecast/trend באותה צורה

  // -- שכבה-פנימית 3: מורכבים-על --
  const donorIntel = (sups) => intelDonorIntel(scan(sups), { rfm, churn, forecast, trend });
  const calls  = (sups) => cockpitCalls(sups, { atRisk, supIls: io.supIls, supUsd: io.supUsd });
  // ...

  return { donorIntel, calls, kpis, queue, segments, portfolio, constellation, commands };
}
```
שים לב: **אף אטום לא השתנה.** כל ה"שילוב" הוא שורות-כריכה בקופסה. רוצים
פחות יכולת? מוחקים שורת-כריכה. האטום לא יודע ולא נפגע (חוק-2, סיפא).

---

## 4 · איפה חי ה-state — קו-הגבול הקדוש

| שכבה | מה חי שם | דוגמה |
|---|---|---|
| **אטום** | חישוב טהור בלבד | `cockpitDaysSince(iso, today) → number` |
| **קופסה** | כריכת-שכנים + סדר + **קריאה לגבול-IO** | `atRisk = sup => cockpitAtRisk(sup, {daysSince})` |
| **לוח-אם** | ה-store/config/רשת האמיתיים + זהות/סודות | `today = isoToday()`, `supCount = store.supCount` |

**חוק-6 (זהות וסודות):** מיילים, מפתחות, מזהי-ארגון — **לעולם לא אטום**. הם
קונפיגורציית-הצבה שמוזרקת בלוח-האם. המשטרה סורקת PII בקובץ-אטום ⇒ 🚨 אדום.
לכן `today` ו-`store` לא נכנסים לאטום כברירת-מחדל — הם נכנסים דרך `io` בקופסה,
ו-`io` עצמו מורכב בלוח-האם.

---

## 5 · לוח-האם — החיבור הבין-קופסתי היחיד

קופסת-ההעצמה מכריזה על 8 שקעים-חיצוניים. **היא לא יודעת** מי מספק אותם.
לוח-האם (`board.*`, הקובץ היחיד במערכת שמייבא מ-`boxes/`) הוא שמחבר:
```js
// board.mjs
const partition = makePartitionBox(store);
const hok       = makeHokBox(store);
const empower   = makeEmpowermentBox({
  today: isoToday(),
  supCount: partition.supCount,        // ← קופסה-א מזינה קופסה-ב
  hokDue:   hok.hokDue,
  orgCalEntries: orgCal.entries,
  // ...
});
```
זה — ורק זה — המקום שקופסאות נפגשות. **חוק-3.** מחוץ ללוח-האם, קופסה לא
מכירה קופסה אחרת. זה מה שמאפשר "מחק-והעלה-קטלוג-חדש" (מבחן-הקונכייה, חוק-7):
מחליפים קופסה שלמה בלי לגעת בשכנותיה, כי הקשר ביניהן חי במקום אחד מרוכז.

---

## 6 · שערי-הסגירה — מתי קופסה "גמורה"

לפי CLAUDE.md: *"קופסה גמורה רק עם: חוטים + חוזים + בדיקות + מגן-הכרעה + רתמת-זהב."*

| שער | מה נדרש | אוכף |
|---|---|---|
| **חוטים** | כל 27 האטומים כרוכים לפי תוכנית-החיווט | wiring-check (משוואה-4) |
| **חוזים** | לכל אטום `*.contract.md` — קלט/פלט/דוגמאות | contract-check ⇒ אדום בלי חוזה |
| **בדיקות** | `*.test.mjs` שמוכיח את דוגמאות-החוזה; **הבדיקה מייבאת רק את האטום שלה** | contract-check ⇒ אדום על אח-מיובא |
| **מגן-הכרעה** | ratchet לכל באג שתוקן + הגנות-מקור | selftest |
| **רתמת-זהב** | golden שנלכד מהחיווט-האמיתי, נעול byte-for-byte | mutation 722/722 |

הפקודה: `node machtzev/police.mjs --fast` לכל commit (חיווט+חוזה+מחצבה+pins),
ו-`node machtzev/police.mjs` המלא (‏+selftest+mutation) בסוף-גל.

---

## 7 · סדר-ההרכבה בפועל (מה-קודם-למה)

1. **וודא שקעים.** כל 8 השקעים-החיצוניים חייבים להיות אטומים-בחוזה קודם.
   בקופסת-ההעצמה — **כולם כבר קיימים** ✅. (בקופסאות שכבה-1 עוד לא: supporterPartition
   הוא צוואר-הבקבוק — נבנה שני, מיד אחרי היסוד.)
2. **כרוך מלמטה-למעלה.** אטומים-חסרי-תלות-אח (`intel-donor-scan`, `cockpit-days-since`,
   `commands`) ראשונים → נגזרות → מורכבי-על.
3. **חבר את גבול-ה-IO** בקופסה (פרמטר `io`), לא באטומים.
4. **לכוד golden** מהחיווט האמיתי, נעל אותו.
5. **הרץ משטרה מלאה** — 7 שערים ירוקים + mutation.
6. **חבר בלוח-האם** — הזרק את הספקים מקופסאות-השכנות.
7. **חוק-7:** טען-לצד → שער-אימות (זהב-ירוק + אפס-ריק) → היפוך-דגל אחד הפיך.
   הישן נשאר שלם עד שהבעלים מכבה.

---

## 🎯 המסקנה

**"לשלב את קופסת-החיבורים" = לכתוב תוכנית-חיווט, לא למזג קוד.**
כל שילוב הוא שורת-כריכה בקובץ-הקופסה: אטום-אח נכרך-ומוזרק, שקע-חיצוני מוצהר,
ו-state/IO/זהות נשארים מחוץ לאטום — בקופסה (IO) ובלוח-האם (חיבור בין-קופסתי).
קופסת-ההעצמה היא הראשונה-לבנייה כי **כל 8 שקעיה כבר אטומים-בחוזה** — אין מה
לחכות לו. סדר-ההצתה: intel-donor-scan + cockpit-days-since + commands ראשונים,
ומעלה לפי הגרף, עד donor-intel/portfolio/constellation/segments.
