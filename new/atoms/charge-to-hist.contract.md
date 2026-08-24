# חוזה · חוט charge-to-hist
**תפקיד:** בניית רשומת-hist (היסטוריית-תרומות בכרטיס-תומך) מעסקת-סליקה —
‏d/a/c/clearer תמיד; שדות אופציונליים (ref/txn/receipt/last4/kevaId) נכנסים
**רק כשאינם-ריקים** אחרי גזימה. ‏kevaId (חיוב חוזר) נשמר לזיהוי-הו"ק מדויק בעתיד.
טהור — הקלט לא משתנה.
**שקעים (חוק-1 — קריאות-השכנים הוזרקו כפרמטרים):**
- ‏curOf(charge) ⇒ ‏'₪' | '$' — מטבע מנורמל מהעסקה (במקור: תומך '₪'/'$' וגם
  קידוד-נדרים '1'/'2').
- ‏providerClearer(provider?) ⇒ תווית-הסליקה (במקור: ‏/sola/i ⇒ 'סולה', אחרת 'נדרים').
**קלט:** charge — ‏{d?, at?, amount, currency?, provider?, reference?, txnId?,
receipt?, last4?, kevaId?} · שני השקעים.
**פלט:** רשומת-hist — ‏{d, a, c, clearer, ref?, txn?, receipt?, last4?, kevaId?}.
**דוגמאות מחייבות (בבדיקה שקעים-מיני כמתועד: curOf ⇒ '$' כש-currency==='$', אחרת '₪' ·
providerClearer ⇒ 'סולה' ל-/sola/i, אחרת 'נדרים'):**
1. עסקה מלאה ‏{d:'2026-08-01', amount:180, currency:'₪', reference:'R1', txnId:'T1',
   receipt:'K5', last4:'1234', kevaId:'KV7'} ⇒
   ‏{d:'2026-08-01', a:180, c:'₪', clearer:'נדרים', ref:'R1', txn:'T1',
   receipt:'K5', last4:'1234', kevaId:'KV7'}.
2. ‏d חסר ⇒ נגזר מ-at: ‏{at:'2026-08-24T10:30:00', amount:50} ⇒ ‏d==='2026-08-24'.
3. עסקה מינימלית ‏{amount:50, currency:'$'} ⇒ ‏{d:'', a:50, c:'$', clearer:'נדרים'}
   בדיוק — **אפס מפתחות אופציונליים** (גם לא כערך ריק).
4. ‏provider:'Sola' ⇒ ‏clearer==='סולה' (דרך השקע).
5. שדה רווחים-בלבד ‏{reference:'   ', txnId:' T2 '} ⇒ ‏ref נעדר, ‏txn==='T2' (גזום).
6. ‏d קודם ל-at: ‏{d:'2026-01-05', at:'2026-08-24T10:30:00', amount:1} ⇒ ‏d==='2026-01-05'.
**מוצא:** maor/src/lib/nedarimSync.ts:124-145 (‏chargeToHist). חולץ כלשונו; השכנים
‏curOf/providerClearer הוזרקו כשקעים (חוק-1 — אפס import פנימי).
