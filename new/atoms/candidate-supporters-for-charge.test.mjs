import { candidateSupportersForCharge } from './candidate-supporters-for-charge.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקעים-מדומים תואמי-חוזה (קידומות ext:/id:/ph:/em:; שם = טוקנים ממוינים)
const keysOf = (o) => {
  const ks = [];
  if (o.extId) ks.push('ext:' + String(o.extId).trim());
  const id = o.idNum || o.zeout;
  if (id) ks.push('id:' + String(id).trim());
  if (o.phone) ks.push('ph:' + String(o.phone).trim());
  if (o.email) ks.push('em:' + String(o.email).trim().toLowerCase());
  return ks;
};
const nameSortKey = (t) => String(t || '').trim().toLowerCase().split(/\s+/).filter(Boolean).sort().join(' ');
const run = (charge, sps, limit = 8) => candidateSupportersForCharge(charge, sps, limit, keysOf, nameSortKey);
// 1) מפתח-חזק ext — בדיוק התואם
const a = { extId: 'T1' }, b = { extId: 'T9' };
let got = run({ toremId: 'T1' }, [a, b]);
ok(got.length === 1 && got[0] === a, 'ext לא בורר בדיוק את התואם');
// 2) דירוג ext(5) → ph(3) → em(2) → שם(1)
const spName = { name: 'כהן ישראל' };
const spEm = { email: 'X@Y.com' };
const spPh = { phone: '0501234567' };
const spExt = { extId: 'T1' };
got = run({ toremId: 'T1', phone: '0501234567', email: 'x@y.com', name: 'ישראל כהן' }, [spName, spEm, spPh, spExt]);
ok(got.length === 4 && got[0] === spExt && got[1] === spPh && got[2] === spEm && got[3] === spName, 'סדר-הדירוג שגוי');
// 3) שם חד-מילתי — לא מועמד
ok(run({ name: 'ישראל' }, [{ name: 'ישראל' }]).length === 0, 'שם חד-מילתי עבר');
// 4) שם דו-מילתי חסין-סדר
const rev = { name: 'ישראל כהן' };
got = run({ name: 'כהן ישראל' }, [rev]);
ok(got.length === 1 && got[0] === rev, 'שם הפוך-סדר לא נמצא');
// 5) limit נאכף
got = run({ toremId: 'T1' }, [{ extId: 'T1' }, { extId: 'T1' }, { extId: 'T1' }], 2);
ok(got.length === 2, 'limit=2 לא נאכף');
// 6) אפס התאמה
ok(run({ toremId: 'T1', name: 'משה לוי' }, [{ extId: 'T2', name: 'דוד כץ' }]).length === 0, 'אי-התאמה ≠ []');
if (f) process.exit(1);
console.log('✓ candidate-supporters-for-charge: 6 דוגמאות-חוזה — ירוק');
