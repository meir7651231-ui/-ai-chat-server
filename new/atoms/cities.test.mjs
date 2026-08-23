import { CITIES } from './cities.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const keys = Object.keys(CITIES);
ok(keys.length === 10, 'מספר-מפתחות ' + keys.length + ' ≠ 10');
ok(keys.includes('default'), "חסר מפתח 'default'");
const j = CITIES.jerusalem;
ok(j.he === 'ירושלים' && j.lat === 31.778 && j.lon === 35.235 && j.candle === 40, 'jerusalem לא תואם-חוזה');
ok(CITIES.telaviv.candle === 18, 'telaviv.candle ≠ 18');
ok(CITIES.tzfat.lat === 32.965, 'tzfat.lat ≠ 32.965');
ok(CITIES.haifa.candle === 30, 'haifa.candle ≠ 30');
const d = CITIES.default;
ok(d.lat === j.lat && d.lon === j.lon && d.candle === j.candle, 'default ≠ נ״צ-ירושלים');
ok(d.he === 'ברירת-מחדל (ירושלים)', 'default.he לא תואם-חוזה');
for (const [k, v] of Object.entries(CITIES)) {
  ok(typeof v.he === 'string' && v.he.length > 0, k + '.he לא מחרוזת-תקינה');
  ok(Number.isFinite(v.lat) && Number.isFinite(v.lon) && Number.isFinite(v.candle), k + ': lat/lon/candle לא סופיים');
}
if (f) process.exit(1);
console.log('✓ cities: ' + keys.length + ' ערים — כל דוגמאות-החוזה ירוקות');
