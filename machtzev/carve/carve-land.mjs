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
// ⚠️ ה-SDK עצמו, לא עטיפת-flutter. `/home/user/flutter/bin/dart` הוא סקריפט-מעטפת
// שנכנס לשומר-ה-root של flutter ומפיל את `dart analyze`/`dart run` — והנחיתה
// ספרה את זה ככשל-אטום ומחקה את האטום. 37 אטומים נזרקו כך בלי שנבדקו מעולם.
// הרתמה והבדיקה ייבאו את ייבואי-האטום בעיוור. `dart analyze` נכשל על
// ייבוא-לא-בשימוש ⇒ אטום תקין נזרק. מייבאים רק מה שהגוף באמת מזכיר.
const usedImports = (imports, body) => (imports || []).filter(im => {
  const pfx = /\bas\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/.exec(im);
  if (pfx) return new RegExp('\\b' + pfx[1] + '\\.').test(body);
  return true;
});
const RESERVED = new Set([
  'int','bool','double','num','String','List','Map','Set','Object','Function','Iterable','dynamic','void','Null','Never','Enum','Symbol','Type','Duration','DateTime','RegExp','Uri','BigInt',
  'do','if','for','in','is','as','new','var','final','const','class','enum','extends','super','this','null','true','false','switch','case','default','return','try','catch','finally','throw','rethrow','while','with','assert','break','continue','else','set','get','factory','operator','typedef','part','show','hide','mixin','abstract','static','external','implements','import','export','library','yield','await','async','covariant','deferred','on',
]);
const DART = process.env.DART_SDK_BIN || '/home/user/flutter/bin/cache/dart-sdk/bin';
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
// ⚠️ בלי ערך-אלמנט, `List<X>` קיבל **רק** את הרשימה-הריקה, והזהב יצא ריק:
// פונקציה מחוללת שמחזירה [] עברה אותו. עכשיו גם טיפוס-מוטבע תורם אלמנט
// (מ-typeSamples של החצב), וללא ערך-אמת — אין אלמנט, לא ניחוש.
const elemLit = (t, samples = {}) => {
  const b = t.replace(/\?$/, '');
  const core = { String: "'a'", int: '1', double: '1.5', num: '1', bool: 'true' }[b];
  if (core) return core;
  const ex = samples[b];
  return (ex && ex.length) ? ex[0] : null;
};
function compat(pt, inlined = [], generics = [], samples = {}, bodyLits = {}) {
  const nul = pt.endsWith('?'); const base = pt.replace(/\?$/, '');
  // G67 · «זהב-ריק» (57/196): הפונקציה החזירה את ברירת-המחדל ('' / 0 / false) על כל דוגמה-גנרית ⇒ העותק-החלול עבר. הדוגמאות
  //   הכי-טובות הן **ליטרלי-ההכרעה של הגוף עצמו** (`key == 'cart'` · `code <= 48`) — החצב פולט אותם (bodyLits) והם באים ראשונים.
  const own = (bodyLits[base] || []).slice(0, 6).map((d) => ({ d, t: base }));
  if (own.length && /^(String|int|double|num|bool)$/.test(base)) { const rest = compat(pt, inlined, generics, samples, {}); const seen = new Set(own.map((x) => x.d)); return [...own, ...rest.filter((x) => !seen.has(x.d))]; }
  // טיפוס-גנרי שנוצר במחיקת-טיפוס: הפונקציה **אינה קוראת ממנו שדה** (אומת
  // ב-_MemberUse), ולכן כל ערך משרת אותה זהה. מחרוזת מספיקה, וההסקה כובלת T=String.
  if (generics.includes(base)) {
    const out = [{ d: "'a'", t: base }, { d: "'ב'", t: base }];
    if (nul) out.push({ d: 'null', t: base });
    return out;
  }
  // DateTime: ליטרל-קבוע (דטרמיניסטי — לא DateTime.now()).
  if (base === 'DateTime') {
    const out = [{ d: 'DateTime(2026, 8, 24)', t: base }, { d: 'DateTime(2026, 1, 1, 13, 45)', t: base }];
    if (nul) out.push({ d: 'null', t: base });
    return out;
  }
  // טיפוס שהוטבע באטום verbatim. ⚠️ הנחת-`values` הישנה הניחה שכל מוטבע הוא
  // enum; למחלקת-דאטה זה לא מתקמפל. עכשיו **החצב** אומר מה הערך (typeSamples),
  // כי רק הוא ראה את ההצהרה. אין ערך ⇒ אין דוגמה, לא ניחוש.
  if (inlined.includes(base)) {
    const ex = samples[base];
    if (!ex || !ex.length) return nul ? [{ d: 'null', t: base }] : [];
    const out = ex.map(d => ({ d, t: base }));
    if (nul) out.push({ d: 'null', t: base });
    return out;
  }
  // סינתזת-אוסף: List<X>/Set<X> ⇒ ריק + זוג-אלמנטים · Map<K,V> ⇒ ריק + זוג
  const mL = base.match(/^(List|Set|Iterable)<(.+)>$/);
  if (mL) { const el = elemLit(mL[2], samples); const c = mL[1] === 'List' ? '[]' : '{}'; const out = [{ d: `const <${mL[2]}>${c}`, t: base }]; if (el) { const kw = /^const /.test(el) || /^['\d]/.test(el) || el === 'true' ? 'const ' : ''; out.push({ d: `${kw}<${mL[2]}>${mL[1] === 'List' ? `[${el},${el}]` : `{${el}}`}`, t: base }); } if (nul) out.push({ d: 'null', t: base }); return out; }
  const mM = base.match(/^Map<\s*(.+?)\s*,\s*(.+)>$/);
  if (mM) { const k = elemLit(mM[1], samples), v = elemLit(mM[2], samples); const out = [{ d: `const <${mM[1]}, ${mM[2]}>{}`, t: base }]; if (k && v) out.push({ d: `const <${mM[1]}, ${mM[2]}>{${k}: ${v}}`, t: base }); if (nul) out.push({ d: 'null', t: base }); return out; }
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
  // חתימה גנרית (`famEmoji<T>(T f)`): בלי לאפשר `<…>` בין השם לסוגריים הרגקס
  // אינו מוצא את החתימה **וממשיך לגוף** — ותופס את הפרמטרים של קריאה אקראית.
  const m = clean.match(/\b[\w$]+\s*(?:<[^>()]*>)?\s*\(([^)]*)\)/); if (!m) return null;
  const raw = m[1].trim(); if (!raw) return [];
  if (/[{[]/.test(raw)) return null;
  return raw.split(',').map(p => { const parts = p.trim().split(/\s+/); return { type: parts.slice(0, -1).join(' '), name: parts.at(-1) }; });
}
// ── G63 · ייעוד-עברי לפונקציה שקטה — **אותו מנגנון של אינדקס-התצוגה** (atom-index: purposeFrom=source-screen):
//   הבעלים: «ברור גבוה יותר [מאדם] ותבדוק איך הוא לקח עד היום את המשפט-ייעוד». האינדקס לוקח את מונחי-המסך של קובץ-המקור
//   (screens-seed/machine/<file-key>.json). כאן שרשרת-נפילה מבנית, אפס-המצאה (§20-ג): תיעוד-עצמי ⇒ מונחי-מסך של קובץ-המקור ⇒
//   מונחי-מסך של הקוראים ⇒ ליטרלים-עבריים בגוף ⇒ אין (לא עולה). המדידה על 177 שקטות: 73 מהמקור · 25 מקוראים · 7 מהגוף · 72 אין.
const SEED_DIR = path.join(SHELF, '..', 'screens-seed', 'machine');
const LIB_DIR = path.join(process.env.BUILDSMART || '/home/user/buildsmart/app_flutter', 'lib');
const heToks = (s) => [...String(s || '').matchAll(/[\u0590-\u05FF]{2,}/g)].map((m) => m[0]);
let _seed = null, _lib = null;
const seedTerms = () => { if (_seed) return _seed; _seed = {}; try { for (const f of fs.readdirSync(SEED_DIR).filter((f) => f.endsWith('.json'))) { try { const d = JSON.parse(fs.readFileSync(path.join(SEED_DIR, f), 'utf8')); _seed[f.replace('.json', '')] = [...new Set((d.terms || []).flatMap(heToks))].slice(0, 24); } catch { /* seed פגום = אין מונחים */ } } } catch { /* אין seed */ } return _seed; };
const libFiles = () => { if (_lib) return _lib; _lib = []; const walk = (d) => { let o = []; try { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const q = path.join(d, e.name); if (e.isDirectory()) { if (!/genesis/.test(e.name)) o = o.concat(walk(q)); } else if (q.endsWith('.dart')) o.push(q); } } catch { /* אין lib */ } return o; }; for (const q of walk(LIB_DIR)) _lib.push([path.relative(LIB_DIR, q), fs.readFileSync(q, 'utf8')]); return _lib; };
const seedKey = (rel) => rel.replace(/\.dart$/, '').replace(/\//g, '__');
function purposeOf(r, srcRef) {
  const own = (r.fnSource.match(/\/\/\/[^\n]*/g) || []).join(' ').match(/[\u0590-\u05FF][\u0590-\u05FF'"\u05F3\u05F4-]*/g) || [];
  if (own.length) return { words: own, from: 'own-doc', key: null };
  const seed = seedTerms();
  const rel = String(srcRef || '').replace(/^buildsmart\/app_flutter\/lib\//, '').replace(/:\d+(-\d+)?$/, '');
  const k = seedKey(rel);
  if (seed[k]?.length) return { words: seed[k], from: 'source-screen', key: k };
  const re = new RegExp('\\b' + String(r.origName || r.name).replace(/^_/, '_?') + '\\s*\\(');
  const callers = libFiles().filter(([f, src]) => f !== rel && re.test(src)).map(([f]) => seedKey(f)).filter((kk) => seed[kk]?.length);
  if (callers.length) return { words: seed[callers[0]], from: 'caller-screen', key: callers[0] };
  const body = [...new Set(heToks(r.fnSource.split('\n').map((l) => l.replace(/\/\/.*$/, '')).join('\n')))];
  if (body.length) return { words: body, from: 'body-he', key: null };
  return { words: [], from: 'none', key: null };
}
// G69 · ייבואי-המדף של אטום: טבלאות-דאטה (`../dart-data/<x>-table.dart`) שהחצב פתר לפי מוצא — נכנסים לכל קובץ שמייבא את האטום (הרתמה · הזהב)
// ⚠️ `dart analyze` = fatal-warnings: ייבוא-מדף שהרתמה/הזהב לא מזכירים בשמו (הערך זורם דרך האטום) ⇒ `unused_import` ⇒ 6 זהבים נפלו. מייבאים רק כשהגוף מזכיר ייצוא.
//   ⚠️ ההתאמה על **קוד**, לא על ליטרלים: הזהב `'Instance of ConnectorEnd'` הזכיר את שם-הטיפוס בתוך מחרוזת ⇒ הייבוא נכנס ⇒ עדיין unused (5 נפלו שוב).
//   G71 · **פר-ייבוא**: שני ייבואי-מדף (טבלת-הקטלוג + טבלת-הספקים) — הזהב הזכיר שם מהאחד, והשני נכנס כ-unused (4 זהבים נפלו). `shelfByImp` מהחצב.
const shelfImports = (r, body = null) => {
  const code = body === null ? null : body.replace(/\/\/.*$/gm, '').replace(/'(?:\\.|[^'\\])*'/g, "''"); /* גם הערות — מימוש-השקע נושא הערות-מקור */
  const all = [...(r.shelfVals || []), ...(r.shelfTypes || []), ...(r.shelfFns || [])];
  return (r.shelfImports || []).filter((p) => { if (code === null) return true; const names = (r.shelfByImp || {})[p] || all; return names.some((n) => new RegExp('\\b' + n + '\\b').test(code)); }).map((p) => `import '${p}';`);
};
function atomFile(r, srcRef, purpose) {
  const imports = [...(r.imports || []), ...shelfImports(r)];
  const shelfLine = (r.shelfImports || []).length ? `// ייבוא-מדף (G69/G70 — אטום משותף מיובא, לא עותק מוטבע ולא שקע): ${[...(r.shelfVals || []), ...(r.shelfTypes || []), ...(r.shelfFns || [])].join(' · ')} ← ${r.shelfImports.join(' ')}.\n` : '';
  const pure = (r.imports || []).length
    ? `// טוהר: פונקציית top-level עצמאית; הייבוא היחיד הוא ספריית-שפה טהורה (${r.imports.join(' ')}).\n${shelfLine}`
    : `// טוהר: פונקציית top-level עצמאית, ${shelfLine ? 'ייבוא-מדף בלבד' : 'אפס-import'} (אומת ע"י פותר-המזהים).\n${shelfLine}`;
  // חוק-3: קריאה-לשכן ⇒ פרמטר-שקע. הכותרת מצהירה על כל שקע שהוזרק אוטומטית.
  const sock = (r.autoSocket && r.socketMeta && r.socketMeta.length)
    ? `// שקעים (חוק-3 — הוזרקו אוטומטית מקריאות-שכן במקור): ${r.socketMeta.map(x => x.name).join(' · ')}.\n`
    : '';
  const header = `// ⚛️ אטום-Dart (דרגת-חוזה) · ${r.name}\n// מוצא: ${srcRef} (חצב-AST · חוק-4 — התנהגות זהה, לא-משופרת).\n${pure}${sock}${r.inlineTypes.length ? `// טיפוסים מוטבעים (חוק-1, verbatim מהמקור): ${r.inlineTypes.join(', ')}.\n` : ''}`;
  const types = r.copiedTypes.length ? r.copiedTypes.join('\n\n') + '\n\n' : '';
  // G69 · רמז-חלול לשן-המוטציה: טיפוס-החזרה שהוא מחלקה-בנויה (לא enum/ליבה) ⇒ `// חלול: T = <הדוגמה-הבנויה של החצב>` — בלי זה השן לא נושכת (unparsed) והאטום נפסל
  const retM = r.fnSource.replace(/^\s*\/\/.*$/gm, '').match(new RegExp('^([A-Za-z_][\\w<>,?\\s]*?)\\s+' + r.name + '\\s*(?:<[^>]*>)?\\s*\\(', 'm'));
  const ret = retM ? retM[1].trim() : ''; const samp = ({ ...(r.typeSamples || {}), ...(r.shelfSamples || {}) })[ret];
  const hint = samp && samp.length && !/^[A-Za-z_]\w*\.[A-Za-z_]\w*$/.test(samp[0]) ? `// חלול: ${ret} = ${samp[0]}\n` : '';   // enum-literal (X.y) ⇒ השן מזהה enum לבד
  const purp = purpose && purpose.from !== 'own-doc' && purpose.words.length ? `// ייעוד-עברי (G63 · מקור: ${purpose.from === 'source-screen' ? 'מונחי-מסך-המקור ' + purpose.key : purpose.from === 'caller-screen' ? 'מונחי-מסך-הקורא ' + purpose.key : 'ליטרלים-בגוף'} — כמו purposeFrom באינדקס-התצוגה, אפס-המצאה): ${purpose.words.slice(0, 12).join(' · ')}\n` : '';
  return header + purp + hint + '\n' + (imports.length ? imports.join('\n') + '\n\n' : '') + types + r.fnSource + '\n';
}

function landOne(r, seen) {
  const kb = kebab(r.name);
  const atomAbs = path.join(ROOT, 'dart', `${kb}.dart`);
  const testAbs = path.join(ROOT, 'dart', `${kb}_test.dart`);
  if (seen.has(kb)) return { name: r.name, skip: 'כפול-שם תוך-ריצה' };
  // שם שהוא מילה-שמורה או טיפוס-ליבה אינו יכול להיות שם-פונקציה באטום:
  // `int(...)` · `do(...)` נפלטו, לא התקמפלו, ונספרו ככשל. פסילה מראש.
  if (RESERVED.has(r.name)) return { name: r.name, skip: 'שם שמור' };
  // ⚠️ «כבר-קיים» נבדק רק מול new/dart, בעוד המדף פרוס על כמה מקורות
  // (dart-maor · dart-ui-bs · atoms) ובשמות-מקף. שער cross-source (23-ד) תפס
  // 2 כפילויות שהנחיתה כתבה. הבדיקה עוברת על כל המקורות ובשתי צורות-השם.
  const kebabName = kb.replace(/_/g, '-');
  const SOURCES = ['dart', 'dart-maor', 'dart-ui-bs', 'dart-ui-bs/auto', 'atoms'];
  const twinExt = { atoms: '.mjs' };
  if (fs.existsSync(atomAbs)) return { name: r.name, skip: 'כבר-קיים' };
  for (const d of SOURCES) for (const nm of [kb, kebabName]) {
    const ext = twinExt[d] || '.dart';
    if (fs.existsSync(path.join(SHELF, d, nm + ext))) return { name: r.name, skip: `כבר-קיים במקור אחר (${d})` };
  }
  // פסול: מתודת-override (לא אטום-עצמאי) · גוף-סטאב (קבוע ריק — אין מנגנון)
  if (/@override\b/.test(r.fnSource)) return { name: r.name, skip: '@override — לא אטום' };
  if (STUB.test(r.fnSource)) return { name: r.name, skip: 'סטאב — גוף-קבוע' };
  // הפרמטרים מגיעים **מהחצב** (עץ-תחביר), לא מניתוח-טקסט. `parseParams` נשאר
  // רק כנפילה-אחורה לקלט ישן שאין בו `paramsSimple` — 3 באגים רצופים נולדו שם.
  const params = ('paramsSimple' in r)
    ? (r.paramsSimple ? r.origParams : null)
    : (r.autoSocket ? r.origParams : parseParams(r.fnSource));
  if (params === null) return { name: r.name, skip: 'חתימה לא-טריוויאלית' };
  const socketArgs = (r.autoSocket && r.socketMeta) ? r.socketMeta.map(s => `${s.name}: ${s.init}`).join(', ') : '';
  const mkArgs = (c) => [c.map(v => v.d).join(', '), socketArgs].filter(Boolean).join(', ');
  // G69 · טיפוס מיובא-מטבלת-מדף מתנהג כמוטבע לצורך הדוגמאות (הערך מגיע מהחצב: shelfSamples מהמקור שבטבלה)
  //   G69 · פונקציה שמפנה לטבלת-מדף (`kVerifiedSpecs[sku]`) מקבלת גם **מפתחות-אמת מהטבלה** כדוגמאות-String (החצב מוציא אותם מהליטרל) — בלי זה כל דוגמה
  //   גנרית מחטיאה את המפה והעותק-החלול עובר (4 זהב-ריק: crossesSystem · verifiedEndsCountFor · …). ערך-אמת מהמקור, לא המצאה (§20-ג).
  const lits = { ...(r.bodyLits || {}) }; if ((r.shelfKeys || []).length) lits.String = [...r.shelfKeys.map((k) => `'${k}'`), ...(lits.String || [])];   // מפתחות-הטבלה ראשונים — הם תחום-הפונקציה
  if ((r.enumNames || []).length) lits.String = [...(lits.String || []), ...r.enumNames.map((k) => `'${k}'`)];   // שמות-ערכי-enum (`e.name == n`) — מההצהרה, לא המצאה
  //   ומחלקה שנכנסת לטבלה דרך שדה (`kVerifiedSpecs[p.sku]` — החצב מסיק `shelfKeyFields`): הדוגמה-הבנויה מקבלת מפתח-אמת בשדה, במקום 'a' שמחטיא תמיד
  const samples = { ...(r.typeSamples || {}), ...(r.shelfSamples || {}) };
  for (const [T, fields] of Object.entries(r.shelfKeyFields || {})) { const base = (samples[T] || [])[0]; if (!base || !(r.shelfKeys || []).length) continue; const keyed = r.shelfKeys.slice(0, 4).map((k) => fields.reduce((acc, f) => acc.replace(new RegExp(`\\b${f}: '[^']*'`), `${f}: '${k}'`), base)).filter((x) => x !== base); samples[T] = [...keyed, ...samples[T]]; }
  const perParam = params.map(p => compat(p.type, [...(r.inlineTypes || []), ...(r.shelfTypes || [])], Object.values(r.erasedTypes || {}), samples, lits));
  if (perParam.some(x => x.length === 0)) return { name: r.name, skip: 'אין-קלט-סל' };
  // G69 · אלכסון-ראשון: הסדר-הלקסיקוגרפי עם תקרה-12 מיצה את 12 הצירופים על 2 ערכי-הפרמטר-הראשון ⇒ מפתחות-הטבלה שנוספו לא נכנסו לזהב (crossesSystem נשאר חלול).
  //   עכשיו כל ערך של כל פרמטר מופיע לפחות פעם אחת (אלכסון), ואז מילוי לקסיקוגרפי עד 12.
  const combos = []; const seenC = new Set();
  // G69 · בחירה-לפי-שונות: מריצים עד CAND צירופים-מועמדים ברתמה, ושומרים בזהב עד 12 — קודם נציג לכל **פלט שונה** (הזהב שמאדים על חלול = זהב עם פלטים שונים), אחר-כך מילוי לפי הסדר
  const CAND = 48;
  const push = (c) => { const k = c.map((v) => v.d).join('\u0001'); if (!seenC.has(k) && combos.length < CAND) { seenC.add(k); combos.push(c); } };
  const rec = (i, acc) => { if (combos.length >= CAND) return; if (i === params.length) { push(acc); return; } for (const v of perParam[i]) { rec(i + 1, [...acc, v]); if (combos.length >= CAND) break; } };
  if (params.length === 0) combos.push([]); else { const maxLen = Math.max(...perParam.map((x) => x.length)); for (let i = 0; i < maxLen; i++) push(perParam.map((x) => x[Math.min(i, x.length - 1)])); rec(0, []); }
  seen.add(kb);

  const srcRef = r._srcRef || '(מקור)';
  const purpose = purposeOf(r, srcRef);
  fs.writeFileSync(atomAbs, atomFile(r, srcRef, purpose));

  // G69 · זהב-מבני: טיפוס-החזרה מחלקה עם מציג-שדות מהחצב ⇒ הרתמה והזהב משווים `_show(r)` (שדה-שדה) ולא `toString()` (`Instance of 'X'` — עיוור לחלול)
  const retM0 = r.fnSource.replace(/^\s*\/\/.*$/gm, '').match(new RegExp('^([A-Za-z_][\\w<>,?\\s]*?)\\s+' + r.name + '\\s*(?:<[^>]*>)?\\s*\\(', 'm'));
  const retT = retM0 ? retM0[1].trim() : '', retBase = retT.replace(/\?$/, ''), showExpr = (r.typeShow || {})[retBase];
  const showFn = showExpr ? `String _show(${retBase}? x) => x == null ? 'null' : ${showExpr.replace(/\bx\./g, 'x.')};\n` : '';
  const wrap = (call) => showExpr ? `_show(${call})` : `(${call}).toString()`;
  const callArgs = combos.map(c => mkArgs(c));
  const sockSrc = (r.autoSocket && r.socketDecls && r.socketDecls.length)
    ? '\n// --- מימוש-השקע verbatim מהמקור (לבדיקה בלבד; לא אטום מיובא) ---\n' + r.socketDecls.join('\n\n') + '\n'
    : '';
  const harnessBody = callArgs.join(' ') + sockSrc;
  const harness = `import 'dart:convert';\nimport '${kb}.dart';\n${usedImports([...(r.imports || []), ...shelfImports(r, harnessBody + showFn)], harnessBody + showFn).join('\n')}${sockSrc}\n${showFn}void main(){\n${callArgs.map((a, i) => `  try { print(jsonEncode([${i}, ${wrap(`${r.name}(${a})`)}])); } catch(e){ print(jsonEncode([${i}, {"__t":1}])); }`).join('\n')}\n}\n`;
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
    // `dart analyze` כותב ל-stdout, לא ל-stderr. הדיווח קרא רק stderr ⇒ 37 כשלים
    // הוצגו כשורה ריקה, ואי-אפשר היה לדעת למה אטום נזרק.
    const msg = [e.stderr, e.stdout, e.message].map(x => (x || '').toString().trim()).filter(Boolean).join(' | ');
    return { name: r.name, fail: 'analyze/run: ' + msg.slice(0, 140).replace(/\n/g, ' ') };
  }
  fs.rmSync(harnessAbs, { force: true });
  if (outs.filter(x => x !== undefined).length !== combos.length) { fs.rmSync(atomAbs, { force: true }); return { name: r.name, fail: 'אפיון חלקי' }; }
  { // בחירת ≤12 מתוך המועמדים: נציג-ראשון לכל פלט-שונה, ואז מילוי בסדר-המקור
    const pick = [], seenOut = new Set();
    combos.forEach((c, i) => { const o = String(outs[i]); if (!seenOut.has(o) && pick.length < 12) { seenOut.add(o); pick.push(i); } });
    combos.forEach((c, i) => { if (pick.length < 12 && !pick.includes(i)) pick.push(i); });
    pick.sort((a, b) => a - b);
    const c2 = pick.map((i) => combos[i]), o2 = pick.map((i) => outs[i]);
    combos.length = 0; combos.push(...c2); outs = o2;
  }

  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\$/g, '\\$');
  const asserts = combos.map((c, i) => {
    const call = `${r.name}(${mkArgs(c)})`;
    return outs[i] === '__THROW__'
      ? `  { var threw=false; try{ ${call}; }catch(_){threw=true;} if(!threw) throw StateError('FAIL #${i}: expected throw'); n++; }`
      : `  _eq(${wrap(call)}, '${esc(outs[i])}', '#${i}'); n++;`;
  }).join('\n');
  const test = `// בדיקת-Golden · ${r.name} — אפיון-חצב (חוק-4). מייבאת רק את האטום.\nimport '${kb}.dart';\n${usedImports([...(r.imports || []), ...shelfImports(r, asserts + sockSrc + showFn)], asserts + sockSrc + showFn).join('\n')}${sockSrc}\n${showFn}void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [\$lbl]: got=\$got want=\$want'); }\nvoid main(){\n  var n=0;\n${asserts}\n  print('✓ ${r.name}: '+n.toString()+' Golden');\n}\n`;
  fs.writeFileSync(testAbs, test);
  try { execSync(`dart analyze ${testAbs}`, { cwd: ROOT, env, stdio: 'pipe' }); execSync(`dart run --enable-asserts ${testAbs}`, { cwd: ROOT, env, stdio: 'pipe' }); }
  catch (e) { if (!process.env.CARVE_KEEP) { fs.rmSync(atomAbs, { force: true }); fs.rmSync(testAbs, { force: true }); } return { name: r.name, fail: 'golden: ' + String((e.stdout || e).toString()).slice(0, 100).replace(/\n/g, ' ') }; }   // CARVE_KEEP=1 ⇒ הקבצים נשארים לאבחון

  // חוזה
  const doc = (r.fnSource.match(/\/\/\/[^\n]*/g) || []).join('\n').replace(/\/\/\/ ?/g, '');
  const md = `# חוזה · ${r.name}\n\n> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).\n\n## מקור\n${srcRef}\n\n## התנהגות\n${doc || '(ראה גוף-האטום)'}\n\n## ייעוד-עברי\n${purpose.from === 'none' ? '(אין — לא נמצא הקשר עברי במקור/בקוראים/בגוף)' : `מקור: ${purpose.from}${purpose.key ? ' · ' + purpose.key : ''} — ${purpose.words.slice(0, 12).join(' · ')}`}\n\n## אימות\nבדיקת-Golden (\`${kb}_test.dart\`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: \`dart run --enable-asserts new/dart/${kb}_test.dart\`.\n`;
  fs.writeFileSync(path.join(ROOT, 'dart', `${kb}.contract.md`), md);
  // G64 · דוגמאות-הזהב של האטום כזוגות [args, check] — למועמד-חזק שייבדק **בריצה** (אין שקעים ⇒ הדוגמאות ניידות; עם שקעים ⇒ null)
  const examples = (socketArgs || showExpr) ? null : combos.map((c, i) => outs[i] === '__THROW__' ? null : [mkArgs(c), `r.toString() == '${esc(outs[i])}'`]).filter(Boolean);   // זהב-מבני ⇒ הדוגמאות תלויות ב-_show ⇒ לא ניידות
  return { name: r.name, landed: `${kb}.dart`, base: kb, golden: combos.length,
           heb: purpose.words, purposeFrom: purpose.from, examples };
}

// ── G69 · נחיתת טבלה-מוקלדת (carveVar) כאטום-דאטה משותף ב-new/dart-data ─────────────────────────────────────
// 37 פונקציות נפלו על `kVerifiedSpecs` (final · 111KB · לא const ⇒ אינו שקע-ערך). ההעתקה-פר-פונקציה (37 עותקים) נדחתה; במקום זה
// הטבלה + סגירתה (טיפוסים · עוזרים · קבועים) נוחתת **פעם אחת** ב-dart-data, והחצב פותר את הצרכניות ל**ייבוא** לפי מוצא (קובץ+שם).
// אימות: analyze + הרצת `.length` (הטבלה נטענת ואינה ריקה). בלי זהב/מוטציה/הוכחת-חיפוש — אין מנגנון, ודאטה אינו בהיקף search-proof.
function landData(r, seenData) {
  const kb = kebab(r.name);
  const file = `${kb}-table.dart`, abs = path.join(ROOT, 'dart-data', file);
  if (seenData.has(kb)) return { name: r.name, skip: 'כפול-שם תוך-ריצה' };
  if (fs.existsSync(path.join(SHELF, 'dart-data', file))) return { name: r.name, skip: 'כבר-קיים' };
  if (!r.depOrigins || !Object.keys(r.depOrigins).length) return { name: r.name, skip: 'אין מוצא-פר-הצהרה (חצב ישן)' };
  seenData.add(kb);
  const srcRef = r._srcRef || '(מקור)';
  const short = (p) => String(p).replace(/^\/home\/user\//, '');
  const exportsPub = Object.keys(r.depOrigins).filter((n) => !n.startsWith('_'));
  const mk = (size) => `// 🗄️ טבלה-מוקלדת · ${r.name} (${r.kind} ${r.type}) — אטום-דאטה משותף (G69 · חצב-AST, חוק-4 — verbatim מהמקור, כולל סגירת-הטיפוסים).\n// מוצא: ${srcRef}\n// טוהר: אפס-import; ${r.deps.length} הצהרות-סגירה + הטבלה. פונקציות-מדף **מייבאות** את הקובץ הזה (ייבוא-לפי-מוצא בחצב) במקום להטביע עותק.\n${size == null ? '' : `// גודל: ${size} רשומות (נמדד בהרצה).\n`}${exportsPub.map((n) => `// ייצוא: ${n} ← ${short(r.depOrigins[n])}`).join('\n')}\n\n${r.deps.join('\n\n')}\n\n${r.decl}\n`;
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, mk(null));
  const h = path.join(ROOT, 'dart-data', `_carve_h_${kb}.dart`);
  fs.writeFileSync(h, `import '${file}';\nvoid main(){ print(${r.name}.length); }\n`);
  try {
    execSync(`dart analyze ${abs}`, { cwd: ROOT, env, stdio: 'pipe' });
    const n = parseInt(execSync(`dart run ${h}`, { cwd: ROOT, env, stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000 }).toString().trim().split('\n').pop(), 10);
    fs.rmSync(h, { force: true });
    if (!(n > 0)) { fs.rmSync(abs, { force: true }); return { name: r.name, fail: `טבלה ריקה (${n})` }; }
    fs.writeFileSync(abs, mk(n));
    return { name: r.name, landed: `dart-data/${file}`, size: n, exports: exportsPub };
  } catch (e) {
    fs.rmSync(abs, { force: true }); fs.rmSync(h, { force: true });
    const msg = [e.stderr, e.stdout, e.message].map(x => (x || '').toString().trim()).filter(Boolean).join(' | ');
    return { name: r.name, fail: 'analyze/run: ' + msg.slice(0, 160).replace(/\n/g, ' ') };
  }
}

const carved = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const datas = carved.filter(r => r.ok && r.isData);
if (datas.length) {
  const seenData = new Set(); let dl = 0;
  for (const r of datas) { const res = landData(r, seenData); if (res.landed) { dl++; console.log(`🗄️ ${res.name} → ${res.landed} · ${res.size} רשומות · ייצוא: ${res.exports.join(' · ')}`); } else console.log(`   ${res.fail ? '↩' : '↷'} ${res.name}: ${res.fail || res.skip}`); }
  console.log(`═══ טבלאות-מדף: ${dl}/${datas.length} נחתו ב-dart-data (הצרכניות נחצבות מחדש עם --batch — החצב יפתור אותן לייבוא) ═══\n`);
}
const trivial = carved.filter(r => r.ok && (r.trivial || r.autoSocket));
const seen = new Set();
let landed = 0, failed = 0, skipped = 0;
const skipWhy = {};   // סיבת-דילוג ⇒ שמות (בלי זה 16 דילוגים נעלמו בשקט)
const landedBases = [];
const hebOf = {};   // בסיס ⇒ מילות-הייעוד העבריות (G63: תיעוד-עצמי ⇒ מסך-המקור ⇒ מסך-הקורא ⇒ גוף)
const purposeFromCount = {};
const exOf = {};   // בסיס ⇒ דוגמאות-הזהב (G64 · הוכחת-אי-כפילות בריצה)
for (const r of trivial) {
  const res = landOne(r, seen);
  if (res.landed) { landed++; landedBases.push(res.base); hebOf[res.base] = res.heb; exOf[res.base] = res.examples; purposeFromCount[res.purposeFrom] = (purposeFromCount[res.purposeFrom] || 0) + 1; if (landed <= 40) console.log(`✅ ${res.name} → dart/${res.landed} · ${res.golden} Golden`); }
  else if (res.fail) { failed++; if (failed <= 20) console.log(`↩ ${res.name}: ${res.fail}`); }
  else { skipped++; (skipWhy[res.skip || 'לא-מנומק'] ??= []).push(res.name); }   // שקט אינו דילוג
}
console.log(`\n═══ נחיתה: ✅ ${landed} אטומים · ↩ ${failed} נכשלו · ↷ ${skipped} דולגו (מתוך ${trivial.length} trivial) ═══`);
for (const [why, names] of Object.entries(skipWhy).sort((a, b) => b[1].length - a[1].length)) console.log(`   ↷ ${why}: ${names.length} · ${names.slice(0, 6).join(' ')}`);

// ── שן-המוטציה, בנחיתה ולא רק בשער ─────────────────────────────────────────
// זהב שנשאר ירוק על אטום-**חלול** אינו חוזה — הוא תיאור-ריק. עד כאן זה
// נתפס רק בשער (61 אטומים בנחיתה הראשונה ⇒ המדף היה מאדים). עכשיו
// **אותו שער עצמו** (‏mutation-dart-check --files) מורץ על מה שנחת,
// והריקים מוסרים לפני שהם נוגעים במדף. אפס מנוע חדש — הפעלה של הקיים.
if (landedBases.length) {
  const files = landedBases.flatMap(b => [path.join(ROOT, 'dart', b + '.dart'), path.join(ROOT, 'dart', b + '_test.dart')]).join(',');
  const gate = new URL('../mutation-dart-check.mjs', import.meta.url).pathname;
  let out = '';
  // ⚠️ השער כותב חלק מהפסק-דין ל-stderr. לכידת stdout בלבד החזירה ריק
  // על exit=1, והסחיפה «לא מצאה» מה שהשער כן מצא.
  try { out = execSync(`node ${gate} --all --list-unparsed --files ${files}`, { cwd: path.join(ROOT, '..'), stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 << 20 }).toString(); }
  catch (e) { out = ((e.stdout || '') + (e.stderr || '')).toString(); }
  const vac = [...out.matchAll(/✗ .*?\/([a-z0-9_]+)_test\.dart/g)].map(m => m[1]);
  // ‏unparsed = העותק-החלול לא קומפל ⇒ **השן לא נשכה**. «לא-נפסל» אינו
  // «הוכח», והחוב-המוצהר של השער רק-יורד — לכן גם אלה אינם עולים למדף.
  // ⚠️ כשל-קומפילציה של החלול מדווח בנתיב **הבדיקה** (`socket_test.dart`) — בלי קילוף `_test` ההסרה מחקה רק את הבדיקה והאטום עלה למדף בלי זהב (socket, G69)
  const unp = [...out.matchAll(/^UNPARSED .*?\/([a-z0-9_]+)\.dart/gm)].map(m => m[1].replace(/_test$/, ''));
  const drop = [...new Set([...vac, ...unp])];
  for (const b of drop) for (const f of [b + '.dart', b + '_test.dart', b + '.contract.md'])
    fs.rmSync(path.join(ROOT, 'dart', f), { force: true });
  console.log(`\n🦷 שן-המוטציה: ${vac.length} זהב-ריק · ${unp.length} שהשן לא נשכה בהם (unparsed) ⇒ ${drop.length} הוסרו · נשארו ${landedBases.length - drop.length} אטומים מוכחים`);
  const alive = landedBases.filter(b => !drop.includes(b));

  // ── חוק-טוהר-הדאטה (הכרעה 16) ─────────────────────────────────────────
  // «אין דאטה במנגנון». האטום נחצב verbatim, ולכן פונקציה שמערבבת ליטרל-עברי
  // עם זרימת-בקרה מגיעה מעורבת — והשער אוסר להוסיף מעורב חדש. מריצים את
  // **אותו שער** ומסירים; הפיצול לאטום-דאטה הוא החלטה, לא נחיתה אוטומטית.
  // G64 · **שני** שערי-הטוהר (data-purity-check ⇒ `+ dart/<שם>` · purity/purity-data ⇒ `new/dart/<שם>.dart`), ובלולאה עד-נקי:
  //   השערים מדפיסים רק 20/12 ראשונים ⇒ סבב יחיד הסיר בדיוק 20 והשאיר 9 מעורבים שנפלו במשטרה אחרי הנחיתה.
  const dpGate = new URL('../data-purity-check.mjs', import.meta.url).pathname;
  const pdGate = new URL('../purity/purity-data.mjs', import.meta.url).pathname;
  const runGate = (g) => { try { return execSync(`node ${g} --gate`, { cwd: path.join(ROOT, '..'), stdio: ['ignore', 'pipe', 'pipe'] }).toString(); } catch (e) { return ((e.stdout || '') + (e.stderr || '')).toString(); } };
  const mixed = [];
  for (let round = 0; round < 12; round++) {
    // ⚠️ הפורמט של data-purity-check עצמו הוא `+ dart/<שם>`; הצורה עם «אטום-מעורב חדש» היא עטיפת-ה-pre-commit / purity-data (`new/dart/<שם>.dart`).
    const found = [...new Set([
      ...[...runGate(dpGate).matchAll(/^\s*\+ dart\/([a-z0-9_]+)\s*$/gm)].map(m => m[1]),
      ...[...runGate(pdGate).matchAll(/new\/dart\/([a-z0-9_]+)\.dart/g)].map(m => m[1]),
    ])].filter(b => alive.includes(b) && !mixed.includes(b));
    if (!found.length) break;
    for (const b of found) for (const f of [b + '.dart', b + '_test.dart', b + '.contract.md']) fs.rmSync(path.join(ROOT, 'dart', f), { force: true });
    mixed.push(...found);
  }
  const alive2 = alive.filter(b => !mixed.includes(b));
  console.log(`🧪 טוהר-דאטה: ${mixed.length} אטומים-מעורבים הוסרו · נשארו ${alive2.length}`);

  // ── הוכחת-חיפוש (23-ד «אין = לא-חיפשת») ───────────────────────────────
  // לכל אטום חדש חייבת להיות רשומת-חיפוש חתומה מול האורקל. מריצים את
  // **הכלי הקיים**; מועמד-חזק (ציון ≥3) ⇒ הכלי יוצא 1 ⇒ האטום **אינו עולה**
  // (כפילות אפשרית = הכרעה אנושית, לא נחיתה). אחרת נכתבת רשומה.
  const srTool = new URL('../search-record.mjs', import.meta.url).pathname;
  // ⚠️ הכלי דורש שאילתה **דו-לשונית** (אנגלית=שם · עברית=ייעוד), אחרת חצי
  // מהאורקל לא נסרק. ייעוד עברי אי-אפשר לחולל בלי להמציא — לכן הוא נלקח
  // מתיעוד-האטום עצמו. אטום בלי ייעוד-עברי **אינו עולה**: שאילתה חצי-סרוקה
  // אינה הוכחת-חיפוש, וההמצאה אסורה (§20-ג).
  // G64 · «מועמד-חזק» (ציון-שם ≥3 באותה שכבה) אינו נפסק בהסתכלות אלא **בריצה** (הרף-הגבוה-מאדם): כל מועמד-לוגיקה טהור מורץ על דוגמאות-הזהב
  //   של האטום-החדש דרך המוכיח-האחד (logic-proof). עובר 100% ⇒ **תאום-מוכח** (לא עולה; הכרעת-בעלים על איחוד) · נכשל ⇒ אי-כפילות מוכחת,
  //   ונרשם ב---none בשמו עם התוצאה · לא-ניתן-להוכחה (לא-טהור / אין דוגמאות-ניידות / אין דוגמאות) ⇒ נשאר «כפילות-אפשרית» (לא עולה).
  //   הדירוג = אותו דירוג של search-record (search-score · top-15 · שכבה), כדי שהשמות ב-why יהיו בדיוק אלה שהשער דורש.
  const { loadOracle, scoreFor, tok, layerOf } = await import('../search-score.mjs');
  const { proveCandidates } = await import('../generator/logic-proof.mjs');
  const oracle = process.env.CARVE_OUT ? null : loadOracle();
  // G64 · פרה-פלייט: כלי-הרשומה חייב לרוץ לפני שפוסלים אטום על סמך «נדחתה» — רפקטור שבר אותו (OUT חסר) ונחיתה שלמה נפסלה בשקט כ«כפילות»
  if (!process.env.CARVE_OUT) { try { execSync(`node ${srTool} "preflight בדיקה" --creates new/dart/_preflight.dart --dry`, { cwd: path.join(ROOT, '..'), stdio: 'pipe' }); } catch (e) { console.log(`🚨 search-record שבור — הנחיתה נעצרת לפני הוכחת-החיפוש (האטומים נשארים על הדיסק לבדיקה): ${String(e.stderr || e.message).slice(0, 200).replace(/\n/g, ' ')}`); process.exit(1); } }
  const dup = [], noPurpose = [], twins = [], provenNot = [];
  for (const b of alive2) {
    const heb = (hebOf[b] || []).filter(w => w.length > 1).slice(0, 6);
    if (!heb.length) { noPurpose.push(b); continue; }
    if (process.env.CARVE_OUT) continue;   // ריצת-ניסוי: לא כותבים רשומות-חיפוש לאודיט (הן שייכות לנחיתה אמיתית בלבד)
    const words = `${b.replace(/_/g, ' ')} ${heb.join(' ')}`;
    const creates = `new/dart/${b}.dart`, lay = layerOf(creates), q = [...new Set(tok(words))];
    // G64 · אחי-האצווה: אטומים שנחתו באותה ריצה עדיין אינם באורקל, אבל השער (search-proof, ניקוד-חי אחרי regen) יראה אותם כ«מועמד-חזק חדש».
    //   לכן הם נכנסים למאגר-המועמדים כבר עכשיו (id=camel · שכבה=לוגיקה · ייעוד=מילותיהם) — ונשפטים בריצה כמו כל מועמד (תאום-בתוך-האצווה = נתפס כאן).
    const inOracle = new Set(oracle.all.map((e) => e.layer + ':' + e.id));
    const camel = (kb) => kb.replace(/_(\w)/g, (_, c) => c.toUpperCase());
    const siblings = alive2.filter((x) => x !== b).map((x) => ({ id: camel(x), layer: 'logic', file: `dart/${x}.dart`, purpose: hebOf[x] || [] })).filter((e) => !inOracle.has('logic:' + e.id));
    // שני חלונות, כי הכלי (search-record) מדרג **בלי** האחים: (א) חלון-הכלי — אורקל בלבד, top-15, אלה השמות שהוא דורש ב---none;
    //   (ב) אחי-האצווה החזקים — בלי חלון (אחרי regen הם באורקל והשער יראה אותם). האיחוד נשפט בריצה. (6 נדחו כשחלון-מאוחד דחק שמות מחלון-הכלי.)
    const rank = (pool) => pool.filter((e) => 'new/' + e.file !== creates).map((e) => ({ ...e, s: scoreFor(q, e).s })).filter((e) => e.s > 0).sort((x, y) => y.s - x.s || x.id.localeCompare(y.id));
    const toolStrong = rank(oracle.all).slice(0, 15).filter((e) => e.s >= 3 && (!lay || e.layer === lay));
    const sibStrong = rank(siblings).filter((e) => e.s >= 3);
    const strong = [...toolStrong, ...sibStrong.filter((e) => !toolStrong.some((t) => t.id === e.id))];
    let why = `נחצב אוטומטית מ-buildsmart/app_flutter ע"י חצב-AST (חוק-4 — verbatim מהמקור, כולל תיעודו). `;
    if (!strong.length) why += `האורקל המאוחד לא החזיר מועמד בציון ≥3 באותה שכבה לשאילתה הזו, כלומר אין במדף אטום שמשרת את הייעוד — ולכן נוצר חדש.`;
    else {
      const ex = exOf[b];
      if (!ex || !ex.length) { dup.push(b); continue; }   // אין דוגמאות-ניידות ⇒ אי-אפשר להוכיח ⇒ כפילות-אפשרית (הכרעת-בעלים)
      const res = proveCandidates('carve__' + b, strong.map((e) => ({ id: e.id, file: e.file })), ex);
      const verdicts = strong.map((e) => ({ id: e.id, r: res[e.id] }));
      const unproven = verdicts.filter((v) => !v.r);   // לא-טהור / לא הורץ
      const twin = verdicts.filter((v) => v.r && v.r.total && v.r.ok === v.r.total);
      if (twin.length) { twins.push(`${b} ≡ ${twin.map((v) => v.id).join(',')}`); dup.push(b); continue; }
      if (unproven.length) { dup.push(b); continue; }
      why += `מועמדים-חזקים (ציון-שם ≥3, אותה שכבה) הורצו על ${ex.length} דוגמאות-הזהב של האטום דרך logic-proof ונכשלו — אי-כפילות מוכחת בריצה, לא בהסתכלות: ` + verdicts.map((v) => `${v.id} ${v.r.ok}/${v.r.total}`).join(' · ') + `. לכן נוצר חדש.`;
      provenNot.push(b);
    }
    try { execSync(`node ${srTool} ${JSON.stringify(words)} --creates ${creates} --none ${JSON.stringify(why)}`, { cwd: path.join(ROOT, '..'), stdio: 'pipe' }); }
    catch (e) { dup.push(b); console.log(`   ↷ ${b}: רשומת-חיפוש נדחתה — ${String(e.stderr || e.stdout || e.message).slice(0, 160).replace(/\n/g, ' ')}`); }
  }
  if (twins.length) console.log(`   ≡ תאומים-מוכחים-בריצה (לא עלו · הכרעת-בעלים על איחוד): ${twins.join(' · ')}`);
  for (const b of [...dup, ...noPurpose]) for (const f of [b + '.dart', b + '_test.dart', b + '.contract.md'])
    fs.rmSync(path.join(ROOT, 'dart', f), { force: true });
  console.log(`🔎 הוכחת-חיפוש: ${alive2.length - dup.length - noPurpose.length} רשומות נכתבו (${provenNot.length} עם אי-כפילות-מוכחת-בריצה) · ${dup.length} כפילות-אפשרית (${twins.length} תאומים-מוכחים) · ${noPurpose.length} בלי ייעוד-עברי (דורש הכרעה) · מקור-הייעוד: ${Object.entries(purposeFromCount).map(([k, v]) => k + ' ' + v).join(' · ')}`);
  console.log(`\n📦 עלו למדף: ${alive2.length - dup.length - noPurpose.length} אטומים`);
  if (drop.length) console.log('   ✗ ' + drop.slice(0, 12).join(' ') + (drop.length > 12 ? ` …+${drop.length - 12}` : ''));
  // G69 · רשימות-מלאות לרישום (הלוג הקצר הסתיר 50/62 — אטום שנעלם בלי שם אינו ניתן-למעקב)
  console.log(`\n📋 מלא · זהב-ריק: ${vac.join(' ') || '-'}\n📋 מלא · unparsed: ${unp.join(' ') || '-'}\n📋 מלא · מעורבים: ${mixed.join(' ') || '-'}\n📋 מלא · כפילות-אפשרית: ${dup.join(' ') || '-'}\n📋 מלא · בלי-ייעוד: ${noPurpose.join(' ') || '-'}`);
}
