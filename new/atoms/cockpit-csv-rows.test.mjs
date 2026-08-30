import { cockpitCsvRows as __pure_cockpitCsvRows } from './cockpit-csv-rows.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_cockpitCsvRows_COCKPIT_CSV_ROWS_T = {
  k1: "שיחה",
  k2: "תודה",
  k3: "הו״ק",
  k4: "קבוצה",
  k5: "שם",
  k6: "טלפון",
  k7: "סיבה",
};
const f = (...a) => __pure_cockpitCsvRows(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_cockpitCsvRows_COCKPIT_CSV_ROWS_T);
const Q = { tasks: [{ kind: 'call', name: 'אבי', phone: '050', reason: 'יעד' }, { kind: 'thanks', name: '', phone: '', reason: 'תרם ₪100 · היום' }, { kind: 'hok', name: 'דן', phone: '052', reason: 'הוק' }], total: 3 };
const want = '[["קבוצה","שם","טלפון","סיבה"],["שיחה","אבי","050","יעד"],["תודה","","","תרם ₪100 · היום"],["הו״ק","דן","052","הוק"]]';
const got = JSON.stringify(f(Q));
if (got !== want) { console.error('✗', got, '≠', want); process.exit(1); }
console.log('✓ cockpit-csv-rows: 1 Golden — ירוק');
