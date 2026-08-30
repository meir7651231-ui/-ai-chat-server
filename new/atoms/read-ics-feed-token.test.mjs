import { readIcsFeedToken as __pure_readIcsFeedToken } from './read-ics-feed-token.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_read_ics_feed_token_T = {
  k1: "icsFeeds",
  k2: "string",
};
const readIcsFeedToken = (...a) => __pure_readIcsFeedToken(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_read_ics_feed_token_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const db = { __db: true };
const ref = { __ref: true };
const mkFs = (snap) => {
  const docCalls = [];
  const getCalls = [];
  return {
    docCalls, getCalls,
    fs: {
      db,
      doc: (...args) => { docCalls.push(args); return ref; },
      getDoc: async (r) => { getCalls.push(r); return snap; },
    },
  };
};

// 1) עדות-נתיב
const m1 = mkFs({ exists: () => false, data: () => null });
await readIcsFeedToken('kehila', m1.fs);
chk("1 ‏doc(db,'icsFeeds','kehila') פעם אחת + getDoc עם ההפניה",
  m1.docCalls.length === 1 && m1.docCalls[0][0] === db &&
  JSON.stringify(m1.docCalls[0].slice(1)) === JSON.stringify(['icsFeeds', 'kehila']) &&
  m1.getCalls.length === 1 && m1.getCalls[0] === ref);

// 2) מסמך לא קיים ⇒ null
chk('2 לא-קיים ⇒ null',
  (await readIcsFeedToken('s', mkFs({ exists: () => false, data: () => ({ token: 'x' }) }).fs)) === null);

// 3) token תקין ⇒ מוחזר
chk("3 ‏token 'a1b2c3d4' מוחזר",
  (await readIcsFeedToken('s', mkFs({ exists: () => true, data: () => ({ token: 'a1b2c3d4', ics: 'BEGIN:VCALENDAR…' }) }).fs)) === 'a1b2c3d4');

// 4) token ריק ⇒ null
chk('4 ‏token ריק ⇒ null',
  (await readIcsFeedToken('s', mkFs({ exists: () => true, data: () => ({ token: '' }) }).fs)) === null);

// 5) token לא-מחרוזת ⇒ null
chk('5 ‏token=42 ⇒ null',
  (await readIcsFeedToken('s', mkFs({ exists: () => true, data: () => ({ token: 42 }) }).fs)) === null);

// 6) getDoc נדחה ⇒ מבעבע
let e6 = '';
try {
  await readIcsFeedToken('s', { db, doc: () => ref, getDoc: async () => { throw new Error('permission-denied'); } });
} catch (e) { e6 = e.message; }
chk('6 שגיאת-ענן מבעבעת', e6 === 'permission-denied');

if (f) process.exit(1);
console.log('✓ read-ics-feed-token: 6 דוגמאות-חוזה (שקעי-fs + ולידציית-token) — ירוק');
