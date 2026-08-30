#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  engine/generate.mjs — המחולל · מנוע נקי (אפס-דאטה)
//  משפט ⇒ role ⇒ בחירת-אטום ⇒ חיווט-props ⇒ מסך-קוד. דטרמיניסטי, בלי LLM.
//  כל הידע (לקסיקון/roles/tokens) והקטלוג (אטומים) מגיעים מ-config + קבצים חיצוניים.
//  המנוע אינו יודע דבר על שום פרויקט. ראה README.md ו-engine.config.json.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { stripComments, snake, dartLit } from './lib.mjs';
import { buildAtlas } from './atlas.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const cfg = JSON.parse(fs.readFileSync(path.join(HERE, 'engine.config.json'), 'utf8'));
cfg.root = path.resolve(HERE, cfg.root || '.');
const KNOW = path.resolve(cfg.root, cfg.knowledge || 'knowledge');
const SPECS = path.resolve(cfg.root, cfg.specs || 'specs');
const OUT = path.resolve(cfg.root, cfg.out.screens);
const DATA = path.resolve(cfg.root, cfg.out.data);
const FW = cfg.framework;

const readJson = (p, dflt) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return dflt; } };

// ── הידע — נטען מקבצים חיצוניים, לא מוטמע (חוק-1: אפס-דאטה במנוע) ──
const LEX_RAW = readJson(path.join(KNOW, 'lexicon.json'), {});
const LEXICON = new Map(Object.entries(LEX_RAW).filter(([k]) => !k.startsWith('_')));
const HERO_WORD = LEX_RAW._hero || '';
const NAV_WORD = LEX_RAW._nav || '';
const PIN_WORD = LEX_RAW._pin || '';
const ROLE_RULES = (readJson(path.join(KNOW, 'roles.json'), { rules: [] }).rules).map(r => ({ re: new RegExp(r.pattern), role: r.role }));
const TOKEN_RULES = (readJson(path.join(KNOW, 'tokens.json'), { rules: [{ pattern: '', token: FW.defaultToken || 'null' }] }).rules).map(r => ({ re: new RegExp(r.pattern, 'i'), token: r.token }));
const LOGIC_RULES = readJson(path.join(KNOW, 'logic-lexicon.json'), { rules: [] }).rules;
const roleOf = (cls) => ROLE_RULES.find(r => r.re.test(cls))?.role || 'other';
const tokenFor = (n) => (TOKEN_RULES.find(r => r.re.test(n))?.token) ?? (FW.defaultToken || 'null');
const pascalOf = (slug) => slug.replace(/(^|[_-])([a-z])/g, (_, __, c) => c.toUpperCase());
const termKeyOf = new Map();                              // hook אופציונלי (מיפוי-מונחים) — ריק בליבה
const TWIN_TAILS = readJson(path.join(KNOW, 'twin-tails.json'), {}); // hook אופציונלי (אמת-בדיקה) — ריק כברירת-מחדל

const atlas = buildAtlas({ root: cfg.root, ...cfg.catalog });

function parsePart(txt) {
  let body = txt, options = null;
  const ci = txt.indexOf(':');
  if (ci > 0) { body = txt.slice(0, ci).trim(); options = txt.slice(ci + 1).split('/').map(s => s.trim()).filter(Boolean); }
  const em = body.match(/(\p{Extended_Pictographic}(?:️)?)/u);
  const emoji = em ? em[1] : null;
  if (emoji) body = body.replace(emoji, '').replace(/\s+/g, ' ').trim();
  let sub = null;
  const pi = body.indexOf('|');
  if (pi > 0) { sub = body.slice(pi + 1).trim(); body = body.slice(0, pi).trim(); }
  // חילוץ-ערך: רק אסימון-מספר עומד-לבדו (לא ספרה בתוך מילה — 'quest1'/'ברך 90°' נשארים שלמים),
  // ולא בשורות ניווט/אטום שבהן מספר הוא חלק מזהות (slug/שם-מחלקה)
  const firstWord = body.split(/\s+/)[0];
  // 🎨 תור-ערכים: כל האסימונים-המספריים העומדים-לבדם נאספים בסדרם — props מספריים נדרשים
  //   (done/total/pct/coins/flow) נמזגים מהם בזה-אחר-זה (עיצוב-חי, לא 0 קשיח). ניווט מוחרג (slug).
  const numRe = /(?<=^|\s)\d[\d,.]*[%+]?(?=\s|$)/g;
  const values = firstWord === NAV_WORD ? [] : [...body.matchAll(numRe)].map(mm => mm[0]);
  if (values.length) body = body.replace(numRe, ' ').replace(/\s+/g, ' ').trim();
  const value = values[0] ?? null;
  const words = body.split(/\s+/);
  // 📌 הצבעה-ישירה: 'אטום <ClassName> <תווית>' ⇒ האטום הזה בדיוק (מצב-האלתור מצביע כך)
  if (words[0] === PIN_WORD && /^[A-Z]\w+$/.test(words[1] || '')) {
    return { pin: words[1], role: roleOf(words[1]), label: words.slice(2).join(' ') || words[1], txt, options, emoji, sub, value, values };
  }
  // 📚 עיגון-דאטה: 'דאטה <ConstName> <תווית>' ⇒ chips חיים מתוכן אטום-דאטה מהמדף
  if (words[0] === 'דאטה' && /^[a-zA-Z_]\w*$/.test(words[1] || '')) {
    return { dataPin: words[1], role: 'chip', label: words.slice(2).join(' ') || words[1], txt, options, emoji, sub, value, values };
  }
  // 🔀 חיבור בין-מסכים: 'ניווט <slug> <תווית>' ⇒ כרטיס שפותח מסך-מחולל אחר
  if (words[0] === NAV_WORD && /^[a-z][a-z0-9_-]*$/.test(words[1] || '')) {
    return { role: 'card', hero: true, navSlug: words[1], label: words.slice(2).join(' ') || words[1], txt, options, emoji, sub, value, values };
  }
  return {
    role: LEXICON.get(words[0]) || 'row',
    hero: words[0] === HERO_WORD,
    label: (LEXICON.has(words[0]) ? words.slice(1) : words).join(' ') || body,
    txt, options, emoji, sub, value, values,
  };
}

// ── בחירה: האטום-הוויזואלי המנוקד-הכי-גבוה שכל ה-required שלו ניתנים-למילוי ──
const FILLABLE = /^(String|bool|int|double|Color|IconData|TextEditingController|VoidCallback|void Function\(\)|ValueChanged<(bool|int|String)>|void Function\((bool|int|String)\)|List<String>)/;
const INTERACTIVE = new Set(['textfield', 'number', 'switch', 'radio', 'chip', 'button', 'slider']);
function pickAtom(part) {
  if (part.pin) return atlas.widgets.find(a => a.cls === part.pin) || null;
  let best = null, bestScore = -1;
  for (const a of atlas.widgets) {
    const role = roleOf(a.cls);
    let score = role === part.role ? 5 : role === 'row' ? 1 : 0;
    if (score === 0) continue;
    // תפקיד-אינטראקטיבי ⇒ האטום חייב יכולת-תגובה (on*) — תווית-דוממת לא משמשת שדה/מתג
    if (INTERACTIVE.has(part.role) && ![...a.types.keys()].some(n => /^on[A-Z]/.test(n))) continue;
    // עוגן-דאטה ⇒ חובה prop-אופציות List<String> (התוכן החי חייב משטח-הצגה)
    if (part.dataPin && ![...a.types.entries()].some(([n, t]) => /^(options|items)$/.test(n) && /^List<String>/.test(t.replace(/\?$/, '')))) continue;
    let fillable = true, widgetFills = 0;
    for (const rq of [...a.required, ...a.positional]) {
      const t = (a.types.get(rq) || '').replace(/\?$/, '');
      if (/^Widget\b/.test(t) || /^List<Widget>/.test(t)) { widgetFills++; continue; }
      if (/^List<\(\{/.test(t)) { if (!part.options?.length) { fillable = false; break; } continue; }
      if (!FILLABLE.test(t)) { fillable = false; break; }
    }
    if (!fillable) continue;
    if (part.options?.length && [...a.types.entries()].some(([n, t]) => /^(options|items)$/.test(n) && /^List</.test(t))) score += 2;
    if (part.hero && /Hero/.test(a.cls)) score += 4;
    if (part.sub && a.types.has('sub')) score += 2;
    if (a.dirty) score -= 3;                                          // חוב-טוהר ⇒ מעדיפים אטום נקי
    score -= widgetFills + 0.05 * (a.required.size + a.positional.length);
    if (score > bestScore) { bestScore = score; best = a; }
  }
  return best;
}

// ── חילול מסך אחד ──
function generate(slug, specText) {
  // שורה-מוזחת (שני-רווחים/טאב) = ענף של החלק שמעליה — חיבור אטום⇒אטום (הבורר מחליף ענפים)
  const rawLines = specText.split('\n').filter(l => l.trim());
  const lines = rawLines.map(s => s.trim().replace(/,$/, ''));
  const first = lines[0];
  const oneLine = lines.length === 1;
  const title = (oneLine ? (first.includes(':') ? first.slice(0, first.indexOf(':')) : '') : first.replace(/:$/, '')).trim();
  const nodes = [];   // [{part, children:[part]}]
  if (oneLine) {
    for (const t of (first.includes(':') ? first.slice(first.indexOf(':') + 1) : first).split(',').map(s => s.trim()).filter(Boolean))
      nodes.push({ part: parsePart(t), children: [] });
  } else {
    for (let i = 1; i < rawLines.length; i++) {
      const indented = /^(\s{2,}|\t)/.test(rawLines[i]);
      const part = parsePart(lines[i]);
      if (indented && nodes.length) nodes.at(-1).children.push(part);
      else nodes.push({ part, children: [] });
    }
  }
  const parts = [...nodes.map(n => n.part), ...nodes.flatMap(n => n.children)];
  // 🌉 גשר-הלוגיקה: חלק-'חישוב' ⇒ קריאה חיה לאטום-לוגיקה מהמדף (מוצג כמדד).
  // סדר: כלל-מפורש מקובץ-הדעת ⇒ התאמה-אוטומטית לפי התיאור-העברי-העצמי של האטום +
  // כיול-ארגומנטים מהמשפט עצמו (מספרים · "מחרוזות" · תאריך-עכשיו). אין-התאמה ⇒ שורה כנה.
  const logicImports = new Set();
  const norm = (w) => w.replace(/^ה(?=..)/, '').replace(/[^֐-׿\w]/g, '');
  const RETS = new Set(['String', 'String?', 'int', 'double', 'num', 'bool']);
  const bindArgs = (fn, part, pendingHebArg, fieldFeed = false) => {
    const nums = [...part.txt.matchAll(/\d[\d.]*/g)].map(m => m[0]);
    const strs = [...part.txt.matchAll(/"([^"]*)"/g)].map(m => m[1]);
    // 🌾 זנב-הקציר: אמת-קרקע מבדיקת-האטום (twin-tails.json, נכתב ע"י רתמת-התאומים) —
    // פרמטרי-הזנב של מנוע רב-פרמטרי נפלטים כליטרלים ⇒ המסך שקול לתאום-ה-JS שהוכיח.
    const tailMeta = TWIN_TAILS[fn.name];
    const tailLits = tailMeta && tailMeta.simple && tailMeta.tail.length === fn.params.length - 1 ? tailMeta.tail.map(x => dartLit(x)) : null;
    const args = [];
    let pi = -1;
    for (const p of fn.params) {
      pi++;
      const t = p.type.replace(/\?$/, '');
      if (pi > 0 && tailLits) args.push(tailLits[pi - 1]);
      else if (t === 'DateTime') args.push('DateTime.now()');
      else if (t === 'String' && fieldFeed) args.push('__FIELD__');
      // 🔗 הזנת-שרשרת גם לפרמטר גמיש/מספרי (מנוע-הסינתזה מרכיב חוליות שקולטות מספר):
      // dynamic/Object בולעים String כמות-שהוא; num/int דרך tryParse — כשל-פרסור ⇒ NaN/0 ⇒
      // האטום עצמו מחזיר '' (כנות-תצוגה), בדיוק כמו תאום-ה-JS על קלט שבור.
      else if ((t === 'dynamic' || t === 'Object') && fieldFeed) args.push('__FIELD__');
      else if ((t === 'num' || t === 'double') && fieldFeed && !nums.length) args.push('(num.tryParse(__FIELD__) ?? double.nan)');
      else if (t === 'int' && fieldFeed && !nums.length) args.push('(int.tryParse(__FIELD__) ?? 0)');
      else if (t === 'String' && strs.length) { const s = strs.shift(); args.push(/[֐-׿]/.test(s) ? pendingHebArg(s) : `'${s.replace(/'/g, "\\'")}'`); }
      else if ((t === 'int') && nums.length) args.push(String(parseInt(nums.shift())));
      else if ((t === 'double' || t === 'num') && nums.length) args.push(nums.shift());
      else if (t === 'bool') args.push('false');
      else if (p.type.endsWith('?')) args.push('null');
      else return null;                                               // פרמטר-חובה בלי מקור ⇒ לא קוראים
    }
    return args;
  };
  // (לולאת-הגשר עצמה רצה אחרי הגדרת constFor — ראה resolveCalcParts להלן)

  const cls = 'Gen' + slug.replace(/(^|[_-])([a-z])/g, (_, __, c) => c.toUpperCase()) + 'Screen';
  const consts = [];
  const usedNames = new Set();
  const constFor = (v, purpose) => {
    let n = 'gen_' + slug + '_' + (purpose || 'text'), i = 2;
    while (usedNames.has(n)) n = 'gen_' + slug + '_' + (purpose || 'text') + i++;
    usedNames.add(n);
    consts.push([n, v]);
    return n;
  };
  const stateDecls = [];
  const imports = new Set([...FW.imports, FW.tokenImport, `${FW.contentImportPrefix}${slug}${FW.contentImportSuffix}`].filter(Boolean));
  let sIdx = 0;

  // מפת-הורים (לחיבור שדה⇒חישוב) + חיווט-ניווט בין-מסכים
  const parentOf = new Map();
  for (const n of nodes) for (const c of n.children) parentOf.set(c, n.part);
  for (const part of parts) {
    if (!part.navSlug) continue;
    imports.add(`import 'gen_${part.navSlug}.dart';`);
    part.navExpr = `() => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const Gen${pascalOf(part.navSlug)}Screen()))`;
  }

  // 🌉 פתרון חלקי-'חישוב' (רץ כאן — אחרי constFor, שמשרת ארגומנט-עברי דרך קובץ-התוכן)
  for (const part of parts) {
    if (part.role !== 'calc') continue;
    const pendingHebArg = (s) => constFor(s, 'calc_arg');
    const wrapCall = (f, args) => `${f.name}(${args.join(', ')})${f.ret === 'String' || f.ret === 'String?' ? '' : '.toString()'}${f.ret === 'String?' ? " ?? ''" : ''}`;
    let call = null, fnHit = null;
    // 📌 עיגון-מפורש '(fnName)' בסוף חלק-חישוב ⇒ האטום המדויק — לבקשות שהמכונה כותבת לעצמה
    const pinM = part.txt.match(/\(([a-z]\w*)\)\s*$/);
    if (pinM) {
      const pf = atlas.functions.find(f => f.name === pinM[1]);
      if (pf) {
        const args = bindArgs(pf, part, pendingHebArg, ['textfield', 'chip'].includes(parentOf.get(part)?.role));
        if (args) { fnHit = pf; call = wrapCall(pf, args); part.label = part.label.replace(/\s*\([a-z]\w*\)\s*$/, ''); }
      }
    }
    const rule = !fnHit && LOGIC_RULES.find(r => part.txt.includes(r.match));
    if (rule) { fnHit = atlas.functions.find(f => f.name === rule.fn); call = rule.call; }
    if (!fnHit) {
      // התאמה-אוטומטית: חפיפת-מילים בין הבקשה לתיאור-העצמי; רק פונקציות-ערך ניתנות-לכיול
      const words = new Set(part.label.split(/\s+/).map(norm).filter(w => w.length > 1));
      let best = null, bestScore = 1;                                 // סף: לפחות 2 מילים חופפות
      for (const f of atlas.functions) {
        if (!RETS.has(f.ret) || !f.he.length) continue;
        const overlap = f.he.filter(w => words.has(norm(w))).length;
        if (overlap > bestScore) { bestScore = overlap; best = f; }
      }
      if (best) {
        const args = bindArgs(best, part, pendingHebArg, ['textfield', 'chip'].includes(parentOf.get(part)?.role));
        if (args) { fnHit = best; call = wrapCall(best, args); }
      }
    }
    if (fnHit && call) {
      part.calcExpr = call;
      part.role = 'stat';
      imports.add(`import '${FW.logicImportPrefix}${fnHit.file}';`);
    } else part.role = 'row';                                         // אין-גשר ⇒ שורה כנה, לא המצאה
  }

  // 🔗 שרשרת-חישובים: כמה ילדי-'חישוב' תחת קלט אחד ⇒ צינור אמיתי — פלט כל שלב מוזרם לבא.
  // שלב 1 ניזון מהקלט (__FIELD__); שלב N מקבל את ביטוי שלב N-1 (הביטוי תמיד String ⇒ תואם-טיפוס).
  for (const n of nodes) {
    if (!['textfield', 'chip'].includes(n.part.role)) continue;
    let prev = '__FIELD__';
    for (const c of n.children) {
      if (!c.calcExpr || !c.calcExpr.includes('__FIELD__')) continue;
      c.calcExpr = c.calcExpr.replace('__FIELD__', prev);
      prev = '(' + c.calcExpr + ')';
    }
  }

  // 🎨 תור-הערכים של החלק: כל בקשת-prop-מספרי מושכת את המספר-הבא בסדר-הכתיבה
  const nextNum = (part) => { part._vi = part._vi || 0; const v = (part.values || [])[part._vi]; if (v !== undefined) part._vi++; return v; };
  const fillProp = (a, name, part, shared) => {
    const t = (a.types.get(name) || 'String').replace(/\?$/, '');
    if (part.calcExpr && name === 'value' && t === 'String') return { expr: part.calcExpr };   // 🌉 ערך-חי ממנוע-לוגיקה
    if (name === 'value' && part.value != null && t === 'String') return { expr: constFor(nextNum(part) ?? part.value, part.role + '_value') };
    if (name === 'value' && part.value != null && t === 'int') return { expr: String(parseInt(String(nextNum(part) ?? part.value).replace(/[^0-9]/g, ''))) };
    if (part.dataPin && name === 'options' && t === 'List<String>') {
      const da = atlas.data.find(d => d.name === part.dataPin && d.type === 'List<String>');
      if (da) { imports.add(`import '../${da.shelf.replace(/^new\//, '')}/${da.file}';`); return { expr: da.name }; }
    }
    if (t === 'String' && /^(value|selected)$/.test(name)) { if (!shared.s) { shared.s = '_t' + (++sIdx); stateDecls.push(`String ${shared.s} = '';`); } return { expr: shared.s }; }
    if (t === 'String' && /^(glyph|emoji|icon)$/.test(name)) return { expr: constFor(part.emoji || '🔹', part.role + '_glyph') };
    if (t === 'String' && /^(sub|subtitle|caption|secondary)$/.test(name)) return { expr: constFor(part.sub || part.label, part.role + '_sub') };
    if (t === 'String') {
      // 🎨 תור-טקסטים: prop-מחרוזת גנרי ראשון = התווית; הבאים נמזגים מה-options בסדרם
      // (רק כשהאטום עצמו אינו אטום-אופציות) ואז מה-sub — כך widget רב-כיתובים מקבל טקסט שונה לכל פינה.
      part._si = part._si || 0;
      const optWidget = [...a.types.entries()].some(([n2, t2]) => /^(options|items)$/.test(n2) && /^List</.test(t2.replace(/\?$/, '')));
      const texts = optWidget || !part.options ? [] : part.options;
      const pick = part._si === 0 ? part.label : (texts[part._si - 1] ?? part.sub ?? part.label);
      part._si++;
      return { expr: constFor(pick, part.role + '_' + snake(name)) };
    }
    if (t === 'bool' && name === 'value') { if (!shared.b) { shared.b = '_v' + (++sIdx); stateDecls.push(`bool ${shared.b} = false;`); } return { expr: shared.b }; }
    if (t === 'bool') return { expr: 'false' };
    if (t === 'int' && /^(value|selectedIndex|activeIndex|selected|qty|count)$/.test(name)) { if (!shared.i) { shared.i = '_n' + (++sIdx); stateDecls.push(`int ${shared.i} = 0;`); } return { expr: shared.i }; }
    if (t === 'int') { const nv = nextNum(part); return { expr: nv !== undefined ? String(parseInt(nv.replace(/[^0-9]/g, '')) || 0) : '0' }; }
    if (t === 'double') {
      if (/radius/i.test(name)) return { expr: '12' };
      const nv = nextNum(part);
      return { expr: nv !== undefined ? String(parseFloat(nv.replace(/[^0-9.]/g, '')) || 0) : '16' };
    }
    if (t === 'Color') return { expr: tokenFor(name) };
    if (t === 'IconData') return { expr: 'Icons.tune' };
    if (t === 'TextEditingController') { const c = '_c' + (++sIdx); stateDecls.push(`final TextEditingController ${c} = TextEditingController();`); return { expr: c }; }
    if (part.navExpr && (t === 'VoidCallback' || t === 'void Function()')) return { expr: part.navExpr };
    if (t === 'VoidCallback' || t === 'void Function()') return { expr: `() => _toast(${constFor(part.label, part.role + '_toast')})` };
    if (/^ValueChanged<bool>$|^void Function\(bool\)$/.test(t)) { if (!shared.b) { shared.b = '_v' + (++sIdx); stateDecls.push(`bool ${shared.b} = false;`); } return { expr: `(v) => setState(() => ${shared.b} = v)` }; }
    if (/^ValueChanged<int>$|^void Function\(int\)$/.test(t)) { if (!shared.i) { shared.i = '_n' + (++sIdx); stateDecls.push(`int ${shared.i} = 0;`); } return { expr: `(v) => setState(() => ${shared.i} = v)` }; }
    if (/^ValueChanged<String>$|^void Function\(String\)$/.test(t)) { if (!shared.s) { shared.s = '_t' + (++sIdx); stateDecls.push(`String ${shared.s} = '';`); } return { expr: `(v) => setState(() => ${shared.s} = v)` }; }
    if (/^List<String>/.test(t)) return { expr: part.options?.length ? `const <String>[${part.options.map(o => constFor(o, part.role + '_option')).join(', ')}]` : 'const <String>[]' };
    const rm2 = t.match(/^List<(\(\{[^}]*\}\))>$/);
    if (rm2 && part.options?.length) {
      const recT = rm2[1];
      const fields2 = [...recT.matchAll(/(String|bool|int)\s+(\w+)/g)];
      const items = part.options.map(o => '(' + fields2.map(([, ft, fn]) => `${fn}: ${ft === 'String' ? constFor(o, part.role + '_option') : ft === 'bool' ? 'true' : '0'}`).join(', ') + ')');
      return { expr: `const <${recT}>[${items.join(', ')}]` };
    }
    if (t === 'Widget') return { expr: 'const SizedBox(height: 4)' };
    if (/^List<Widget>/.test(t)) return { expr: 'const <Widget>[]' };
    return null;
  };

  const atomOf = new Map(parts.map(p => [p, pickAtom(p)]));
  const chosen = parts.map(part => ({ part, atom: atomOf.get(part) })).filter(c => c.atom);
  if (!chosen.length) { console.log(`🧬 ${slug}: אף אטום לא נבחר`); return null; }

  const buildCall = ({ part, atom }, shared = {}, overrides = {}) => {
    imports.add(`import '${FW.widgetImportPrefix}${atom.file}';`);
    const argsOut = [];
    for (const pn of atom.positional) { const r = fillProp(atom, pn, part, shared); argsOut.push(r ? r.expr : "''"); }
    for (const pn of atom.named) {
      if (overrides[pn]) { argsOut.push(`${pn}: ${overrides[pn]}`); continue; }
      const req = atom.required.has(pn);
      const t = (atom.types.get(pn) || '').replace(/\?$/, '');
      if (!req && !(t === 'String' && /^(label|title|text|hint)$/.test(pn)) && !/^ValueChanged|^void Function\(/.test(t) && pn !== 'value' && pn !== 'onTap' && pn !== 'onPressed') continue;
      const r = fillProp(atom, pn, part, shared);
      if (r) argsOut.push(`${pn}: ${r.expr}`);
      else if (req) argsOut.push(`${pn}: (null as dynamic) /* לא-ממולא */`);
    }
    return `${atom.cls}(${argsOut.join(', ')})`;
  };
  // הרכבה: אטומי-flex עוקבים ⇒ Row אחד · ענפים-מוזחים תחת בורר ⇒ IndexedStack מחווט
  // למצב-הבורר (חיבור אטום⇒אטום: הבחירה מחליפה את האטום המוצג) · אטום-מכיל ⇒ ילדים אמיתיים
  const calls = [];
  const flexBuf = [];
  const flushFlex = () => {
    if (!flexBuf.length) return;
    calls.push(`          Padding(padding: const EdgeInsets.symmetric(horizontal: 12), child: Row(children: [${flexBuf.join(', ')}])),`);
    flexBuf.length = 0;
  };
  for (const node of nodes) {
    const atom = atomOf.get(node.part);
    if (!atom) continue;
    const kids = node.children.map(c => ({ part: c, atom: atomOf.get(c) })).filter(k => k.atom);
    if (!kids.length) {
      if (atom.flexRoot) { flexBuf.push(buildCall({ part: node.part, atom })); continue; }
      flushFlex();
      calls.push(`          ${buildCall({ part: node.part, atom })},`);
      continue;
    }
    flushFlex();
    const kidCalls = kids.map(k => k.atom.flexRoot ? `Row(children: [${buildCall(k)}])` : buildCall(k));
    if (node.part.role === 'radio' && node.part.options?.length) {
      const shared = {};
      const pickerCall = buildCall({ part: node.part, atom }, shared);
      calls.push(`          ${pickerCall},`);
      calls.push(`          IndexedStack(index: ${shared.i || '0'}, children: [${kidCalls.join(', ')}]),`);
    } else if (node.part.role === 'switch') {
      const shared = {};
      calls.push(`          ${buildCall({ part: node.part, atom }, shared)},`);
      for (const kc of kidCalls) calls.push(`          if (${shared.b || 'true'}) ${kc},`);
    } else if (node.part.role === 'textfield' || node.part.role === 'chip') {
      const shared = {};
      calls.push(`          ${buildCall({ part: node.part, atom }, shared)},`);
      for (const kc of kidCalls) calls.push(`          ${kc.replaceAll('__FIELD__', shared.s || "''")},`);
    } else if (/^List<Widget>/.test((atom.types.get('children') || ''))) {
      calls.push(`          ${buildCall({ part: node.part, atom }, {}, { children: `[${kidCalls.join(', ')}]` })},`);
    } else if ((atom.types.get('child') || '').replace(/\?$/, '') === 'Widget') {
      calls.push(`          ${buildCall({ part: node.part, atom }, {}, { child: `Column(children: [${kidCalls.join(', ')}])` })},`);
    } else {
      calls.push(`          ${buildCall({ part: node.part, atom })},`);
      for (const kc of kidCalls) calls.push(`          ${kc},`);
    }
  }
  flushFlex();

  const titleConst = constFor(title, 'app_bar_title');
  fs.writeFileSync(path.join(DATA, `gen_${slug}_content.dart`),
    '// 📦 דאטה · תוכן-המחולל (genesis-gen) — התוויות מן-הבקשה, verbatim. אל תערוך ידנית.\n' +
    consts.map(([n, v]) => `const String ${n} = '${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}';${termKeyOf.has(v) ? ' // ' + termKeyOf.get(v) : ''}`).join('\n') + '\n');

  const code = `// 🧬 חולל ע"י המחולל (genesis-gen, הכרעות 17+18) — בקשה ⇒ בחירת-אטומים ⇒ חיווט ⇒ מסך. אל תערוך ידנית.
// 🧬 שם: ${title}
// 🧬 בקשה: ${lines.join(' · ')}
// 🧬 אטומים שנבחרו: ${chosen.map(c => c.atom.cls).join(' · ')}
${[...imports].sort().join('\n')}

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});

  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  ${stateDecls.join('\n  ')}

  void _toast(String msg) => ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(msg), duration: const Duration(seconds: 2)),
      );

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: ${FW.scaffoldBg},
        appBar: AppBar(title: Text(${titleConst})),
        body: ListView(
          padding: const EdgeInsets.symmetric(vertical: 12),
          children: [
${calls.join('\n')}
          ],
        ),
      ),
    );
  }
}
`;
  // 🚨 שער-עצמי (הכרעה 16): קוד-המסך נקי — אפס-עברית ואפס-אימוג'י מחוץ להערות
  const codeOnly = stripComments(code);
  if (/[֐-׿]/.test(codeOnly) || /\p{Extended_Pictographic}/u.test(codeOnly)) {
    throw new Error(`🧬 ${slug}: עברית/אימוג'י דלפו לקוד-המסך — הפרת-טוהר`);
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, `gen_${slug}.dart`), code);
  console.log(`🧬 ${slug} · "${title}" · ${chosen.length}/${parts.length} חלקים ⇒ ${chosen.map(c => c.atom.cls).join(', ')}`);
  return cls;
}

// ── CLI runner ──
// שימוש:  node engine/generate.mjs                 ⇒ מחולל את כל ה-specs שבתיקיית specs
//         node engine/generate.mjs <slug> "<spec>" ⇒ שומר spec ומחולל אותו
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(DATA, { recursive: true });
fs.mkdirSync(SPECS, { recursive: true });

const [slugArg, specArg] = process.argv.slice(2);
if (slugArg && specArg) fs.writeFileSync(path.join(SPECS, slugArg + '.txt'), specArg + '\n');

for (const f of fs.readdirSync(OUT)) if (/^gen_.*\.dart$/.test(f)) fs.unlinkSync(path.join(OUT, f));
for (const f of fs.readdirSync(DATA)) if (/^gen_.*_content\.dart$/.test(f)) fs.unlinkSync(path.join(DATA, f));

let n = 0;
for (const f of fs.readdirSync(SPECS).filter(f => f.endsWith('.txt')).sort()) {
  const spec = fs.readFileSync(path.join(SPECS, f), 'utf8').trim();
  if (spec && generate(f.replace('.txt', ''), spec)) n++;
}
console.log(`engine · ${n} screens · atlas: ${atlas.widgets.length} widgets · ${atlas.functions.length} functions · ${atlas.data.length} data`);
