# חוזה · חוט holidays
**תפקיד:** מפת-חגים סטטית של הלוח העברי — מפתח `"<חודש-עברי-Intl> <יום>"`
(שמות-החודשים כפי ש-Intl מחזיר: ‏Tishri/Kislev/Tevet/Shevat/Adar I/Adar/
Adar II/Nisan/Iyar/Sivan/Tamuz/Av/Elul) ⇒ שם-החג בעברית. **בדיוק 33 מפתחות.**
מה **לא** כאן (בכוונה — דינים דינמיים של holidayOf, השכן-הצרכן): ג' טבת
(יום ח' של חנוכה, רק כשכסלו חסר) · דחיות-צומות (שבת⇒ראשון, תענית-אסתר⇒חמישי).
**קלט:** — (קבוע). **פלט:** אובייקט קפוא-תוכן ‏Record<string,string>.
**דוגמאות מחייבות:**
1. ‏HOLIDAYS['Tishri 10'] === 'יום כיפור'.
2. ‏HOLIDAYS['Adar 14'] === 'פורים' וגם ‏HOLIDAYS['Adar II 14'] === 'פורים'
   (שנה פשוטה ומעוברת — אותו חג).
3. חנוכה = 8 רשומות סטטיות: ‏Kislev 25..30 + ‏Tevet 1..2, כולן 'חנוכה'.
4. ‏HOLIDAYS['Tevet 3'] === undefined (מטופל דינמית ב-holidayOf — לא במפה).
5. ‏Object.keys(HOLIDAYS).length === 33.
6. ‏HOLIDAYS['Adar I 14'] === 'פורים קטן' (מעוברת בלבד — אדר א׳).
**מוצא:** maor/src/lib/hebrew.ts:164-204 (הקבוע HOLIDAYS, ביט-זהה).
