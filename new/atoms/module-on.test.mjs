import { moduleOn } from './module-on.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

// 1) רק false מכבה
chk('1 false מפורש מכבה', moduleOn({ modules: { families: false } }, 'families') === false);

// 2) מפתח חסר = פעיל
chk('2 מפתח חסר פעיל', moduleOn({ modules: {} }, 'families') === true);

// 3) true מפורש = פעיל
chk('3 true מפורש פעיל', moduleOn({ modules: { shop: true } }, 'shop') === true);

// 4) כיבוי-שכן לא מדביק
chk('4 כיבוי-שכן לא מדביק', moduleOn({ modules: { shop: false } }, 'tzedaka') === true);

// 5) undefined ≠ false
chk('5 undefined פעיל', moduleOn({ modules: { courses: undefined } }, 'courses') === true);

if (f) process.exit(1);
console.log('✓ module-on: 5 דוגמאות-חוזה — ירוק');
