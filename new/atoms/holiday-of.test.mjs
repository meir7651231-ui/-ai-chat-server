import { holidayOf as __pure_holidayOf } from './holiday-of.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_holidayOf_HOLIDAY_OF_T = {
  k1: "Tevet",
  k2: "Kislev",
  k3: "חנוכה",
  k4: "Tamuz 17",
  k5: "Tamuz",
  k6: "צום י״ז בתמוז (נדחה)",
  k7: "תשעה באב (נדחה)",
  k8: "Tishri 3",
  k9: "Tishri",
  k10: "צום גדליה (נדחה)",
  k11: "Adar 13",
  k12: "Adar II 13",
  k13: "Adar",
  k14: "Adar II",
  k15: "תענית אסתר (מוקדם)",
};
const holidayOf = (...a) => __pure_holidayOf(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_holidayOf_HOLIDAY_OF_T);
// ימי-עוגן אמיתיים לפי יום-בשבוע: שבת=22.8.2026 · ראשון=23.8 · שני=24.8 · חמישי=27.8
const SAT=new Date('2026-08-22T12:00:00'), SUN=new Date('2026-08-23T12:00:00'),
      MON=new Date('2026-08-24T12:00:00'), THU=new Date('2026-08-27T12:00:00');
const hp=(day,month)=>()=>({ day, month, year: 5786 });          // שקע hebParts קבוע פר-מקרה
const scanNo30=()=>({ has30:new Set() });                        // כסלו חסר
const scanFull=()=>({ has30:new Set(['Kislev','Heshvan']) });    // כסלו מלא
const H={ 'Nisan 15':'פסח' };                                    // שקע HOLIDAYS מוזרק
const C=[ // [תאריך, hebParts, scanHebYear, צפוי, תיאור]
  [MON, hp(3,'Tevet'),  scanNo30, 'חנוכה',                'ג׳ טבת · כסלו חסר ⇒ יום ח׳'],
  [MON, hp(3,'Tevet'),  scanFull, null,                   'ג׳ טבת · כסלו מלא ⇒ אין'],
  [SAT, hp(17,'Tamuz'), scanNo30, null,                   'י״ז בתמוז בשבת ⇒ נדחה'],
  [SUN, hp(18,'Tamuz'), scanNo30, 'צום י״ז בתמוז (נדחה)', 'י״ח בתמוז בראשון'],
  [SUN, hp(10,'Av'),    scanNo30, 'תשעה באב (נדחה)',      'י׳ באב בראשון'],
  [SUN, hp(4,'Tishri'), scanNo30, 'צום גדליה (נדחה)',     'ד׳ תשרי בראשון'],
  [THU, hp(11,'Adar'),  scanNo30, 'תענית אסתר (מוקדם)',   'י״א אדר בחמישי'],
  [MON, hp(15,'Nisan'), scanNo30, 'פסח',                  'ט״ו ניסן ⇒ מפת-החגים'],
  [MON, hp(12,'Heshvan'),scanNo30, null,                  'יום רגיל ⇒ null'],
];
let f=0; for(const [d,parts,scan,w,desc] of C){const g=holidayOf(d,parts,scan,H);
  if(g!==w){console.error(`✗ ${desc}: ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`);f=1;}}
if(f)process.exit(1); console.log(`✓ holiday-of: ${C.length} דוגמאות-חוזה — ירוק (חנוכה-ח׳ · צומות-נדחים · תענית-מוקדמת)`);
