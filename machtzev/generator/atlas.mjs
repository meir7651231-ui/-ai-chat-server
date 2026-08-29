#!/usr/bin/env node
/** 🗺️ מחצב · אטלס-המדף המלא (atlas) — מנגנון-סריקה טהור, אפס-דאטה (חוק-1).
 *  מחבר את *כל* האטומים לרשות-המחולל (הכרעת-בעלים 29.8 "הוא יכול להשתמש בהכל"):
 *    widgets   — לבנים-ויזואליות (new/dart-ui-bs): מחלקה, props, בנאי
 *    functions — אטומי-לוגיקה (new/dart-maor · new/dart): שם, חתימה, קובץ
 *    data      — אטומי-דאטה (new/dart-data-bs · new/dart-data-maor): קבועים, קובץ
 *  תוצר: machtzev/generator/atlas.json + API בזיכרון (buildAtlas).
 */
import fs from 'node:fs';
import path from 'node:path';
import { classBody, stripComments } from '../assemble/lift-lib.mjs';

const ROOT = new URL('../../', import.meta.url).pathname;
const WIDGET_SHELVES = ['new/dart-ui-bs'];
const LOGIC_SHELVES = ['new/dart-maor', 'new/dart'];
const DATA_SHELVES = ['new/dart-data-bs', 'new/dart-data-maor'];

const dartFiles = (dir) => {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { recursive: true }).map(String)
    .filter(f => f.endsWith('.dart') && !f.endsWith('_test.dart') && !f.includes('QUARANTINE'))
    .filter(f => fs.statSync(path.join(abs, f)).isFile())
    .map(f => ({ shelf: dir, rel: f, abs: path.join(abs, f) }));
};

export function buildAtlas() {
  const widgets = [];
  for (const f of WIDGET_SHELVES.flatMap(dartFiles)) {
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
        cls, file: f.rel, shelf: f.shelf, types, positional,
        required: new Set([...namedPart.matchAll(/required\s+this\.(\w+)/g)].map(x => x[1])),
        named: new Set([...namedPart.matchAll(/this\.(\w+)/g)].map(x => x[1])),
        flexRoot: /return\s+(?:Expanded|Flexible)\s*\(/.test(body),   // בנוי-ל-Row: חייב הורה-flex
        dirty: /['"][^'"\n]*[֐-׿]/.test(body),                        // חוב-טוהר: דאטה-עברי קשיח בגוף (הכרעה 16)
      });
    }
  }

  const functions = [];
  for (const f of LOGIC_SHELVES.flatMap(dartFiles)) {
    const src = stripComments(fs.readFileSync(f.abs, 'utf8'));
    for (const fm of src.matchAll(/(?:^|\n)((?:Future<[^>\n]+>|Iterable<[^>\n]+>|List<[^>\n]+>|Map<[^>\n]+>|Set<[^>\n]+>|[A-Z]\w*(?:<[^>\n]+>)?\??|void|bool|int|double|num|String\??|dynamic)\s+([a-z]\w*)\s*\(([^)]*)\))\s*(?:=>|\{|async)/g)) {
      functions.push({ name: fm[2], sig: fm[1].replace(/\s+/g, ' ').trim(), file: f.rel, shelf: f.shelf });
    }
  }

  const data = [];
  for (const f of DATA_SHELVES.flatMap(dartFiles)) {
    const src = stripComments(fs.readFileSync(f.abs, 'utf8'));
    for (const dm of src.matchAll(/(?:^|\n)const\s+(?:\w[\w<>,?() ]*\s+)?([a-zA-Z_]\w*)\s*=/g)) {
      data.push({ name: dm[1], file: f.rel, shelf: f.shelf });
    }
  }

  return { widgets, functions, data };
}

export function writeAtlas(atlas) {
  fs.writeFileSync(path.join(ROOT, 'machtzev/generator/atlas.json'), JSON.stringify({
    counts: { widgets: atlas.widgets.length, functions: atlas.functions.length, data: atlas.data.length },
    widgets: atlas.widgets.map(a => ({ cls: a.cls, file: a.file, props: [...a.types.keys()], required: [...a.required], positional: a.positional })),
    functions: atlas.functions,
    data: atlas.data,
  }, null, 1));
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const a = buildAtlas();
  writeAtlas(a);
  console.log(`🗺️ אטלס-מלא · widgets: ${a.widgets.length} · functions: ${a.functions.length} · data: ${a.data.length}`);
}
