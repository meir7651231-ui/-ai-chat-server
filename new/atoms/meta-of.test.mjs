import { metaOf } from './meta-of.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };
const META_KEYS = [
  'orgName', 'orgSite', 'orgDonate', 'orgGoal', 'budget', 'usdRate', 'audit',
  'notif', 'reports', 'ui', 'seq', 'receiptSeq', 'donationSeq', 'shopReceiptSeq',
  'attnDone', 'savedAt',
];
const db = {
  v: 6,
  orgName: 'מאור', orgSite: 'https://x', orgDonate: '', orgGoal: 100000,
  budget: 5000, usdRate: 3.7, audit: [{ t: '2026-08-24', a: 'add' }],
  notif: {}, reports: {}, ui: { theme: 'dark' },
  seq: 42, receiptSeq: 7, donationSeq: 3, shopReceiptSeq: 1,
  attnDone: {}, savedAt: '2026-08-24T10:00:00',
  supporters: [{ id: 's1' }], families: [{ id: 'f1' }], courses: [], events: [],
};

// דוגמה 1 — ערכי-meta עוברים, ישויות לא
{
  const out = metaOf(db);
  chk('1 orgName', out.orgName === 'מאור');
  chk('1 מונים', out.seq === 42 && out.receiptSeq === 7 && out.donationSeq === 3 && out.shopReceiptSeq === 1);
  chk('1 usdRate/savedAt', out.usdRate === 3.7 && out.savedAt === '2026-08-24T10:00:00');
  chk('1 בלי-ישויות', !('supporters' in out) && !('families' in out) && !('courses' in out));
}
// דוגמה 2 — בדיוק 16 המפתחות, בסדר החוזה
{
  const out = metaOf(db);
  chk('2 סט-מפתחות', JSON.stringify(Object.keys(out)) === JSON.stringify(META_KEYS));
}
// דוגמה 3 — v לא עובר
{
  chk('3 בלי-v', !('v' in metaOf(db)));
}
// דוגמה 4 — שדה חסר ⇒ מפתח קיים עם undefined
{
  const { budget, ...noBudget } = db;
  const out = metaOf(noBudget);
  chk('4 מפתח-קיים', 'budget' in out && out.budget === undefined);
}
// דוגמה 5 — עומק בהפניה (הטלה, לא העתקה)
{
  const out = metaOf(db);
  chk('5 ui-בהפניה', out.ui === db.ui && out.audit === db.audit);
}
if (f) process.exit(1);
console.log('✓ meta-of: 5 דוגמאות-חוזה — ירוק');
