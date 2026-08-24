import { autoMatchCharges } from './auto-match-charges.mjs';
// מימוש-שקע לבדיקה — נאמן למקור (nedarimSync.ts keysOf):
const keysOf = (o) => {
  const ks = [];
  const ext = (o.extId || '').trim();
  if (ext) ks.push('ext:' + ext);
  const id = String(o.idNum || o.zeout || '').replace(/\D/g, '');
  if (id) ks.push('id:' + id);
  const ph = String(o.phone || '').replace(/\D/g, '');
  if (ph.length >= 7) ks.push('ph:' + ph);
  const em = (o.email || '').trim().toLowerCase();
  if (em) ks.push('em:' + em);
  return ks;
};
const supporters = [
  { id: 's1', extId: 'E1' },
  { id: 's2', phone: '050-1234567' },
  { id: 's3', email: 'A@b.com' },
  { id: 's4', phone: '050-1234567' }, // טלפון-כפול — s2 גובר
];
const charges = [
  { toremId: 'E1' },
  { phone: '0501234567' },
  { email: 'a@B.com' },
  { zeout: '999' }, // אין-התאמה — לא-בפלט
  { toremId: 'E1', phone: '0501234567' }, // ext חזק מ-ph
];
const out = autoMatchCharges(charges, supporters, keysOf);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(out.length === 4, 'אורך ' + out.length + ' ≠ 4');
ok(out[0].supId === 's1' && out[0].charge === charges[0], 'toremId E1 → s1');
ok(out[1].supId === 's2', 'טלפון-כפול: הראשון-במערך (s2) גובר — קיבלנו ' + out[1].supId);
ok(out[2].supId === 's3', 'אימייל lowercase → s3 — קיבלנו ' + out[2].supId);
ok(!out.some((m) => m.charge === charges[3]), 'חיוב בלי-התאמה לא-בפלט');
ok(out[3].supId === 's1', 'ext חזק מ-ph → s1 — קיבלנו ' + out[3].supId);
if (f) process.exit(1);
console.log('✓ auto-match-charges: 6 דוגמאות-חוזה — ירוק');
