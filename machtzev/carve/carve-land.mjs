#!/usr/bin/env node
// 🔨 פולט+מאמת · לוקח תוצאת-חצב (trivial) → מנחית אטום + בדיקת-Golden ב-new/dart,
// מאמת (analyze + golden), מחזיר-לאחור בכשל. אפס-אטום שלא עבר קומפילציה+בדיקה.
// חוזק: קידוד-פלט jsonEncode (חסין escaping/רב-שורות) · דדופ-שם תוך-ריצה.
// שימוש: node carve-land.mjs <carved.json>
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

// יעד-הנחיתה: new/ כברירת-מחדל. CARVE_OUT מאפשר ריצת-ניסוי לתיקייה זמנית
// בלי לגעת במדף — נחיתה למדף היא החלטה, לא תופעת-לוואי של הרצה.
const ROOT = process.env.CARVE_OUT || new URL('../../new/', import.meta.url).pathname;
// ⚠️ המדף האמיתי, תמיד — גם בריצת-ניסוי. בלי זה `CARVE_OUT` מזיז את בדיקת
// «כבר-קיים» לתיקייה הזמנית, וריצת-מדידה מדווחת כ«חדשים» אטומים שכבר במדף.
const SHELF = new URL('../../new/', import.meta.url).pathname;
const DART = process.env.DART_SDK_BIN || '/home/user/flutter/bin';
const env = { ...process.env, PATH: `${DART}:${process.env.PATH}` };

const POOL = [
  { d: "''", t: 'String' }, { d: "'abc'", t: 'String' }, { d: "'כהן לוי'", t: 'String' },
  { d: "'2026-08-24'", t: 'String' }, { d: "'0501234567'", t: 'String' }, { d: "'  x  '", t: 'String' },
  { d: '0', t: 'int' }, { d: '1', t: 'int' }, { d: '-3', t: 'int' }, { d: '100', t: 'int' }, { d: '786', t: 'int' },
  { d: '3.14', t: 'double' }, { d: '0.5', t: 'double' },
  { d: 'true', t: 'bool' }, { d: 'false', t: 'bool' }, { d: 'null', t: 'Null' },
];
// קו-תחתון (snake_case) — תואם קונבנציית-הריפו (action_from_string), מפעיל דדופ נכון
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/^_+/, '').toLowerCase();
// גוף-סטאב: החזרת-קבוע ריקה-מתוכן (=> 0 / const {} / '' / null) — לא מנגנון
const STUB = /=>\s*(?:const\s+)?(?:\{\s*\}|\[\s*\]|''|""|0|0\.0|null|-?\d+)\s*;?\s*$/;

// ליטרל-דוגמה לטיפוס-אלמנט (לסינתזת-אוסף)
const elemLit = (t) => ({ String: "'a'", int: '1', double: '1.5', num: '1', bool: 'true' }[t.replace(/\?$/, '')] ?? null);
function compat(pt, inlined = []) {
  const nul = pt.endsWith('?'); const base = pt.replace(/\?$/, '');
  // DateTime: ליטרל-קבוע (דטרמיניסטי — לא DateTime.now()).
  if (base === 'DateTime') {
    const out = [{ d: 'DateTime(2026, 8, 24)', t: base }, { d: 'DateTime(2026, 1, 1, 13, 45)', t: base }];
    if (nul) out.push({ d: 'null', t: base });
    return out;
  }
  // enum שהוטבע באטום verbatim: הערכים זמינים בקובץ, אין צורך לזייף.
  if (inlined.includes(base)) {
    const out = [{ d: `${base}.values.first`, t: base }, { d: `${base}.values.last`, t: base }];
    if (nul) out.push({ d: 'null', t: base });
    return out;
  }
  // סינתזת-אוסף: List<X>/Set<X> ⇒ ריק + זוג-אלמנטים · Map<K,V> ⇒ ריק + זוג
  const mL = base.match(/^(List|Set|Iterable)<(.+)>$/);
  if (mL) { const el = elemLit(mL[2]); const c = mL[1] === 'List' ? '[]' : '{}'; const out = [{ d: `const <${mL[2]}>${c}`, t: base }]; if (el) out.push({ d: `const <${mL[2]}>${mL[1] === 'List' ? `[${el},${el}]` : `{${el}}`}`, t: base }); if (nul) out.push({ d: 'null', t: base }); return out; }
  const mM = base.match(/^Map<\s*(.+?)\s*,\s*(.+)>$/);
  if (mM) { const k = elemLit(mM[1]), v = elemLit(mM[2]); const out = [{ d: `const <${mM[1]}, ${mM[2]}>{}`, t: base }]; if (k && v) out.push({ d: `const <${mM[1]}, ${mM[2]}>{${k}: ${v}}`, t: base }); if (nul) out.push({ d: 'null', t: base }); return out; }
  return POOL.filter(v => {
    if (v.t === 'Null') return nul || base === 'Object' || base === 'dynamic';
    if (base === 'Object' || base === 'dynamic') return true;
    if (base === 'num') return v.t === 'int' || v.t === 'double';
    if (base === 'double') return v.t === 'double' || v.t === 'int';
    return v.t === base;
  });
}
function parseParams(fnSrc) {
  // ⚠️ בלי הסרת-הערות הרגקס תופס סוגריים מתוך dartdoc (`/// ... (…)`) ולא את
  // החתימה — והפונקציה נדחתה «אין-קלט-סל» בזמן שהפרמטרים שלה פרימיטיביים.
  const clean = fnSrc.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const m = clean.match(/\b[\w$]+\s*\(([^)]*)\)/); if (!m) return null;
  const raw = m[1].trim(); if (!raw) return [];
  if (/[{[]/.test(raw)) return null;
  return raw.split(',').map(p => { const parts = p.trim().split(/\s+/); return { type: parts.slice(0, -1).join(' '), name: parts.at(-1) }; });
}
function atomFile(r, srcRef) {
  const imports = (r.imports || []);
  const pure = imports.length
    ? `// טוהר: פונקציית top-level עצמאית; הייבוא היחיד הוא ספריית-שפה טהורה (${imports.join(' ')}).\n`
    : `// טוהר: פונקציית top-level עצמאית, אפס-import (אומת ע"י פותר-המזהים).\n`;
  // חוק-3: קריאה-לשכן ⇒ פרמטר-שקע. הכותרת מצהירה על כל שקע שהוזרק אוטומטית.
  const sock = (r.autoSocket && r.socketMeta && r.socketMeta.length)
    ? `// שקעים (חוק-3 — הוזרקו אוטומטית מקריאות-שכן במקור): ${r.socketMeta.map(x => x.name).join(' · ')}.\n`
    : '';
  const header = `// ⚛️ אטום-Dart (דרגת-חוזה) · ${r.name}\n// מוצא: ${srcRef} (חצב-AST · חוק-4 — התנהגות זהה, לא-משופרת).\n${pure}${sock}${r.inlineTypes.length ? `// טיפוסים מוטבעים (חוק-1, verbatim מהמקור): ${r.inlineTypes.join(', ')}.\n` : ''}`;
  const types = r.copiedTypes.length ? r.copiedTypes.join('\n\n') + '\n\n' : '';
  return header + '\n' + (imports.length ? imports.join('\n') + '\n\n' : '') + types + r.fnSource + '\n';
}

function landOne(r, seen) {
  const kb = kebab(r.name);
  const atomAbs = path.join(ROOT, 'dart', `${kb}.dart`);
  const testAbs = path.join(ROOT, 'dart', `${kb}_test.dart`);
  if (seen.has(kb)) return { name: r.name, skip: 'כפול-שם תוך-ריצה' };
  if (fs.existsSync(atomAbs) || fs.existsSync(path.join(SHELF, 'dart', `${kb}.dart`))) return { name: r.name, skip: 'כבר-קיים' };
  // פסול: מתודת-override (לא אטום-עצמאי) · גוף-סטאב (קבוע ריק — אין מנגנון)
  if (/@override\b/.test(r.fnSource)) return { name: r.name, skip: '@override — לא אטום' };
  if (STUB.test(r.fnSource)) return { name: r.name, skip: 'סטאב — גוף-קבוע' };
  const params = r.autoSocket ? r.origParams : parseParams(r.fnSource);
  if (params === null) return { name: r.name, skip: 'חתימה לא-טריוויאלית' };
  const socketArgs = (r.autoSocket && r.socketMeta) ? r.socketMeta.map(s => `${s.name}: ${s.init}`).join(', ') : '';
  const mkArgs = (c) => [c.map(v => v.d).join(', '), socketArgs].filter(Boolean).join(', ');
  const perParam = params.map(p => compat(p.type, r.inlineTypes || []));
  if (perParam.some(x => x.length === 0)) return { name: r.name, skip: 'אין-קלט-סל' };
  const combos = [];
  const rec = (i, acc) => { if (combos.length >= 12) return; if (i === params.length) { combos.push(acc); return; } for (const v of perParam[i]) { rec(i + 1, [...acc, v]); if (combos.length >= 12) break; } };
  if (params.length === 0) combos.push([]); else rec(0, []);
  seen.add(kb);

  const srcRef = r._srcRef || '(מקור)';
  fs.writeFileSync(atomAbs, atomFile(r, srcRef));

  const callArgs = combos.map(c => mkArgs(c));
  const sockSrc = (r.autoSocket && r.socketDecls && r.socketDecls.length)
    ? '\n// --- מימוש-השקע verbatim מהמקור (לבדיקה בלבד; לא אטום מיובא) ---\n' + r.socketDecls.join('\n\n') + '\n'
    : '';
  const harness = `import 'dart:convert';\nimport '${kb}.dart';\n${(r.imports || []).join('\n')}${sockSrc}\nvoid main(){\n${callArgs.map((a, i) => `  try { print(jsonEncode([${i}, (${r.name}(${a})).toString()])); } catch(e){ print(jsonEncode([${i}, {"__t":1}])); }`).join('\n')}\n}\n`;
  const harnessAbs = path.join(ROOT, 'dart', `_carve_h_${kb}.dart`);
  fs.writeFileSync(harnessAbs, harness);
  let outs;
  try {
    execSync(`dart analyze ${atomAbs}`, { cwd: ROOT, env, stdio: 'pipe' });
    const raw = execSync(`dart run ${harnessAbs}`, { cwd: ROOT, env, stdio: ['ignore', 'pipe', 'pipe'], timeout: 15000 }).toString();
    const rows = raw.trim().split('\n').filter(l => l.startsWith('[')).map(l => JSON.parse(l));
    outs = []; for (const [i, o] of rows) outs[i] = (o && typeof o === 'object' && o.__t) ? '__THROW__' : o;
  } catch (e) {
    fs.rmSync(atomAbs, { force: true }); fs.rmSync(harnessAbs, { force: true });
    return { name: r.name, fail: 'analyze/run: ' + String((e.stderr || e).toString()).slice(0, 90).replace(/\n/g, ' ') };
  }
  fs.rmSync(harnessAbs, { force: true });
  if (outs.filter(x => x !== undefined).length !== combos.length) { fs.rmSync(atomAbs, { force: true }); return { name: r.name, fail: 'אפיון חלקי' }; }

  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\$/g, '\\$');
  const asserts = combos.map((c, i) => {
    const call = `${r.name}(${mkArgs(c)})`;
    return outs[i] === '__THROW__'
      ? `  { var threw=false; try{ ${call}; }catch(_){threw=true;} if(!threw) throw StateError('FAIL #${i}: expected throw'); n++; }`
      : `  _eq((${call}).toString(), '${esc(outs[i])}', '#${i}'); n++;`;
  }).join('\n');
  const test = `// בדיקת-Golden · ${r.name} — אפיון-חצב (חוק-4). מייבאת רק את האטום.\nimport '${kb}.dart';\n${(r.imports || []).join('\n')}${sockSrc}\nvoid _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [\$lbl]: got=\$got want=\$want'); }\nvoid main(){\n  var n=0;\n${asserts}\n  print('✓ ${r.name}: '+n.toString()+' Golden');\n}\n`;
  fs.writeFileSync(testAbs, test);
  try { execSync(`dart analyze ${testAbs}`, { cwd: ROOT, env, stdio: 'pipe' }); execSync(`dart run --enable-asserts ${testAbs}`, { cwd: ROOT, env, stdio: 'pipe' }); }
  catch (e) { fs.rmSync(atomAbs, { force: true }); fs.rmSync(testAbs, { force: true }); return { name: r.name, fail: 'golden: ' + String((e.stdout || e).toString()).slice(0, 100).replace(/\n/g, ' ') }; }

  // חוזה
  const doc = (r.fnSource.match(/\/\/\/[^\n]*/g) || []).join('\n').replace(/\/\/\/ ?/g, '');
  const md = `# חוזה · ${r.name}\n\n> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).\n\n## מקור\n${srcRef}\n\n## התנהגות\n${doc || '(ראה גוף-האטום)'}\n\n## אימות\nבדיקת-Golden (\`${kb}_test.dart\`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: \`dart run --enable-asserts new/dart/${kb}_test.dart\`.\n`;
  fs.writeFileSync(path.join(ROOT, 'dart', `${kb}.contract.md`), md);
  return { name: r.name, landed: `${kb}.dart`, golden: combos.length };
}

const carved = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const trivial = carved.filter(r => r.ok && (r.trivial || r.autoSocket));
const seen = new Set();
let landed = 0, failed = 0, skipped = 0;
const skipWhy = {};   // סיבת-דילוג ⇒ שמות (בלי זה 16 דילוגים נעלמו בשקט)
for (const r of trivial) {
  const res = landOne(r, seen);
  if (res.landed) { landed++; if (landed <= 40) console.log(`✅ ${res.name} → dart/${res.landed} · ${res.golden} Golden`); }
  else if (res.fail) { failed++; if (failed <= 20) console.log(`↩ ${res.name}: ${res.fail}`); }
  else { skipped++; (skipWhy[res.skip || 'לא-מנומק'] ??= []).push(res.name); }   // שקט אינו דילוג
}
console.log(`\n═══ נחיתה: ✅ ${landed} אטומים · ↩ ${failed} נכשלו · ↷ ${skipped} דולגו (מתוך ${trivial.length} trivial) ═══`);
for (const [why, names] of Object.entries(skipWhy).sort((a, b) => b[1].length - a[1].length)) console.log(`   ↷ ${why}: ${names.length} · ${names.slice(0, 6).join(' ')}`);
