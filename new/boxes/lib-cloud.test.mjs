/** בדיקת-קצה: מנוע-הענן דרך הקופסה בלבד — הכרעות טהורות + חיווט-מלא עם io-מזויף. */
import {
  DEFAULT_SCOPE, META_COUNTER_KEYS, AUDIT_CAP, PUSH_BATCH,
  newScope, scopedCol, scopedMeta, scopedEnv, scopedDonations,
  hebrewAuthError, signUpError, resetPasswordError, changePasswordCurrentError, changePasswordNextError,
  mergeMetaCounters, normalizeAllowedPurposes, normalizeAuditEmail,
  buildNedarimUrl, buildSolaUrl, createLibCloud,
} from './lib-cloud.mjs';
import { readFileSync } from 'node:fs';

let f = 0;
const bad = (m) => { console.error('✗ ' + m); f = 1; };

/* ── 1) מילון-שגיאות-Auth ── */
if (hebrewAuthError({ code: 'auth/too-many-requests' }).message !== 'יותר מדי ניסיונות — המתינו מספר דקות ונסו שוב') bad('hebrewAuthError too-many');
if (hebrewAuthError({ code: 'auth/wrong-password' }).message !== 'אימייל או סיסמה שגויים') bad('hebrewAuthError wrong-password');
if (hebrewAuthError({ code: 'zzz' }).message !== 'הכניסה נכשלה — נסו שוב') bad('hebrewAuthError unknown');
if (hebrewAuthError(null).message !== 'הכניסה נכשלה — נסו שוב') bad('hebrewAuthError null');

/* ── 2) מיפויי-שגיאה עם נפילה-ל-hebrewAuthError ── */
if (signUpError({ code: 'auth/email-already-in-use' }).message !== 'האימייל כבר רשום — נסו להתחבר או לאפס סיסמה') bad('signUpError dup');
if (signUpError({ code: 'auth/network-request-failed' }).message !== 'אין חיבור לאינטרנט — בדקו את החיבור ונסו שוב') bad('signUpError fallback');
if (resetPasswordError({ code: 'auth/user-not-found' }).message !== 'לא נמצא משתמש עם האימייל הזה') bad('resetPasswordError');
if (changePasswordCurrentError({ code: 'auth/invalid-credential' }).message !== 'הסיסמה הנוכחית שגויה') bad('changePw current');
if (changePasswordNextError({ code: 'auth/weak-password' }).message !== 'הסיסמה החדשה חלשה מדי — לפחות 6 תווים') bad('changePw next');
if (changePasswordNextError({ code: 'zzz' }).message !== 'הכניסה נכשלה — נסו שוב') bad('changePw next fallback');

/* ── 3) נתיבים מתוחמים ── */
const root = DEFAULT_SCOPE, org = newScope('acme', false);
if (scopedCol(root, 'families') !== 'families') bad('scopedCol root');
if (scopedCol(org, 'families') !== 'orgs/acme/families') bad('scopedCol org');
if (scopedMeta(root) !== 'meta/org') bad('scopedMeta root');
if (scopedMeta(org) !== 'orgs/acme/meta/org') bad('scopedMeta org');
if (scopedEnv(root) !== '_enc/envelope') bad('scopedEnv root');
if (scopedDonations(org) !== 'orgs/acme/donations') bad('scopedDonations org');
if (scopedDonations(root) !== 'donations') bad('scopedDonations root');

/* ── 4) מיזוג-בטוח-למונים (הענן לא נסוג) ── */
const m = mergeMetaCounters({ seq: 9, receiptSeq: 3, donationSeq: 4 }, { seq: 5, receiptSeq: 8, orgName: 'א' });
if (m.seq !== 9) bad('merge: seq ישן-גבוה ננעל');
if (m.receiptSeq !== 8) bad('merge: receiptSeq חדש-גבוה');
if (m.donationSeq !== 4) bad('merge: חסר-בחדש ⇒ ננעל לישן');
if (m.orgName !== 'א') bad('merge: שדה-לא-מונה עובר');
if (mergeMetaCounters(null, { seq: 2 }).seq !== 2) bad('merge: אין-קיים ⇒ החדש');

/* ── 5) נרמולים ── */
if (normalizeAllowedPurposes([]) !== null) bad('normAllowed []');
if (normalizeAllowedPurposes(null) !== null) bad('normAllowed null');
if (JSON.stringify(normalizeAllowedPurposes(['ק'])) !== '["ק"]') bad('normAllowed list');
if (normalizeAuditEmail('  A@B.CO ') !== 'a@b.co') bad('normAuditEmail');

/* ── 6) בניית-URL ── */
const nu = buildNedarimUrl(root, 'https://fn/x', { reset: true });
if (nu.searchParams.get('org') !== 'root' || nu.searchParams.get('full') !== '1' || nu.searchParams.get('reset') !== '1') bad('buildNedarimUrl root+full+reset');
if (buildNedarimUrl(org, 'https://fn/x', {}).searchParams.get('org') !== 'acme') bad('buildNedarimUrl org');
const su = buildSolaUrl(newScope('vaultco', true), 'https://fn/y', {});
if (su.searchParams.get('org') !== 'root' || su.searchParams.get('vault') !== 'vaultco' || su.searchParams.get('full') !== null) bad('buildSolaUrl vault+no-full');
let threw = false;
try { buildNedarimUrl(root, 'http://insecure', {}); } catch { threw = true; }
if (!threw) bad('buildNedarimUrl לא-חסם http');

/* ── 7) חיווט-מלא עם io-מזויף ── */
if (AUDIT_CAP !== 500 || PUSH_BATCH !== 400) bad('קבועים');
const calls = { cols: [], added: [], batches: 0, sets: 0 };
const fakeIo = {
  doc: (_db, path, id) => ({ path, id }),
  collection: (_db, path) => { calls.cols.push(path); return { path }; },
  getDocs: async () => ({ docs: [{ id: 'p1', data: () => ({ amount: 5, status: 'pending' }) }] }),
  where: (k, op, v) => ({ k, op, v }),
  query: (base) => base,
  addDoc: async (col, body) => { calls.added.push({ path: col.path, body }); },
  writeBatch: () => ({ set: () => { calls.sets++; }, delete: () => {}, commit: async () => { calls.batches++; } }),
  now: () => '2026-08-24T00:00:00.000Z',
  b64: (x) => x, unb64: (x) => x, isEncDoc: () => false,
};
const cloud = createLibCloud(fakeIo);
// requireDb זורק עד initCloud — נזריק fsDb דרך initCloud מזויף:
Object.assign(fakeIo, {
  initializeApp: () => ({}), initAppCheck: () => {}, getAuth: () => ({ useDeviceLanguage() {} }),
  initializeFirestore: () => ({ FS: 1 }), persistentLocalCache: () => ({}), persistentMultipleTabManager: () => ({}), getFirestore: () => ({ FS: 1 }),
});
cloud.initCloud({});

// setCloudScope משנה את הנתיבים לכל הקריאות הבאות (orgs/acme)
cloud.setCloudScope('acme', false);
await cloud.writeSmsOutbox('050', 'שלום');
const sms = calls.added.at(-1);
if (sms.path !== 'orgs/acme/smsOutbox') bad('setCloudScope לא החליף נתיב');
if (sms.body.status !== 'pending' || sms.body.at !== '2026-08-24T00:00:00.000Z' || sms.body.text !== 'שלום') bad('writeSmsOutbox גוף');

// דגלים ומצב
cloud.setDonationSplit(true);
if (cloud.donationSplitActive() !== true) bad('donationSplitActive');
cloud.setSupEnforce(true);
if (cloud.supEnforceActive() !== true) bad('supEnforceActive');
cloud.setAuditContext('u1', '  ME@ORG.CO ', true);
if (cloud.auditWriterEmail() !== 'me@org.co') bad('auditWriterEmail מנורמל');

// fetchIncomingPayments → id-spread
const pays = await cloud.fetchIncomingPayments();
if (pays.length !== 1 || pays[0].id !== 'p1' || pays[0].amount !== 5) bad('fetchIncomingPayments id-spread');

// pushDonations — אצווה ≤400 ⇒ 401 sets = 2 אצוות
const sets = Array.from({ length: 401 }, (_, i) => ({ id: 'r' + i, supporterId: 's', pkey: '_shared_', donation: { rid: 'r' + i } }));
await cloud.pushDonations({ sets, deletes: [] });
if (calls.batches !== 2) bad('pushDonations אצווה: ' + calls.batches + ' (צפוי 2)');

/* 🛡 מגן-הכרעה: קריאת מקור-הקופסה (theme.test דפוס) */
const src = readFileSync(new URL('./lib-cloud.mjs', import.meta.url), 'utf8');
if (!/DEFAULT_SCOPE = \{ slug: 'default', cloudRoot: true \}/.test(src)) bad('מגן: ברירת-התחום הבטוחה השתנתה (הגנת הלקוח-החי)');
if (!src.includes("['seq', 'receiptSeq', 'donationSeq', 'shopReceiptSeq']")) bad('מגן: META_COUNTER_KEYS השתנה');
if (src.indexOf('pullBase(rawUrl)') > src.indexOf('u.searchParams.set') && src.indexOf('function pullBase') > src.indexOf('new URL(pullBase')) bad('מגן: שער-https אחרי בניית-URL');
if (src.indexOf("if (!/^https:\\/\\//i.test(clean))") < 0) bad('מגן: שער-https הוסר');

if (f) process.exit(1);
console.log('✓ קופסת-lib-cloud: מילוני-שגיאה + נתיבים + בטיחות-מונים + בניית-URL + חיווט-io-מזויף (scope/דגלים/audit/batch) — ירוקים');
