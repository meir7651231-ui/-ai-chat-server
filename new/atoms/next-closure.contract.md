# חוזה · חוט next-closure
**תפקיד:** הסגירה ההלכתית הבאה (שבת/יו״ט) בחלון 10 הימים הקרובים — לווידג'ט-הבית
"זמני שבת/חג": הדלקת-נרות, צאת, סיבה ועיר-העוגן בעברית. בלי `config.telephony`
⇒ null (אין נ״צ — השקע לא נקרא כלל). אין חלון בטווח ⇒ null.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏hebrewClosedWindows(fromIso, windowDays, tenant, opt) ⇒ מערך חלונות
  `{startIso,startTime,endIso,endTime,reason,kind,days}` — מנוע-הזמנים הטהור
  (NOAA, חישוב-מקומי). האטום קורא לו פעם-אחת בדיוק:
  `(todayIso, 10, {city, timezone:'Asia/Jerusalem'}, {})` כאשר
  `city = config.telephony.city || 'default'`.
- ‏CITIES — מילון עיר⇒`{he,…}` (שם-עברי). עיר לא-מוכרת/חסרה ⇒ נפילה
  ל-`CITIES.jerusalem.he`.
**קלט:** config (קונפיג-ארגון, `config.telephony.city`) · todayIso (עוגן-היום) ·
שני השקעים. **פלט:** `{reason,kind,startIso,candle,endIso,tzeis,cityHe}` או null.
**דוגמאות מחייבות** (שקע-דמה שמחזיר חלון קבוע; CITIES כבמקור —
jerusalem⇒'ירושלים', telaviv⇒'תל אביב'):
1. ‏config={} (בלי telephony) ⇒ null, והשקע **לא נקרא**.
2. ‏config={telephony:{city:'telaviv'}}, השקע מחזיר
   ‏[{reason:'שבת',kind:'shabbat',startIso:'2026-08-28',startTime:'18:42',endIso:'2026-08-29',endTime:'19:53',days:1}]
   ⇒ ‏{reason:'שבת',kind:'shabbat',startIso:'2026-08-28',candle:'18:42',endIso:'2026-08-29',tzeis:'19:53',cityHe:'תל אביב'}
   ‏(startTime⇒candle · endTime⇒tzeis · days לא מועתק).
3. השקע מחזיר [] ⇒ null.
4. ‏telephony:{} בלי city ⇒ השקע נקרא עם tenant.city='default' ו-cityHe='ירושלים'.
5. ‏telephony:{city:'nowhere'} (לא ב-CITIES) ⇒ tenant.city='nowhere',
   ‏cityHe='ירושלים' (נפילת-ירושלים).
6. אימות-קריאה: בדוגמה 2 השקע נקרא בדיוק עם
   ‏('2026-08-24', 10, {city:'telaviv',timezone:'Asia/Jerusalem'}, {}).
**מוצא:** maor/src/components/telephony/lib.ts:186-198 (‏nextClosure). השכנים
hebrewClosedWindows + CITIES (מ-lib/telephony/engine, במקורם telephony/lib/zmanim.mjs)
הפכו לשקעים (חוק-1).
