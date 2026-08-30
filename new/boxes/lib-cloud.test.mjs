/** בדיקת-קצה: מנוע-הענן דרך הקופסה בלבד — הכרעות טהורות + חיווט-מלא עם io-מזויף. */
const LIB_CLOUD_TERMS = {
  k1: "default",
  k2: "donations",
  k3: "seq",
  k4: "receiptSeq",
  k5: "donationSeq",
  k6: "shopReceiptSeq",
  k7: "auth/invalid-credential",
  k8: "auth/invalid-login-credentials",
  k9: "auth/wrong-password",
  k10: "auth/user-not-found",
  k11: "auth/invalid-email",
  k12: "אימייל או סיסמה שגויים",
  k13: "auth/network-request-failed",
  k14: "אין חיבור לאינטרנט — בדקו את החיבור ונסו שוב",
  k15: "auth/too-many-requests",
  k16: "יותר מדי ניסיונות — המתינו מספר דקות ונסו שוב",
  k17: "auth/user-disabled",
  k18: "החשבון הושבת — פנו למנהל המערכת",
  k19: "הכניסה נכשלה — נסו שוב",
  k20: "auth/email-already-in-use",
  k21: "האימייל כבר רשום — נסו להתחבר או לאפס סיסמה",
  k22: "auth/weak-password",
  k23: "הסיסמה חלשה מדי — לפחות 6 תווים",
  k24: "כתובת האימייל אינה תקינה",
  k25: "auth/operation-not-allowed",
  k26: "ההרשמה סגורה כרגע — פנו למנהל המערכת",
  k27: "לא נמצא משתמש עם האימייל הזה",
  k28: "הסיסמה הנוכחית שגויה",
  k29: "הסיסמה החדשה חלשה מדי — לפחות 6 תווים",
  k30: "number",
  k31: "כתובת-משיכה לא-תקינה (חייבת https)",
  k32: "root",
  k33: "org",
  k34: "full",
  k35: "reset",
  k36: "vault",
  k37: "הענן לא אותחל — פנו למנהל המערכת",
  k38: "auditlog",
  k39: "אין משתמש מחובר — התחברו ונסו שוב",
  k40: "skey",
  k41: "pkey",
  k42: "string",
  k43: "נתוני הענן אינם בפורמט מוכר — לא בוצע סנכרון",
  k44: "removed",
  k45: "nedarimDonors",
  k46: "incomingPayments",
  k47: "status",
  k48: "pending",
  k49: "provider",
  k50: "נדרשת התחברות-ענן",
  k51: "POST",
  k52: "Bearer ",
  k53: "משיכה נכשלה (",
  k54: "handled",
  k55: "smsOutbox",
  k56: "mailOutbox",
};   // צילום-מקומי (מנוע-הטיהור v6 — מגני-המקור עודכנו לצורה החדשה)
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
if (hebrewAuthError({ code: LIB_CLOUD_TERMS.k15 }).message !== LIB_CLOUD_TERMS.k16) bad('hebrewAuthError too-many');
if (hebrewAuthError({ code: LIB_CLOUD_TERMS.k9 }).message !== LIB_CLOUD_TERMS.k12) bad('hebrewAuthError wrong-password');
if (hebrewAuthError({ code: 'zzz' }).message !== LIB_CLOUD_TERMS.k19) bad('hebrewAuthError unknown');
if (hebrewAuthError(null).message !== LIB_CLOUD_TERMS.k19) bad('hebrewAuthError null');

/* ── 2) מיפויי-שגיאה עם נפילה-ל-hebrewAuthError ── */
if (signUpError({ code: LIB_CLOUD_TERMS.k20 }).message !== LIB_CLOUD_TERMS.k21) bad('signUpError dup');
if (signUpError({ code: LIB_CLOUD_TERMS.k13 }).message !== LIB_CLOUD_TERMS.k14) bad('signUpError fallback');
if (resetPasswordError({ code: LIB_CLOUD_TERMS.k10 }).message !== LIB_CLOUD_TERMS.k27) bad('resetPasswordError');
if (changePasswordCurrentError({ code: LIB_CLOUD_TERMS.k7 }).message !== LIB_CLOUD_TERMS.k28) bad('changePw current');
if (changePasswordNextError({ code: LIB_CLOUD_TERMS.k22 }).message !== LIB_CLOUD_TERMS.k29) bad('changePw next');
if (changePasswordNextError({ code: 'zzz' }).message !== LIB_CLOUD_TERMS.k19) bad('changePw next fallback');

/* ── 3) נתיבים מתוחמים ── */
const root = DEFAULT_SCOPE, org = newScope('acme', false);
if (scopedCol(root, 'families') !== 'families') bad('scopedCol root');
if (scopedCol(org, 'families') !== 'orgs/acme/families') bad('scopedCol org');
if (scopedMeta(root) !== 'meta/org') bad('scopedMeta root');
if (scopedMeta(org) !== 'orgs/acme/meta/org') bad('scopedMeta org');
if (scopedEnv(root) !== '_enc/envelope') bad('scopedEnv root');
if (scopedDonations(org) !== 'orgs/acme/donations') bad('scopedDonations org');
if (scopedDonations(root) !== LIB_CLOUD_TERMS.k2) bad('scopedDonations root');

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
if (nu.searchParams.get(LIB_CLOUD_TERMS.k33) !== LIB_CLOUD_TERMS.k32 || nu.searchParams.get(LIB_CLOUD_TERMS.k34) !== '1' || nu.searchParams.get(LIB_CLOUD_TERMS.k35) !== '1') bad('buildNedarimUrl root+full+reset');
if (buildNedarimUrl(org, 'https://fn/x', {}).searchParams.get(LIB_CLOUD_TERMS.k33) !== 'acme') bad('buildNedarimUrl org');
const su = buildSolaUrl(newScope('vaultco', true), 'https://fn/y', {});
if (su.searchParams.get(LIB_CLOUD_TERMS.k33) !== LIB_CLOUD_TERMS.k32 || su.searchParams.get(LIB_CLOUD_TERMS.k36) !== 'vaultco' || su.searchParams.get(LIB_CLOUD_TERMS.k34) !== null) bad('buildSolaUrl vault+no-full');
let threw = false;
try { buildNedarimUrl(root, 'http://insecure', {}); } catch { threw = true; }
if (!threw) bad('buildNedarimUrl לא-חסם http');

/* ── 7) חיווט-מלא עם io-מזויף ── */
if (AUDIT_CAP !== 500 || PUSH_BATCH !== 400) bad('קבועים');
const calls = { cols: [], added: [], batches: 0, sets: 0 };
const fakeIo = {
  doc: (_db, path, id) => ({ path, id }),
  collection: (_db, path) => { calls.cols.push(path); return { path }; },
  getDocs: async () => ({ docs: [{ id: 'p1', data: () => ({ amount: 5, status: LIB_CLOUD_TERMS.k48 }) }] }),
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
if (sms.body.status !== LIB_CLOUD_TERMS.k48 || sms.body.at !== '2026-08-24T00:00:00.000Z' || sms.body.text !== 'שלום') bad('writeSmsOutbox גוף');

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
if (!/DEFAULT_SCOPE = \{ slug: LIB_CLOUD_TERMS.k1, cloudRoot: true \}/.test(src)) bad('מגן: ברירת-התחום הבטוחה השתנתה (הגנת הלקוח-החי)');
if (!src.includes("[LIB_CLOUD_TERMS.k3, LIB_CLOUD_TERMS.k4, LIB_CLOUD_TERMS.k5, LIB_CLOUD_TERMS.k6]")) bad('מגן: META_COUNTER_KEYS השתנה');
if (src.indexOf('pullBase(rawUrl)') > src.indexOf('u.searchParams.set') && src.indexOf('function pullBase') > src.indexOf('new URL(pullBase')) bad('מגן: שער-https אחרי בניית-URL');
if (src.indexOf("if (!/^https:\\/\\//i.test(clean))") < 0) bad('מגן: שער-https הוסר');

if (f) process.exit(1);
console.log('✓ קופסת-lib-cloud: מילוני-שגיאה + נתיבים + בטיחות-מונים + בניית-URL + חיווט-io-מזויף (scope/דגלים/audit/batch) — ירוקים');
