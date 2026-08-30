import { encryptDb as __pure_encryptDb } from './encrypt-db.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_encrypt_db_T = {
  k1: "raw",
  k2: "AES-GCM",
  k3: "encrypt",
  k4: "decrypt",
  tbl1: 600000,
};
const encryptDb = (...a) => __pure_encryptDb(...a, ...Array(Math.max(0, 7 - a.length)).fill(undefined), __d_encrypt_db_T);
let f = 0;
const err = (m) => { console.error('✗ ' + m); f = 1; };

// שקעי-בדיקה מתעדים
function spies() {
  const log = { rand: [], derive: [], aes: [] };
  const rand = (n) => { log.rand.push(n); return new Uint8Array(n).fill(n === 32 ? 7 : 3); };
  const deriveWrapKey = async (secret, salt, iter) => { log.derive.push([secret, salt, iter]); return { wrap: secret }; };
  const aesEnc = async (key, plain) => { log.aes.push([key, plain]); return 'IV:CT'; };
  const b64 = () => 'B64';
  return { log, rand, deriveWrapKey, aesEnc, b64 };
}

// 1: צורת-הפלט — $enc:2 ו-iter:600000
{ const s = spies();
  const env = await encryptDb('{}', 'סוד', 'מפתח', s.rand, s.deriveWrapKey, s.aesEnc, s.b64);
  if (env.$enc !== 2 || env.iter !== 600000) err(`$enc/iter ⇒ ${env.$enc}/${env.iter}`); }

// 2+3: סדר-הקריאות והפרמטרים המדויקים
{ const s = spies();
  await encryptDb('{"a":1}', 'סוד', 'מפתח', s.rand, s.deriveWrapKey, s.aesEnc, s.b64);
  if (JSON.stringify(s.log.rand) !== '[32,16,16]') err(`rand ⇒ ${JSON.stringify(s.log.rand)} ≠ [32,16,16]`);
  const [d1, d2] = s.log.derive;
  if (s.log.derive.length !== 2 || d1[0] !== 'סוד' || d2[0] !== 'מפתח' || d1[2] !== 600000 || d2[2] !== 600000) err('deriveWrapKey: (סיסמה,·,600000) ואז (שחזור,·,600000)');
  if (d1[1] === d2[1] || d1[1].length !== 16 || d2[1].length !== 16) err('מלח-הסיסמה ≠ מלח-השחזור, שניהם 16 בייט');
  if (s.log.aes.length !== 3) err(`aesEnc נקרא ${s.log.aes.length} ≠ 3`);
  else {
    const [a1, a2, a3] = s.log.aes;
    if (a1[1] !== a2[1] || a1[1].length !== 32) err('שתי העטיפות על אותו dekRaw (32 בייט)');
    if (new TextDecoder().decode(a3[1]) !== '{"a":1}') err('העטיפה השלישית על בייטי-ה-JSON');
    if (a1[0].wrap !== 'סוד' || a2[0].wrap !== 'מפתח') err('עטיפה 1 ב-kPass, עטיפה 2 ב-kRec');
  } }

// 4+5: מסלול-אמת WebCrypto — שקעים כהגדרות-המקור, שני המנעולים פותחים
{ const b64 = (buf) => { const u = buf instanceof Uint8Array ? buf : new Uint8Array(buf); let s = ''; for (const b of u) s += String.fromCharCode(b); return btoa(s); };
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const rand = (n) => crypto.getRandomValues(new Uint8Array(n));
  const deriveWrapKey = async (secret, salt, iter) => {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  };
  const aesEnc = async (key, plain) => { const iv = rand(12); const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain); return b64(iv) + ':' + b64(ct); };
  const aesDec = async (key, blob) => { const [ivB, ctB] = blob.split(':'); return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(ivB) }, key, unb64(ctB))); };
  const json = '{"שלום":1}';
  const env = await encryptDb(json, 'סיסמה-חזקה', 'ABCD-EFGH', rand, deriveWrapKey, aesEnc, b64);
  const openVia = async (secret, saltB64) => {
    const k = await deriveWrapKey(secret, unb64(saltB64), env.iter);
    const dekRaw = await aesDec(k, secret === 'סיסמה-חזקה' ? env.wrapPass : env.wrapRec);
    const dek = await crypto.subtle.importKey('raw', dekRaw, 'AES-GCM', false, ['decrypt']);
    return new TextDecoder().decode(await aesDec(dek, env.data));
  };
  if (await openVia('סיסמה-חזקה', env.saltPass) !== json) err('מסלול-אמת: הסיסמה לא פתחה את הנתונים');
  if (await openVia('ABCD-EFGH', env.saltRec) !== json) err('מסלול-אמת: מפתח-השחזור לא פתח את הנתונים'); }

if (f) process.exit(1);
console.log('✓ encrypt-db: 5 דוגמאות-חוזה — ירוק (כולל מסלול-אמת PBKDF2 שני-מנעולים)');
