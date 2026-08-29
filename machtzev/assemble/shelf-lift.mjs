#!/usr/bin/env node
/** 🛗 מחצב · מנוע-המדף (shelf-lift) — חוזה: SHELF-LIFT-CONTRACT.md.
 *  מרים למדף, בלי-סוכן, כל widget שהמכונה הוכיחה dataClean+pure והוא עומד-ברשות-עצמו.
 *  כל ספק ⇒ דחייה-מנומקת לתור-הנחיל. דטרמיניסטי.
 *  שימוש: node shelf-lift.mjs [screens-dir] */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
const ROOT = new URL('../../', import.meta.url).pathname;
const SCRATCH = process.argv[2] || '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/all-screens';
const SHELF = path.join(ROOT, 'new/dart-ui-bs');
const OUT = path.join(SHELF, 'auto');
const MACHINE = path.join(ROOT, 'screens-seed/machine');

// ── allowlist טיפוסי-בנאי (חובה 2) ──
const OK_TYPES = new Set(['String', 'int', 'double', 'bool', 'num', 'Color', 'VoidCallback',
  'IconData', 'Widget', 'List<Widget>', 'List<String>', 'EdgeInsets', 'EdgeInsetsGeometry',
  'BorderRadius', 'TextStyle', 'Key', 'ValueChanged<String>', 'ValueChanged<bool>',
  'ValueChanged<int>', 'ValueChanged<double>']);
const okType = (t) => OK_TYPES.has(t.replace(/\?$/, '').replace(/\s+/g, ''));

// ── חילוץ-מחלקה verbatim בסוגריים-מאוזנים (חוק-4) ──
function classBody(src, startIdx) {
  let i = src.indexOf('{', startIdx); if (i < 0) return null;
  let d = 0, j = i, inS = 0; // inS: 1=' 2="
  for (; j < src.length; j++) {
    const c = src[j];
    if (inS) { if (c === '\\') j++; else if ((inS === 1 && c === "'") || (inS === 2 && c === '"')) inS = 0; continue; }
    if (c === "'") inS = 1; else if (c === '"') inS = 2;
    else if (c === '{') d++; else if (c === '}') { d--; if (!d) break; }
  }
  return src.slice(startIdx, j + 1);
}
const blind = (body, name) => crypto.createHash('sha1').update(
  body.replace(/\/\/[^\n]*/g, '').replace(/'[^'\n]*'/g, 'S').replace(/"[^"\n]*"/g, 'S')
    .replace(/\b[0-9]+(\.[0-9]+)?\b/g, 'N').replaceAll(name, 'W').replace(/\s+/g, ' ')
).digest('hex').slice(0, 10);
const snake = (n) => n.replace(/^_/, '').replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

// ── מלאי-המדף הקיים: שמות + גיבובים-מבניים (חובה 3) ──
const shelfNames = new Set(); const shelfHashes = new Map();
for (const f of fs.readdirSync(SHELF, { recursive: true })) {
  const p = path.join(SHELF, String(f));
  if (!String(f).endsWith('.dart') || !fs.statSync(p).isFile() || String(f).startsWith('auto/')) continue;
  const src = fs.readFileSync(p, 'utf8');
  for (const m of src.matchAll(/class\s+([A-Za-z0-9_]+)\s+extends\s+\w+/g)) {
    shelfNames.add(m[1]);
    const b = classBody(src, m.index); if (b) shelfHashes.set(blind(b, m[1]), m[1]);
  }
}

// ── המעבר: כל מפות-המכונה ⇒ מועמדים ⇒ שערי-דחייה ──
const report = { lifted: [], skipped: {} };
const skip = (why, id) => (report.skipped[why] ??= []).push(id);
const liftedHashes = new Map(); const usedNames = new Set(shelfNames); const outputs = [];
const maps = fs.readdirSync(MACHINE).filter(f => f.endsWith('.json')).sort();
for (const mf of maps) {
  const map = JSON.parse(fs.readFileSync(path.join(MACHINE, mf), 'utf8'));
  const screen = mf.replace('.json', '');
  const srcPath = path.join(SCRATCH, screen + '.dart');
  if (!fs.existsSync(srcPath)) continue;
  const src = fs.readFileSync(srcPath, 'utf8');
  const fileClasses = new Set([...src.matchAll(/class\s+([A-Za-z0-9_]+)[\s<]/g)].map(x => x[1]));
  for (const w of map.widgets || []) {
    const id = screen + ':' + w.name;
    if (!w.dataClean || !w.pure) continue;                       // תור-הנחיל — לא ענייננו
    if (w.kind !== 'StatelessWidget') { skip('stateful', id); continue; }
    const decl = src.match(new RegExp('class\\s+' + w.name + '\\s+extends\\s+StatelessWidget'));
    if (!decl) { skip('no-decl', id); continue; }
    const body = classBody(src, decl.index);
    if (!body) { skip('no-body', id); continue; }
    const code = body.replace(/\/\/[^\n]*/g, '');
    // שער: טיפוסי-בנאי פרימיטיביים בלבד
    const fields = [...code.matchAll(/final\s+([A-Za-z_][\w<>,\s]*\??)\s+[a-zA-Z_]\w*\s*;/g)].map(x => x[1].trim());
    if (fields.some(t => !okType(t))) { skip('model-prop', id); continue; }
    // שער: אפס-תלות באחים-מאותו-קובץ או בפרטיים-חיצוניים
    const refs = new Set([...code.matchAll(/\b(_?[A-Z]\w+|_[a-z]\w*)\b/g)].map(x => x[1]));
    refs.delete(w.name);
    if ([...refs].some(r => fileClasses.has(r))) { skip('sibling-class', id); continue; }
    if ([...refs].some(r => /^_[a-z]/.test(r) && !new RegExp('(final|var|const|void|double|int|String|bool|Widget|Color)\\s+' + r + '\\b').test(code))) { skip('private-dep', id); continue; }
    if ([...refs].some(r => /^_[A-Z]/.test(r))) { skip('private-dep', id); continue; }
    // דדופ: מול המדף ומול מה-שכבר-הורם בריצה-הזו
    const h = blind(body, w.name);
    if (shelfHashes.has(h)) { skip('already-on-shelf', id + '⇒' + shelfHashes.get(h)); continue; }
    if (liftedHashes.has(h)) { liftedHashes.get(h).also.push(id); continue; }
    // שם-ציבורי ייחודי
    let pub = w.name.replace(/^_/, '');
    if (usedNames.has(pub)) { skip('name-collision', id); continue; }
    usedNames.add(pub);
    liftedHashes.set(h, { id, pub, screen, body, name: w.name, also: [] });
  }
}

// ── פליטה + שער-עצמי (חובה 4) ──
fs.mkdirSync(OUT, { recursive: true });
for (const L of [...liftedHashes.values()].sort((a, b) => a.pub.localeCompare(b.pub))) {
  const file = path.join(OUT, snake(L.pub) + '.dart');
  const also = L.also.length ? `\n// משרת-גם (זהה-מבנית): ${L.also.join(' · ')}` : '';
  const code = `// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: ${L.id} (בנייה-חכמה main)${also}
import 'package:flutter/material.dart';

${L.body.replaceAll(L.name, L.pub)}
`;
  fs.writeFileSync(file, code);
  try {
    const chk = execFileSync('node', [path.join(ROOT, 'machtzev/carve/screen-decomp.mjs'), file], { encoding: 'utf8' });
    const m = chk.match(/טהורי-IO: (\d+) · מהם 🧼 נקיים-מדאטה: (\d+)/);
    if (!m || m[1] !== m[2] || m[1] === '0') throw new Error('לא-dataClean');
    report.lifted.push({ atom: L.pub, from: L.id, serves: 1 + L.also.length });
    outputs.push(file);
  } catch (e) { fs.unlinkSync(file); skip('failed-self-gate', L.id); }
}

const skippedN = Object.values(report.skipped).reduce((a, v) => a + v.length, 0);
fs.writeFileSync(path.join(ROOT, 'screens-seed/shelf-lift-report.json'), JSON.stringify(report, null, 1));
const serves = report.lifted.reduce((a, x) => a + x.serves, 0);
console.log(`🛗 מנוע-המדף · הורמו: ${report.lifted.length} אטומים (משרתים ${serves} מופעים) · נדחו-לנחיל: ${skippedN}`);
for (const [why, ids] of Object.entries(report.skipped)) console.log(`   ⏭️ ${why}: ${ids.length}`);
console.log('⇒ new/dart-ui-bs/auto/ + screens-seed/shelf-lift-report.json');
