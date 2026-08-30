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
import { normSearch as __pure_normSearch } from '../atoms/norm-search.mjs';
import { NORM_SEARCH_T as __d_normSearch_NORM_SEARCH_T } from '../atoms/norm-search-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const normSearch = (...a) => __pure_normSearch(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_normSearch_NORM_SEARCH_T);
import { nameSortKey as _nameSortKey } from '../atoms/name-sort-key.mjs';
import { CLEARING_PROVIDERS } from '../atoms/clearing-providers.mjs';
import { providerClearer as __pure_providerClearer } from '../atoms/provider-clearer.mjs';
import { PROVIDER_CLEARER_T as __d_providerClearer_PROVIDER_CLEARER_T } from '../atoms/provider-clearer-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const providerClearer = (...a) => __pure_providerClearer(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_providerClearer_PROVIDER_CLEARER_T);
import { chargeToHist as __pure_chargeToHist } from '../atoms/charge-to-hist.mjs';
import { CHARGE_TO_HIST_T as __d_charge_to_hist_T } from '../atoms/charge-to-hist-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const _chargeToHist = (...a) => __pure_chargeToHist(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_charge_to_hist_T);
import { chargeDedupKey as __pure_chargeDedupKey } from '../atoms/charge-dedup-key.mjs';
import { CHARGE_DEDUP_KEY_T as __d_chargeDedupKey_CHARGE_DEDUP_KEY_T } from '../atoms/charge-dedup-key-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const chargeDedupKey = (...a) => __pure_chargeDedupKey(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_chargeDedupKey_CHARGE_DEDUP_KEY_T);
import { withNedarimHok as __pure_withNedarimHok } from '../atoms/with-nedarim-hok.mjs';
import { WITH_NEDARIM_HOK_T as __d_withNedarimHok_WITH_NEDARIM_HOK_T } from '../atoms/with-nedarim-hok-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _withNedarimHok = (...a) => __pure_withNedarimHok(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_withNedarimHok_WITH_NEDARIM_HOK_T);
import { detectRecurringHok as __pure_detectRecurringHok } from '../atoms/detect-recurring-hok.mjs';
import { DETECT_RECURRING_HOK_T as __d_detectRecurringHok_DETECT_RECURRING_HOK_T } from '../atoms/detect-recurring-hok-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _detectRecurringHok = (...a) => __pure_detectRecurringHok(...a, ...Array(Math.max(0, 7 - a.length)).fill(undefined), __d_detectRecurringHok_DETECT_RECURRING_HOK_T);
import { candidateSupportersForCharge as __pure_candidateSupportersForCharge } from '../atoms/candidate-supporters-for-charge.mjs';
import { CANDIDATE_SUPPORTERS_FOR_CHARGE_T as __d_candidateSupportersForCharge_CANDIDATE_SUPPORTERS_FOR_CHARGE_T } from '../atoms/candidate-supporters-for-charge-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _candidateSupportersForCharge = (...a) => __pure_candidateSupportersForCharge(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_candidateSupportersForCharge_CANDIDATE_SUPPORTERS_FOR_CHARGE_T);
import { fillCardFromCharge as _fillCardFromCharge } from '../atoms/fill-card-from-charge.mjs';
import { attachChargeTo as _attachChargeTo } from '../atoms/attach-charge-to.mjs';
import { relabelHistByTxn } from '../atoms/relabel-hist-by-txn.mjs';
import { repairCardsFromRows as _repairCardsFromRows } from '../atoms/repair-cards-from-rows.mjs';
import { strongMatchForCharge as __pure_strongMatchForCharge } from '../atoms/strong-match-for-charge.mjs';
import { CANDIDATE_SUPPORTERS_FOR_CHARGE_T as __d_strongMatchForCharge_STRONG_MATCH_FOR_CHARGE_T } from '../atoms/candidate-supporters-for-charge-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _strongMatchForCharge = (...a) => __pure_strongMatchForCharge(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_strongMatchForCharge_STRONG_MATCH_FOR_CHARGE_T);
import { autoMatchCharges as _autoMatchCharges } from '../atoms/auto-match-charges.mjs';
import { attachChargesBulk as _attachChargesBulk } from '../atoms/attach-charges-bulk.mjs';
import { planNedarimSync as __pure_planNedarimSync } from '../atoms/plan-nedarim-sync.mjs';
import { PLAN_NEDARIM_SYNC_T as __d_planNedarimSync_PLAN_NEDARIM_SYNC_T } from '../atoms/plan-nedarim-sync-strings.mjs';
import { LIB_NEDARIM_SYNC_TERMS } from '../atoms/lib-nedarim-sync-terms.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _planNedarimSync = (...a) => __pure_planNedarimSync(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_planNedarimSync_PLAN_NEDARIM_SYNC_T);

// ── מילון-החיווט (הכרעה שחיה בקופסה, verbatim מהמקור) ──
// תארים/כינויי-כבוד עבריים למפתח-שם חסין-סדר (validate.ts:73-80). מילון-תוויות
// = ידע-קופסה (חוק-5) — לא אטום; מוזרק ל-name-sort-key.
const NAME_TITLES = new Set([
  LIB_NEDARIM_SYNC_TERMS.k1, LIB_NEDARIM_SYNC_TERMS.k2, LIB_NEDARIM_SYNC_TERMS.k3, LIB_NEDARIM_SYNC_TERMS.k4, LIB_NEDARIM_SYNC_TERMS.k5, LIB_NEDARIM_SYNC_TERMS.k6, LIB_NEDARIM_SYNC_TERMS.k7, LIB_NEDARIM_SYNC_TERMS.k8, LIB_NEDARIM_SYNC_TERMS.k9, LIB_NEDARIM_SYNC_TERMS.k10, LIB_NEDARIM_SYNC_TERMS.k11, LIB_NEDARIM_SYNC_TERMS.k12, LIB_NEDARIM_SYNC_TERMS.k13,
  LIB_NEDARIM_SYNC_TERMS.k14, LIB_NEDARIM_SYNC_TERMS.k15, LIB_NEDARIM_SYNC_TERMS.k16, LIB_NEDARIM_SYNC_TERMS.k17, LIB_NEDARIM_SYNC_TERMS.k18, LIB_NEDARIM_SYNC_TERMS.k19, LIB_NEDARIM_SYNC_TERMS.k20,
  LIB_NEDARIM_SYNC_TERMS.k21, LIB_NEDARIM_SYNC_TERMS.k22, LIB_NEDARIM_SYNC_TERMS.k23, LIB_NEDARIM_SYNC_TERMS.k24, LIB_NEDARIM_SYNC_TERMS.k25, LIB_NEDARIM_SYNC_TERMS.k26, LIB_NEDARIM_SYNC_TERMS.k27, LIB_NEDARIM_SYNC_TERMS.k28, LIB_NEDARIM_SYNC_TERMS.k29, LIB_NEDARIM_SYNC_TERMS.k30, LIB_NEDARIM_SYNC_TERMS.k31,
]);

// מפתח-שם חסין-סדר: name-sort-key מוזרק normSearch (אטום) + NAME_TITLES (מילון-קופסה).
const nameSortKey = (t) => _nameSortKey(t, normSearch, NAME_TITLES);

// ── שקעי-הצמדה (glue) — עוזרים module-private במקור שלא קודמו כאטומים ──
// nedarimSync.ts:88-104 — מפתחות-שיוך של רשומה (ext/id/ph/em/namecity) — עקבי עם מנוע-הדדופ.
const keysOf = (o) => {
  const ks = [];
  const ext = (o.extId || '').trim();
  if (ext) ks.push(LIB_NEDARIM_SYNC_TERMS.k35 + ext);
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
  if (txn) return LIB_NEDARIM_SYNC_TERMS.k36 + txn;
  const ref = (h.ref || '').trim();
  return ref ? LIB_NEDARIM_SYNC_TERMS.k37 + ref : '';
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
  const notes = [d.notes, extraPhones.length ? LIB_NEDARIM_SYNC_TERMS.k32 + extraPhones.join(', ') : '']
    .map((s) => (s || '').trim())
    .filter(Boolean)
    .join(' · ');
  return {
    id: LIB_NEDARIM_SYNC_TERMS.k38 + d.toremId,
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
    ? LIB_NEDARIM_SYNC_TERMS.k38 + c.toremId
    : anon
      ? LIB_NEDARIM_SYNC_TERMS.k39
      : LIB_NEDARIM_SYNC_TERMS.k40 + (c.txnId || String(seq));
  return {
    id,
    name: (c.name || (anon ? LIB_NEDARIM_SYNC_TERMS.k33 : LIB_NEDARIM_SYNC_TERMS.k34)).trim(),
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
