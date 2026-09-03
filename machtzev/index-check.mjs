#!/usr/bin/env node
/** מחצב · index-check — שער `index-complete` (M3 · PROTOCOL §4/§7.2 · שלב 5): כל `.mjs` ב-machtzev/ מופיע ב-INDEX.md
 *  (בשם-הקובץ, בנתיב, או בתיקייה `dir/`). חוב-קיים ב-index-baseline.json (רשימה · shrink-only); סקריפט חדש בלי שורה ⇒ אדום.
 *  --write: קובע את הרשימה הנוכחית כ-baseline. */
import fs from 'node:fs';
import path from 'node:path';
import * as R from './root.mjs';
const idx = fs.readFileSync(R.MACH + 'INDEX.md', 'utf8');
const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) { if (!['node_modules', 'selftest-fixtures'].includes(e.name)) walk(f); } else if (e.name.endsWith('.mjs')) files.push(path.relative(R.MACH, f)); } })(R.MACH);
const covered = (rel) => idx.includes('`' + rel + '`') || idx.includes('`' + path.basename(rel) + '`') || idx.includes('`' + rel.replace(/\.mjs$/, '') + '`') || idx.includes('`' + path.basename(rel, '.mjs') + '`');   // R3-3.7: רק אסימון-בגרשיים מדויק
const missing = files.filter((f) => !covered(f)).sort();
const BL = R.MACH + 'index-baseline.json';
if (process.argv.includes('--write')) { fs.writeFileSync(BL, JSON.stringify(missing, null, 1) + '\n'); console.log(`✍️ index baseline ⇒ ${missing.length} בלי-שורה`); process.exit(0); }
const base = new Set(fs.existsSync(BL) ? JSON.parse(fs.readFileSync(BL, 'utf8')) : []);
const fresh = missing.filter((f) => !base.has(f));
if (fresh.length) { console.log(`🔴 index-complete: סקריפטים חדשים בלי שורה ב-INDEX.md: ${fresh.join(' · ')}`); process.exit(1); }
console.log(`✓ index-complete: ${files.length - missing.length}/${files.length} סקריפטים מאונדקסים · חוב ${missing.length}/${base.size} (רק-יורד)`);
