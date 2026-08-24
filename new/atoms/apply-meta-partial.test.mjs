import { applyMetaPartial } from './apply-meta-partial.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) הענן-מנצח + immutability
let db = { orgName: 'א', seq: 5 };
let out = applyMetaPartial(db, { orgName: 'ב' });
ok(out.orgName === 'ב' && out.seq === 5, 'orgName לא עודכן מהענן');
ok(out !== db && db.orgName === 'א', 'ה-db הנכנס שוכתב');

// 2) undefined מדולג, שדה מוגדר נכתב
out = applyMetaPartial({ orgName: 'א', usdRate: 3.5, seq: 0 }, { orgName: undefined, usdRate: 3.7 });
ok(out.orgName === 'א' && out.usdRate === 3.7, 'undefined לא דולג / usdRate לא עודכן');

// 3) מונה יורד ⇒ no-op (אותה רפרנס)
db = { seq: 10 };
ok(applyMetaPartial(db, { seq: 7 }) === db, 'מונה ירד — אסור');

// 4) כל מונה נשפט לעצמו
out = applyMetaPartial({ seq: 10, receiptSeq: 3 }, { seq: 12, receiptSeq: 2 });
ok(out.seq === 12 && out.receiptSeq === 3, 'המונים לא נשפטו כל-אחד לעצמו');

// 5) מונה לא-מספרי / אינסופי ⇒ מדולג
db = { donationSeq: 4 };
ok(applyMetaPartial(db, { donationSeq: '99' }) === db, "מחרוזת '99' טיפסה על מונה");
ok(applyMetaPartial(db, { donationSeq: Infinity }) === db, 'Infinity טיפס על מונה');

// 6) שוויון-עמוק ⇒ אותה רפרנס
db = { ui: { a: 1 }, seq: 0 };
ok(applyMetaPartial(db, { ui: { a: 1 } }) === db, 'ערך שווה-ערך נחשב שינוי');

// 7) meta ריק ⇒ אותה רפרנס
db = { orgName: 'א', seq: 1 };
ok(applyMetaPartial(db, {}) === db, 'meta ריק החזיר db חדש');

if (f) process.exit(1);
console.log('✓ apply-meta-partial: 7 דוגמאות-חוזה — ירוק');
