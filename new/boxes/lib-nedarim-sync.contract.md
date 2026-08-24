# חוזה · קופסת-חיבורים "lib-nedarim-sync"
**מקור-האמת:** `maor-system/src/lib/nedarimSync.ts` (694 שורות). כל טענה למטה נעגנת בשורה.
**תפקיד:** מנוע-הסנכרון נדרים→מאור (כיוון-נכנס) — מתאים כל תורם/עסקה לכרטיס-התומך
הנכון לפי מפתחות-שיוך (ext→id→ph→em→שם+עיר), רושם עסקאות ל-`hist[]` (לא קבלות-§46),
ומזהה/ממלא הו״ק. **טהור** — אין DOM/localStorage/fetch/ענן; אפס Date.now (ה"היום" מוזרק).

**חיווט:** הקופסה מייבאת 15 אטומים מ-`new/atoms` ומזריקה להם את השקעים. עוזרי-glue
module-private במקור (curOf · keysOf · histDedupKey · hokDayFromDate · monthsAgo ·
modeOf · modeStr · supFromDonor · supFromCharge) חיים בקופסה כהכרעות-חיווט
(nedarimSync.ts:88-231,471-531). מילון-התוויות `NAME_TITLES` (validate.ts:73-80) הוא
ידע-קופסה (חוק-5), מוזרק ל-`name-sort-key`. `nameSortKey(t)=_nameSortKey(t, normSearch, NAME_TITLES)`.

## חשיפה (ה-API הפומבי — ביט-זהה לחתימות המקור)
`CLEARING_PROVIDERS` · `providerClearer(provider)` · `chargeToHist(charge)` ·
`chargeDedupKey(charge)` · `withNedarimHok(sp, charge)` · `detectRecurringHok(supporters, todayIso, minMonths=3)` ·
`candidateSupportersForCharge(charge, supporters, limit=8)` · `fillCardFromCharge(sp, charge)` ·
`attachChargeTo(supporters, supId, charge)` · `relabelHistByTxn(supporters, txns, label)` ·
`repairCardsFromRows(supporters, rows, label)` · `strongMatchForCharge(charge, supporters)` ·
`autoMatchCharges(charges, supporters)` · `attachChargesBulk(supporters, items)` ·
`planNedarimSync(existing, donors, charges, opts={attachOnly?})`.

## הכרעות מחייבות (verbatim מהמקור — מגן-ההכרעה קורא את מקור-הקופסה)
- **סדר מפתחות-השיוך** ext→id→ph→em→nc (nedarimSync.ts:88-104): ext:5 > id:4 > ph:3 > em:2 > שם:1.
- **תווית-סליקה** (provider-clearer, ts:119-121): `/sola/i` ⇒ 'סולה'; חסר-ספק ⇒ 'נדרים'.
- **`CLEARING_PROVIDERS`** = `['נדרים','סולה']` (ts:113).
- **מטבע** (curOf, ts:107-110): `$`/`2`/usd/$/דולר ⇒ '$'; אחרת '₪'.
- **דדופ-עסקה** (charge-dedup-key, ts:146-151): `txn:`<txnId> ראשון, נפילה `ref:`<reference>, ריק ⇒ ''.
- **מזהה-כרטיס דטרמיניסטי** (ts:479,506-510): `sup-ned-<toremId>`; אנונימי ⇒ `sup-ned-unassigned`; אחרת `sup-ned-txn-<txn|seq>`.
- **הרחבה-בלבד:** מילוי-אם-ריק, לעולם לא דורס שדה מלא (fill-card-from-charge ts:303-317; שלב-ההעשרה ts:606-622).
- **פאזה-מודעת-כסף** (plan ts:646-690): Amount 0 ⇒ chargesNonPositive+handled, לא ל-hist · Amount<0 ⇒ refund (שורת-hist שלילית, בלי הו״ק/recurring) · Amount>0 ⇒ chargesAdded (+מילוי-הו״ק).
- **דדופ-גלובלי C2** (attach-charge-to ts:331, attach-charges-bulk ts:454-455): מפתח שכבר על כרטיס כלשהו לא נרשם שוב באף כרטיס.
- **מגן-ביטול C10** (ts:326,460): amount=0 ⇒ added:false / skip.
- **attachOnly** (plan ts:653,657): שם-בלבד וללא-כרטיס ⇒ נשאר pending (chargesSkipped), לא יוצר כרטיס.
- **detectRecurringHok** (ts:236-271): הו״ק ידני (בלי kevaId) לא נדרס; kevaId ⇒ ודאי; אחרת ≥minMonths חודשים שונים; active=חויב ≤2 חודשים.

## דוגמאות מספריות (הבדיקה מוכיחה אותן דרך הקופסה בלבד)
1. `providerClearer('sola')` ⇒ `'סולה'` · `providerClearer('')` ⇒ `'נדרים'`.
2. `chargeDedupKey({txnId:'T1'})` ⇒ `'txn:T1'` · `chargeDedupKey({reference:'R1'})` ⇒ `'ref:R1'` · `chargeDedupKey({})` ⇒ `''`.
3. `chargeToHist({amount:50,currency:'2',d:'2026-03-05',txnId:'T7',provider:'sola'})` ⇒ `{d:'2026-03-05',a:50,c:'$',clearer:'סולה',txn:'T7'}`.
4. `planNedarimSync([], [{toremId:'55',name:'רחל בן צבי'}], [{amount:100,toremId:'55',txnId:'X1',d:'2026-01-10',id:'c1'}])`
   ⇒ newSupporters:1, chargesAdded:1, ilsAdded:100, supporters[0].id==='sup-ned-55', hist[0].a===100, handledChargeIds==['c1'].
5. שם חסין-סדר: תורם "בן צבי רחל" מתחבר לכרטיס קיים "רחל בן צבי" (findByName) ⇒ updatedSupporters, לא כפול.
6. ביטול `amount:0` ⇒ chargesNonPositive:1, לא ל-hist; זיכוי `amount:-30` על כרטיס-תואם ⇒ refundsApplied:1, ilsAdded:-30.
7. `attachChargesBulk` על אותה עסקה (אותו txn) לשני supId ⇒ added:1 (דדופ-גלובלי C2).

**DoD:** `node new/boxes/lib-nedarim-sync.test.mjs` ⇒ exit 0 (כל הדוגמאות ירוקות + מגן-הכרעה) ·
`node maor-system/machtzev/parity/lib-nedarim-sync.parity.mjs` ⇒ exit 0 (ישן≡חדש, אפס-סטייה).
