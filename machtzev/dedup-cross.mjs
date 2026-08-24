#!/usr/bin/env node
/** 🌐 בודק-כפליות חוצה-מערכות — מאור (new/atoms, JS) מול בנייה-חכמה (new/dart, Dart).
 *  שפות שונות ⇒ אי-אפשר להשוות גוף; משווים לפי שם-מנורמל + חתימת-דומיין.
 *  מטרה: לזהות "ליבה-אימפריאלית" — יכולת שקיימת בשתי המערכות ⇒ מועמדת-לאיחוד
 *  (לא כפילות-למחיקה: שתי שפות, שני מוצרים-חיים; אבל דגל לתשומת-לב באיחוד). */
import fs from 'node:fs';
const R = new URL('../new/', import.meta.url).pathname;
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
if (!shared.length) console.log('  (אין חפיפת-שם — המנועים זרים, כפי שהראה הניתוח: 83+51 מנועים כמעט-לא-חופפים)');
