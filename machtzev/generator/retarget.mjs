#!/usr/bin/env node
// 🎯 retarget — שבר-זהב ⇒ ישות אחרת מהסכמה (GENMAX · G5c · הכרעה-24): הופך את המנוע מ"מרכיב" ל"מחולל".
//   קלט: מודול-זהב M (למשל schoolos_rooms.dart) + ישות E מ-`new/atoms/schema-fields.mjs` (54 ישויות · 492 שדות).
//   1. הישות-הראשית של M = רשימת-המפות ה-const הראשונה ב-`_XData` (הזרע: rooms/students/teachers…) ⇒ מפתחות + טיפוס-משוער מהערך (§20-ד: מצורת-הדאטה).
//   2. מיפוי מפתח⇒שדה-E דטרמיניסטי, בלי מילון: (א) שם-זהה · (ב) אותה קטגוריית-טיפוס (Id/string/number/boolean/IsoDate/TimeHM/enum/list/map) לפי סדר-ההצהרה בסכמה, כל שדה פעם-אחת · (ג) לא-ממופה ⇒ נשאר כמפתח-מקור ומדווח (מקום-שמור, חוק-7).
//   3. שכתוב: כל ליטרל `'srcKey'` (מפתח-מפה/אינדקס/רשימת-עמודות) ⇒ `'dstKey'` מחוץ להערות · שמות-המחלקות של M ⇒ של E (`RoomsScreen`⇒`VolunteerScreen`) · הערכים-בזרע נשמרים (זרע-הצבה מוצהר — לא ערך-מומצא לשקע).
//   4. הרכבה: compose+declared (המסך-השלם) ⇒ new/dart-gen-bs/gen_retarget_<e>_from_<tag>.dart ⇒ analyze + gen-verify (G5b) הם השער.
//   CLI: --module <file> --entity <E> [--out] · --gate: ההרכבות-המחויבות ≡ טריות.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as R from '../root.mjs';
import { assemble, PARTICLE_IDS, TAG } from './render-module.mjs';
import { FIELDS } from '../../new/atoms/schema-fields.mjs';

const ROOT = R.ROOT, DIR = path.join(ROOT, 'new/dart-gen-bs');
const cat = (t) => /^Id/.test(t) ? 'Id' : /IsoDate/.test(t) ? 'IsoDate' : /TimeHM/.test(t) ? 'TimeHM' : /^number/.test(t) ? 'number' : /^boolean/.test(t) ? 'boolean' : /^string/.test(t) ? 'string' : /\[\]$/.test(t) ? 'list' : /^Record</.test(t) ? 'map' : (/'/.test(t) || /^[A-Z]\w+$/.test(t)) ? 'enum' : 'other';
const guess = (v) => /^'\d{4}-\d{2}-\d{2}'$/.test(v) ? 'IsoDate' : /^'\d{2}:\d{2}'$/.test(v) ? 'TimeHM' : /^'[a-z]{1,3}\d+'$/.test(v) ? 'Id' : /^'/.test(v) ? 'string' : /^(true|false)$/.test(v) ? 'boolean' : /^-?\d/.test(v) ? 'number' : /^\[/.test(v) ? 'list' : /^\{/.test(v) ? 'map' : /^null$/.test(v) ? 'null' : '?';
const tagOf = (m) => TAG[m] || TAG[m.replace(/\.dart$/, '')] || 'x';

// הישות-הראשית: רשימת-המפות ה-const הראשונה של מחלקת-הדאטה ⇒ [{key, type}] לפי סדר-הופעה
export function primaryKeys(src) {
  const m = src.match(/static const (\w+) = <Map<String, dynamic>>\[\s*\n([\s\S]*?)\n\s*\];/);
  if (!m) return { name: null, keys: [] };
  const seen = new Map();
  for (const row of m[2].split('\n')) for (const kv of row.matchAll(/'([a-zA-Z_]\w*)':\s*((?:'(?:[^'\\]|\\.)*'|[^,}\]]+))/g)) { const t = guess(kv[2].trim()); if (!seen.has(kv[1]) || seen.get(kv[1]) === 'null') seen.set(kv[1], t); }
  return { name: m[1], keys: [...seen].map(([key, type]) => ({ key, type })) };
}
export function mapKeys(keys, entity) {
  const fields = FIELDS.filter((f) => f.e === entity).map((f) => ({ n: f.n, cat: cat(f.t), t: f.t }));
  if (!fields.length) throw new Error(`ישות לא בסכמה: ${entity}`);
  const used = new Set(), map = [];
  for (const k of keys) { const f = fields.find((x) => x.n === k.key && !used.has(x.n)); if (f) { used.add(f.n); map.push({ src: k.key, dst: f.n, how: 'name', srcType: k.type, dstType: f.t }); } }
  for (const k of keys) { if (map.some((x) => x.src === k.key)) continue; const f = fields.find((x) => x.cat === k.type && !used.has(x.n)); if (f) { used.add(f.n); map.push({ src: k.key, dst: f.n, how: 'type', srcType: k.type, dstType: f.t }); } else map.push({ src: k.key, dst: null, how: 'reserved', srcType: k.type, dstType: null }); }
  return { map, unusedFields: fields.filter((f) => !used.has(f.n)).map((f) => f.n) };
}
export function retarget({ module, entity }) {
  const src = fs.readFileSync(path.join(DIR, module), 'utf8');
  const pk = primaryKeys(src);
  const { map, unusedFields } = mapKeys(pk.keys, entity);
  const tag = tagOf(module), k = module.replace(/\.dart$/, '');
  const ids = PARTICLE_IDS.filter((id) => (TAG[k] && TAG[k] !== 'inv' ? id.startsWith(tag + '.') : !id.includes('.')));
  const res = assemble({ module, particles: ids, mode: 'compose', declared: true });
  let code = res.code;
  // שכתוב-מפתחות מחוץ להערות (שורה-שורה: החלק שלפני `//` בלבד) — רק מפתחות שממופים לשם אחר
  const ren = map.filter((x) => x.dst && x.dst !== x.src);
  code = code.split('\n').map((l) => { const i = l.indexOf('//'); const head = i >= 0 ? l.slice(0, i) : l, tail = i >= 0 ? l.slice(i) : ''; let h = head; for (const x of ren) h = h.replace(new RegExp(`'${x.src}'`, 'g'), `'${x.dst}'`); return h + tail; }).join('\n');
  // שמות-מחלקות: <Tag>Screen/_<Tag>ScreenState/_<Tag>Data ⇒ של הישות
  const E = entity.replace(/[^A-Za-z0-9]/g, '');
  const classes = [...new Set([...code.matchAll(/^(?:abstract\s+)?class\s+(\w+)/gm)].map((m) => m[1]))];
  const pub = classes.find((c) => /Screen$/.test(c) && !/^_/.test(c));
  const stem = pub ? pub.replace(/Screen$/, '') : null;
  const clsMap = stem ? classes.filter((c) => c.includes(stem)).map((c) => [c, c.replace(stem, E)]) : [];
  for (const [a, b] of clsMap) code = code.replace(new RegExp(`\\b${a}\\b`, 'g'), b);
  const header = [`// 🎯 ${E}Screen — retarget של ${module} לישות ${entity} (GENMAX·G5c · הכרעה-24) · מחולל דטרמיניסטי: retarget.mjs --module ${module} --entity ${entity}`,
    `//   מיפוי-מפתחות (שם-זהה ⇒ אותה צורת-טיפוס לפי סדר-הסכמה ⇒ מקום-שמור): ${map.map((x) => `${x.src}⇒${x.dst || '∅'}(${x.how})`).join(' · ')}`,
    `//   שדות-E שלא קיבלו מקור (מקום-שמור, יאירו כשיוזרם נתון): ${unusedFields.join(', ') || '—'} · הזרע (${pk.name}) = זרע-הצבה של מודול-המקור, לא ערך-אמת של ${entity}`];
  code = header.join('\n') + '\n' + code;
  return { code, map, unusedFields, primary: pk.name, classes: clsMap, fragments: res.fragments, of: res.of };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const arg = (k) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : null; };
export const COMMITTED = [{ module: 'schoolos_rooms.dart', entity: 'Volunteer' }, { module: 'schoolos_teachers.dart', entity: 'Supporter' }];
const outName = (module, entity) => `gen_retarget_${entity.toLowerCase()}_from_${tagOf(module)}.dart`;
if (isMain && process.argv.includes('--gate')) {
  const errs = []; 
  for (const c of COMMITTED) { const r = retarget(c); const f = path.join(DIR, outName(c.module, c.entity)); if (process.argv.includes('--write')) fs.writeFileSync(f, r.code); else if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== r.code) errs.push(`${path.basename(f)} ≠ retarget-טרי (הרץ --gate --write)`); }
  if (errs.length) { console.log('🔴 retarget: ' + errs.join(' · ')); process.exit(1); }
  console.log(`✓ retarget: ${COMMITTED.length} מודולים-לישות-אחרת (gen_retarget_*.dart) ≡ מחולל-דטרמיניסטי · הרנדר-בפועל בשער genverify`); process.exit(0);
}
if (isMain && arg('--module') && arg('--entity')) {
  const r = retarget({ module: arg('--module'), entity: arg('--entity') });
  const out = arg('--out') || path.join(DIR, outName(arg('--module'), arg('--entity')));
  fs.writeFileSync(out, r.code);
  console.log(`✓ ${arg('--module')} ⇒ ${arg('--entity')} ⇒ ${path.basename(out)} · זרע ${r.primary} · מיפוי: ${r.map.map((x) => `${x.src}⇒${x.dst || '∅'}(${x.how[0]})`).join(' ')} · שדות-E בלי-מקור: ${r.unusedFields.join(',') || '—'} · מחלקות: ${r.classes.map((c) => c.join('⇒')).join(' ')} · ${r.code.split('\n').length} שורות`);
}
