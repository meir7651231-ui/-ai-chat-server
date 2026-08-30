import { telephonyToTenant as __pure_telephonyToTenant } from './telephony-to-tenant.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_telephonyToTenant_TELEPHONY_TO_TENANT_T = {
  k1: "sim-in-gateway",
  k2: "customer-forward",
  k3: "device-link",
  k4: "voice",
  k5: "whatsapp",
  k6: "sim",
  k7: "ארגון",
  k8: "Asia/Jerusalem",
  k9: "directory",
  k10: "voice.kosher",
  k11: "calendar.hebrew",
  k12: "calendar.shabbat",
  k13: "calendar.fasts",
  k14: "calendar.zmanim",
};
const telephonyToTenant = (...a) => __pure_telephonyToTenant(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_telephonyToTenant_TELEPHONY_TO_TENANT_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const baseTc = (numbers) => ({
  numbers,
  officeDays: [4, 0, 2],
  officeStart: '09:00',
  officeEnd: '17:00',
  officeExt: '101',
  managerExt: '201',
  vmBox: '100',
  city: '',
  kosherMode: false,
  hebrewCalendar: true,
  zmanim: false,
  shabbat: true,
  fasts: false,
  voicemail: true,
});
const t = telephonyToTenant(
  baseTc([
    { id: 'n1', e164: ' +972501234567 ', label: 'קו ראשי', kind: 'sim' },
    { id: 'n2', e164: '', label: 'ריק', kind: 'virtual' },
    { id: 'n3', e164: '+97277', kind: 'virtual' },
    { id: 'n4', e164: '+97252', kind: 'whatsapp', kosher: true },
    { id: 'n5', e164: '+972521111111', label: 'שער ב', kind: 'sim' },
  ]),
  '', 'maor-test',
);
// 1) קו בלי e164 מסונן
ok(t.numbers.length === 4 && !t.numbers.some((n) => n.id === 'n2'), 'דוגמה 1: קו-ריק לא סונן');
// 2) SIM: trim + onramp/channels + ערוצי-שער עולים
const n1 = t.numbers.find((n) => n.id === 'n1');
ok(n1.e164 === '+972501234567', 'דוגמה 2: e164 לא עבר trim');
ok(n1.label === 'קו ראשי' && n1.type === 'sim', 'דוגמה 2: label/type שגויים');
ok(n1.onramp === 'sim-in-gateway' && eq(n1.channels, ['voice']), 'דוגמה 2: onramp/channels של sim שגויים');
ok(n1.gatewayChannel === 1, 'דוגמה 2: gatewayChannel ראשון לא 1');
ok(t.numbers.find((n) => n.id === 'n5').gatewayChannel === 2, 'דוגמה 2: SIM שני לא ערוץ 2');
// 3) virtual בלי label ⇒ id; whatsapp ⇒ device-link + kosher
const n3 = t.numbers.find((n) => n.id === 'n3');
ok(n3.label === 'n3' && n3.onramp === 'customer-forward' && !('gatewayChannel' in n3), 'דוגמה 3: virtual שגוי');
const n4 = t.numbers.find((n) => n.id === 'n4');
ok(n4.onramp === 'device-link' && eq(n4.channels, ['whatsapp']) && n4.kosher === true, 'דוגמה 3: whatsapp שגוי');
ok(!('kosher' in n1), 'דוגמה 3: kosher הופיע כשלא-truthy');
// 4) outbound: ה-SIM הראשון; בלי SIM ⇒ ראשון; אפס-קווים ⇒ 'n1'
ok(t.outbound.defaultNumberId === 'n1', 'דוגמה 4: default לא ה-SIM הראשון');
const tNoSim = telephonyToTenant(baseTc([{ id: 'v9', e164: '+9721', kind: 'virtual' }]), 'א', 'x-org');
ok(tNoSim.outbound.defaultNumberId === 'v9', 'דוגמה 4: בלי-SIM לא נפל לקו הראשון');
const tEmpty = telephonyToTenant(baseTc([]), 'א', 'x-org');
ok(tEmpty.outbound.defaultNumberId === 'n1', "דוגמה 4: אפס-קווים לא 'n1'");
// 5) officeHours ממוין + destinations + cti
ok(eq(t.officeHours, { days: [0, 2, 4], start: '09:00', end: '17:00' }), 'דוגמה 5: officeHours שגוי');
ok(eq(t.destinations, {
  office: { ext: ['101'], ringSeconds: 25 },
  manager: { ext: '201', ringSeconds: 30 },
  voicemail: { box: '100' },
}), 'דוגמה 5: destinations שגוי');
ok(eq(t.cti, { org: 'maor-test', mode: 'directory' }), 'דוגמה 5: cti שגוי');
// 6) orgName ריק ⇒ 'ארגון'; city ריק ⇒ אין מפתח; timezone קבוע
ok(t.orgName === 'ארגון', "דוגמה 6: orgName ריק לא 'ארגון'");
ok(!('city' in t), 'דוגמה 6: city ריק הופיע');
ok(t.timezone === 'Asia/Jerusalem', 'דוגמה 6: timezone שגוי');
const tCity = telephonyToTenant({ ...baseTc([]), city: 'צפת' }, 'מאור', 'x-org');
ok(tCity.city === 'צפת' && tCity.orgName === 'מאור', 'דוגמה 6: city/orgName מלאים שגויים');
// 7) features — מיפוי ישיר מהדגלים
ok(eq(t.features, {
  'voice.kosher': false,
  'calendar.hebrew': true,
  'calendar.shabbat': true,
  'calendar.fasts': false,
  'calendar.zmanim': false,
  voicemail: true,
}), 'דוגמה 7: features שגוי');
if (f) process.exit(1);
console.log('✓ telephony-to-tenant: 7 דוגמאות-חוזה — ירוק');
