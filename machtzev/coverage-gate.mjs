#!/usr/bin/env node
/** 📈 שער-הכיסוי (מבצע-המאה, פאזה 6) — מחגר רק-עולה על צירי-היכולת של המפעל:
 *  לבנים-ברות-מילוי · מנועים-ברי-הרצה (רתמת-התאומים) · מהות-עברית · תאומי-דאטה.
 *  ‏baseline נשמר ב-coverage-baseline.json: ירידה בציר ⇒ אדום; עלייה ⇒ ה-baseline מתעדכן
 *  מעצמו (המדד חי ב-machtzev/generator/knowledge — מוזן גם למסך-הראווה). */
import fs from 'node:fs';
import path from 'node:path';
import { buildAtlas } from './generator/atlas.mjs';
import { buildTwinRegistry } from './generator/twins.mjs';
import { harvestDartTwins } from './generator/dart-twins.mjs';
import * as R from './root.mjs';
const HERE = R.MACH;
const ROOT = R.ROOT;
const BASE = path.join(HERE, 'coverage-baseline.json');

const atlas = buildAtlas();
const FILLABLE = /^(String|bool|int|double|Color|IconData|TextEditingController|VoidCallback|void Function\(\)|ValueChanged<(bool|int|String|TimeOfDay)>|void Function\((bool|int|String|TimeOfDay)( \w+)?\)|List<String>|EdgeInsets(Geometry)?|FontWeight|TimeOfDay|Key|Object|Future<void> Function\(\)|List<[A-Z]\w*>|List<\([^)]*\)>|\(\{[^}]*\}\))/;
let fillable = 0;
for (const w of atlas.widgets) {
  let ok = true;
  for (const rq of [...w.required, ...w.positional]) {
    const t = (w.types.get(rq) || '').replace(/\?$/, '');
    if (/^Widget\b|^List<Widget>/.test(t)) continue;
    if (!FILLABLE.test(t)) { ok = false; break; }
  }
  if (ok) fillable++;
}
const uniq = new Map();
for (const f of atlas.functions) if (!uniq.has(f.name)) uniq.set(f.name, f);
const withHe = [...uniq.values()].filter(f => f.he.length);
const dartReg = harvestDartTwins(atlas.functions);
const twins = await buildTwinRegistry([...uniq.values()].filter(f => f.he.length && f.params.length));
// מנועים מוכחי-חוזה: פונקציות שבדיקת-ה-golden שלהן עברה בהרצת-Dart (ההוכחה החזקה; machtzev/verify-dart-tests.mjs)
let testProven = new Set();
try { testProven = new Set(JSON.parse(fs.readFileSync(path.join(HERE, 'generator/knowledge/dart-tests-passing.json'), 'utf8'))); } catch { }
// תאומי-דאטה: כל אטום-דאטה-JS (מוסכמת-שמות) עם קובץ-Dart תואם
const jsData = fs.readdirSync(path.join(ROOT, 'new/atoms')).filter(f => /(-strings|-terms|-data|-nums)\.mjs$/.test(f) && !/\.test\.|\.contract\./.test(f));
const dartData = new Set(fs.readdirSync(path.join(ROOT, 'new/dart-data-maor')).map(f => f.replace(/\.dart$/, '')));
const dataTwinned = jsData.filter(f => dartData.has(f.replace(/\.mjs$/, ''))).length;

const cur = {
  widgetsFillable: fillable,
  widgetsTotal: atlas.widgets.length,
  enginesRunnable: new Set([...twins.keys(), ...dartReg.keys(), ...[...testProven].filter(n => uniq.has(n))]).size,
  enginesTotal: uniq.size,
  essence: withHe.length,
  dataTwinned,
  dataTotal: jsData.length,
};
let base = {};
try { base = JSON.parse(fs.readFileSync(BASE, 'utf8')); } catch { }
let bad = 0;
for (const k of ['widgetsFillable', 'enginesRunnable', 'essence', 'dataTwinned'])
  if (base[k] !== undefined && cur[k] < base[k]) { console.error(`🚨 שער-הכיסוי: נסיגה ב-${k}: ${cur[k]} < ${base[k]}`); bad = 1; }
// c3ג · עיקרון 5: שער לא כותב. גידול מדווח ומוחל בטבעת-push (--baseline מפורש); היה: כתיבה בכל ריצה ירוקה (R2-5.6).
if (process.argv.includes('--baseline')) { fs.writeFileSync(BASE, JSON.stringify(cur, null, 1) + '\n'); console.log('✍️ coverage-baseline נכתב'); }
else { const grew = ['widgetsFillable', 'enginesRunnable', 'essence', 'dataTwinned'].filter(k => base[k] === undefined || cur[k] > base[k]); if (!bad && grew.length) console.log(`ℹ️ baseline may grow: ${grew.map(k => k + ' ' + (base[k] ?? '∅') + '→' + cur[k]).join(' · ')} — מוחל בטבעת-push (--baseline)`); }
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
console.log(`${bad ? '🚨' : '✓'} שער-הכיסוי: לבנים ${cur.widgetsFillable}/${cur.widgetsTotal} (${pct(cur.widgetsFillable, cur.widgetsTotal)}%) · מנועים ${cur.enginesRunnable}/${cur.enginesTotal} (${pct(cur.enginesRunnable, cur.enginesTotal)}%) · מהות ${cur.essence}/${cur.enginesTotal} (${pct(cur.essence, cur.enginesTotal)}%) · תאומי-דאטה ${cur.dataTwinned}/${cur.dataTotal} (${pct(cur.dataTwinned, cur.dataTotal)}%)`);
process.exit(bad);
