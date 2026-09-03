#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  truth.mjs — מקור-האמת-האחד (נגזר-מהבייטים · דטרמיניסטי · אפס-הערכה).
//  כל מספר על הענף נמדד כאן מהקוד עצמו, חוצה 3 השכבות (תצוגה·לוגיקה·דאטה).
//  אסור לצטט מספר על הענף שלא יצא מכאן. `--gate` נכשל אם TRUTH.md סטה מהמדידה.
//  אפס תופעות-לוואי (קריאה בלבד; ייבוא render-ds בונה census/engines בזיכרון).
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { selectVaried, listMapEngines } from './generator/render-ds.mjs';
import * as R from './root.mjs';

const ROOT = R.ROOT;
const G = path.join(ROOT, 'machtzev/generator');
const rd = (p) => { try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); } catch { return ''; } };
const rj = (p) => { try { return JSON.parse(fs.readFileSync(path.join(G, p), 'utf8')); } catch { return []; } };
const nd = (d, re = /\.(mjs|dart)$/) => { try { return fs.readdirSync(path.join(ROOT, d)).filter((f) => re.test(f) && !/\.test\.|_test\.|\.contract\./.test(f)).length; } catch { return 0; } };

// ── שכבת-תצוגה ──
const census = rj('atom-index.json');   // c4ב · הכרעה C: האינדקס הוא האורקל (554); atom-census.json (522, ישן) נמחק
const seam = {}; for (const a of census) seam[a.seam] = (seam[a.seam] || 0) + 1;
const _rS = /^String\??$/, _rLS = /^List<String>\??$/, _rLLS = /^List<List<String>>\??$/, _rLD = /^List<double>\??$/, _rI = /^int\??$/;
const ASPECTS = {
  kpi: [{ value: { re: /^(value|val|amount|total|count|num)$/, ty: _rS }, label: { re: /^(label|title|caption|name|sub)$/, ty: _rS } }, (a) => a.caps.includes('kpi') && a.seam === 'fields'],
  board: [{ stages: { re: /^stages$/ }, records: { re: /^records$/ }, stageOf: { re: /^stageOf$/ }, titleOf: { re: /^titleOf$/ }, onMove: { re: /^onMove$/ } }, (a) => a.seam === 'collection'],
  nav: [{ label: { re: /^(label|title|name|text)$/, ty: _rS }, onTap: { re: /^onTap$/ } }, (a) => a.seam === 'fields'],
  tbl: [{ labels: { re: /^(labels|cols|columns|headers)$/, ty: _rLS }, rows: { re: /^(rows|data)$/, ty: _rLLS } }, (a) => a.caps.includes('list') && a.seam === 'collection'],
  trend: [{ labels: { re: /^(labels|cols)$/, ty: _rLS }, values: { re: /^(values|data|series)$/, ty: _rLD } }, (a) => a.caps.includes('trend') && a.seam === 'series'],
  prog: [{ pct: { re: /^(pct|percent|value|val)$/, ty: _rI } }, (a) => a.caps.includes('progress') && a.seam === 'fields'],
  card: [{ title: { re: /^(title|name|label|head|caption)$/, ty: _rS }, sub: { re: /^(sub|subtitle|desc|body|note|caption)$/, ty: _rS } }, (a) => a.caps.includes('card') && a.seam === 'fields'],
};
const dispReach = {}; const dispAll = new Set();
for (const [n, [spec, pred]] of Object.entries(ASPECTS)) {
  const s = new Set(); for (let seed = 0; seed < 400; seed++) { const r = selectVaried(spec, pred, seed); if (r) s.add(r.cls); }
  dispReach[n] = s.size; for (const x of s) dispAll.add(x);
}

// ── שכבת-לוגיקה ──
const logic = rj('logic-census.json');
const wireable = logic.filter((x) => x.wireable).length;
const engines = listMapEngines();
// c3ג · מכנה כן (הכרעה N): לא כל אטום ניתן-לחיווט. תצוגה: fields עם ≥1 שקע-String, collection, series; לוגיקה: wireable.
const eligibleDisp = census.filter((a) => (a.seam === 'fields' && (a.str || 0) >= 1) || a.seam === 'collection' || a.seam === 'series').length;
const eligible = eligibleDisp + wireable;

// ── מבנה + שערים ──
const gatesTsv = rd('machtzev/gates.tsv').split('\n').filter((l) => l && !l.startsWith('#')).length;
const gateCalls = (rd('machtzev/police.mjs').match(/^\s*gate(Dirty)?\(/gm) || []).length;

const totalAtoms = census.length + logic.length;
const wiredTotal = dispAll.size + engines.length;
const wiredPct = (wiredTotal / totalAtoms * 100).toFixed(1);
const layers = {
  '🔢 סה"כ אטומים מאונדקסים (תצוגה+לוגיקה)': totalAtoms,
  '🔌 מחווטים-למחולל בפועל': `${wiredTotal} (${wiredPct}%) · ${totalAtoms - wiredTotal} מפורקים-אך-לא-מחווטים`,
  '  ↳ מול כשירים-לחיווט (eligible)': `${wiredTotal}/${eligible} (${(wiredTotal / (eligible || 1) * 100).toFixed(1)}%) · כשירים: תצוגה ${eligibleDisp} (fields∧str≥1 ∪ collection ∪ series) + לוגיקה ${wireable} (wireable)`,
  '  ↳ חיווט-תצוגה': `${dispAll.size}/${census.length} (${(dispAll.size / census.length * 100).toFixed(1)}%)`,
  '  ↳ חיווט-לוגיקה': `${engines.length}/${logic.length} (${(engines.length / logic.length * 100).toFixed(1)}%)`,
  'תצוגה · atom-index (widgets · הכרעה C)': census.length,
  '  ↳ seam': JSON.stringify(seam),
  '  ↳ נגישים-בהרכבה (selectVaried×400)': dispAll.size,
  '  ↳ פר-היבט': JSON.stringify(dispReach),
  'לוגיקה · logic-census': logic.length,
  '  ↳ wireable': wireable,
  '  ↳ מחוברים-למחולל (MAP_ENGINES)': engines.length,
  'דאטה · new/dart-data-maor': nd('new/dart-data-maor', /\.dart$/),
  'מקור-JS · new/atoms': nd('new/atoms'),
  'המרה · new/dart-maor': nd('new/dart-maor', /\.dart$/),
};
const structure = {
  'machtzev/ שורש (.mjs)': nd('machtzev', /\.mjs$/),
  'machtzev/ תת-תיקיות': (() => { try { return fs.readdirSync(path.join(ROOT, 'machtzev'), { withFileTypes: true }).filter((e) => e.isDirectory() && e.name !== 'node_modules' && !e.name.startsWith('.')).length; } catch { return 0; } })(),
  'generator/ קנוני': nd('machtzev/generator'),
  'generator/legacy/': nd('machtzev/generator/legacy'),
  'knowledge/ פעיל': nd('knowledge', /\.md$/),
  'knowledge/archive/': nd('knowledge/archive', /\.md$/),
  'שערי-משטרה (gates.tsv)': gatesTsv,
  'שערי-משטרה (police gate())': gateCalls,
};

const stamp = (o) => Object.entries(o).map(([k, v]) => `- **${k}:** ${v}`).join('\n');
const body = `# 📐 TRUTH — מקור-האמת-האחד (מחולל · נגזר-מהבייטים · אל תערוך ידנית)
> כל מספר כאן נמדד ע"י \`node machtzev/truth.mjs\` מהקוד עצמו. **אסור לצטט מספר-ענף שלא מכאן.**
> \`--gate\` נכשל אם הקובץ הזה סטה מהמדידה החיה. ריענון: \`node machtzev/truth.mjs --write\`.

## 3 השכבות של §21 (תצוגה · לוגיקה · דאטה)
${stamp(layers)}

## מבנה הענף
${stamp(structure)}

## אזהרת-אמת (הלקח שנקנה ביוקר)
"סידור-הענף" = פריסת-קבצים. "כמה/מה-מחובר" = **מדידה חוצת-3-שכבות**. אל תסיק תקרה משכבה-אחת.
המחולל מחובר: תצוגה=${dispAll.size} נגישים · לוגיקה=${engines.length} מנועים · מתוך מאגר גדול בהרבה שנחסם ע"י §20-ג (אל-תזייף).
`;

// 🔒 רַצֶ'ט-אי-נסיגה: חיווט רק-עולה. floor נשמר; --gate נכשל אם ירד מתחתיו (מונע חזרה-אחורה למטרה).
const FLOOR = path.join(ROOT, 'machtzev/wired-floor.json');
const readFloor = () => { try { return JSON.parse(fs.readFileSync(FLOOR, 'utf8')).wired || 0; } catch { return 0; } };
if (process.argv.includes('--write')) {
  fs.writeFileSync(path.join(ROOT, 'TRUTH.md'), body);
  // c5 · בלוק-אמת מחולל ב-CLAUDE.md (בין <!-- truth:begin --> ל-<!-- truth:end -->): המספרים בשער-הכניסה
  // נגזרים מהמדידה, לא נכתבים ביד (R2-4.7 · D1 תת-ספירה=אזעקה). הקובץ נעול — הבלוק פטור מכוונה: הוא פלט של truth.
  try {
    const cf = path.join(ROOT, 'CLAUDE.md'); const cur = fs.readFileSync(cf, 'utf8');
    const gatesN = (rd('machtzev/gates.tsv').split('\n').filter((l) => l && !l.startsWith('#'))).length;
    const pinsN = (rd('machtzev/pins.sha256').split('\n').filter(Boolean)).length;
    const block = `<!-- truth:begin · מחולל ע"י node machtzev/truth.mjs --write · אל תערוך ידנית -->\n` +
      `‏**${totalAtoms}** אטומים מאונדקסים (תצוגה **${census.length}** · לוגיקה **${logic.length}**) · מחווטים-למחולל **${wiredTotal}** מתוך **${eligible}** כשירים (${(wiredTotal / (eligible || 1) * 100).toFixed(1)}%) · ` +
      `‏**${gatesN}** שערי-משטרה (gates.tsv) · **${pinsN}** קבצים נעולי-חתימה (pins.sha256)\n<!-- truth:end -->`;
    const re = /<!-- truth:begin[^]*?<!-- truth:end -->/;
    if (re.test(cur)) { const next = cur.replace(re, block); if (next !== cur) { fs.writeFileSync(cf, next); console.log('📐 CLAUDE.md truth-block עודכן'); } }
  } catch {}
  // c3ג · הרצפה זזה רק עם --floor (טבעת-push/CI, floor-advance) — לעולם לא מתוך hook (R2-4.5 · R2-5.7).
  if (process.argv.includes('--floor')) {
    const floor = Math.max(readFloor(), wiredTotal);   // מונוטוני — לעולם לא יורד
    fs.writeFileSync(FLOOR, JSON.stringify({ wired: floor, eligible, total: totalAtoms, note: 'רצפת-חיווט — רק-עולה. היעד: wired≡eligible (הכשירים-לחיווט), לא total.' }, null, 1) + '\n');
    console.log('📐 TRUTH.md + wired-floor=' + floor + ' נכתבו (' + wiredTotal + '/' + eligible + ' כשירים · ' + totalAtoms + ' סה"כ)');
  } else console.log('📐 TRUTH.md נכתב (' + wiredTotal + '/' + eligible + ' כשירים · ' + totalAtoms + ' סה"כ · רצפה ' + readFloor() + ' ללא שינוי; --floor להזזה)');
  process.exit(0);
}
if (process.argv.includes('--gate')) {
  const cur = rd('TRUTH.md');
  if (cur.trim() !== body.trim()) { console.error('🔴 TRUTH.md סטה מהמדידה החיה — הרץ `node machtzev/truth.mjs --write` וקבֵּע.'); process.exit(1); }
  const floor = readFloor();
  if (wiredTotal < floor) { console.error(`🔴 נסיגת-חיווט! ${wiredTotal} < רצפה ${floor} — §21 חזר-אחורה. אסור.`); process.exit(1); }
  console.log(`✓ אמת: TRUTH.md ≡ מדידה · חיווט ${wiredTotal}/${totalAtoms} ≥ רצפה ${floor} (רק-עולה)`); process.exit(0);
}
process.stdout.write(body + '\n');
