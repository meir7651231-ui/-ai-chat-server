# חוזה · make-normalize-site (חוט-מפעל)
**מהות:** מחטא תוכן-האתר-הציבורי — allowlist מלא + תקרות-אורך + https-בלבד; שדה-זר נזרק.
**מוצא:** ‏maor/src/lib/config.ts:216-512 (עוזרים פרטיים נכללו; safeHttpsUrl+SITE_LANGS שקעים).

## קלט/פלט
`makeNormalizeSite(safeHttpsUrl, SITE_LANGS)` ⇒ `normalizeSite(raw)` ⇒ PublicSiteContent|undefined.

## ערבויות (ratchet)
1. חסר / לא-אובייקט / מערך ⇒ undefined (אין אתר-ציבורי — ביט-זהה להיום).
2. **https-בלבד:** donateUrl/gallery/mapUrl/heroImage/tiers.url עוברים דרך שקע-safeHttpsUrl —
   javascript:/http: לעולם לא שורדים.
3. טקסטים: ניקוי תווי-בקרה (Unicode Cc) + trim + תקרת-אורך פר-שדה; רב-לשוני רק שפות-allowlist.
4. אובייקט-משנה ריק (אחרי חיטוי) לא נכתב כלל — אין {} ריקים בפלט.
5. תקרות-כמות: heroWords<=8 · stats<=8 · services<=12 · gallery<=24 · marquee<=16 · tiers<=6 ·
   testimonials<=12 · faq<=20 · events<=12 · partners<=24 · badges<=6 · phones<=8.
6. טלפונים: תווי-חיוג בלבד, עד 24; מייל חייב '@'.
