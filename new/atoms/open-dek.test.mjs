import { openDek as __pure_openDek } from './open-dek.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_open_dek_T = {
  k1: "pass",
  k2: "raw",
  k3: "AES-GCM",
  k4: "encrypt",
  k5: "decrypt",
};
const openDek = (...a) => __pure_openDek(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_open_dek_T);

/* מימושי-השקעים (העתק-מקור maor/src/lib/crypto.ts) + עזרי-בנייה למעטפת-הבדיקה.
   הבדיקה מייבאת רק את האטום שלה; WebCrypto = גלובלי-סטנדרט. */
const b64 = (buf) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
};
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const enc = new TextEncoder();
async function deriveWrapKey(secret, salt, iter) {
  const base = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' },
    base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'],
  );
}
async function aesEnc(key, plain) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain);
  return b64(iv) + ':' + b64(ct);
}
async function aesDec(key, blob) {
  const [ivB, ctB] = blob.split(':');
  const buf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(ivB) }, key, unb64(ctB));
  return new Uint8Array(buf);
}

// מעטפת-בדיקה: DEK = בייטים 0..31, iter=1000 (לא 600K — הוכחת כיבוד env.iter).
const DEK = new Uint8Array([...Array(32).keys()]);
const ITER = 1000;
const PASS = 'sod-123';
const REC = 'MFTQ-1234';
const saltPass = new Uint8Array(16).fill(7);
const saltRec = new Uint8Array(16).fill(9);
const env = {
  $enc: 2, iter: ITER,
  saltPass: b64(saltPass), saltRec: b64(saltRec),
  wrapPass: await aesEnc(await deriveWrapKey(PASS, saltPass, ITER), DEK),
  wrapRec: await aesEnc(await deriveWrapKey(REC, saltRec, ITER), DEK),
  data: 'לא-רלוונטי',
};
const open = (e, s, v) => openDek(e, s, v, unb64, deriveWrapKey, aesDec);

let f = 0;
const chk = (name, ok) => { if (!ok) { console.error('✗ ' + name); f = 1; } };

// 1. via='pass' — DEK נכון, CryptoKey תקני
const k1 = await open(env, PASS, 'pass');
chk('pass ⇒ CryptoKey', !!k1 && k1.type === 'secret' && k1.algorithm.name === 'AES-GCM' && k1.extractable === true);
chk('pass ⇒ raw ≡ 0..31', k1 && b64(new Uint8Array(await crypto.subtle.exportKey('raw', k1))) === b64(DEK));

// 2. via='rec' — אותו DEK דרך saltRec/wrapRec
const k2 = await open(env, REC, 'rec');
chk('rec ⇒ raw ≡ 0..31', !!k2 && b64(new Uint8Array(await crypto.subtle.exportKey('raw', k2))) === b64(DEK));

// 3. סוד שגוי ⇒ null
chk('סוד שגוי ⇒ null', (await open(env, 'sod-999', 'pass')) === null);

// 4. base64 פגום ⇒ null (לא זורק)
chk('salt פגום ⇒ null', (await open({ ...env, saltPass: '!!!' }, PASS, 'pass')) === null);

// 5. כיבוד env.iter — מעטפת שנבנתה ב-1000 נפתחת (לו הגזירה הייתה ב-600K, הפענוח היה נכשל)
chk('env.iter=1000 מכובד', k1 !== null);

if (f) process.exit(1);
console.log('✓ open-dek: 5 דוגמאות-חוזה (round-trip אמיתי ב-WebCrypto) — ירוק');
