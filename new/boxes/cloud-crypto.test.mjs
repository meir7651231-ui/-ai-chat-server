#!/usr/bin/env node
/** בדיקת-קצה · קופסת הצפנת-הענן (cloud-crypto). מייבאת אך-ורק את הקופסה-שלה.
 *  מוכיחה את דוגמאות-החוזה 1-9 + מגן-הכרעה (קודק-base64 + חיווט האטומים verbatim). */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import {
  isEncDoc, encryptDoc, decryptDoc, createCloudKey, openCloudKey, isEncrypted,
} from './cloud-crypto.mjs';

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// DEK אמיתי (AES-GCM 256) — סטנדרט-פלטפורמה, מותר בבדיקת-קופסה
async function mkDek(seedByte) {
  const raw = new Uint8Array(32).fill(seedByte);
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', true, ['encrypt', 'decrypt']);
}

// ── 1) isEncDoc (מבני) ──
ok(isEncDoc({ enc: 'a', iv: 'b' }) === true, '1a isEncDoc {enc,iv}');
ok(isEncDoc({ enc: 7, iv: 'b' }) === false, '1b isEncDoc enc לא-מחרוזת');
ok(isEncDoc(null) === false, '1c isEncDoc null');
ok(isEncDoc({ id: 'f1' }) === false, '1d isEncDoc plaintext');

// ── 9) isEncrypted (מעטפת) ──
ok(isEncrypted({ $enc: 2 }) === true, '9a isEncrypted $enc=2');
ok(isEncrypted({ $enc: 1 }) === false, '9b isEncrypted $enc=1');
ok(isEncrypted(null) === false, '9c isEncrypted null');

const run = async () => {
  const dekA = await mkDek(1);
  const dekB = await mkDek(2);

  // ── 2) round-trip ──
  const src = { id: 's7', ils: 120, name: 'שרה' };
  const doc = await encryptDoc(src, dekA);
  ok(typeof doc.enc === 'string' && typeof doc.iv === 'string', '2a enc+iv base64-strings');
  ok(isEncDoc(doc), '2b התוצאה היא EncDoc');
  const back = await decryptDoc(doc, dekA);
  ok(back.id === 's7' && back.ils === 120 && back.name === 'שרה', '2c פענוח שווה-עמוק (כולל עברית)');

  // ── 3) IV-טרי ──
  const doc2 = await encryptDoc(src, dekA);
  ok(doc.iv !== doc2.iv, '3 IV שונה בין שתי הצפנות');

  // ── 4) plaintext-passthrough (אותה רפרנס) ──
  const pt = { id: 'f1', name: 'משה' };
  const passed = await decryptDoc(pt, dekA);
  ok(passed === pt, '4 plaintext מוחזר כאותה רפרנס');

  // ── 5) DEK-שגוי ⇒ דחייה ──
  let rejected = false;
  try { await decryptDoc(doc, dekB); } catch { rejected = true; }
  ok(rejected, '5 DEK שגוי ⇒ ההבטחה נדחית (GCM-auth)');

  // ── 6) createCloudKey · שקעים דטרמיניסטיים ──
  let encCalls = 0, encFirstArg, openCallArgs;
  const encryptDb = async (j, p, r) => { encCalls++; encFirstArg = j; return { v: 2, p, r, j }; };
  const openDek = async (env, s, via) => { openCallArgs = [env, s, via]; return 'DEK:' + s; };
  const res = await createCloudKey('סוד7', 'REC-42', { encryptDb, openDek });
  ok(JSON.stringify(res.env) === JSON.stringify({ v: 2, p: 'סוד7', r: 'REC-42', j: '' }), '6a env');
  ok(res.dek === 'DEK:סוד7', '6b dek חי');
  ok(encCalls === 1 && encFirstArg === '', '6c encryptDb פעם-אחת, json ריק');
  ok(openCallArgs[1] === 'סוד7' && openCallArgs[2] === 'pass', "6d openDek(env, password, 'pass')");
  ok(openCallArgs[0].p === 'סוד7', '6e openDek קיבל את ה-env שחזר');

  // ── 7) createCloudKey · openDek⇒null ⇒ זריקה ──
  let threw = null;
  try {
    await createCloudKey('x', 'y', { encryptDb: async () => ({}), openDek: async () => null });
  } catch (e) { threw = e; }
  ok(threw instanceof Error && threw.message === 'יצירת מפתח-הצפנה נכשלה', '7 openDek=null ⇒ Error');

  // ── 8) openCloudKey · האצלה שקופה ──
  const S = Symbol('sentinel');
  let spyCalls = 0, spyArgs;
  const spy = (env, secret, via) => { spyCalls++; spyArgs = [env, secret, via]; return S; };
  const envRef = { iter: 1000 };
  const out = openCloudKey(envRef, 'סוד', 'pass', { openDek: spy });
  ok(out === S, '8a מחזיר בדיוק את ערך-השקע (אותה רפרנס)');
  ok(spyCalls === 1 && spyArgs[0] === envRef && spyArgs[1] === 'סוד' && spyArgs[2] === 'pass', '8b נקרא פעם-אחת עם אותם ארגומנטים');
  const out2 = openCloudKey(envRef, 'ריק', 'rec', { openDek: (e, s, v) => v });
  ok(out2 === 'rec', "8c via='rec' מועבר verbatim");
  const outNull = await openCloudKey(envRef, 'x', 'pass', { openDek: () => Promise.resolve(null) });
  ok(outNull === null, '8d null (סוד-שגוי) מחלחל בלי עטיפה');

  // 🛡 מגן-הכרעה: הקודק b64/unb64 + חיווט-האטומים verbatim בקוד-הקופסה
  const box = readFileSync(new URL('./cloud-crypto.mjs', import.meta.url), 'utf8');
  ok(box.includes('buf instanceof Uint8Array ? buf : new Uint8Array(buf)'), 'מגן: b64 מטפל ב-ArrayBuffer+Uint8Array');
  ok(box.includes('for (const b of bytes) s += String.fromCharCode(b)'), 'מגן: b64 לולאת-הקידוד');
  ok(box.includes('return btoa(s)'), 'מגן: b64 btoa');
  ok(box.includes('Uint8Array.from(atob(s), (c) => c.charCodeAt(0))'), 'מגן: unb64 verbatim');
  ok(box.includes('encDocAtom(plain, dek, b64)'), 'מגן: encrypt-doc מוזרק b64');
  ok(box.includes('decDocAtom(d, dek, isEncDoc, unb64)'), 'מגן: decrypt-doc מוזרק isEncDoc+unb64');
  ok(box.includes("createCloudKeyAtom(password, recoveryKey, encryptDb, openDek)"), 'מגן: create-cloud-key חיווט');
  ok(box.includes('openCloudKeyAtom(env, secret, via, openDek)'), 'מגן: open-cloud-key חיווט');

  if (f) process.exit(1);
  console.log('✓ קופסת הצפנת-ענן: 9 דוגמאות-חוזה (isEncDoc/isEncrypted · round-trip+עברית · IV-טרי · passthrough-רפרנס · DEK-שגוי-נדחה · create/open-שקעים) + 8 מגני-הכרעה');
};

run().catch((e) => { console.error('✗ חריגה לא-צפויה', e); process.exit(1); });
