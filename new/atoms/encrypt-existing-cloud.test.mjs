import { encryptExistingCloud } from './encrypt-existing-cloud.mjs';
let f = 0;
const err = (m) => { console.error('✗ ' + m); f = 1; };

const db = { supporters: [{ id: 's1' }], families: [] };
const dek = { key: true };
const diff = { sets: [], deletes: [], meta: null };
const keyMap = { s1: 'k' };

// 1+2: כל שקע נקרא פעם-אחת, עם הרפרנסים המדויקים
{ const calls = { full: [], sup: [], push: [] };
  await encryptExistingCloud(db, dek,
    async (...a) => { calls.push.push(a); },
    (d) => { calls.full.push(d); return diff; },
    (s) => { calls.sup.push(s); return keyMap; });
  if (calls.full.length !== 1 || calls.full[0] !== db) err('fullDbDiff: פעם-אחת עם db עצמו');
  if (calls.sup.length !== 1 || calls.sup[0] !== db.supporters) err('supKeyMapOf: פעם-אחת עם db.supporters');
  if (calls.push.length !== 1 || calls.push[0][0] !== diff || calls.push[0][1] !== dek || calls.push[0][2] !== keyMap)
    err('pushDiff: פעם-אחת עם (diff, dek, keyMap) באותה רפרנס'); }

// 3: await אמיתי — הדגל דלוק כשהאטום חוזר
{ let done = false;
  await encryptExistingCloud(db, dek,
    async () => { await new Promise((r) => setTimeout(r, 10)); done = true; },
    () => diff, () => keyMap);
  if (!done) err('האטום חזר לפני ש-pushDiff סיים'); }

// 4: דחיית pushDiff מתפשטת
{ let threw = false;
  try {
    await encryptExistingCloud(db, dek,
      async () => { throw new Error('כשל-רשת'); },
      () => diff, () => keyMap);
  } catch { threw = true; }
  if (!threw) err('דחיית-pushDiff נבלעה'); }

if (f) process.exit(1);
console.log('✓ encrypt-existing-cloud: 4 דוגמאות-חוזה — ירוק');
