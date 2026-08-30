import { filterDeliveries as __pure_filterDeliveries } from './filter-deliveries.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_filterDeliveries_FILTER_DELIVERIES_T = {
  k1: "pickup",
  k2: "איסוף",
  k3: "enroute",
  k4: "בדרך",
  k5: "נמסר",
};
const filterDeliveries = (...a) => __pure_filterDeliveries(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_filterDeliveries_FILTER_DELIVERIES_T);
const CASES = [[["\"\"","\"\""],"\"\""],[["\"אבג\"","\"\""],"\"אבג\""],[["\"כהן לוי\"","\"\""],"\"כהן לוי\""],[["\"abc\"","\"\""],"\"abc\""],[["\"a@b.com\"","\"\""],"\"a@b.com\""],[["\"2026-08-24\"","\"\""],"\"2026-08-24\""],[["\"2026-08-24T12:00:00\"","\"\""],"\"2026-08-24T12:00:00\""],[["\"0501234567\"","\"\""],"\"0501234567\""],[["\"03-1234567\"","\"\""],"\"03-1234567\""],[["\"https://x.co\"","\"\""],"\"https://x.co\""],[["\"שלום עולם\"","\"\""],"\"שלום עולם\""],[["\"12\"","\"\""],"\"12\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(filterDeliveries(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
// שקע smartFilter (חוק-3) + statusLabel מוטמע (חוק-1) — מוכיח שהמסלול הלא-ריק אינו קורס.
// stub-שקע מסנן לפי getTerms (⇒ statusLabel המוטמע נקרא); pickup⇒'איסוף' תופס רק את השורה הראשונה.
const rows = [{ familyName: 'כהן', volunteerName: 'לוי', status: 'pickup' }, { familyName: 'לוי', volunteerName: 'דוד', status: 'delivered' }];
const stubFilter = (q, items, getTerms) => items.filter((it) => getTerms(it).some((t) => t.includes(q)));
const gotSock = JSON.stringify(filterDeliveries(rows, 'איסוף', stubFilter));
const wantSock = JSON.stringify([rows[0]]);
if (gotSock !== wantSock) { console.error('✗ socket/statusLabel ⇒ ' + gotSock + ' ≠ ' + wantSock); f = 1; }
if (f) process.exit(1); console.log('✓ filter-deliveries: ' + CASES.length + ' הקלטות-Golden + שקע-smartFilter — ירוק');
