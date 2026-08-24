import { decryptDb } from './decrypt-db.mjs';
let f = 0;
const eq = (name, got, want) => { if (got !== want) { console.error(`✗ ${name} ⇒ ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; } };
// 1+2: שקעי-בדיקה מחזירים בייטים ידועים
eq('בייטי hello', await decryptDb({ data: 'x' }, null, async () => Uint8Array.from([104, 101, 108, 108, 111])), 'hello');
eq('בייטי JSON', await decryptDb({ data: 'x' }, null, async () => new TextEncoder().encode('{"a":1}')), '{"a":1}');
// 3: השקע מקבל בדיוק (dek, env.data), פעם אחת
{ const calls = []; const dek = { k: 1 };
  await decryptDb({ data: 'IV:CT' }, dek, async (key, blob) => { calls.push([key, blob]); return new Uint8Array(); });
  if (calls.length !== 1 || calls[0][0] !== dek || calls[0][1] !== 'IV:CT') { console.error('✗ העברת-פרמטרים לשקע'); f = 1; } }
// 4: מסלול-אמת WebCrypto — aesDec כבמקור ("iv:ct" base64)
{ const b64 = (u) => btoa(String.fromCharCode(...u));
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const aesDec = async (key, blob) => { const [ivB, ctB] = blob.split(':');
    return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(ivB) }, key, unb64(ctB))); };
  const dek = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const json = '{"שלום":"עולם"}';
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, dek, new TextEncoder().encode(json)));
  eq('מסלול-אמת round-trip', await decryptDb({ data: b64(iv) + ':' + b64(ct) }, dek, aesDec), json); }
// 5: שקע זורק ⇒ ההבטחה נדחית
{ let threw = false;
  try { await decryptDb({ data: 'x' }, null, async () => { throw new Error('bad key'); }); }
  catch { threw = true; }
  if (!threw) { console.error('✗ זריקת-שקע נבלעה'); f = 1; } }
if (f) process.exit(1);
console.log('✓ decrypt-db: 5 דוגמאות-חוזה — ירוק');
