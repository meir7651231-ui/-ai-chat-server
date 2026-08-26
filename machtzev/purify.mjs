#!/usr/bin/env node
// 🧽 מכונת-הטיהור · מחלצת דאטה-צרובה ממנועים — דטרמיניסטי, לא נחיל.
// מזהה בלוק-דאטה עליון (const/final Map|List|Set literal, ≥סף ערכים) בכל אטום,
// ומחלץ אותו לקובץ-דאטה + משאיר במנוע הפניה-לשקע.
//
// שימוש:
//   node machtzev/purify.mjs --scan            # אינוונטר: כל מנוע נושא-דאטה
//   node machtzev/purify.mjs --scan --json      # פלט-מכונה
//   node machtzev/purify.mjs --extract <file>   # חילוץ בלוק-הדאטה (מנוע→שקע, דאטה→קובץ)
//
// גבול (חוק-מנגנון): בלוק ≥MIN ערכי-מחרוזת = דאטה-עסקית. פונקציה/control-flow
// אינם נתפסים (רק const/final ברמת-המודול). קבועי-פיזיקה קטנים (<MIN) לא-נתפסים.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = new URL('../new/', import.meta.url).pathname;
const DIRS = [
  { dir: 'dart', data: 'dart-data', lang: 'dart' },
  { dir: 'dart-maor', data: 'dart-data-maor', lang: 'dart' },
  { dir: 'atoms', data: 'atoms-data', lang: 'js' },
];
const MIN = 4; // סף ערכים כדי להיחשב טבלת-דאטה

// --- מציאת בלוק-דאטה עליון: const/final <Type> NAME = { ... }; (או [ ... ]) ---
function findDataBlocks(src) {
  const blocks = [];
  // Dart: const Map<..> _x = { ; JS: const X = { / [
  const re = /^(?:\s*)((?:const|final)\s+(?:[A-Za-z_][\w<>,?\s]*\s+)?)([A-Za-z_]\w*)\s*=\s*(?:const\s*)?([{[])/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    const open = m[3];
    const close = open === '{' ? '}' : ']';
    // התאמת-סוגריים מהמיקום של הפותח
    let i = m.index + m[0].length - 1;
    let depth = 0, end = -1, inStr = false, q = '';
    for (; i < src.length; i++) {
      const c = src[i];
      if (inStr) { if (c === q && src[i - 1] !== '\\') inStr = false; continue; }
      if (c === '"' || c === "'") { inStr = true; q = c; continue; }
      if (c === open) depth++;
      else if (c === close) { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end < 0) continue;
    const body = src.slice(m.index, end + 1);
    // ספירת-ערכים: פריטי-מפה 'k': v  או פריטי-רשימה 'x',
    const entries = (body.match(/['"][^'"]{1,}['"]\s*:/g) || []).length
      || (body.match(/['"][^'"]{1,}['"]\s*,/g) || []).length;
    if (entries >= MIN) {
      const startLine = src.slice(0, m.index).split('\n').length;
      const endLine = src.slice(0, end).split('\n').length;
      blocks.push({ name: m[2], decl: m[1].trim(), open, startLine, endLine, entries, span: [m.index, end + 1], body });
    }
  }
  return blocks;
}

function scan(asJson) {
  const rows = [];
  for (const { dir } of DIRS) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs)) {
      if (!/\.(dart|mjs)$/.test(f)) continue;
      if (/_test\.|\.test\.|\.contract\./.test(f)) continue;
      const src = fs.readFileSync(path.join(abs, f), 'utf8');
      const blocks = findDataBlocks(src);
      if (blocks.length) rows.push({ file: `${dir}/${f}`, blocks: blocks.map(b => ({ name: b.name, entries: b.entries, lines: `${b.startLine}-${b.endLine}` })) });
    }
  }
  if (asJson) { console.log(JSON.stringify(rows, null, 2)); return rows; }
  let engines = 0, values = 0;
  console.log('🧽 אינוונטר-טיהור · מנועים שנושאים דאטה-צרובה (בלוק ≥' + MIN + ' ערכים)\n');
  const byDir = {};
  for (const r of rows) { const d = r.file.split('/')[0]; (byDir[d] ||= []).push(r); }
  for (const [d, list] of Object.entries(byDir)) {
    console.log(`── ${d} (${list.length} מנועים) ──`);
    for (const r of list) {
      engines++;
      const bs = r.blocks.map(b => `${b.name}[${b.entries}]`).join(' · ');
      r.blocks.forEach(b => values += b.entries);
      console.log(`  🔴 ${r.file.split('/')[1]} — ${bs}`);
    }
    console.log('');
  }
  console.log(`═══ סה"כ: ${engines} מנועים · ${values} ערכי-דאטה צרובים ═══`);
  return rows;
}

const args = process.argv.slice(2);
if (args.includes('--scan') || args.length === 0) {
  scan(args.includes('--json'));
} else if (args[0] === '--extract') {
  console.log('extract: מומש בשלב הבא (v1 = הסורק). ראה --scan.');
} else {
  console.log('שימוש: node machtzev/purify.mjs --scan [--json] | --extract <file>');
}
