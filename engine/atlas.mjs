// ── engine/atlas.mjs — סורק-הקטלוג (אטלס) ──
// מנגנון-סריקה טהור: בונה קטלוג-חי מכל קטלוג-קוד שתזין. אפס-דאטה מוטמעת.
//   widgets   — לבנים-ויזואליות: מחלקה + props + בנאי (מהתיקיות ב-config.widgets)
//   functions — אטומי-לוגיקה: שם + חתימה + תיאור-עצמי (מ-config.logic)
//   data      — אטומי-דאטה: קבועים (מ-config.data)
// כל הנתיבים מגיעים מ-config — המנוע אינו יודע דבר על פרויקט מסוים.
import fs from 'node:fs';
import path from 'node:path';
import { classBody, stripComments } from './lib.mjs';

const dartFiles = (dir) => {
  if (!dir || !fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { recursive: true }).map(String)
    .filter(f => f.endsWith('.dart') && !f.endsWith('_test.dart') && !f.includes('QUARANTINE'))
    .filter(f => fs.statSync(path.join(dir, f)).isFile())
    .map(f => ({ dir, rel: f, abs: path.join(dir, f) }));
};

// מילות-פיגום בכותרות-אטומים (עברית) שאינן תיאור — מסוננות מהתיאור-העצמי
const SCAFFOLD = new Set(['חוט', 'אטום', 'חוזה', 'דרגת', 'קבוע', 'מוצא', 'קודם', 'אוטומטית']);

export function buildAtlas(cfg) {
  const widgetDirs = (cfg.widgets || []).map(d => path.resolve(cfg.root, d));
  const logicDirs = (cfg.logic || []).map(d => path.resolve(cfg.root, d));
  const dataDirs = (cfg.data || []).map(d => path.resolve(cfg.root, d));

  const widgets = [];
  for (const f of widgetDirs.flatMap(dartFiles)) {
    const src = stripComments(fs.readFileSync(f.abs, 'utf8'));
    for (const cm of src.matchAll(/class\s+([A-Z][A-Za-z0-9]*)\s+extends\s+(?:StatelessWidget|StatefulWidget)\b/g)) {
      const cls = cm[1];
      const body = classBody(src, cm.index) || '';
      const types = new Map();
      for (const fm of body.matchAll(/final\s+([^;=]+?)\s+([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*)\s*;/g))
        for (const nm of fm[2].split(',')) types.set(nm.trim(), fm[1].trim());
      const ctm = body.match(new RegExp('(?:const\\s+)?' + cls + '\\s*\\(([\\s\\S]*?)\\)\\s*[;:{]'));
      if (!ctm) continue;
      const sig = ctm[1];
      const positional = [];
      const namedPart = sig.includes('{') ? sig.slice(sig.indexOf('{')) : '';
      for (const pp of (sig.includes('{') ? sig.slice(0, sig.indexOf('{')) : sig).split(',')) {
        const mm = pp.match(/this\.(\w+)/); if (mm) positional.push(mm[1]);
      }
      widgets.push({
        cls, file: f.rel, types, positional,
        required: new Set([...namedPart.matchAll(/required\s+this\.(\w+)/g)].map(x => x[1])),
        named: new Set([...namedPart.matchAll(/this\.(\w+)/g)].map(x => x[1])),
        flexRoot: /return\s+(?:Expanded|Flexible)\s*\(/.test(body),
        dirty: /['"][^'"\n]*[֐-׿]/.test(body),
      });
    }
  }

  const functions = [];
  for (const f of logicDirs.flatMap(dartFiles)) {
    const raw = fs.readFileSync(f.abs, 'utf8');
    const src = stripComments(raw);
    const heOf = (line) => [...(line || '').matchAll(/[֐-׿][֐-׿]*/g)].map(m => m[0].replace(/^ה(?=..)/, '')).filter(w => w.length > 1 && !SCAFFOLD.has(w));
    const headLines = raw.split('\n').slice(0, 14).filter(l => /^\s*\/\//.test(l));
    let he = heOf(headLines[0]);
    if (he.length < 2) {
      for (const hl of headLines.slice(1)) {
        if (/מוצא:|טוהר:|חוק-|המרה|תורגם|תיקוני|import |אזהר|צילום|קלט:|פלט:/.test(hl)) continue;
        const w = heOf(hl.replace(/^\s*\/\/+\s*/, '').replace(/^תפקיד:\s*/, ''));
        if (w.length >= 2) { he = w.slice(0, 10); break; }
      }
    }
    for (const fm of src.matchAll(/(?:^|\n)((?:Future<[^>\n]+>|Iterable<[^>\n]+>|List<[^>\n]+>|Map<[^>\n]+>|Set<[^>\n]+>|[A-Z]\w*(?:<[^>\n]+>)?\??|void|bool|int|double|num|String\??|dynamic)\s+([a-z]\w*)\s*\(([^)]*)\))\s*(?:=>|\{|async)/g)) {
      const ret = fm[1].split(/\s+/)[0];
      const params = fm[3].replace(/[\[\]]/g, '').split(',').map(p => p.trim()).filter(Boolean).map(p => {
        const mm = p.match(/^([\w<>,?() ]+?)\s+(\w+)$/);
        return mm ? { type: mm[1].trim(), name: mm[2] } : { type: p, name: '' };
      });
      functions.push({ name: fm[2], sig: fm[1].replace(/\s+/g, ' ').trim(), ret, params, he, file: f.rel, dir: f.dir });
    }
  }

  const data = [];
  for (const f of dataDirs.flatMap(dartFiles)) {
    const src = stripComments(fs.readFileSync(f.abs, 'utf8'));
    const rawD = fs.readFileSync(f.abs, 'utf8');
    const heD = [...(rawD.split('\n')[0] || '').matchAll(/[֐-׿][֐-׿]*/g)].map(m => m[0].replace(/^ה(?=..)/, '')).filter(w => w.length > 1);
    for (const dm of src.matchAll(/(?:^|\n)const\s+(?:(\w[\w<>, ]*?)\s+)?([a-zA-Z_]\w*)\s*=/g)) {
      const entry = { name: dm[2], type: dm[1] || '', he: heD, file: f.rel, dir: f.dir };
      if (entry.type === 'List<String>') {
        const at = dm.index + dm[0].length;
        const seg = src.slice(at, src.indexOf(';', at));
        entry.items = [...seg.matchAll(/'((?:\\.|[^'\\])*)'/g)].map(x => x[1].replace(/\\'/g, "'")).slice(0, 12);
      }
      data.push(entry);
    }
  }

  return { widgets, functions, data };
}
