/** קופסת-חיבורים · lib-cloud — מנוע-הענן (Firebase Auth + Firestore). חוזה: lib-cloud.contract.md
 *  זה המקום היחיד שבו 36 חוטי-הענן נפגשים (חוקי-החשמלאי, LAW.md). מקור-האמת:
 *  maor/src/lib/cloud.ts — החוטים ה-IO-כבדים חולצו לאטומים (push-diff, read/write-
 *  cloud-envelope, encrypt-existing-cloud, migrate-supporters-to-keyed, cloud-db,
 *  sign-out-cloud, set-cloud-scope, set-allowed-purposes) והנתיבים/מפתחות לאטומי
 *  cloud-diff/supporterPartition/donationPartition/cloudCrypto. החיווט (גרף-הקריאות,
 *  ברירות-המחדל, מילוני-השגיאה, בטיחות-המונים, בניית-ה-URL, ומצב-המנוע) חי כאן.
 *  שקעי-IO אמיתיים (firebase/fetch/migrate/הצפנה/now) = פרמטרים מוזרקים דרך
 *  createLibCloud(io) — מתועדים בחוזה, לא ממומשים כאן (חוק-1/חוק-6). */

import { setCloudScope as _setCloudScope } from '../atoms/set-cloud-scope.mjs';
import { setAllowedPurposes as _setAllowedPurposes } from '../atoms/set-allowed-purposes.mjs';
import { colPath as __pure_colPath } from '../atoms/col-path.mjs';
import { COL_PATH_T as __d_colPath_COL_PATH_T } from '../atoms/col-path-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const colPath = (...a) => __pure_colPath(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_colPath_COL_PATH_T);
import { metaPath as __pure_metaPath } from '../atoms/meta-path.mjs';
import { META_PATH_T as __d_metaPath_META_PATH_T } from '../atoms/meta-path-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const metaPath = (...a) => __pure_metaPath(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_metaPath_META_PATH_T);
import { envPath as __pure_envPath } from '../atoms/env-path.mjs';
import { ENV_PATH_T as __d_envPath_ENV_PATH_T } from '../atoms/env-path-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const envPath = (...a) => __pure_envPath(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_envPath_ENV_PATH_T);
import { donationsPath } from '../atoms/donations-path.mjs';
import { ENTITY_COLLECTIONS } from '../atoms/entity-collections.mjs';
import { encryptDoc as __pure_encryptDoc } from '../atoms/encrypt-doc.mjs';
import { ENCRYPT_DOC_T as __d_encrypt_doc_T } from '../atoms/encrypt-doc-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const _encryptDoc = (...a) => __pure_encryptDoc(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_encrypt_doc_T);
import { decryptDoc as __pure_decryptDoc } from '../atoms/decrypt-doc.mjs';
import { DECRYPT_DOC_T as __d_decrypt_doc_T } from '../atoms/decrypt-doc-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const _decryptDoc = (...a) => __pure_decryptDoc(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_decrypt_doc_T);
import { SHARED_SUP_KEY } from '../atoms/shared-sup-key.mjs';
import { SHARED_PURPOSE_KEY } from '../atoms/shared-purpose-key.mjs';
import { SUP_KEYED_COLS } from '../atoms/sup-keyed-cols.mjs';
import { supKeyOf as _supKeyOf } from '../atoms/sup-key-of.mjs';
import { supKeyMapOf as _supKeyMapOf } from '../atoms/sup-key-map-of.mjs';
import { docSkey as __pure_docSkey } from '../atoms/doc-skey.mjs';
import { DOC_SKEY_T as __d_docSkey_DOC_SKEY_T } from '../atoms/doc-skey-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _docSkey = (...a) => __pure_docSkey(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_docSkey_DOC_SKEY_T);
import { stripAuditMeta as __pure_stripAuditMeta } from '../atoms/strip-audit-meta.mjs';
import { STRIP_AUDIT_META_T as __d_stripAuditMeta_STRIP_AUDIT_META_T } from '../atoms/strip-audit-meta-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const stripAuditMeta = (...a) => __pure_stripAuditMeta(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_stripAuditMeta_STRIP_AUDIT_META_T);
import { stripSupKey as __pure_stripSupKey } from '../atoms/strip-sup-key.mjs';
import { STRIP_SUP_KEY_T as __d_stripSupKey_STRIP_SUP_KEY_T } from '../atoms/strip-sup-key-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const stripSupKey = (...a) => __pure_stripSupKey(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_stripSupKey_STRIP_SUP_KEY_T);
import { supAllowedKeys as __pure_supAllowedKeys } from '../atoms/sup-allowed-keys.mjs';
import { SUP_ALLOWED_KEYS_T as __d_sup_allowed_keys_T } from '../atoms/sup-allowed-keys-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const _supAllowedKeys = (...a) => __pure_supAllowedKeys(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_sup_allowed_keys_T);
import { donAllowedKeys as __pure_donAllowedKeys } from '../atoms/don-allowed-keys.mjs';
import { DON_ALLOWED_KEYS_T as __d_don_allowed_keys_T } from '../atoms/don-allowed-keys-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const _donAllowedKeys = (...a) => __pure_donAllowedKeys(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_don_allowed_keys_T);
import { fullDbDiff as _fullDbDiff } from '../atoms/full-db-diff.mjs';
import { cloudDb as __pure_cloudDb } from '../atoms/cloud-db.mjs';
import { CLOUD_DB_T as __d_cloudDb_CLOUD_DB_T } from '../atoms/cloud-db-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const cloudDb = (...a) => __pure_cloudDb(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_cloudDb_CLOUD_DB_T);
import { signOutCloud as _signOutCloud } from '../atoms/sign-out-cloud.mjs';
import { pushDiff as __pure_pushDiff } from '../atoms/push-diff.mjs';
import { PUSH_DIFF_T as __d_push_diff_T } from '../atoms/push-diff-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const _pushDiff = (...a) => __pure_pushDiff(...a, ...Array(Math.max(0, 9 - a.length)).fill(undefined), __d_push_diff_T);
import { readCloudEnvelope as __pure_readCloudEnvelope } from '../atoms/read-cloud-envelope.mjs';
import { READ_CLOUD_ENVELOPE_T as __d_read_cloud_envelope_T } from '../atoms/read-cloud-envelope-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const _readCloudEnvelope = (...a) => __pure_readCloudEnvelope(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_read_cloud_envelope_T);
import { writeCloudEnvelope as _writeCloudEnvelope } from '../atoms/write-cloud-envelope.mjs';
import { encryptExistingCloud as _encryptExistingCloud } from '../atoms/encrypt-existing-cloud.mjs';
import { migrateSupportersToKeyed as __pure_migrateSupportersToKeyed } from '../atoms/migrate-supporters-to-keyed.mjs';
import { MIGRATE_SUPPORTERS_TO_KEYED_T as __d_migrate_supporters_to_keyed_T } from '../atoms/migrate-supporters-to-keyed-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const _migrateSupportersToKeyed = (...a) => __pure_migrateSupportersToKeyed(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_migrate_supporters_to_keyed_T);

/* ══════════ א) הכרעות טהורות (מילון-הקופסה, verbatim מהמקור) ══════════ */

/** ברירת-התחום הבטוחה — נתיבי-שורש (ביט-זהה ללקוח-החי). cloud.ts:76 */
export const DEFAULT_SCOPE = { slug: 'default', cloudRoot: true };
/** שם-אוסף התרומות-הנפרד (מסלול-B). cloud-diff.ts:64 */
export const DONATIONS_COL = 'donations';
/** מוני-הענן — מונוטוניים בלבד (רצף קבלות-מס). לעולם לא לרדת. cloud.ts:393 */
export const META_COUNTER_KEYS = ['seq', 'receiptSeq', 'donationSeq', 'shopReceiptSeq'];
/** תקרת טבעת-הלוג. domain.ts:1072 */
export const AUDIT_CAP = 500;
/** גודל-אצווה (מגבלת Firestore 500 ⇒ 400). cloud.ts:187/232/438 */
export const PUSH_BATCH = 400;

/** ערך תחום-הארגון החדש (אטום set-cloud-scope). cloud.ts:79-81 */
export function newScope(slug, cloudRoot) {
  return _setCloudScope(slug, cloudRoot);
}

/** נתיבים מתוחמים — עטיפות דקות על אטומי-הנתיב עם התחום הנתון. cloud.ts:84-95 */
export function scopedCol(scope, col) {
  return colPath(scope.slug, scope.cloudRoot, col);
}
export function scopedMeta(scope) {
  return metaPath(scope.slug, scope.cloudRoot);
}
export function scopedEnv(scope) {
  return envPath(scope.slug, scope.cloudRoot);
}
export function scopedDonations(scope) {
  return donationsPath(scope.slug, scope.cloudRoot, colPath, DONATIONS_COL);
}

/** מיפוי קודי שגיאה של Firebase Auth להודעות בעברית. cloud.ts:278-296 */
export function hebrewAuthError(e) {
  const code = ((e && e.code) ?? '').toString();
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return new Error('אימייל או סיסמה שגויים');
    case 'auth/network-request-failed':
      return new Error('אין חיבור לאינטרנט — בדקו את החיבור ונסו שוב');
    case 'auth/too-many-requests':
      return new Error('יותר מדי ניסיונות — המתינו מספר דקות ונסו שוב');
    case 'auth/user-disabled':
      return new Error('החשבון הושבת — פנו למנהל המערכת');
    default:
      return new Error('הכניסה נכשלה — נסו שוב');
  }
}

/** מיפוי-שגיאת הרשמה-עצמית; קוד לא-מוכר ⇒ נופל ל-hebrewAuthError. cloud.ts:329-334 */
export function signUpError(e) {
  const code = ((e && e.code) ?? '').toString();
  if (code === 'auth/email-already-in-use') return new Error('האימייל כבר רשום — נסו להתחבר או לאפס סיסמה');
  if (code === 'auth/weak-password') return new Error('הסיסמה חלשה מדי — לפחות 6 תווים');
  if (code === 'auth/invalid-email') return new Error('כתובת האימייל אינה תקינה');
  if (code === 'auth/operation-not-allowed') return new Error('ההרשמה סגורה כרגע — פנו למנהל המערכת');
  return hebrewAuthError(e);
}

/** מיפוי-שגיאת איפוס-סיסמה. cloud.ts:351-354 */
export function resetPasswordError(e) {
  const code = ((e && e.code) ?? '').toString();
  if (code === 'auth/user-not-found') return new Error('לא נמצא משתמש עם האימייל הזה');
  if (code === 'auth/invalid-email') return new Error('כתובת האימייל אינה תקינה');
  return hebrewAuthError(e);
}

/** מיפוי-שגיאת אימות-מחדש בשינוי-סיסמה (הסיסמה הנוכחית). cloud.ts:368-371 */
export function changePasswordCurrentError(e) {
  const code = ((e && e.code) ?? '').toString();
  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials')
    return new Error('הסיסמה הנוכחית שגויה');
  return hebrewAuthError(e);
}

/** מיפוי-שגיאת החלפת-הסיסמה (הסיסמה החדשה). cloud.ts:375-378 */
export function changePasswordNextError(e) {
  const code = ((e && e.code) ?? '').toString();
  if (code === 'auth/weak-password') return new Error('הסיסמה החדשה חלשה מדי — לפחות 6 תווים');
  return hebrewAuthError(e);
}

/** מיזוג-בטוח-למונים: הענן לעולם אינו נסוג — מונה קיים-גבוה ננעל. cloud.ts:411-416 */
export function mergeMetaCounters(existing, meta) {
  const safe = { ...meta };
  for (const k of META_COUNTER_KEYS) {
    const cur = existing?.[k];
    const nxt = safe[k];
    if (typeof cur === 'number' && (typeof nxt !== 'number' || cur > nxt)) safe[k] = cur;
  }
  return safe;
}

/** נרמול רשימת-הייעודים-המותרים (אטום set-allowed-purposes). cloud.ts:112-113 */
export function normalizeAllowedPurposes(p) {
  return _setAllowedPurposes(p);
}

/** נרמול מייל-המבקר (טבעת-הלוג). cloud.ts:140 */
export function normalizeAuditEmail(email) {
  return email.trim().toLowerCase();
}

/** שער-https משותף לבניית-URL של משיכה. cloud.ts:688-689/707-708 */
function pullBase(rawUrl) {
  const clean = String(rawUrl || '').trim();
  if (!/^https:\/\//i.test(clean)) throw new Error('כתובת-משיכה לא-תקינה (חייבת https)');
  return clean;
}
/** org של התחום הנוכחי (שורש ⇒ 'root'). cloud.ts:693/712 */
function orgOf(scope) {
  return scope.cloudRoot ? 'root' : scope.slug;
}

/** בניית-URL למשיכת-נדרים (org · full=1 · reset). cloud.ts:687-698 */
export function buildNedarimUrl(scope, rawUrl, opts = {}) {
  const u = new URL(pullBase(rawUrl));
  u.searchParams.set('org', orgOf(scope));
  u.searchParams.set('full', '1');
  if (opts.reset) u.searchParams.set('reset', '1');
  return u;
}

/** בניית-URL למשיכת-סולה (org · vault-לשורש-עם-slug · reset; בלי full). cloud.ts:706-719 */
export function buildSolaUrl(scope, rawUrl, opts = {}) {
  const u = new URL(pullBase(rawUrl));
  u.searchParams.set('org', orgOf(scope));
  // לקוח-השורש: האוספים ב-root אבל הכספת (orgSecrets) נכתבת תחת ה-slug האמיתי —
  // vault מגשר כדי שהפונקציה תמצא את ה-xKey שהוזן בהגדרות. cloud.ts:715-717
  if (scope.cloudRoot && scope.slug && scope.slug !== 'default') u.searchParams.set('vault', scope.slug);
  if (opts.reset) u.searchParams.set('reset', '1');
  return u;
}

/* ══════════ ב) createLibCloud(io) — מנוע-הענן המחווט ══════════ */

/**
 * לוח-החיבורים החי: מקבל את שקעי-ה-IO (firebase/fetch/migrate/הצפנה/now) ומחזיר
 * את ה-API של מנוע-הענן בחתימות ביט-זהות ל-cloud.ts. המצב (scope/דגלים/audit/
 * singletons) חי בסגור. אף שקע-IO אינו ממומש כאן — רק מחווט.
 */
export function createLibCloud(io) {
  // ── מצב-המנוע (משתני-המודול של cloud.ts, כאן בסגור) ──
  let app = null;
  let auth = null;
  let fsDb = null;
  let scope = { ...DEFAULT_SCOPE };
  let splitOn = false;
  let allowedPurposes = null;
  let supEnforceOn = false;
  const audit = { uid: '', email: '', readable: false };

  // ── חיווט-אטומי-ההצפנה/המפתחות (סוקטים מוזרקים לתוך האטומים) ──
  const encDoc = (plain, dek) => _encryptDoc(plain, dek, io.b64);
  const decDoc = (d, dek) => _decryptDoc(d, dek, io.isEncDoc, io.unb64);
  const supKeyOf = (sp) => _supKeyOf(sp, SHARED_SUP_KEY);
  const supKeyMapOf = (sups) => _supKeyMapOf(sups, supKeyOf);
  const docSkey = (col, data, map) => _docSkey(col, data, map, supKeyOf, SHARED_SUP_KEY);
  const supAllowedKeys = (allowed) => _supAllowedKeys(allowed, SHARED_SUP_KEY);
  const donAllowedKeys = (allowed) => _donAllowedKeys(allowed, SHARED_PURPOSE_KEY);
  const fullDbDiff = (db) => _fullDbDiff(db, ENTITY_COLLECTIONS, io.metaOf);
  const toPlain = (data) => JSON.parse(JSON.stringify(data));

  // ── שערי-הידית (cloud.ts:262-270) ──
  const requireDb = () => cloudDb(fsDb);
  const requireAuth = () => {
    if (!auth) throw new Error('הענן לא אותחל — פנו למנהל המערכת');
    return auth;
  };

  // ── נתיבים מתוחמים לפי ה-scope החי (cloud.ts:84-95) ──
  const sCol = (col) => scopedCol(scope, col);
  const sMeta = () => scopedMeta(scope);
  const sEnv = () => scopedEnv(scope);
  const sDon = () => scopedDonations(scope);

  // ── כתיבת-meta בטוחה-למונים (עסקה; cloud.ts:401-419) ──
  const pushMetaCounterSafe = async (meta, dek) => {
    const db = requireDb();
    const ref = io.doc(db, sMeta());
    await io.runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      let existing = null;
      if (snap.exists()) {
        const raw = snap.data();
        existing = dek ? await decDoc(raw, dek) : raw;
      }
      const safe = mergeMetaCounters(existing, meta);
      const body = dek ? await encDoc(safe, dek) : safe;
      tx.set(ref, body);
    });
  };

  // ── pushDiff (אטום; cloud.ts:422-448) ──
  const pushDiff = (diff, dek, supKeyBySpId = new Map()) =>
    _pushDiff(
      diff, dek, supKeyBySpId,
      requireDb(), sCol,
      { doc: io.doc, writeBatch: io.writeBatch },
      encDoc, pushMetaCounterSafe,
      { enforceOn: supEnforceOn, keyedCols: SUP_KEYED_COLS, docSkey, stripAuditMeta },
    );

  // ── דחיפת אוסף-התרומות (cloud.ts:175-192) ──
  const pushDonations = async (diff, dek) => {
    const db = requireDb();
    const ops = [];
    for (const d of diff.sets) {
      // pkey נשמר plaintext (מחוץ למעטפה) כדי ש-where-pkey-in + Rules יעבדו גם בארגון-מוצפן.
      const payload = { supporterId: d.supporterId, ...d.donation };
      const body = dek ? { pkey: d.pkey, ...(await encDoc(payload, dek)) } : { pkey: d.pkey, ...payload };
      ops.push((b) => b.set(io.doc(db, sDon(), d.id), body));
    }
    for (const id of diff.deletes) {
      ops.push((b) => b.delete(io.doc(db, sDon(), id)));
    }
    for (let i = 0; i < ops.length; i += PUSH_BATCH) {
      const batch = io.writeBatch(db);
      for (const op of ops.slice(i, i + PUSH_BATCH)) op(batch);
      await batch.commit();
    }
  };

  // ── טבעת-הלוג המסונכרנת (cloud.ts:149-169) ──
  const pushAuditRing = async (entries, dek) => {
    if (!audit.uid) return;
    const db = requireDb();
    const ring = entries.slice(-AUDIT_CAP);
    const body = dek ? await encDoc({ entries: ring }, dek) : { entries: ring };
    await io.setDoc(io.doc(db, sCol('auditlog'), audit.uid), body);
  };
  const pullAuditRing = async (dek) => {
    if (!audit.readable) return null;
    const db = requireDb();
    const snap = await io.getDocs(io.collection(db, sCol('auditlog')));
    const all = [];
    for (const d of snap.docs) {
      const data = dek ? await decDoc(d.data(), dek) : d.data();
      if (Array.isArray(data.entries)) all.push(...data.entries);
    }
    all.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
    return all.slice(-AUDIT_CAP);
  };

  // ── מיגרציות (cloud.ts:201-238) ──
  const migrateDonationsToCollection = async (supporters, dek) => {
    const diff = io.donationPartitionDiff([], supporters); // prev ריק ⇒ כל התרומות = sets
    await pushDonations(diff, dek);
    return diff.sets.length;
  };
  const migrateSupportersToKeyed = (supporters, events, dek) =>
    _migrateSupportersToKeyed(supporters, events, dek, {
      requireDb, supKeyMapOf, supKeyOf, docSkey, toPlain, encryptDoc: encDoc,
      scopedCol: sCol, doc: io.doc, writeBatch: io.writeBatch,
    });

  // ── אתחול-הענן (idempotent; cloud.ts:241-260) ──
  const initCloud = (fb) => {
    if (app && auth && fsDb) return { auth, db: fsDb };
    app = io.initializeApp(fb);
    io.initAppCheck(app, fb && fb.appCheckKey);
    auth = io.getAuth(app);
    auth.useDeviceLanguage();
    try {
      fsDb = io.initializeFirestore(app, {
        localCache: io.persistentLocalCache({ tabManager: io.persistentMultipleTabManager() }),
      });
    } catch {
      fsDb = io.getFirestore(app);
    }
    return { auth, db: fsDb };
  };

  // ── Auth (cloud.ts:299-380) ──
  const watchAuth = (cb) =>
    io.onAuthStateChanged(requireAuth(), (u) => cb(u ? { uid: u.uid, email: u.email ?? '' } : null));
  const signIn = async (email, password) => {
    try {
      await io.signInWithEmailAndPassword(requireAuth(), email, password);
    } catch (e) {
      throw hebrewAuthError(e);
    }
  };
  const signUp = async (email, password) => {
    try {
      const cred = await io.createUserWithEmailAndPassword(requireAuth(), email, password);
      void io.sendEmailVerification(cred.user).catch(() => {});
      return cred.user.uid;
    } catch (e) {
      throw signUpError(e);
    }
  };
  const signOutCloud = () => _signOutCloud(io.signOut, requireAuth);
  const resetPassword = async (email) => {
    try {
      await io.sendPasswordResetEmail(requireAuth(), email);
    } catch (e) {
      throw resetPasswordError(e);
    }
  };
  const changePassword = async (currentPass, nextPass) => {
    const u = requireAuth().currentUser;
    if (!u || !u.email) throw new Error('אין משתמש מחובר — התחברו ונסו שוב');
    try {
      await io.reauthenticateWithCredential(u, io.emailCredential(u.email, currentPass));
    } catch (e) {
      throw changePasswordCurrentError(e);
    }
    try {
      await io.updatePassword(u, nextPass);
    } catch (e) {
      throw changePasswordNextError(e);
    }
  };

  // ── envelope + מיגרציית-הצפנה (אטומים; cloud.ts:458-489) ──
  const readCloudEnvelope = () => _readCloudEnvelope(requireDb(), sEnv, { getDoc: io.getDoc, doc: io.doc });
  const writeCloudEnvelope = (env) => _writeCloudEnvelope(env, requireDb(), sEnv, { setDoc: io.setDoc, doc: io.doc });
  const encryptExistingCloud = (db, dek) => _encryptExistingCloud(db, dek, pushDiff, fullDbDiff, supKeyMapOf);

  // ── משיכת-הכול (cloud.ts:490-546) ──
  const pullAll = async (dek) => {
    const db = requireDb();
    const metaSnap = await io.getDoc(io.doc(db, sMeta()));
    if (!metaSnap.exists()) return null;
    const metaData = dek ? await decDoc(metaSnap.data(), dek) : metaSnap.data();
    const raw = { ...metaData, v: io.dbVersion };
    const snaps = await Promise.all(
      ENTITY_COLLECTIONS.map((col) => {
        if (supEnforceOn && SUP_KEYED_COLS.includes(col) && allowedPurposes) {
          return io.getDocs(io.query(io.collection(db, sCol(col)), io.where('skey', 'in', supAllowedKeys(allowedPurposes))));
        }
        return io.getDocs(io.collection(db, sCol(col)));
      }),
    );
    for (let i = 0; i < ENTITY_COLLECTIONS.length; i++) {
      const col = ENTITY_COLLECTIONS[i];
      const keyed = SUP_KEYED_COLS.includes(col);
      raw[col] = await Promise.all(
        snaps[i].docs.map(async (d) => {
          const data = dek ? await decDoc(d.data(), dek) : d.data();
          return { ...(keyed ? stripSupKey(data) : data), id: d.id };
        }),
      );
    }
    if (splitOn) {
      const donRef = io.collection(db, sDon());
      const dsnap = await io.getDocs(
        allowedPurposes ? io.query(donRef, io.where('pkey', 'in', donAllowedKeys(allowedPurposes))) : donRef,
      );
      const bySup = new Map();
      for (const d of dsnap.docs) {
        const data = dek ? await decDoc(d.data(), dek) : d.data();
        const supporterId = data.supporterId;
        if (typeof supporterId !== 'string') continue;
        const { supporterId: _s, pkey: _p, ...donation } = data; // rid נשמר בתוך ...donation
        void _s;
        void _p;
        const arr = bySup.get(supporterId) ?? [];
        arr.push(donation);
        bySup.set(supporterId, arr);
      }
      const sups = raw.supporters;
      if (Array.isArray(sups)) for (const sp of sups) sp.donations = bySup.get(sp.id) ?? [];
    }
    const migrated = io.migrate(raw);
    if (!migrated) throw new Error('נתוני הענן אינם בפורמט מוכר — לא בוצע סנכרון');
    return migrated;
  };

  // ── האזנה-חיה (cloud.ts:556-612) ──
  const subscribeAll = (onRemote, onError, dek) => {
    const db = requireDb();
    const clean = (col, data) => (SUP_KEYED_COLS.includes(col) ? stripSupKey(data) : data);
    const unsubs = ENTITY_COLLECTIONS.map((col) =>
      io.onSnapshot(
        supEnforceOn && SUP_KEYED_COLS.includes(col) && allowedPurposes
          ? io.query(io.collection(db, sCol(col)), io.where('skey', 'in', supAllowedKeys(allowedPurposes)))
          : io.collection(db, sCol(col)),
        (snap) => {
          if (snap.metadata.hasPendingWrites) return;
          const changes = snap.docChanges();
          if (!changes.length) return;
          if (!dek) {
            onRemote({ col, docs: changes.map((ch) => ({ id: ch.doc.id, data: clean(col, ch.doc.data()), deleted: ch.type === 'removed' })) });
            return;
          }
          void Promise.all(
            changes.map(async (ch) => ({
              id: ch.doc.id,
              data: ch.type === 'removed' ? clean(col, ch.doc.data()) : clean(col, await decDoc(ch.doc.data(), dek)),
              deleted: ch.type === 'removed',
            })),
          )
            .then((docs) => onRemote({ col, docs }))
            .catch((e) => onError?.(e));
        },
        (e) => onError?.(e),
      ),
    );
    unsubs.push(
      io.onSnapshot(
        io.doc(db, sMeta()),
        (snap) => {
          if (snap.metadata.hasPendingWrites || !snap.exists()) return;
          if (!dek) {
            onRemote({ meta: snap.data() });
            return;
          }
          void decDoc(snap.data(), dek)
            .then((meta) => onRemote({ meta }))
            .catch((e) => onError?.(e));
        },
        (e) => onError?.(e),
      ),
    );
    return () => {
      for (const u of unsubs) u();
    };
  };

  // ── צד-הלקוח של functions/ (cloud.ts:663-770) ──
  const fetchNedarimDonors = async () => {
    const snap = await io.getDocs(io.collection(requireDb(), sCol('nedarimDonors')));
    return snap.docs.map((d) => ({ toremId: d.id, ...d.data() }));
  };
  const fetchIncomingPayments = async () => {
    const snap = await io.getDocs(io.query(io.collection(requireDb(), sCol('incomingPayments')), io.where('status', '==', 'pending')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };
  const fetchProviderRows = async (provider) => {
    const snap = await io.getDocs(io.query(io.collection(requireDb(), sCol('incomingPayments')), io.where('provider', '==', provider)));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };
  const pullNedarim = async (pullUrl, opts = {}) => {
    const u = buildNedarimUrl(scope, pullUrl, opts);
    const user = requireAuth().currentUser;
    if (!user) throw new Error('נדרשת התחברות-ענן');
    const token = await user.getIdToken();
    const r = await io.fetch(u.toString(), { method: 'POST', headers: { Authorization: 'Bearer ' + token } });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.ok === false) throw new Error(j.error || 'משיכה נכשלה (' + r.status + ')');
    return j;
  };
  const pullSola = async (pullUrl, opts = {}) => {
    const u = buildSolaUrl(scope, pullUrl, opts);
    const user = requireAuth().currentUser;
    if (!user) throw new Error('נדרשת התחברות-ענן');
    const token = await user.getIdToken();
    const r = await io.fetch(u.toString(), { method: 'POST', headers: { Authorization: 'Bearer ' + token } });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.ok === false) throw new Error(j.error || 'משיכה נכשלה (' + r.status + ')');
    return j;
  };
  const markIncomingPayment = (id) =>
    io.updateDoc(io.doc(requireDb(), sCol('incomingPayments'), id), { status: 'handled', handledAt: io.now() });
  const watchIncomingPayments = (cb) => {
    try {
      const q = io.query(io.collection(requireDb(), sCol('incomingPayments')), io.where('status', '==', 'pending'));
      return io.onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), () => {});
    } catch {
      return () => {};
    }
  };
  const writeSmsOutbox = (to, text) =>
    io.addDoc(io.collection(requireDb(), sCol('smsOutbox')), { to, text, status: 'pending', at: io.now() });
  const writeMailOutbox = (to, subject, text) =>
    io.addDoc(io.collection(requireDb(), sCol('mailOutbox')), { to, subject, text, status: 'pending', at: io.now() });

  // ── שקעי-הקונפיג (cloud.ts:79-146) ──
  const setCloudScope = (slug, cloudRoot) => { scope = newScope(slug, cloudRoot); };
  const setDonationSplit = (on) => { splitOn = on; };
  const donationSplitActive = () => splitOn;
  const setAllowedPurposes = (p) => { allowedPurposes = normalizeAllowedPurposes(p); };
  const setSupEnforce = (on) => { supEnforceOn = on; };
  const supEnforceActive = () => supEnforceOn;
  const setAuditContext = (uid, email, canRead) => {
    audit.uid = uid;
    audit.email = normalizeAuditEmail(email);
    audit.readable = canRead;
  };
  const auditWriterEmail = () => audit.email;

  return {
    setCloudScope, setDonationSplit, donationSplitActive, setAllowedPurposes,
    setSupEnforce, supEnforceActive, setAuditContext, auditWriterEmail,
    pushAuditRing, pullAuditRing, pushDonations, migrateDonationsToCollection,
    migrateSupportersToKeyed, initCloud, cloudDb: requireDb, watchAuth, signIn,
    signUp, signOutCloud, resetPassword, changePassword, pushDiff, readCloudEnvelope,
    writeCloudEnvelope, encryptExistingCloud, pullAll, subscribeAll, fetchNedarimDonors,
    fetchIncomingPayments, fetchProviderRows, pullNedarim, pullSola, markIncomingPayment,
    watchIncomingPayments, writeSmsOutbox, writeMailOutbox,
  };
}
