import { decryptDoc } from './decrypt-doc.mjs';
// שקעי-אמת כהגדרות-המקור (cloudCrypto.ts)
const isEncDoc = (d) => !!d && typeof d === 'object' && typeof d.enc === 'string' && typeof d.iv === 'string';
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const b64 = (u) => btoa(String.fromCharCode(...new Uint8Array(u)));
const encryptDoc = async (plain, dek) => { const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, dek, new TextEncoder().encode(JSON.stringify(plain)));
  return { enc: b64(ct), iv: b64(iv) }; };
let f = 0;
const dek = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
// 1: plaintext ⇒ אותה רפרנס
{ const d = { id: 'f1', name: 'משה' };
  if ((await decryptDoc(d, dek, isEncDoc, unb64)) !== d) { console.error('✗ plaintext לא הוחזר כרפרנס'); f = 1; } }
// 2: round-trip מוצפן
{ const plain = { id: 's7', ils: 120, name: 'שרה' };
  const got = await decryptDoc(await encryptDoc(plain, dek), dek, isEncDoc, unb64);
  if (JSON.stringify(got) !== JSON.stringify(plain) || got.id !== 's7' || got.ils !== 120) { console.error(`✗ round-trip ⇒ ${JSON.stringify(got)}`); f = 1; } }
// 3: enc שאינו מחרוזת ⇒ עובר כמו-שהוא
{ const d = { enc: 7, iv: 'AAAA' };
  if ((await decryptDoc(d, dek, isEncDoc, unb64)) !== d) { console.error('✗ enc-לא-מחרוזת פוענח בטעות'); f = 1; } }
// 4: DEK אחר ⇒ נדחה
{ const other = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  let threw = false;
  try { await decryptDoc(await encryptDoc({ a: 1 }, dek), other, isEncDoc, unb64); } catch { threw = true; }
  if (!threw) { console.error('✗ מפתח-שגוי לא נדחה'); f = 1; } }
if (f) process.exit(1);
console.log('✓ decrypt-doc: 4 דוגמאות-חוזה — ירוק');
