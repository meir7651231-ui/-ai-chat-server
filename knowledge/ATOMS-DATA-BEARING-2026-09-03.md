# אטומי-תצוגה: נושאי-ערך מול מזייפים (מגן-"בלי-סטיות", 3.9.2026)

> **הכרעת-בעלים 3.9 "בנה הכל מחדש, בלי סטיות".** תנאי-קדם: לדעת אילו אטומים נושאי-ערך-אמת
> ואילו **מזייפים** (מציגים מספר מ-`math.*`/`AnimationController`, לא מדאטה). חיווט-מזייף = §20-ג = סטיה.

## 🔴 כלל-הזיהוי (קרא build() לפני כל חיווט — VERIFY-LAWS)
אטום **מזייף** אם המספר/הערך שמוצג נגזר מ:
- `math.sin/cos/Random/pi` (ערך-דמו מחזורי) — למשל `Text('${(math.sin(i)*40+60).round()}')`.
- `AnimationController` שמניע את הערך-המוצג (`_c.value * 100`) בלי קלט-דאטה.
- **אין שקע-דאטה בכלל** (רק גובה/רדיוס/צבעים) — אין מה להזין ⇒ הוא ממציא/מנפיש.

## 🔴 מזייפים מאומתים (אל תחווט לערך-אמת)
| אטום | הזיוף |
|---|---|
| `stat_block` | `Text('${(math.sin(i*1.7)*40+60).round()}')` — מקבל `labels` בלבד, ממציא ערכים |
| `linear_progress` | `AnimationController repeat` → `${(v*100).round()}%` — אין קלט-ערך, מנפיש 0→100 |
| `radial_gauge` | מחוג מ-math/אנימציה, לא מערך-מוזרק |
> ⚠️ הרשימה חלקית — **תמיד לקרוא build()**. שם-מרשים ("מדד"/"התקדמות"/"מד") ≠ נושא-ערך.

## 🟢 נושאי-ערך-אמת מאומתים (הפלטה לרביבלד)
מקבלים דאטה כשקע-חובה (`value/values/label(s)/count/fraction/delta/title/subtitle/message`):
- **מספר/ערך:** `BareStat`(value·label·inkColor) · `KpiTile`(glyph·value·label) · `stat_hero`(value·label ענק) ·
  `count_up`(מטפס לערך-אמת) · `premium_stat`(value·unit·delta·trend·glyph)
- **כסף/מחיר:** `price_ticker` · `pricing_card` · `product_card`
- **פס/יחס:** `StatRow`(label·value·fraction) · `progress_ring`/`premium_ring`(value) · `gauge_meter`(value) ·
  `NeonBars`(labels·values) · `rating_bars`
- **שבב/תג/מצב:** `StatusChip`(label·tone) · `badge_pill` · `badge_count`(count) · `premium_chip`(label·count) ·
  `AlertBanner`(message·tone·glyph) · `live_status_dot`
- **שורה/כרטיס/כותרת:** `MediaRow` · `nav_row` · `glass_list_tile` · `hero_header` · `feature_panel` ·
  `avatar_tile` · `expandable_tile` · `SoftButton`/`gold_button`/`grad_button` · `GradientCard`/`glass_card` ·
  `DsSection`(title·tone) · `DsScaffold`
- **טבלה/רשימה:** `pure_table_row` · `data_grid`(?—בדוק) · `donut_chart`(values) · `trend_stat`(value·delta·label)

## המשמעות לרביבלד (הכרעה 23-ג)
לכל חלקיק-תובנה: (1) פרק לפעולות-הצגה · (2) סרוק את הפלטה-האמיתית בלבד · (3) בחר הכי-טוב-לייעוד
לכל פעולה · (4) חווט ליכולת-אחת · (5) **רנדר** לאמת. אטום-מזייף בהצעה = לחזור לקרוא build().
תקדים: "עלות" — הצעתי stat_hero⊕stat_block⊕linear_progress; 2/3 מזייפים; היכולת נבנתה מ-BareStat×3 בלבד.
