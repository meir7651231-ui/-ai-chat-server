# חוזה · חוט push-donations
**תפקיד:** דחיפת diff של אוסף-התרומות-הנפרד (מסלול-B) לענן בכתיבות-אצווה —
עד **400 פעולות ל-batch** (מגבלת Firestore: 500). גוף-המסמך =
‏{pkey, supporterId, ...donation}; ‏id = rid. ‏dek קיים ⇒ התוכן מוצפן, אך
**pkey נשאר plaintext מחוץ למעטפה** — כדי ש-where-pkey-in + ‏Rules יעבדו גם
בארגון-מוצפן. ‏dek נעדר ⇒ נתיב plaintext ביט-זהה.
**שקעים (חוק-1 — קריאות-החוץ הוזרקו כפרמטרים):**
- ‏db — מסד-הענן (במקור: ‏requireDb()).
- ‏scopedDonations() ⇒ string — נתיב אוסף-התרומות הסקופי-לארגון.
- ‏fs — ערכת-Firestore: ‏{ doc, writeBatch } — ‏writeBatch(db) ⇒ batch עם
  ‏set(ref,body) / delete(ref) / commit() אסינכרוני.
- ‏encryptDoc(payload, dek) ⇒ ‏Promise<מעטפה> — נקרא רק כש-dek קיים.
**קלט:** ‏diff = ‏{sets:[{id, supporterId, pkey, donation}], deletes:[id]} ·
‏dek (CryptoKey|null) · השקעים. **פלט:** ‏Promise<void>.
**דוגמאות מחייבות** (בכולן ‏fs מזויף שמתעד):
1. ‏set יחיד ‏{id:'R-7', supporterId:'sp1', pkey:'P1', donation:{amount:180, date:'2026-01-05'}},
   ‏dek=null, ‏scopedDonations=()=>'orgs/demo/donations' ⇒ ‏batch יחיד, commit אחד;
   ‏doc נקרא עם ‏(db,'orgs/demo/donations','R-7'); הגוף שנכתב =
   ‏{pkey:'P1', supporterId:'sp1', amount:180, date:'2026-01-05'} — ‏pkey ראשון.
2. ‏deletes=['R-9'] ⇒ ‏batch.delete על הפניית ‏doc(db, scopedDonations(), 'R-9').
3. הצפנה: ‏dek='DEK', ‏encryptDoc=(p)=>({enc:JSON.stringify(p), iv:'IV'}) ⇒
   ‏encryptDoc נקרא עם ‏({supporterId:'sp1', amount:180, date:'2026-01-05'}, 'DEK')
   — **בלי pkey** — והגוף שנכתב = ‏{pkey:'P1', enc:…, iv:'IV'} (pkey מחוץ למעטפה).
4. חיתוך-אצווה: 401 sets ⇒ שני batches — הראשון 400 פעולות, השני 1; שני commits,
   וה-commit הראשון קודם לפעולות ה-batch השני.
5. ‏diff ריק (‏sets=[], deletes=[]) ⇒ אפס batches, אפס commits.
**מוצא:** maor/src/lib/cloud.ts:175-200 (‏pushDonations — מסלול-B, פיצול-תרומות).
חולץ כלשונו; ‏requireDb/scopedDonations/doc/writeBatch/encryptDoc הפכו לשקעים (חוק-1).
