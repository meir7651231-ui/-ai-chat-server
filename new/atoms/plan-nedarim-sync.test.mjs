import { planNedarimSync as __pure_planNedarimSync } from './plan-nedarim-sync.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_planNedarimSync_PLAN_NEDARIM_SYNC_T = {
  k1: "extId",
  k2: "phone",
  k3: "email",
  k4: "address",
  k5: "idNum",
  k6: 40,
};
const planNedarimSync = (...a) => __pure_planNedarimSync(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_planNedarimSync_PLAN_NEDARIM_SYNC_T);

/* ── שקעי-ייחוס נאמנים למקור (maor/src/lib/nedarimSync.ts + dedup.ts + validate.ts)
   — מקומיים לבדיקה; הבדיקה מייבאת רק את האטום שלה (חוק-4). ── */
const normPhone = (s) => {
  let d = (s || '').replace(/\D/g, '');
  if (/^(\d)\1+$/.test(d)) return '';
  d = d.replace(/^00/, '');
  if (d.startsWith('972')) d = '0' + d.slice(3);
  return d.replace(/^0{2,}/, '0');
};
const normId = (s) => {
  const d = (s || '').replace(/\D/g, '');
  if (!d || /^0+$/.test(d)) return '';
  if (d.replace(/^0+/, '').length < 4) return '';
  return d.length >= 5 ? d : '';
};
const normSearch = (t) => String(t || '').toLowerCase().replace(/['"׳״\-–._]/g, '').trim();
const nameSortKey = (t) => normSearch(t).split(/\s+/).filter(Boolean).sort().join(' ');
const keysOf = (o) => {
  const ks = [];
  const ext = (o.extId || '').trim();
  if (ext) ks.push('ext:' + ext);
  const id = normId(o.idNum || o.zeout);
  if (id) ks.push('id:' + id);
  for (const p of [o.phone, o.phone2, o.phone3]) {
    const ph = normPhone(p || '');
    if (ph.length >= 7) ks.push('ph:' + ph);
  }
  const em = (o.email || '').trim().toLowerCase();
  if (em) ks.push('em:' + em);
  const n = normSearch(o.name || '');
  const c = normSearch(o.city || '');
  if (n && c) ks.push('nc:' + n + '|' + c);
  return ks;
};
const curOf = (c) => {
  const raw = String(c.currency || '').trim();
  return raw === '$' || raw === '2' || /usd|\$|דולר/i.test(raw) ? '$' : '₪';
};
const chargeToHist = (c) => {
  const h = { d: (c.d || (c.at || '').slice(0, 10) || '').trim(), a: c.amount, c: curOf(c), clearer: 'נדרים' };
  const txn = (c.txnId || '').trim();
  const ref = (c.reference || '').trim();
  const keva = (c.kevaId || '').trim();
  if (txn) h.txn = txn;
  if (ref) h.ref = ref;
  if (keva) h.kevaId = keva;
  return h;
};
const chargeDedupKey = (c) => {
  const txn = (c.txnId || '').trim();
  if (txn) return 'txn:' + txn;
  const ref = (c.reference || '').trim();
  return ref ? 'ref:' + ref : '';
};
const histDedupKey = (h) => {
  const txn = (h.txn || '').trim();
  if (txn) return 'txn:' + txn;
  const ref = (h.ref || '').trim();
  return ref ? 'ref:' + ref : '';
};
const withNedarimHok = (sp, c) => {
  if (!(c.amount > 0)) return sp;
  const keva = (c.kevaId || '').trim();
  if (!keva) return sp;
  if (sp.hok && !sp.hok.kevaId) return sp; // הו"ק ידני — לא דורסים
  const cd = (c.d || c.at || '').slice(0, 10);
  const day = Number(cd.slice(8, 10));
  return {
    ...sp,
    hok: { amount: c.amount, cur: curOf(c), day: isFinite(day) && day >= 1 ? Math.min(28, day) : 1, method: 'card', active: true, startedAt: cd, kevaId: keva },
  };
};
const supFromDonor = (d) => ({
  id: 'sup-ned-' + d.toremId,
  name: (d.name || '').trim(),
  phone: (d.phone || d.phone2 || d.phone3 || '').trim(),
  email: (d.email || '').trim(),
  address: (d.address || '').trim(),
  city: '', idNum: normId(d.zeout) ? String(d.zeout).replace(/\D/g, '') : '',
  extId: d.toremId, cat: '', forWho: '', notes: '',
  count: 0, ils: 0, usd: 0, first: '', last: '', nextDate: '', donations: [],
});
const supFromCharge = (c, seq) => {
  const anon = !c.toremId && !nameSortKey(c.name || '');
  const id = c.toremId ? 'sup-ned-' + c.toremId : anon ? 'sup-ned-unassigned' : 'sup-ned-txn-' + (c.txnId || String(seq));
  return {
    id, name: (c.name || (anon ? 'תרומות נדרים ללא שיוך' : 'תורם נדרים')).trim(),
    phone: (c.phone || '').trim(), email: (c.email || '').trim(), address: '', city: '',
    idNum: normId(c.zeout) ? String(c.zeout).replace(/\D/g, '') : '',
    ...(c.toremId ? { extId: c.toremId } : {}),
    cat: (c.category || '').trim(), forWho: '', notes: '',
    count: 0, ils: 0, usd: 0, first: '', last: '', nextDate: '', donations: [],
  };
};
const deps = { nameSortKey, keysOf, normId, supFromDonor, supFromCharge, histDedupKey, chargeDedupKey, chargeToHist, withNedarimHok, curOf };

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// דוגמה 1 — תורם תואם-extId ⇒ העשרה (מילוי-ריק בלבד)
{
  const r = planNedarimSync(
    [{ id: 's1', name: 'דוד כהן', extId: 'T1', phone: '', email: '' }],
    [{ toremId: 'T1', name: 'דוד כהן', phone: '0501234567', email: 'a@b.c' }],
    [], {}, deps,
  );
  ok(r.summary.updatedSupporters === 1, '1: updatedSupporters=1 ⇐ ' + r.summary.updatedSupporters);
  ok(r.summary.newSupporters === 0, '1: newSupporters=0');
  ok(r.supporters[0].phone === '0501234567', '1: phone מולא ⇐ ' + r.supporters[0].phone);
  ok(r.updatedNames.join(',') === 'דוד כהן', '1: updatedNames');
}
// דוגמה 2 — תורם בלי-התאמה ⇒ כרטיס חדש דטרמיניסטי
{
  const r = planNedarimSync([], [{ toremId: 'T2', name: 'שרה לוי' }], [], {}, deps);
  ok(r.summary.newSupporters === 1, '2: newSupporters=1');
  ok(r.supporters[0].id === 'sup-ned-T2', '2: id=sup-ned-T2 ⇐ ' + r.supporters[0].id);
  ok(r.newNames.join(',') === 'שרה לוי', '2: newNames');
}
// דוגמה 3 — קישור-לפי-שם חסין-סדר (ת"ז-אפסים של נדרים אינה מפתח)
{
  const r = planNedarimSync(
    [{ id: 's1', name: 'כהן דוד' }],
    [{ toremId: 'T9', name: 'דוד כהן', zeout: '000000000' }],
    [], {}, deps,
  );
  ok(r.summary.updatedSupporters === 1 && r.summary.newSupporters === 0, '3: התאמה-לפי-שם');
  ok(r.supporters[0].extId === 'T9', '3: extId נקבע ⇐ ' + r.supporters[0].extId);
}
// דוגמה 4 — דדופ-עסקה לפי txn ⇒ handled בלי כפל
{
  const r = planNedarimSync(
    [{ id: 's1', name: 'דוד כהן', extId: 'T1', hist: [{ d: '2026-01-01', a: 100, c: '₪', txn: '99' }] }],
    [],
    [{ id: 'c1', amount: 100, toremId: 'T1', txnId: '99' }],
    {}, deps,
  );
  ok(r.summary.chargesDup === 1 && r.summary.chargesAdded === 0, '4: chargesDup=1, added=0');
  ok(r.summary.ilsAdded === 0, '4: ilsAdded=0');
  ok(r.handledChargeIds.join(',') === 'c1', '4: handled=[c1]');
  ok(r.supporters[0].hist.length === 1, '4: hist באורך 1');
}
// דוגמה 5 — זיכוי מקושר-בשם ⇒ שורת-hist שלילית, בלי הו"ק, נטו שלילי
{
  const r = planNedarimSync(
    [{ id: 's1', name: 'דוד כהן' }],
    [],
    [{ id: 'c2', amount: -50, name: 'כהן דוד', d: '2026-02-01' }],
    {}, deps,
  );
  ok(r.summary.refundsApplied === 1, '5: refundsApplied=1');
  ok(r.summary.ilsAdded === -50, '5: ilsAdded=-50 ⇐ ' + r.summary.ilsAdded);
  ok(r.summary.chargesNoTxn === 1, '5: chargesNoTxn=1 (אין txn/ref)');
  ok(r.supporters[0].hist.length === 1 && r.supporters[0].hist[0].a === -50, '5: שורת-hist a=-50');
  ok(!r.supporters[0].hok, '5: אין hok מזיכוי');
}
// דוגמה 6 — attachOnly: אין-התאמה ⇒ pending (לא כרטיס, לא handled)
{
  const r = planNedarimSync([], [], [{ id: 'c3', amount: 80, name: 'חדש לגמרי' }], { attachOnly: true }, deps);
  ok(r.summary.chargesSkipped === 1, '6: chargesSkipped=1');
  ok(r.summary.newSupporters === 0 && r.supporters.length === 0, '6: אפס כרטיסים');
  ok(r.handledChargeIds.length === 0, '6: לא מסומן handled');
}
// דוגמה 7 — עסקת-הו"ק יוצרת כרטיס + ממלאת משבצת-הו"ק
{
  const r = planNedarimSync([], [], [{ id: 'c4', amount: 200, toremId: 'T3', name: 'משה', txnId: '500', kevaId: 'K1', d: '2026-03-10' }], {}, deps);
  ok(r.summary.newSupporters === 1, '7: newSupporters=1');
  ok(r.supporters[0].id === 'sup-ned-T3', '7: id=sup-ned-T3');
  ok(r.summary.chargesAdded === 1 && r.summary.recurring === 1, '7: added=1, recurring=1');
  ok(r.summary.ilsAdded === 200, '7: ilsAdded=200');
  ok(r.supporters[0].hok && r.supporters[0].hok.kevaId === 'K1', '7: hok.kevaId=K1');
  ok(r.handledChargeIds.join(',') === 'c4', '7: handled=[c4]');
}

if (f) process.exit(1);
console.log('✓ plan-nedarim-sync: 7 דוגמאות-חוזה — ירוק');
