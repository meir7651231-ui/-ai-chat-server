#!/usr/bin/env node
/** מחצב · מנוע-פירוק-מסכים — קלט: קובץ-מסך Flutter ⇒ פלט: מניפסט-שכבות JSON.
 *  חוזה: SCREEN-DECOMP-CONTRACT.md. דטרמיניסטי, קריאה-בלבד, אפס-LLM.
 *  שכבות: 0-פיגמנטים · 1-מונחים · 2-אייקונים · 3-מועמדי-לוגיקה · 4/5-חוטי-תצוגה
 *  וסקציות (כולל קריאות/פעולות פר-widget) · 6-קומפוזר · 7-שקעי-לוח.
 *  שימוש: node screen-decomp.mjs <file.dart> [--json out.json] */
import fs from 'node:fs';
const file = process.argv[2];
if (!file) { console.error('שימוש: screen-decomp.mjs <screen.dart>'); process.exit(1); }
const src = fs.readFileSync(file, 'utf8');
const lines = src.split('\n');

// ── עזרי-סריקה ──
const uniq = (a) => [...new Set(a)].sort();
const grab = (re, g = 0, flags = 'g') => { const out = []; let m; const r = new RegExp(re, flags); while ((m = r.exec(src))) out.push(m[g]); return out; };

// חילוץ-גוף לפי איזון-סוגריים מהצהרת-מחלקה/פונקציה
function bodyOf(startIdx) {
  let i = src.indexOf('{', startIdx); if (i < 0) return ['', startIdx, startIdx];
  let d = 0, j = i;
  for (; j < src.length; j++) { if (src[j] === '{') d++; else if (src[j] === '}') { d--; if (!d) break; } }
  return [src.slice(i, j + 1), i, j];
}
const lineAt = (idx) => src.slice(0, idx).split('\n').length;

// ── שכבה 0 · פיגמנטים ──
const pigments = {
  tokens: uniq(grab('BsTokens\\.[A-Za-z0-9_]+')),
  themeSockets: uniq(grab('\\b(cfgRadius|Theme\\.of)\\b', 1)),
  fontSizes: uniq(grab('fontSize:\\s*([0-9.]+)', 1)).map(Number).sort((a, b) => a - b),
  fontWeights: uniq(grab('FontWeight\\.w?([0-9a-z]+)', 0)),
  opacities: uniq(grab('withOpacity\\(([^)]+)\\)', 1)),
  iconSizes: uniq(grab('Icon\\([^)]*size:\\s*([0-9.]+)', 1)).map(Number),
  roleRecord: /typedef\s+_?Pal|\(\{Color/.test(src), // חיווט-תפקידי-צבע (חוק-3)
};

// ── שכבה 1 · מונחים (מחרוזות עם עברית; אינטרפולציה ⇒ תבנית) ──
const heStrings = uniq(grab("'([^'\\\\]*[\\u0590-\\u05FF][^'\\\\]*)'", 1));

// ── שכבה 2 · אייקונים + גליפים ──
const icons = uniq(grab('Icons\\.[a-z_]+'));
const glyphs = uniq(grab('[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}]', 0, 'gu'));

// ── שכבות 4/5 · מחלקות-widget + גוף-כל-אחת ──
const widgetDecl = /class\s+(_?[A-Za-z0-9]+)\s+extends\s+(StatelessWidget|StatefulWidget|ConsumerWidget|ConsumerStatefulWidget)/g;
const widgets = []; let m;
while ((m = widgetDecl.exec(src))) {
  const [body] = bodyOf(m.index);
  const reads = uniq([...body.matchAll(/\b(?:watch|read)\(\s*([a-zA-Z0-9_]+Provider)/g)].map(x => x[1]));
  const writes = uniq([...body.matchAll(/([a-zA-Z0-9_]+Provider)(?:\.notifier)?\)\s*\.(?:state\s*=|add\(|set[A-Z])/g)].map(x => x[1]));
  const navs = uniq([
    ...[...body.matchAll(/=>\s*(?:const\s+)?([A-Z][A-Za-z0-9]+Screen)\(/g)].map(x => 'nav:' + x[1]),
    ...[...body.matchAll(/\b(open[A-Z][A-Za-z0-9]*|show[A-Z][A-Za-z0-9]*Sheet)\b/g)].map(x => 'call:' + x[1]),
  ]);
  const strs = uniq([...body.matchAll(/'([^'\\]*[\u0590-\u05FF][^'\\]*)'/g)].map(x => x[1]));
  const hasToast = /toast|Toast/.test(body);
  widgets.push({
    name: m[1], kind: m[2], line: lineAt(m.index), loc: body.split('\n').length,
    pure: reads.length + writes.length + navs.length === 0 && !hasToast,
    reads, writes, actions: [...navs, ...(hasToast ? ['fx:toast'] : [])], strings: strs.length,
  });
}

// ── שכבה 3 · מועמדי-לוגיקה (פונקציות/מחלקות שאינן widget, בלי BuildContext-ציור) ──
const logicCandidates = [];
const fnDecl = /(?:^|\n)(?:[A-Za-z_<>\[\]? ]+\s)?(_?[a-z][A-Za-z0-9]*)\s*\(([^)]*)\)\s*(?:=>|\{)/g;
while ((m = fnDecl.exec(src))) {
  const name = m[1];
  if (['if', 'for', 'while', 'switch', 'catch', 'build'].includes(name)) continue;
  const [body] = bodyOf(m.index + 1);
  const impure = /\b(watch|read)\(|Navigator|setState/.test(body);
  const mathy = /\bclamp\(|\bswitch\s*\(|[*\/+-]\s*[0-9.]|\?\s*[0-9.]/.test(body);
  if (!impure && mathy && body.length < 1200 && !/Widget|BuildContext ?[a-z]/.test(m[0] + body.slice(0, 80)))
    logicCandidates.push({ name, line: lineAt(m.index) });
}
// מחלקות-חישוב (לא-widget, שדות+getters מספריים)
for (const cm of src.matchAll(/class\s+(_?[A-Za-z0-9]+)\s*\{/g)) {
  const [body] = bodyOf(cm.index);
  if (/double\s+get|final\s+(?:int|double|bool)/.test(body) && !/extends|Widget/.test(src.slice(cm.index, cm.index + 80)))
    logicCandidates.push({ name: cm[1], line: lineAt(cm.index), kind: 'metrics-class' });
}

// ── שכבה 6 · קומפוזר: מיפוי-סקציות (switch section⇒widget) + מנוע-הסדר ──
const sectionMap = [...src.matchAll(/([A-Za-z]+)\.([a-zA-Z]+)\s*=>\s*(?:[a-zA-Z]+\s*\?\s*)?(?:const\s+)?\[?\s*_?([A-Z][A-Za-z0-9]+)\(\)/g)]
  .filter(x => x[3] !== 'SizedBox').map(x => ({ section: x[2], widget: '_' + x[3].replace(/^_/, '') }));
const composer = widgets.filter(w => /for\s*\(\s*final|visibleIds|\.map\(/.test(src.slice(src.indexOf('class ' + w.name), src.indexOf('class ' + w.name) + 3000)) && w.reads.length)
  .map(w => w.name);
const gates = uniq(grab('\\b(k[A-Z][A-Za-z]+|modOn\\([^)]+\\)|featOn\\([^)]+\\))\\b'));

// ── שכבה 7 · שקעי-לוח מצרפיים ──
const board = {
  reads: uniq(widgets.flatMap(w => w.reads)),
  writes: uniq(widgets.flatMap(w => w.writes)),
  navsAndCalls: uniq(widgets.flatMap(w => w.actions)),
};

// ── פלט ──
const manifest = { file, lines: lines.length, pigments, terms: heStrings, icons, glyphs, logicCandidates, widgets, sectionMap, composer, gates, board };
const jsonOut = process.argv.indexOf('--json');
if (jsonOut > 0) fs.writeFileSync(process.argv[jsonOut + 1], JSON.stringify(manifest, null, 1));

const pure = widgets.filter(w => w.pure), sections = widgets.filter(w => !w.pure);
console.log(`🔬 פירוק-מסך · ${file.split('/').pop()} — ${lines.length} שורות`);
console.log(`  ש0 פיגמנטים: ${pigments.tokens.length} טוקנים · גפנים ${pigments.fontSizes.join('/')} · אטימויות ${pigments.opacities.length} · תפקידי-צבע=${pigments.roleRecord ? 'כן (חוק-3)' : 'לא'}`);
console.log(`  ש1 מונחים: ${heStrings.length} מחרוזות-עבריות`);
console.log(`  ש2 אייקונים: ${icons.length} + ${glyphs.length} גליפים`);
console.log(`  ש3 מועמדי-לוגיקה: ${logicCandidates.length} — ${logicCandidates.map(l => l.name).join(' · ')}`);
console.log(`  ש4 חוטי-תצוגה טהורים: ${pure.length} — ${pure.map(w => w.name).join(' · ')}`);
console.log(`  ש5 סקציות/מחוברים: ${sections.length}`);
for (const w of sections) console.log(`     ${w.name} (${w.loc}ש) ← קורא:[${w.reads.join(',')}] פועל:[${[...w.writes.map(x => 'set:' + x), ...w.actions].join(',')}]`);
console.log(`  ש6 קומפוזר: ${composer.join(',') || '—'} · מיפוי-סקציות: ${sectionMap.length} · שערים: ${gates.join(' · ')}`);
console.log(`  ש7 שקעי-לוח: ${board.reads.length} קריאות · ${board.writes.length} כתיבות · ${board.navsAndCalls.length} ניווטים/קריאות`);
console.log(`  📊 סה"כ אטומים-מזוהים: ${pigments.tokens.length + heStrings.length + icons.length + glyphs.length + logicCandidates.length + widgets.length}`);
