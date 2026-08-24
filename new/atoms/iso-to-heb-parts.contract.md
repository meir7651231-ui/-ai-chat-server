# חוזה · חוט iso-to-heb-parts
**תפקיד:** לועזי→עברי: מחרוזת-ISO ‏YYYY-MM-DD ⇒ ‏{day, monthHe, year} עברי,
או ‏null בכל כשל. הצינור: ולידציית-תבנית (regex ‏\d{4}-\d{2}-\d{2}) ⇒ פרסור
בצהריים-מקומי (‏+'T12:00:00' — מוסכמת-maor, חסין הזחת-UTC ושעון-קיץ) ⇒
שקע-hebParts ⇒ שקע-monthHeOf ⇒ בדיקת-שלמות (חודש-לא-מוכר / day=0 / year=0 ⇒ null).
⚠️ ‏Date של JS מגליש תאריך-עודף ('2026-02-30'→2 במרץ) — האטום **לא** מגן על
זה (כלשון-המקור); הוא מחזיר את החלקים העבריים של היום המוגלש.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏hebParts(d:Date) ⇒ ‏{day:number, month:string, year:number} — חלקי-התאריך
  העברי דרך ‏Intl ‏('en-u-ca-hebrew', ‏month:'long' — 'Av','Tishri'…);
  תאריך-לא-חוקי ⇒ ‏{day:0, month:'', year:0}.
- ‏monthHeOf(en:string) ⇒ תווית עברית ('Av'→'אב'), או '' אם לא-מוכר.
**קלט:** iso (מחרוזת) · השקעים hebParts, monthHeOf. **פלט:** ‏{day, monthHe, year} | null.
**דוגמאות מחייבות (עם שקעים אמיתיים על Intl, אומתו ב-node):**
‏'2026-08-06'→{day:23, monthHe:'אב', year:5786} ·
‏'2026-09-12'→{day:1, monthHe:'תשרי', year:5787} (ראש-השנה) ·
‏'2025-03-14'→{day:14, monthHe:'אדר', year:5785} ·
‏'שטויות'→null (תבנית) · ‏'2026-8-6'→null (בלי ריפוד — נכשל ב-regex) ·
‏'9999-99-99'→null (עובר-regex אך ‏Date לא-חוקי) ·
חודש שהשקע לא מכיר (‏monthHeOf⇒'') ⇒ null
**מוצא:** maor/src/lib/hebdate.ts:107-116 (‏isoToHebParts — "לועזי→עברי").
השכנים hebParts (‏hebrew.ts) ו-monthHeOf הפכו לשקעים (חוק-1).
