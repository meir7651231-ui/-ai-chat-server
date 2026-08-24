import { encryptDoc } from './encrypt-doc.mjs';
let f = 0;
const b64 = (buf) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
};
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const dek = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
const doc = { id: 's7', ils: 120, name: 'שרה' };
// 1: round-trip — פענוח ידני מחזיר שווה-עמוק
const out = await encryptDoc(doc, dek, b64);
if (typeof out.enc !== 'string' || typeof out.iv !== 'string') { console.error('✗ צורת-פלט {enc,iv} מחרוזות'); f = 1; }
{ const buf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(out.iv) }, dek, unb64(out.enc));
  const back = JSON.parse(new TextDecoder().decode(buf));
  if (JSON.stringify(back) !== JSON.stringify(doc)) { console.error(`✗ round-trip ⇒ ${JSON.stringify(back)}`); f = 1; } }
// 2: IV באורך 12 בייט
if (unb64(out.iv).length !== 12) { console.error(`✗ אורך-IV ${unb64(out.iv).length} ≠ 12`); f = 1; }
// 3: טריות-IV — שתי הצפנות של אותו מסמך שונות
{ const out2 = await encryptDoc(doc, dek, b64);
  if (out2.iv === out.iv || out2.enc === out.enc) { console.error('✗ IV/ct חוזרים — אין טריות'); f = 1; } }
// 4: השקע b64 נקרא בדיוק פעמיים — ciphertext ואז IV (אורך 12)
{ const calls = [];
  await encryptDoc(doc, dek, (x) => { calls.push(x); return 'B'; });
  const len = (x) => (x instanceof Uint8Array ? x : new Uint8Array(x)).length;
  if (calls.length !== 2 || len(calls[1]) !== 12 || len(calls[0]) <= 12) { console.error('✗ קריאות-השקע: פעמיים, ct ואז iv-12'); f = 1; } }
// 5: DEK אחר ⇒ זריקת-GCM
{ const other = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  let threw = false;
  try { await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(out.iv) }, other, unb64(out.enc)); } catch { threw = true; }
  if (!threw) { console.error('✗ DEK זר פענח — לא הצפנה אמיתית'); f = 1; } }
if (f) process.exit(1);
console.log('✓ encrypt-doc: 5 דוגמאות-חוזה — ירוק');
