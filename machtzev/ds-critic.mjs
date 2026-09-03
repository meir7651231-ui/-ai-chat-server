#!/usr/bin/env node
/** 🕵️ מנוע-עיצוב 5 · ds-critic — design-judge מזוקק-לכללים, שער-איכות על פלט-המחולל.
 *  סורק את מסכי-המחולל (new/dart-gen-bs/gen_*.dart) ומודד חוב-עיצובי: צבע-inline (עוקף-טוקן) ·
 *  צל-קשיח (עוקף-DsElev) · גופן קטן-מ-11 (a11y). ratchet: החוב רק-יורד (baseline נשמר;
 *  עלייה ⇒ אדום, ירידה ⇒ baseline מתעדכן). כך "אנטי-גנרי/עקבי-טוקן" הופך לשער, לא לתקווה.
 *  שימוש: node machtzev/ds-critic.mjs [--gate] */
import fs from 'node:fs';
import path from 'node:path';
import * as R from './root.mjs';
const ROOT = R.ROOT;
const GATE = process.argv.includes('--gate');
const SCAN = R.outDir();
const BASE = path.join(ROOT, 'machtzev/ds-critic-baseline.json');

const walk = (d, o = []) => { if (!fs.existsSync(d)) return o; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p, o) : o.push(p); } return o; };
const files = walk(SCAN).filter(f => /\.dart$/.test(f) && !/_test\.dart$/.test(f));

// כללי-הביקורת (design-judge מזוקק): שם · תיאור · regex-פר-שורה (רק על שורות-קוד, לא-הערה)
const rules = [
  ['inlineHex', 'צבע-inline (עוקף מערכת-הטוקנים)', /Color\(0x[0-9A-Fa-f]{6,8}\)/],
  ['hardShadow', 'צל-קשיח (עוקף DsElev)', /BoxShadow\(/],
  ['smallText', 'גופן קטן-מ-11 (a11y)', /fontSize:\s*([0-9]|10)(\.0)?\b/],
];
const cats = Object.fromEntries(rules.map(r => [r[0], 0]));
for (const f of files) {
  for (const raw of fs.readFileSync(f, 'utf8').split('\n')) {
    const ln = raw.replace(/\/\/.*$/, '');            // בלי הערות-שורה
    for (const [key, , re] of rules) { const m = ln.match(new RegExp(re, 'g')); if (m) cats[key] += m.length; }
  }
}
const total = Object.values(cats).reduce((a, b) => a + b, 0);

let base = null; try { base = JSON.parse(fs.readFileSync(BASE, 'utf8')); } catch { }
let bad = 0;
if (GATE && base) {
  for (const [k, v] of Object.entries(cats)) if (v > (base[k] ?? Infinity)) { console.error(`🚨 ds-critic: נסיגה ב-${k}: ${v} > ${base[k]} (חוב-עיצוב עלה)`); bad = 1; }
}
if (!bad) fs.writeFileSync(BASE, JSON.stringify(cats, null, 1) + '\n');   // ratchet: שומר/מוריד
const line = rules.map(([k, he]) => `${he.split(' ')[0]}:${cats[k]}`).join(' · ');
console.log(`${bad ? '🚨' : '✓'} ds-critic: ${files.length} מסכים · חוב-עיצוב ${total} (${line})${bad ? '' : ' — ratchet'}`);
process.exit(bad);
