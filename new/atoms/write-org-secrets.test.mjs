import { writeOrgSecrets as __pure_writeOrgSecrets } from './write-org-secrets.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_write_org_secrets_T = {
  k1: "orgSecrets",
  k2: "orgSecretsMeta",
};
const writeOrgSecrets = (...a) => __pure_writeOrgSecrets(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_write_org_secrets_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const KEYS = ['yemotToken', 'nedarimMosad', 'nedarimApiPass', 'smsApiKey', 'smtpUrl', 'solaXKey'];
const db = { __db: true };
const delSentinel = { __deleteField: true };

function mkFs() {
  const docCalls = [];
  const setCalls = [];
  const fs = {
    db,
    doc: (...args) => { docCalls.push(args); return { __ref: args.slice(1).join('/') }; },
    setDoc: async (...args) => { setCalls.push(args); },
    deleteField: () => delSentinel,
  };
  return { fs, docCalls, setCalls };
}

// 1) ערך מלא: trim + שתי כתיבות merge בסדר כספת⇒מטא
{
  const { fs, docCalls, setCalls } = mkFs();
  const out = await writeOrgSecrets('kehila', { smtpUrl: ' smtp://u:p@h ' }, KEYS, fs);
  chk('1 נתיבים: orgSecrets/kehila ואז orgSecretsMeta/kehila, שניהם merge:true',
    docCalls.length === 2 &&
    JSON.stringify(docCalls[0]) === JSON.stringify([db, 'orgSecrets', 'kehila'].map((x) => x === db ? db : x)) &&
    docCalls[0][0] === db && docCalls[0][1] === 'orgSecrets' && docCalls[0][2] === 'kehila' &&
    docCalls[1][1] === 'orgSecretsMeta' && docCalls[1][2] === 'kehila' &&
    setCalls.length === 2 &&
    JSON.stringify(setCalls[0][2]) === JSON.stringify({ merge: true }) &&
    JSON.stringify(setCalls[1][2]) === JSON.stringify({ merge: true }));
  chk('1 כספת: {smtpUrl:"smtp://u:p@h"} (trim) · מטא: {smtpUrl:true,+updatedAt}',
    JSON.stringify(setCalls[0][1]) === JSON.stringify({ smtpUrl: 'smtp://u:p@h' }) &&
    setCalls[1][1].smtpUrl === true);
  chk('1 פלט undefined', out === undefined);

  // 6) updatedAt = מחרוזת-ISO, והמטא בלי ערכי-סודות
  chk('6 updatedAt בפורמט ISO, ואין ערך-סוד במטא',
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(setCalls[1][1].updatedAt) &&
    !JSON.stringify(setCalls[1][1]).includes('smtp://'));
}

// 2) '' ⇒ סנטינל-מחיקה בכספת + false במטא
{
  const { fs, setCalls } = mkFs();
  await writeOrgSecrets('s', { smsApiKey: '' }, KEYS, fs);
  chk('2 "" ⇒ deleteField-סנטינל + מטא false',
    setCalls[0][1].smsApiKey === delSentinel && setCalls[1][1].smsApiKey === false);
}

// 3) null מפורש ⇒ כמו ''
{
  const { fs, setCalls } = mkFs();
  await writeOrgSecrets('s', { yemotToken: null }, KEYS, fs);
  chk('3 null ⇒ סנטינל-מחיקה + false',
    setCalls[0][1].yemotToken === delSentinel && setCalls[1][1].yemotToken === false);
}

// 4) allowlist: לא-מוכר נזרק; מוכר-שלא-נשלח לא נגוע
{
  const { fs, setCalls } = mkFs();
  await writeOrgSecrets('s', { hack: 'evil', smtpUrl: 'x' }, KEYS, fs);
  chk('4 hack נזרק · רק smtpUrl בכספת · solaXKey לא מופיע',
    JSON.stringify(setCalls[0][1]) === JSON.stringify({ smtpUrl: 'x' }) &&
    !('hack' in setCalls[0][1]) && !('hack' in setCalls[1][1]) &&
    !('solaXKey' in setCalls[0][1]) && !('solaXKey' in setCalls[1][1]));
}

// 5) אפס-כתיבות: patch ריק או ללא-מוכרים
{
  const { fs, setCalls } = mkFs();
  const o1 = await writeOrgSecrets('s', {}, KEYS, fs);
  const o2 = await writeOrgSecrets('s', { hack: 'evil' }, KEYS, fs);
  chk('5 setDoc לא נקרא כלל + undefined', setCalls.length === 0 && o1 === undefined && o2 === undefined);
}

// 7) כשל בכתיבת-הכספת ⇒ מבעבע, והמטא לא נכתב
{
  const setCalls = [];
  const fs = {
    db,
    doc: (...args) => ({ __ref: args.slice(1).join('/') }),
    setDoc: async (ref, data, opts) => {
      if (ref.__ref.startsWith('orgSecrets/')) throw new Error('permission-denied');
      setCalls.push([ref, data, opts]);
    },
    deleteField: () => delSentinel,
  };
  let bubbled = '';
  try {
    await writeOrgSecrets('s', { smtpUrl: 'x' }, KEYS, fs);
  } catch (e) { bubbled = e.message; }
  chk('7 שגיאת-כספת מבעבעת ואין כתיבת-מטא', bubbled === 'permission-denied' && setCalls.length === 0);
}

if (f) process.exit(1);
console.log('✓ write-org-secrets: 7 דוגמאות-חוזה (allowlist · trim · deleteField · דו-מסמכי merge) — ירוק');
