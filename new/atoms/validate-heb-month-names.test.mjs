import { validateHebMonthNames as __pure_validateHebMonthNames } from './validate-heb-month-names.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_validate_heb_month_names_T = {
  k1: 3761,
  k2: 440,
  k3: 12,
};
const validateHebMonthNames = (...a) => __pure_validateHebMonthNames(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_validate_heb_month_names_T);
let f = 0;
const eq = (a, b, msg) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; }
};

const KNOWN = new Set(['Tishri', 'Heshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar',
  'Adar I', 'Adar II', 'Nisan', 'Iyar', 'Sivan', 'Tamuz', 'Av', 'Elul']);

// 1) כל החודשים מוכרים ⇒ []
eq(validateHebMonthNames(5786, () => ({ year: 5786, month: 'Tishri', day: 1 }), KNOWN),
  [], 'דוגמה 1: תקין');

// 2) איות-CLDR זר — מדווח פעם אחת (דדופ) למרות 440 הופעות
eq(validateHebMonthNames(5786, () => ({ year: 5786, month: 'Tishrei', day: 1 }), KNOWN),
  ['Tishrei'], 'דוגמה 2: דדופ');

// 3) ימים של שנה עברית אחרת מדולגים
{
  let i = 0;
  const hebParts = () => (i++ < 100 ? { year: 5785, month: 'Weird', day: 1 } : { year: 5786, month: 'Elul', day: 1 });
  eq(validateHebMonthNames(5786, hebParts, KNOWN), [], 'דוגמה 3: שנה אחרת מדולגת');
}

// 4) עוגן-הסריקה: קריאה ראשונה = Date(2025,7,1,12), ובסך-הכול 440 קריאות
{
  const dates = [];
  validateHebMonthNames(5786, (d) => { dates.push(d); return { year: 5786, month: 'Av', day: 1 }; }, KNOWN);
  const d0 = dates[0];
  if (dates.length !== 440) { console.error(`✗ דוגמה 4: ${dates.length} קריאות במקום 440`); f = 1; }
  if (d0.getFullYear() !== 2025 || d0.getMonth() !== 7 || d0.getDate() !== 1 || d0.getHours() !== 12) {
    console.error(`✗ דוגמה 4: עוגן שגוי ⇒ ${d0}`); f = 1;
  }
}

// 5) סדר-הופעה נשמר
{
  let i = 0;
  const seq = ['Foo', 'Bar'];
  const hebParts = () => ({ year: 5786, month: seq[i] ?? 'Nisan', day: 1 + i++ });
  eq(validateHebMonthNames(5786, hebParts, KNOWN), ['Foo', 'Bar'], 'דוגמה 5: סדר-הופעה');
}

if (f) process.exit(1);
console.log('✓ validate-heb-month-names: 5 דוגמאות-חוזה — ירוק');
