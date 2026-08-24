/** קופסת-חיבורים · lib-nedarim-sync — מנוע-סנכרון נדרים→מאור (כיוון-נכנס). חוזה: lib-nedarim-sync.contract.md
 *  זה המקום היחיד שבו 15 חוטי-הסנכרון נפגשים (חוקי-החשמלאי, LAW.md). מקור-האמת:
 *  maor/src/lib/nedarimSync.ts — כל חוט חולץ לאטום; החיווט (גרף-הקריאות, סדר-
 *  ההזרקות, ברירות-המחדל, מילון-התוויות NAME_TITLES, ומספר עוזרי-glue module-
 *  private שלא קודמו כאטומים: curOf/keysOf/histDedupKey/hokDayFromDate/monthsAgo/
 *  modeOf/modeStr/supFromDonor/supFromCharge) חי כאן, לא בחוטים.
 *  שקעי-IO אמיתיים: אין — המנוע טהור לגמרי (בלי firebase/DOM/localStorage/fetch).
 *  ה"היום" של detectRecurringHok = פרמטר-todayIso מוזרק (אין Date.now). */
import { normId } from '../atoms/norm-id.mjs';
import { normPhone } from '../atoms/norm-phone.mjs';
import { normSearch } from '../atoms/norm-search.mjs';
import { nameSortKey as _nameSortKey } from '../atoms/name-sort-key.mjs';
import { CLEARING_PROVIDERS } from '../atoms/clearing-providers.mjs';
import { providerClearer } from '../atoms/provider-clearer.mjs';
import { chargeToHist as _chargeToHist } from '../atoms/charge-to-hist.mjs';
import { chargeDedupKey } from '../atoms/charge-dedup-key.mjs';
import { withNedarimHok as _withNedarimHok } from '../atoms/with-nedarim-hok.mjs';
import { detectRecurringHok as _detectRecurringHok } from '../atoms/detect-recurring-hok.mjs';
import { candidateSupportersForCharge as _candidateSupportersForCharge } from '../atoms/candidate-supporters-for-charge.mjs';
import { fillCardFromCharge as _fillCardFromCharge } from '../atoms/fill-card-from-charge.mjs';
import { attachChargeTo as _attachChargeTo } from '../atoms/attach-charge-to.mjs';
import { relabelHistByTxn } from '../atoms/relabel-hist-by-txn.mjs';
import { repairCardsFromRows as _repairCardsFromRows } from '../atoms/repair-cards-from-rows.mjs';
import { strongMatchForCharge as _strongMatchForCharge } from '../atoms/strong-match-for-charge.mjs';
import { autoMatchCharges as _autoMatchCharges } from '../atoms/auto-match-charges.mjs';
import { attachChargesBulk as _attachChargesBulk } from '../atoms/attach-charges-bulk.mjs';
import { planNedarimSync as _planNedarimSync } from '../atoms/plan-nedarim-sync.mjs';

// ── מילון-החיווט (הכרעה שחיה בקופסה, verbatim מהמקור) ──
// תארים/כינויי-כבוד עבריים למפתח-שם חסין-סדר (validate.ts:73-80). מילון-תוויות
// = ידע-קופסה (חוק-5) — לא אטום; מוזרק ל-name-sort-key.
const NAME_TITLES = new Set([
  'ר', 'רבי', 'הרב', 'הרבנית', 'הרהג', 'הרהח', 'הגר', 'מוהרר', 'אדמור', 'מרת', 'מר', 'גב', 'הגב',
  'דר', 'פרופ', 'הבחור', 'הבהח', 'הת', 'משפ', 'משפחת',
  'שליטא', 'זצל', 'זצוקל', 'זקל', 'זל', 'עה', 'היד', 'נרו', 'ניו', 'ני', 'היו',
]);

// מפתח-שם חסין-סדר: name-sort-key מוזרק normSearch (אטום) + NAME_TITLES (מילון-קופסה).
const nameSortKey = (t) => _nameSortKey(t, normSearch, NAME_TITLES);

// ── שקעי-הצמדה (glue) — עוזרים module-private במקור שלא קודמו כאטומים ──
// nedarimSync.ts:88-104 — מפתחות-שיוך של רשומה (ext/id/ph/em/namecity) — עקבי עם מנוע-הדדופ.
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
// nedarimSync.ts:107-110 — מטבע מנורמל מעסקה (תומך '₪'/'$' וגם קידוד-נדרים '1'/'2').
const curOf = (charge) => {
  const raw = String(charge.currency || '').trim();
  return raw === '$' || raw === '2' || /usd|\$|דולר/i.test(raw) ? '$' : '₪';
};
// nedarimSync.ts:153-158 — מפתח-דדופ מרשומת-hist קיימת (מקביל ל-chargeDedupKey).
const histDedupKey = (h) => {
  const txn = (h.txn || '').trim();
  if (txn) return 'txn:' + txn;
  const ref = (h.ref || '').trim();
  return ref ? 'ref:' + ref : '';
};
// nedarimSync.ts:165-168 — יום-החיוב מתאריך-העסקה (1–28 — כך קיים בכל חודש). ברירת-מחדל 1.
const hokDayFromDate = (iso) => {
  const d = Number((iso || '').slice(8, 10));
  return isFinite(d) && d >= 1 ? Math.min(28, Math.floor(d)) : 1;
};
// nedarimSync.ts:200-205 — מספר-החודשים מ-dateIso עד todayIso (0=אותו חודש).
const monthsAgo = (dateIso, todayIso) => {
  const [y1, m1] = dateIso.slice(0, 7).split('-').map(Number);
  const [y2, m2] = todayIso.slice(0, 7).split('-').map(Number);
  if (!y1 || !m1 || !y2 || !m2) return 999;
  return (y2 - y1) * 12 + (m2 - m1);
};
// nedarimSync.ts:208-218 — הערך-השכיח במערך (mode) — ליום-החיוב הטיפוסי.
const modeOf = (nums) => {
  const c = new Map();
  let best = nums[0] ?? 1;
  let bestN = 0;
  for (const n of nums) {
    const k = (c.get(n) ?? 0) + 1;
    c.set(n, k);
    if (k > bestN) { bestN = k; best = n; }
  }
  return best;
};
// nedarimSync.ts:221-231 — המחרוזת-השכיחה (mode) — לסכום|מטבע הטיפוסי של ההו"ק.
const modeStr = (strs) => {
  const c = new Map();
  let best = strs[0] ?? '';
  let bestN = 0;
  for (const s of strs) {
    const k = (c.get(s) ?? 0) + 1;
    c.set(s, k);
    if (k > bestN) { bestN = k; best = s; }
  }
  return best;
};
// nedarimSync.ts:471-498 — כרטיס-תומך חדש מרשומת-תורם נדרים (מזהה דטרמיניסטי).
const supFromDonor = (d) => {
  const phone = (d.phone || d.phone2 || d.phone3 || '').trim();
  const extraPhones = [d.phone2, d.phone3].map((p) => (p || '').trim()).filter((p) => p && p !== phone);
  const notes = [d.notes, extraPhones.length ? 'טל׳ נוספים: ' + extraPhones.join(', ') : '']
    .map((s) => (s || '').trim())
    .filter(Boolean)
    .join(' · ');
  return {
    id: 'sup-ned-' + d.toremId,
    name: d.name.trim(),
    phone,
    email: (d.email || '').trim(),
    address: (d.address || '').trim(),
    city: '',
    idNum: normId(d.zeout) ? String(d.zeout).replace(/\D/g, '') : '',
    extId: d.toremId,
    cat: '',
    forWho: '',
    notes,
    count: 0,
    ils: 0,
    usd: 0,
    first: '',
    last: '',
    nextDate: '',
    donations: [],
  };
};
// nedarimSync.ts:504-531 — כרטיס-תומך חדש מעסקה (כשאין תורם/כרטיס תואם) — אפס-אובדן-חיוב.
const supFromCharge = (c, seq) => {
  const anon = !c.toremId && !nameSortKey(c.name || '');
  const id = c.toremId
    ? 'sup-ned-' + c.toremId
    : anon
      ? 'sup-ned-unassigned'
      : 'sup-ned-txn-' + (c.txnId || String(seq));
  return {
    id,
    name: (c.name || (anon ? 'תרומות נדרים ללא שיוך' : 'תורם נדרים')).trim(),
    phone: (c.phone || '').trim(),
    email: (c.email || '').trim(),
    address: '',
    city: '',
    idNum: normId(c.zeout) ? String(c.zeout).replace(/\D/g, '') : '',
    ...(c.toremId ? { extId: c.toremId } : {}),
    cat: (c.category || '').trim(),
    forWho: '',
    notes: '',
    count: 0,
    ils: 0,
    usd: 0,
    first: '',
    last: '',
    nextDate: '',
    donations: [],
  };
};

// ── החיווט (גרף-הקריאות של nedarimSync.ts, סוקטים מוזרקים) ──
const chargeToHist = (charge) => _chargeToHist(charge, curOf, providerClearer);
const withNedarimHok = (sp, charge) => _withNedarimHok(sp, charge, curOf, hokDayFromDate);
const detectRecurringHok = (supporters, todayIso, minMonths = 3) =>
  _detectRecurringHok(supporters, todayIso, minMonths, CLEARING_PROVIDERS, modeStr, modeOf, monthsAgo);
const candidateSupportersForCharge = (charge, supporters, limit = 8) =>
  _candidateSupportersForCharge(charge, supporters, limit, keysOf, nameSortKey);
const fillCardFromCharge = (sp, charge) => _fillCardFromCharge(sp, charge, normPhone, normId);
const attachChargeTo = (supporters, supId, charge) =>
  _attachChargeTo(supporters, supId, charge, chargeDedupKey, histDedupKey, chargeToHist, fillCardFromCharge, withNedarimHok);
const repairCardsFromRows = (supporters, rows, label) =>
  _repairCardsFromRows(supporters, rows, label, fillCardFromCharge);
const strongMatchForCharge = (charge, supporters) => _strongMatchForCharge(charge, supporters, keysOf);
const autoMatchCharges = (charges, supporters) => _autoMatchCharges(charges, supporters, keysOf);
const attachChargesBulk = (supporters, items) =>
  _attachChargesBulk(supporters, items, histDedupKey, chargeDedupKey, chargeToHist, fillCardFromCharge, withNedarimHok);
const planNedarimSync = (existing, donors, charges, opts = {}) =>
  _planNedarimSync(existing, donors, charges, opts, {
    nameSortKey, keysOf, normId, supFromDonor, supFromCharge, histDedupKey, chargeDedupKey, chargeToHist, withNedarimHok, curOf,
  });

// ── החשיפה (ה-API הפומבי, ביט-זהה לחתימות nedarimSync.ts) ──
export {
  CLEARING_PROVIDERS,
  providerClearer,
  chargeToHist,
  chargeDedupKey,
  withNedarimHok,
  detectRecurringHok,
  candidateSupportersForCharge,
  fillCardFromCharge,
  attachChargeTo,
  relabelHistByTxn,
  repairCardsFromRows,
  strongMatchForCharge,
  autoMatchCharges,
  attachChargesBulk,
  planNedarimSync,
};
