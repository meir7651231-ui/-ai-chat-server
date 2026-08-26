# 🧱 תוכנית-בנייה לקופסאות — מה מתחיל להשתלב עם מה (26.8.2026)

**המצב:** 62 טיוטות-קופסה · 46 מוכנות · 0 חורי-כיסוי. dialer+nedarim כבר קופסאות.
27 האטומים-החדשים (cockpit·intel·segments·portfolio·commands·constellation) **עדיין לא בקופסה** —
זו הקופסה החדשה שהתוכנית פותחת: **שכבת-ההעצמה** (הקוקפיט).

**עקרון-הבנייה:** קופסה נבנית **רק אחרי** שכל שקעיה קיימים-בחוזה (בנייה מלמטה-למעלה לפי גרף-התלות).
"מה מתחיל להשתלב עם מה" = סדר-ההצתה הבא.

---

## 🔻 גרף-התלות (7 שכבות — הצתה מלמטה-למעלה)

### שכבה 0 · היסוד — כולם מתחברים לכאן (מתחילים מכאן!)
`lib-validate` (normSearch · nameSortKey) · `lib-dedup` (normId · normPhone) ·
`lib-config` (termOf · moduleOn · featureOn) · `lib-hebdate`+`lib-hebrew` · date/number-utils.
- **⚙️ כאן קורה איחוד-הליבה-האימפריאלית:** normPhone (על-קבוצה של normalizePhone — מוכח 7/9 + מתקן 2) · norm-search (JS≡Dart) ⇒ אטום-משותף אחד.
- **למה מתחילים כאן:** כל קופסה אחרת מזריקה מ-כאן. בלי זה — כלום לא נסגר.

### שכבה 1 · ליבות-דומיין — מזריקות מ-שכבה 0
`lib-supporterPartition` ⇒ **מספק את sup-count · sup-last · sup-ils · sup-usd · sup-tier** (הצבירות).
`hok-*` (hok-due · hok-monthly-total · hok-cat · hok-effectively-active) · `org-cal-entries` ·
`lib-nedarimSync` (charge→hist · auto-match — מזריק dedup/validate) · `lib-dialer` · `lib-receipt` · `lib-pricing`.
- **קריטי:** supporterPartition הוא **צוואר-הבקבוק** — גם שכבת-ההעצמה וגם components-supporters תלויים בו. **נבנה שני.**

### שכבה 2 · 🆕 קופסת-ההעצמה (הקוקפיט) — 27 האטומים-החדשים
**זו הקופסה החדשה. חיווט-פנימי (מי-מזין-את-מי):**
```
sup-count/last/ils/usd (שכבה 1) ─┐
hok-due/monthly-total (שכבה 1) ──┼─▶ cockpit-* (12): kpis←collected+atRisk+hokMonthly
org-cal-entries (שכבה 1) ────────┘                queue←calls+thanks+hok-tasks
                                                   calls←atRisk+valueTag(supIls/usd)
intel-donor-scan (טהור) ─▶ intel-rfm/churn/forecast/trend ─▶ intel-donor-intel
                        └─▶ portfolio-* (3) + constellation (1)   [+ sup-tier משכבה 1]
cockpit-atRisk ─▶ segments-* (2)          commands-* (2): טהורים, אפס-שקע
```
- **סדר-פנימי:** intel-donor-scan ראשון (בסיס-הכל) → rfm/churn/forecast/trend → donor-intel · portfolio · constellation.
  במקביל: cockpit-days-since → cockpit-at-risk → cockpit-calls/kpis/queue → segments. commands עצמאי.
- **שקעים חיצוניים שהקופסה מקבלת:** 8 מ-שכבה 1 (sup-*/hok-*/org-cal) — **כולם כבר אטומים ✅**.

### שכבה 3 · קופסאות-הרכיב (עמודות-הפיצ'ר)
`components-supporters` **סופג את קופסת-ההעצמה** + partition + hok + nedarim + dialer ⇒ עמודת-התורמים המלאה.
במקביל (בלתי-תלויים): `components-families` · `components-courses` · `components-diary` ·
`components-shop`/`shop7` · `components-tzedaka` · `components-reports` · `components-platform`.

### שכבה 4 · אינטגרציות-חוצות
`lib-wa`/`maps`/`ics`/`ai`/`payLink` · `lib-cloud*` (sync/diff/merge/crypto) · `lib-audit` · `lib-annualReport`.

### שכבה 5 · מסכים (מניפסטים) · שכבה 6 · רתמת-זהב מלאה ⇒ cutover (חוק-7)

---

## 🚀 סדר-ההצתה המומלץ (מה-מתחיל-עם-מה, פר-גל)
1. **גל-0 (היסוד + איחוד-ליבה):** לסגור שכבה 0 כקופסאות + לבצע את מיזוגי-הליבה-האימפריאלית (normPhone/norm-search) עם הוכחת-golden אפס-אובדן. **בלי זה כלום לא נסגר.**
2. **גל-1 (supporterPartition):** צוואר-הבקבוק — נבנה מיד אחרי היסוד.
3. **גל-2 (קופסת-ההעצמה 🆕):** 27 האטומים — כל השקעים כבר קיימים, אז זו הקופסה **הכי-מוכנה-לבנייה עכשיו**. חיווט-פנימי לפי הגרף למעלה + מגן-הכרעה + רתמת-זהב.
4. **גל-3 (components-supporters):** סופג את ההעצמה. שאר עמודות-הרכיב במקביל.
5. **גל-4→6:** אינטגרציות → מסכים → cutover.

## 🎯 המסקנה
**מתחילים מ-שכבה 0 (היסוד), אבל הקופסה הראשונה בעלת-הערך שנסגרת היא קופסת-ההעצמה** —
כי כל 8 שקעיה כבר אטומים-בחוזה, והיא מלכדת את 27 החדשים לפיצ'ר-שלם (חלון-העבודה של התורמים).
