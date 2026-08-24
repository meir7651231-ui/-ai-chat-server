# חוזה · חוט site-donate-url
**תפקיד:** קישור-התרומה האפקטיבי לעמוד-השיווק הציבורי — עדיפות ראשונה
‏`site.donateUrl` (רק מחרוזת לא-ריקה), נפילה ל-‏`integrations.payments.payUrl`
(רק מחרוזת לא-ריקה), ואם אין אף אחד — ‏null. טהור, אפס שקעים; לא מאמת
כתובת (החיטוי https-בלבד נעשה בשכבת-הקונפיג, safeHttpsUrl).
**קלט:** ‏config — אובייקט-קונפיג-ארגון (‏site? · integrations? אופציונליים).
**פלט:** מחרוזת-כתובת או ‏null.
**דוגמאות מחייבות:**
1. ‏{site:{donateUrl:'https://pay.me/x'}} ⇒ 'https://pay.me/x' — הישיר גובר.
2. ‏{site:{donateUrl:''}, integrations:{payments:{payUrl:'https://p.io/q'}}} ⇒
   'https://p.io/q' — ריק אינו נחשב, נופלים ל-payUrl.
3. ‏{site:{donateUrl:'https://pay.me/x'}, integrations:{payments:{payUrl:'https://p.io/q'}}}
   ⇒ 'https://pay.me/x' — הישיר מנצח גם כששניהם קיימים.
4. ‏{integrations:{payments:{payUrl:'https://p.io/q'}}} (בלי site) ⇒ 'https://p.io/q'.
5. ‏{} ⇒ null — אין site ואין integrations.
6. ‏{site:{donateUrl:5}, integrations:{payments:{payUrl:7}}} ⇒ null —
   לא-מחרוזת נפסל בשתי התחנות.
7. ‏{integrations:{payments:{}}} ⇒ null — payments בלי payUrl.
**מוצא:** maor/src/lib/publicSite.ts:247-254 (‏siteDonateUrl — "קישור-התרומה
האפקטיבי — site.donateUrl, ואם אין, integrations.payments.payUrl").
