#!/usr/bin/env node
// 🎯 כלי-דה-הרדקוד · מחליף שמות-צרובים במנוע במפתחות-מטרה + מזריק את השמות.
// לכל מחרוזת-עברית צרובה במנוע: מפיק מפתח-מטרה, מחליף ב-`term('<key>')`,
// אוסף {key→שם} לקובץ-דאטה, מוסיף שקע `term`, מחווט הבדיקה, מאמת, מחזיר-אם-נכשל.
// המנוע נשאר מדבר ב**מטרות** בלבד; השם מוזרק (מתחלף פר-וורטיקל: תרומה/תשלום/חשבונית).
//
// שימוש: node machtzev/dehardcode.mjs <file>   (dart-maor/atoms/dart)
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = new URL('../../new/', import.meta.url).pathname;
const DIRS = { 'dart': 'dart', 'dart-maor': 'dart-maor', 'atoms': 'atoms' };
const HEB = /[\u0590-\u05FF]/;

// תעתיק-על עברי→לטיני לגזירת-מפתח קריא (חלקי — נופל למספר-רץ אם ריק).
const T = { 'א':'a','ב':'b','ג':'g','ד':'d','ה':'h','ו':'v','ז':'z','ח':'ch','ט':'t','י':'y','כ':'k','ך':'k','ל':'l','מ':'m','ם':'m','נ':'n','ן':'n','ס':'s','ע':'a','פ':'p','ף':'f','צ':'ts','ץ':'ts','ק':'k','ר':'r','ש':'sh','ת':'t',' ':'-' };
function slug(s) { let o = ''; for (const c of s) o += (T[c] ?? ''); o = o.replace(/-+/g, '-').replace(/^-|-$/g, ''); return o || null; }

function dehardcode(rel) {
  const [dir] = rel.split('/');
  const lang = dir === 'atoms' ? 'js' : 'dart';
  const abs = path.join(ROOT, rel);
  const src0 = fs.readFileSync(abs, 'utf8');
  const base = path.basename(rel).replace(/\.(dart|mjs)$/, '');

  // מצא ליטרלים-עבריים (לא בתגובות). פשטני: מחוץ ל-// שורות.
  const codeNoComments = src0.replace(/^\s*\/\/.*$/gm, '');
  const lits = new Set();
  for (const m of codeNoComments.matchAll(/'([^'\\]*)'/g)) if (HEB.test(m[1])) lits.add(m[1]);
  if (lits.size === 0) { console.log(`↷ ${rel}: אין שמות-עבריים צרובים.`); return false; }

  // בנה מיפוי שם→מפתח-מטרה (ייחודי)
  const terms = {}; const key = {}; const used = new Set(); let i = 0;
  for (const s of lits) { let k = slug(s); if (!k || used.has(k)) k = `t${i}`; used.add(k); key[s] = k; terms[k] = s; i++; }

  // החלף כל ליטרל צרוב ב-term('<key>')
  let atom = src0.replace(/'([^'\\]*)'/g, (full, inner) => HEB.test(inner) && key[inner] ? `term('${key[inner]}')` : full);

  // הוסף שקע term לפונקציה הראשית
  const fnRe = /^([A-Za-z_][\w<>,?.\s]*?\s+([a-zA-Z_]\w*)\s*(?:<[^>]*>)?\s*)\(([^;]*?)\)\s*(\{|=>)/m;
  const fm = fnRe.exec(atom);
  if (!fm) { console.log(`↷ ${rel}: לא נמצאה פונקציה-ראשית.`); return false; }
  const fn = fm[2];
  const decl = lang === 'js' ? 'term' : 'required String Function(String) term';
  let params = fm[3];
  let np = /\{/.test(params) ? params.replace(/\}(\s*)$/, `, ${decl},}$1`) : (params.trim() ? `${params}, {${decl}}` : `{${decl}}`);
  atom = atom.slice(0, fm.index) + fm[1] + '(' + np + ') ' + fm[4] + atom.slice(fm.index + fm[0].length);

  // קובץ-דאטה
  const dataDir = { 'dart': 'dart-data', 'dart-maor': 'dart-data-maor', 'atoms': 'atoms-data' }[dir];
  const ext = lang === 'js' ? 'mjs' : 'dart';
  const dataRel = `${dataDir}/${base}-terms.${ext}`;
  const dataAbs = path.join(ROOT, dataRel);
  const entries = Object.entries(terms).map(([k, v]) => `  '${k}': '${v}',`).join('\n');
  const dataBody = lang === 'js'
    ? `// 🗄️ שמות · חולצו מ-${rel} (דה-הרדקוד). נערכים/מתחלפים פר-וורטיקל.\nexport const kTerms = {\n${entries}\n};\n`
    : `// 🗄️ שמות · חולצו מ-${rel} (דה-הרדקוד). נערכים/מתחלפים פר-וורטיקל.\nconst Map<String,String> kTerms = {\n${entries}\n};\n`;

  // בדיקה + צרכנים לגיבוי/שחזור
  const testRel = lang === 'js' ? rel.replace(/\.mjs$/, '.test.mjs') : rel.replace(/\.dart$/, '_test.dart');
  const testAbs = path.join(ROOT, testRel);
  const hasTest = fs.existsSync(testAbs);
  const testSrc0 = hasTest ? fs.readFileSync(testAbs, 'utf8') : '';

  // כתיבה
  fs.mkdirSync(path.dirname(dataAbs), { recursive: true });
  fs.writeFileSync(dataAbs, dataBody);
  fs.writeFileSync(abs, atom);

  // חיווט-בדיקה: import kTerms + הזרקת term:(k)=>kTerms[k]! לכל קריאה
  const injectCall = (s, dotted) => {
    const re = new RegExp((dotted ? '\\.\\s*' : '\\b') + fn + '\\s*\\(', 'g'); let out = '', idx = 0, m;
    while ((m = re.exec(s)) !== null) {
      let d = 1, j = m.index + m[0].length, inStr = false, q = '';
      for (; j < s.length; j++) { const c = s[j]; if (inStr) { if (c === q && s[j-1] !== '\\') inStr = false; continue; } if (c === '"' || c === "'") { inStr = true; q = c; continue; } if (c === '(') d++; else if (c === ')') { d--; if (d === 0) break; } }
      const after = s.slice(j+1).replace(/^\s*/, ''); if (!dotted && (after.startsWith('{') || after.startsWith('=>'))) continue;
      const val = lang === 'js' ? 'term: (k)=>kTerms[k]' : 'term: (k)=>kTerms[k]!';
      out += s.slice(idx, j) + `, ${val}` + s[j]; idx = j+1; re.lastIndex = idx;
    }
    return out + s.slice(idx);
  };
  if (hasTest) {
    const imp = lang === 'js' ? `import { kTerms } from '../${dataDir}/${base}-terms.mjs';\n` : `import '../${dataDir}/${base}-terms.dart';\n`;
    fs.writeFileSync(testAbs, injectCall(imp + testSrc0, false));
  }

  const cwd = path.join(ROOT, '..');
  try {
    if (lang === 'dart') { execSync(`dart analyze ${abs} ${dataAbs}`, { cwd, stdio: 'pipe' }); if (hasTest) execSync(`dart run --enable-asserts ${testAbs}`, { cwd, stdio: 'pipe' }); }
    else if (hasTest) execSync(`node ${testAbs}`, { cwd, stdio: 'pipe' });
    console.log(`✅ ${rel} — מנוע-מטרות · ${Object.keys(terms).length} שמות ל-${dataRel}${hasTest ? ' · בדיקה ✓' : ''} · שקע: term`);
    return true;
  } catch (e) {
    fs.writeFileSync(abs, src0); fs.rmSync(dataAbs, { force: true }); if (hasTest) fs.writeFileSync(testAbs, testSrc0);
    console.log(`↩ ${rel}: אימות נכשל — הוחזר לאחור.\n${String(e.stdout || e).slice(0, 250)}`);
    return false;
  }
}

const f = process.argv[2];
if (!f) console.log('שימוש: node machtzev/dehardcode.mjs <file>');
else dehardcode(f);
