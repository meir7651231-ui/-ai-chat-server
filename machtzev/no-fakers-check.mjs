#!/usr/bin/env node
/** מחצב · no-fakers-check — שער `no-fakers` (מגן-בלי-סטיות · §20-ג · PROTOCOL §7.2 · שלב 5).
 *  SSOT = `FAKERS` בתוך compose-engine.mjs (נקרא מהמקור, לא מועתק). snake_case ⇒ PascalCase (stat_block ⇒ StatBlock).
 *  סורק: פלט-המחולל (`outDir()` = new/dart-gen-bs) + לוחות (new/dart-boards-bs) + מסכים (new/dart-screens-bs).
 *  קובץ שמכיל `<Faker>(` = הפרה. חוב-קיים ב-no-fakers-baseline.json (רשימת-קבצים · shrink-only); קובץ חדש ⇒ אדום.
 *  --write: קובע את הרשימה הנוכחית כ-baseline (ידני, אירוע-ראצ׳ט מוצהר). */
import fs from 'node:fs';
import path from 'node:path';
import * as R from './root.mjs';
const src = fs.readFileSync(R.MACH + 'compose-engine.mjs', 'utf8');
const m = src.match(/const FAKERS = new Set\(\[([^\]]*)\]\)/);
if (!m) { console.log('🔴 no-fakers: לא נמצא FAKERS ב-compose-engine.mjs (SSOT)'); process.exit(1); }
const fakers = [...m[1].matchAll(/'([a-z_]+)'/g)].map((x) => x[1]);
const classes = fakers.map((f) => f.split('_').map((s) => s[0].toUpperCase() + s.slice(1)).join(''));
const re = new RegExp(`\\b(${classes.join('|')})\\s*(\\.\\w+\\s*)?\\(`);   // R3-3.10: StatBlock.named( · StatBlock (
const dirs = [R.outDir(), path.join(R.NEW, 'dart-boards-bs'), path.join(R.NEW, 'dart-screens-bs')].filter((d) => fs.existsSync(d));
const hits = [];
for (const d of dirs) (function walk(x) { for (const e of fs.readdirSync(x, { withFileTypes: true })) { const f = path.join(x, e.name); if (e.isDirectory()) walk(f); else if (e.name.endsWith('.dart') && re.test(fs.readFileSync(f, 'utf8'))) hits.push(path.relative(R.ROOT, f)); } })(d);
hits.sort();
const BL = R.MACH + 'no-fakers-baseline.json';
if (process.argv.includes('--write')) { fs.writeFileSync(BL, JSON.stringify(hits, null, 1) + '\n'); console.log(`✍️ no-fakers baseline ⇒ ${hits.length} קבצים`); process.exit(0); }
const base = new Set(fs.existsSync(BL) ? JSON.parse(fs.readFileSync(BL, 'utf8')) : []);
const fresh = hits.filter((h) => !base.has(h));
if (fresh.length) { console.log(`🔴 no-fakers: מזייף (${classes.join('|')}) בקבצים חדשים: ${fresh.join(' · ')} — בחר אטום-אמיתי מטבלת-ATOM`); process.exit(1); }
console.log(`✓ no-fakers: ${classes.length} מזייפים · ${dirs.length} תיקיות · חוב ${hits.length}/${base.size} (רק-יורד) · אפס חדשים`);
