import { normalizeTelephony } from './normalize-telephony.mjs';

// מימושי-השקעים (העתק-מקור maor/src/lib/config.ts:153-160) — הבדיקה מייבאת רק את האטום שלה.
const telStr = (v, max) => (typeof v === 'string' ? v.replace(/\p{Cc}/gu, '').trim().slice(0, max) : '');
const telExt = (v, def) => {
  const s = typeof v === 'string' ? v.replace(/\D/g, '').slice(0, 8) : '';
  return s || def;
};
const N = (raw) => normalizeTelephony(raw, telStr, telExt);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let f = 0;
const chk = (name, ok) => { if (!ok) { console.error('✗ ' + name); f = 1; } };

// 1. חסר/לא-אובייקט/מערך ⇒ undefined
chk('null⇒undefined', N(null) === undefined);
chk("'x'⇒undefined", N('x') === undefined);
chk('[1]⇒undefined', N([1]) === undefined);

// 2. {} ⇒ ברירות-מחדל מלאות, בלי enabled
const d = N({});
chk('{} ברירות-מחדל', eq(d, {
  numbers: [], officeDays: [0, 1, 2, 3, 4], officeStart: '09:00', officeEnd: '17:00',
  officeExt: '101', managerExt: '201', vmBox: '100', city: '', kosherMode: false,
  hebrewCalendar: true, zmanim: false, shabbat: true, fasts: false, voicemail: true,
}));
chk('{} בלי מפתח enabled', !('enabled' in d));

// 3. enabled — opt-in: רק true בדיוק
chk('enabled:true נשמר', N({ enabled: true }).enabled === true);
chk("enabled:'yes' מושמט", !('enabled' in N({ enabled: 'yes' })));

// 4. חיטוי מספרים
const nums = N({ numbers: [{ e164: '03-123x4567!', label: 'משרד', kind: 'זבל', kosher: true }, 7] }).numbers;
chk('מספר יחיד (לא-אובייקט נזרק)', nums.length === 1);
chk('מספר מחוטא', eq(nums[0], { id: 'n1', e164: '03-1234567', label: 'משרד', kind: 'sim', kosher: true }));
const nk = N({ numbers: [{ kosher: 'true' }] }).numbers[0];
chk("kosher:'true' מושמט + label נופל ל-id", !('kosher' in nk) && nk.label === 'n1' && nk.e164 === '');

// 5. officeDays — ייחוד+טווח+מיון
chk('officeDays מחוטא', eq(N({ officeDays: [3, 1, 3, 9, -1, 'a', 2] }).officeDays, [1, 2, 3]));
chk('officeDays לא-מערך ⇒ ברירת-מחדל', eq(N({ officeDays: 'x' }).officeDays, [0, 1, 2, 3, 4]));

// 6. שעות HH:MM
chk("'25:00'⇒'09:00'", N({ officeStart: '25:00' }).officeStart === '09:00');
chk("'08:30' נשמר", N({ officeStart: '08:30' }).officeStart === '08:30');

// 7. עיר — [a-z] בלבד, 2–20
chk("'Tel-Aviv6'⇒'telaviv'", N({ city: 'Tel-Aviv6' }).city === 'telaviv');
chk("'a'⇒''", N({ city: 'a' }).city === '');
chk("21 תווים⇒''", N({ city: 'a'.repeat(21) }).city === '');

if (f) process.exit(1);
console.log('✓ normalize-telephony: 7 קבוצות דוגמאות-חוזה (שקעים telStr/telExt) — ירוק');
