#!/usr/bin/env node
/** 🔍 בודק-כפליות למדף-החוזה (הכרעה 5) — שלוש עדשות:
 *  א) תאומי-גוף: אותו קוד בדיוק (נרמול הערות/רווחים) בשמות שונים.
 *  ב) תאומי-שם: וריאנטים (kebab/underscore/מילים-הפוכות) של אותו שם.
 *  ג) תאומי-מוצא: שני אטומים שמצביעים על אותו מקור (קובץ:שורות). */
import fs from 'node:fs';
import crypto from 'node:crypto';
const DIR = new URL('../new/atoms/', import.meta.url).pathname;
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.mjs') && !f.endsWith('.test.mjs'));
const norm = (s) => s
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')   // הערות
  .replace(/\s+/g, ' ').trim();
const bodyOf = (f) => norm(fs.readFileSync(DIR + f, 'utf8'));
const srcOf = (f) => (fs.readFileSync(DIR + f, 'utf8').match(/מוצא:\s*([^\s(]+)/) || [])[1] || '';

// א) תאומי-גוף
const byHash = new Map();
for (const f of files) {
  const h = crypto.createHash('sha256').update(bodyOf(f)).digest('hex').slice(0, 16);
  if (!byHash.has(h)) byHash.set(h, []);
  byHash.get(h).push(f);
}
const bodyTwins = [...byHash.values()].filter(g => g.length > 1);

// ב) תאומי-שם: נרמול שם (בלי מקפים/קווים, אותיות בלבד, מילים ממוינות)
const nameKey = (f) => f.replace(/\.mjs$/, '').split(/[-_]/).sort().join('|');
const byName = new Map();
for (const f of files) {
  const k = nameKey(f);
  if (!byName.has(k)) byName.set(k, []);
  byName.get(k).push(f);
}
const nameTwins = [...byName.values()].filter(g => g.length > 1);

// ג) תאומי-מוצא
const bySrc = new Map();
for (const f of files) {
  const s = srcOf(f);
  if (!s) continue;
  if (!bySrc.has(s)) bySrc.set(s, []);
  bySrc.get(s).push(f);
}
const srcTwins = [...bySrc.values()].filter(g => g.length > 1);

console.log(`מדף: ${files.length} אטומים`);
console.log(`\n— תאומי-גוף (${bodyTwins.length} קבוצות):`);
for (const g of bodyTwins) console.log('  ' + g.join(' ≡ '));
console.log(`\n— תאומי-שם (${nameTwins.length} קבוצות, גוף שונה):`);
for (const g of nameTwins) if (!bodyTwins.some(b => b.join() === g.join())) console.log('  ' + g.join(' ~ '));
console.log(`\n— תאומי-מוצא (${srcTwins.length} קבוצות):`);
for (const g of srcTwins) console.log('  ' + g.join(' + ') + '  ← ' + srcOf(g[0]));
