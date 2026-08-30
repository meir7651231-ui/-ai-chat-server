import { slugify as __pure_slugify } from './slugify.mjs';
const __d_slugify_SLUGIFY_T = {
  k1: "org",
};
// צילום-מקומי מ-slugify-data + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)
const HEB2LAT = {
    'א': 'a', 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z',
    'ח': 'ch', 'ט': 't', 'י': 'y', 'כ': 'k', 'ך': 'k', 'ל': 'l', 'מ': 'm',
    'ם': 'm', 'נ': 'n', 'ן': 'n', 'ס': 's', 'ע': 'a', 'פ': 'p', 'ף': 'p',
    'צ': 'ts', 'ץ': 'ts', 'ק': 'k', 'ר': 'r', 'ש': 'sh', 'ת': 't',
};
const slugify = (...a) => __pure_slugify(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), HEB2LAT, __d_slugify_SLUGIFY_T);
let f = 0;
const eq = (a, b, msg) => { if (a !== b) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

// 1) תעתיק עברית + רווח ⇒ מקף
eq(slugify('מאור החסד', []), 'mavr-hchsd', 'תעתיק עברי שגוי');

// 2) תווים לא-לטיניים קורסים למקף אחד
eq(slugify('Café! 123', []), 'caf-123', 'ניקוי תווים שגוי');

// 3) קצר מ-2 ⇒ 'org'
eq(slugify('א', []), 'org', 'ברירת-המחדל לקצר לא הופעלה');

// 4) ייחודיות מול תפוסים
eq(slugify('maor', ['maor']), 'maor-2', 'סיומת ‎-2 לא ניתנה');
eq(slugify('maor', ['maor', 'maor-2']), 'maor-3', 'סיומת ‎-3 לא ניתנה');

// 5) קיצוץ ל-30
eq(slugify('a'.repeat(35), []), 'a'.repeat(30), 'קיצוץ-30 שגוי');

// 6) קיצוץ שנחת על מקף ⇒ גיזום מקפי-סוף
eq(slugify('a'.repeat(29) + ' b', []), 'a'.repeat(29), 'גיזום מקף-סוף אחרי קיצוץ שגוי');

if (f) process.exit(1);
console.log('✓ slugify: 6 דוגמאות-חוזה — ירוק');
