import { createCloudKey } from './create-cloud-key.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };
// 1–3 — מסלול מוצלח + פרוטוקול-הקריאות
const encCalls = [];
const openCalls = [];
const encryptDb = async (j, p, r) => { encCalls.push([j, p, r]); return { v: 2, p, r, j }; };
const openDek = async (env, s, via) => { openCalls.push([env, s, via]); return 'DEK:' + s; };
const out = await createCloudKey('סוד7', 'REC-42', encryptDb, openDek);
chk('1 env+dek', out.dek === 'DEK:סוד7' && out.env.v === 2 && out.env.p === 'סוד7' && out.env.r === 'REC-42' && out.env.j === '');
chk("2 encryptDb פעם אחת עם json=''", encCalls.length === 1 && encCalls[0][0] === '' && encCalls[0][1] === 'סוד7' && encCalls[0][2] === 'REC-42');
chk("3 openDek(env, password, 'pass')", openCalls.length === 1 && openCalls[0][0] === out.env && openCalls[0][1] === 'סוד7' && openCalls[0][2] === 'pass');
// 4 — openDek⇒null זורק
let threw = '';
try { await createCloudKey('x', 'y', async () => ({}), async () => null); } catch (e) { threw = e.message; }
chk('4 null ⇒ זריקה', threw === 'יצירת מפתח-הצפנה נכשלה');
// 5 — שגיאת encryptDb מבעבעת
let bubbled = '';
try { await createCloudKey('x', 'y', async () => { throw new Error('boom'); }, async () => 'd'); } catch (e) { bubbled = e.message; }
chk('5 בעבוע', bubbled === 'boom');
if (f) process.exit(1);
console.log('✓ create-cloud-key: 5 דוגמאות-חוזה (שקעי encryptDb/openDek) — ירוק');
