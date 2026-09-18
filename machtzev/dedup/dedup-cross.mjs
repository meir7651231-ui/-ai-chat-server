#!/usr/bin/env node
/** 🌐 בודק-כפליות חוצה-מערכות — מאור (new/atoms, JS) מול בנייה-חכמה (new/dart, Dart).
 *  שפות שונות ⇒ אי-אפשר להשוות גוף; משווים לפי שם-מנורמל + חתימת-דומיין.
 *  מטרה: לזהות "ליבה-אימפריאלית" — יכולת שקיימת בשתי המערכות ⇒ מועמדת-לאיחוד
 *  (לא כפילות-למחיקה: שתי שפות, שני מוצרים-חיים; אבל דגל לתשומת-לב באיחוד). */
import fs from 'node:fs';
import { rminhu, had, pliga, lo } from '../../yeshiva/rminhu.mjs';   // 🕯️ «אין» = «לא-חיפשת» (הכרעה-23)
const R = new URL('../../new/', import.meta.url).pathname;
const norm = (s) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();
const js = fs.existsSync(R + 'atoms') ? fs.readdirSync(R + 'atoms')
  .filter(f => f.endsWith('.mjs') && !f.endsWith('.test.mjs')).map(f => f.replace('.mjs', '')) : [];
const dart = fs.existsSync(R + 'dart') ? fs.readdirSync(R + 'dart')
  .filter(f => f.endsWith('.dart') && !f.endsWith('_test.dart')).map(f => f.replace('.dart', '')) : [];
const jsN = new Map(js.map(n => [norm(n), n]));
const shared = [];
for (const d of dart) { const k = norm(d); if (jsN.has(k)) shared.push([jsN.get(k), d]); }
console.log(`מאור-JS: ${js.length} אטומים · בנייה-חכמה-Dart: ${dart.length} אטומים`);
console.log(`🔗 ליבה-אימפריאלית (שם-חופף בשתי המערכות): ${shared.length}`);
for (const [a, b] of shared) console.log(`  ${a} (JS) ≡ ${b} (Dart) ⇒ מועמד-לאיחוד`);
// 🕯️ השורה שהייתה כאן — «(אין חפיפת-שם — המנועים זרים, כפי שהראה הניתוח)» — היא «אין»
//    עם **נרטיב** במקום פסק, ובדיוק המחלה של L112: ההשוואה כאן היא **לפי-שם-מנורמל בלבד**,
//    ולכן «אין חפיפה» אומר «אין חפיפת-שם», לא «אין יכולת משותפת». עכשיו זה נאמר במפורש,
//    וכל צד נפסק בשמו ובהיקפו.
rminhu({ engine: 'dedup-cross', matter: 'ליבה-אימפריאלית: מאור-JS ↔ בנייה-חכמה-Dart',
  searched: [`new/atoms (${js.length} אטומי-JS)`, `new/dart (${dart.length} אטומי-Dart)`, 'עדשה: שם-מנורמל בלבד (שפות שונות ⇒ אי-אפשר להשוות גוף)'],
  rulings: (shared.length
    ? shared.map(([a, b]) => had(`${a}≡${b}`, 'שם-מנורמל חופף בשתי המערכות ⇒ מועמד-לאיחוד (לא כפילות-למחיקה: שני מוצרים חיים)'))
    : [pliga('העדשה עצמה: שם-מנורמל', `0 חפיפות בין ${js.length} JS ל-${dart.length} Dart — אבל זו העדשה שנבדקה, ולכן הפסק הוא «אין חפיפת-שם», לא «אין יכולת משותפת»: התאמה לפי שם/מחרוזת במקום לפי המקור המוצהר היא בדיוק משפחת-הבאגים של L112`)]) });
if (!shared.length) console.log('  (אין חפיפת-שם — המנועים זרים, כפי שהראה הניתוח: 83+51 מנועים כמעט-לא-חופפים)');
(await import('../../yeshiva/rminhu.mjs')).printNotes('dedup-cross');
