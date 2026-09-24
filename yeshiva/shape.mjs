// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/shape.mjs — 🔷 **חיפוש לפי צורה, לא לפי מילה.** הכרעת-בעלים 24.9 «העיקרון שחסר ⇒ תחבר».
//  ────────────────────────────────────────────────────────────────────────
//  הדלת חיפשה חלק לא-מובן לפי המילה («תלויות» ⇒ 0 חלקיקים), והחלק שעושה את זה כתוב במילים אחרות.
//  כאן: הצורה של הטבלה מהדוגמאות של הבעלים — לכל עמודה: מפתח (הראשונה) · מספר · מצביע-לאותה-רשימה · טקסט —
//  מול אטומי-המדף שהקלט שלהם הוא **רשימת-שורות** (מפתחות-השורה מהחוזה שלהם, שדה **קלט:** {…}).
//  כל שיבוץ של עמודות למפתחות (עם המרה לפי צורת-העמודה) **מורץ** על הדוגמאות (תאום-JS);
//  נשאר רק שיבוץ שבו כל עמודת-מספר/מצביע שנכנסה **משפיעה** על התוצאה (שינוי שלה ⇒ תוצאה אחרת). אפס מילון, אפס שמות.
//  האטום נכנס רק אם יש לו חתימת-Dart של פרמטר אחד (או עטיפה -wired) — אחרת אי אפשר לחווט במסך (מדווח).
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import * as R from '../machtzev/root.mjs';
const A = path.join(R.ROOT, 'new/atoms');
const NUM = /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/;   // «0501…» (אפס מוביל) = מזהה כמו טלפון, לא מספר
/** צורת-הטבלה: לכל שדה — key (הראשון) · num · ref (ערכים ⊆ מפתחות-הרשימה, לא-ריק אחד לפחות) · shared (טקסט שחוזר בכמה שורות = מכנה-משותף) · text */
export function tableShape(ent) {
  const rows = ent.examples || []; const keys = new Set(rows.map((r) => String(r[0] || '').trim()).filter(Boolean));
  return ent.fields.map((f, i) => { const vals = rows.map((r) => String(r[i] ?? '').trim()); const ne = vals.filter(Boolean);
    const kind = i === 0 ? 'key' : ne.length && ne.every((v) => NUM.test(v)) ? 'num' : ne.length && ne.every((v) => keys.has(v)) ? 'ref' : new Set(ne).size < ne.length ? 'shared' : 'text';
    return { i, label: f.label, kind }; });
}
/** אטומים שהקלט הראשון שלהם = רשימת-שורות עם מפתחות מוצהרים בחוזה, וחתימת-Dart חד-פרמטרית (או -wired) */
let _atoms = null;
export function rowAtoms() {
  if (_atoms) return _atoms; _atoms = [];
  for (const f of fs.readdirSync(A).filter((x) => x.endsWith('.contract.md'))) {
    const base = f.replace('.contract.md', ''); const c = fs.readFileSync(path.join(A, f), 'utf8'); const m = c.match(/\*\*קלט:\*\*([\s\S]{0,400}?)\*\*פלט/); if (!m) continue;
    const br = m[1].match(/\{([^{}]+)\}/); if (!br) continue;
    const keys = br[1].split(',').map((s) => s.trim().replace(/[‏‎]/g, '')).map((s) => s.match(/^(\w+)(\?)?(\[\])?$/)).filter(Boolean).map((k) => ({ k: k[1], opt: !!k[2], list: !!k[3] }));
    if (!keys.length || keys.length > 5) continue;
    const js = path.join(A, base + '.mjs'); if (!fs.existsSync(js)) continue; const fn = (fs.readFileSync(js, 'utf8').match(/export\s+function\s+(\w+)\s*\(/) || [])[1]; if (!fn) continue;
    const dir = ['dart-maor', 'dart'].find((d) => fs.existsSync(path.join(R.ROOT, 'new', d, base + '.dart'))); if (!dir) continue;
    const dsrc = fs.readFileSync(path.join(R.ROOT, 'new', dir, base + '.dart'), 'utf8'); const params = dartParams(dsrc, fn); if (!params) continue;
    const one = params.length === 1 && /^(List|Iterable|dynamic|Object)/.test(params[0]);
    // 🔌 שקע-שדה: פרמטר «T Function(dynamic)» = «תן לי ערך מהשורה» ⇒ גם הוא כתובת לעמודה (הכרעת-בעלים 24.9 «תתקן שכן ימצא»)
    const sockets = params.length > 1 && /^(List|Iterable)/.test(params[0]) ? params.slice(1).map((p) => p.match(/^(String|List<String>|num|int|double|bool)\??\s+Function\((?:dynamic|Object\??|Map[^)]*)(?:\s+\w+)?\)\s+\w+$/)) : null;
    const sock = sockets && sockets.every(Boolean) && sockets.length <= 3 ? sockets.map((m) => ({ t: m[1] === 'List<String>' ? 'list' : m[1] === 'String' ? 'str' : m[1] === 'bool' ? 'bool' : 'num' })) : null;
    const wired = fs.existsSync(path.join(R.ROOT, 'new', dir, base + '-wired.dart')) ? `${fn}Wired` : null;
    if (!one && !sock && !wired) continue;
    _atoms.push({ name: fn, base, keys, sockets: !one && sock ? sock : null, dart: `${dir}/${base}${one || sock ? '' : '-wired'}.dart`, call: one || sock ? fn : wired });
  }
  return _atoms;
}
/** הפרמטרים של פונקציית-Dart ברמה העליונה (סוגריים/זוויות מאוזנים) — null אם לא נמצאה */
function dartParams(src, fn) {
  const m = src.match(new RegExp(`^[\\w<>, ?]+\\s+${fn}\\(`, 'm')); if (!m) return null; let d = 0, cur = ''; const out = [];
  for (let i = m.index + m[0].length; i < src.length; i++) { const ch = src[i];
    if (ch === ')' && d === 0) { if (cur.trim()) out.push(cur.trim()); return out.map((x) => x.replace(/\s+/g, ' ')); }
    if ('(<'.includes(ch)) d++; else if (')>'.includes(ch)) d--; if (ch === ',' && d === 0) { out.push(cur.trim()); cur = ''; } else cur += ch; }
  return null;
}
const sockVal = (col, t) => (r) => { const v = String(r[col.i] ?? '').trim(); return t === 'list' ? (v ? [v] : []) : t === 'num' ? Number(v) || 0 : t === 'bool' ? !!v : v; };
const conv = (col, list) => (r) => { const v = String(r[col.i] ?? '').trim(); if (col.kind === 'num') return v === '' ? undefined : Number(v); if (list) return v ? [v] : []; return v; };
/** החיפוש: לכל אטום-רשימה — כל שיבוץ עמודות⇒מפתחות, הרצה על הדוגמאות, סינון לפי השפעה. מחזיר את הטובים, ממוינים. */
export async function search(ent) {
  const SHAPED = (c) => c.kind === 'num' || c.kind === 'ref' || c.kind === 'shared';
  const shape = tableShape(ent); if (!shape.some(SHAPED)) return { shape, results: [], tried: 0 };
  const atoms = rowAtoms(); const TW = await import('../machtzev/generator/twins.mjs');
  const twins = await TW.buildTwinRegistry(atoms.filter((a) => !a.sockets).map((a) => ({ name: a.name, file: a.base + '.dart' })));
  for (const a of atoms.filter((x) => x.sockets)) { try { const m = await import('file://' + path.join(A, a.base + '.mjs')); if (typeof m[a.name] === 'function') twins.set(a.name, m[a.name]); } catch { } }   // עם שקעים ⇒ הפונקציה הגולמית (Dart = המרה זהה, חוק-4); השקעים ממולאים כאן
  const ex = ent.examples.filter((r) => String(r[0] || '').trim()); let tried = 0; const results = [];
  const run = (fn, rows) => { try { const o = fn(rows); const j = JSON.stringify(o); return j === undefined || j === '[]' || j === '{}' || j === 'null' || j === '""' || j === '0' ? null : { o, j }; } catch { return null; } };
  for (const a of atoms) { const fn0 = twins.get(a.name); if (!fn0) continue; const S = a.sockets || [];
    const fn = S.length ? (rows) => fn0(rows, ...S.map((s, j) => (o) => o.__s[j])) : fn0;
    const opts = [...a.keys.map((k) => [...shape.flatMap((c) => (c.kind === 'ref' ? [{ c, list: true }, { c, list: false }] : [{ c, list: k.list }])), ...(k.opt ? [null] : [])]),
      ...S.map((s) => shape.filter((c) => c.kind !== 'key' && (s.t !== 'num' || c.kind === 'num')).map((c) => ({ c, sock: s.t })))];
    let best = null; const combos = opts.reduce((acc, o) => acc.flatMap((x) => o.map((y) => [...x, y])), [[]]).slice(0, 4000);
    for (const mp of combos) { tried++;
      const mk = (src) => src.map((r) => { const o = Object.fromEntries(a.keys.map((k, j) => [k.k, mp[j] ? conv(mp[j].c, mp[j].list)(r) : undefined]).filter(([, v]) => v !== undefined)); if (S.length) o.__s = S.map((s, j) => sockVal(mp[a.keys.length + j].c, s.t)(r)); return o; });
      const base = run(fn, mk(ex)); if (!base) continue; if (base.j === JSON.stringify(mk(ex))) continue;
      const used = [...new Set(mp.filter(Boolean).map((x) => x.c))]; const shaped = used.filter(SHAPED); if (!shaped.length) continue;
      const moves = shaped.every((c) => { const alt = ex.map((r, ri) => r.map((v, i) => (i !== c.i ? v : c.kind === 'num' ? String((Number(v) || 0) + 7) : c.kind === 'shared' ? (v ? `${v}·${ri}` : '') : ''))); const p = run(fn, mk(alt)); return !p || p.j !== base.j; });
      if (!moves) continue;
      const score = used.length * 10 + shaped.length * 5 + mp.filter(Boolean).length;
      if (!best || score > best.score) best = { atom: a, map: a.keys.map((k, j) => (mp[j] ? { k: k.k, col: mp[j].c.i, label: mp[j].c.label, kind: mp[j].c.kind, list: mp[j].list } : null)).filter(Boolean),
        sockets: S.map((s, j) => ({ k: `__s${j}`, t: s.t, col: mp[a.keys.length + j].c.i, label: mp[a.keys.length + j].c.label, kind: mp[a.keys.length + j].c.kind })), out: base.o, score }; }
    if (best) results.push(best); }
  results.sort((x, y) => y.score - x.score);
  return { shape, results, tried };
}
/** הצגת פלט-האטום כטבלה: מפתח-רשימה (שורות) + ערכים בודדים; תאים מעוצבים כמו במסך (רשימה ⇒ «, » · אמת ⇒ ✓) */
export const cellOf = (v) => (Array.isArray(v) ? v.join(', ') : v === true ? '✓' : v === false ? '' : v == null ? '' : String(v));
export function layoutOf(out) {
  if (Array.isArray(out) && out.length && out.every(Array.isArray)) return { listKey: null, rows: out.map((g) => ({ group: g })), scalars: [], groups: true };   // קבוצות (אשכולות) ⇒ שורה לכל קבוצה
  if (Array.isArray(out)) return { listKey: null, rows: out, scalars: [] };
  if (out && typeof out === 'object') { const lk = Object.keys(out).find((k) => Array.isArray(out[k]) && out[k].every((x) => x && typeof x === 'object')); return { listKey: lk || null, rows: lk ? out[lk] : [], scalars: Object.keys(out).filter((k) => k !== lk && (typeof out[k] !== 'object' || out[k] === null)) }; }
  return { listKey: null, rows: [], scalars: [] };
}

/** מסך-הצורה: הרשומות החיות של הישות ⇒ שורות-האטום (לפי השיבוץ) ⇒ קריאה לאטום ⇒ טבלה + ערכים בודדים. + מבחן-קבלה: הדוגמאות ⇒ מה שהאטום החזיר על המסך. */
export function emit({ shp, cls, slug = 'shape1', entSlug, title, pkg = 'buildsmart', seedSlug = null }) {
  const lit = (v) => "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$') + "'";
  const cell = (m) => (m.kind === 'num' ? null : m.list ? `'${m.k}': [(r[${lit(m.label)}] ?? '').trim()].where((x) => x.isNotEmpty).toList()` : `'${m.k}': (r[${lit(m.label)}] ?? '').trim()`);
  const nums = shp.map.filter((m) => m.kind === 'num'); const S = shp.sockets || [];
  const sockCell = (s) => (s.t === 'list' ? `'${s.k}': [(r[${lit(s.label)}] ?? '').trim()].where((x) => x.isNotEmpty).toList()` : s.t === 'num' ? `'${s.k}': num.tryParse((r[${lit(s.label)}] ?? '').trim()) ?? 0` : s.t === 'bool' ? `'${s.k}': (r[${lit(s.label)}] ?? '').trim().isNotEmpty` : `'${s.k}': (r[${lit(s.label)}] ?? '').trim()`);
  const sockFn = (s) => (s.t === 'list' ? `(f) => ((f as Map)['${s.k}'] as List).cast<String>()` : s.t === 'num' ? `(f) => (f as Map)['${s.k}'] as num` : s.t === 'bool' ? `(f) => (f as Map)['${s.k}'] as bool` : `(f) => (f as Map)['${s.k}'] as String`);
  const rowExpr = `appStore.records('${entSlug}').map((r) => <String, dynamic>{${shp.map.filter((m) => m.kind !== 'num').map(cell).join(', ')}${nums.length ? ', ' : ''}${nums.map((m) => `if (num.tryParse((r[${lit(m.label)}] ?? '').trim()) != null) '${m.k}': num.tryParse((r[${lit(m.label)}] ?? '').trim())!`).join(', ')}${S.length ? ', ' + S.map(sockCell).join(', ') : ''}}).toList()`;
  const L = layoutOf(shp.out); const labelOf = (k) => (shp.map.find((m) => m.k === k) || {}).label || (k === 'group' ? shp.ent : k);
  const keys0 = L.rows.length ? Object.keys(L.rows[0]).filter((k) => L.rows.every((r) => typeof r[k] !== 'object' || r[k] === null || Array.isArray(r[k]))) : [];
  const cols = keys0.filter((k, i) => !keys0.slice(0, i).some((j) => L.rows.every((r) => cellOf(r[j]) === cellOf(r[k]))));
  const itemsExpr = L.groups ? `(res as List).map((g) => <String, dynamic>{'group': g}).toList()` : L.listKey ? `((res['${L.listKey}'] ?? const []) as List).cast<Map>()` : `(res as List).cast<Map>()`;
  const code = [`// 🔷 חולל ע"י הדלת (yeshiva/shape · חיפוש לפי צורה) — צורת «${shp.ent}» ⇒ ${shp.atom} (אושר ע"י הבעלים) ⇒ מסך חי. אל תערוך ידנית.`,
    `import '../dart-ui-bs/ds/ds_store.dart';`, `import '../${shp.dart}';`, `import 'package:flutter/material.dart';`, '',
    `class ${cls} extends StatefulWidget {`, `  const ${cls}({super.key});`, '  @override', `  State<${cls}> createState() => _${cls}State();`, '}', '',
    `class _${cls}State extends State<${cls}> {`,
    `  String _c(Object? v) => v is List ? v.join(', ') : v == true ? '✓' : v == false ? '' : v == null ? '' : '\$v';`,
    '  @override', `  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {`,
    `        final res = ${shp.call}(${rowExpr}${S.length ? ', ' + S.map(sockFn).join(', ') : ''});`, `        final items = ${itemsExpr};`,
    `        return Scaffold(appBar: AppBar(title: Text(${lit(title)})), body: ListView(padding: const EdgeInsets.all(16), children: [`,
    ...L.scalars.map((k) => `          Text('${labelOf(k)}: \${_c(res['${k}'])}', key: const Key('shape-s-${k}'), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),`),
    `          Row(children: [${cols.map((k) => `Expanded(child: Text(${lit(labelOf(k))}, style: const TextStyle(fontWeight: FontWeight.w700)))`).join(', ')}]),`,
    `          for (final m in items) Row(children: [${cols.map((k) => `Expanded(child: Text(_c(m['${k}'])))`).join(', ')}]),`,
    '        ]));', '      });', '}', ''].join('\n');
  const exp = [...L.scalars.map((k) => `${labelOf(k)}: ${cellOf(shp.out[k])}`), ...new Set(L.rows.flatMap((r) => cols.map((k) => cellOf(r[k]))).filter(Boolean))];
  const test = seedSlug ? [`// 🎯 מבחן-קבלה (חיפוש לפי צורה): הדוגמאות של הבעלים ⇒ מה ש-${shp.atom} החזיר עליהן (תאום-JS) חייב להופיע במסך. חולל; אל תערוך.`,
    `import 'package:flutter/material.dart';`, `import 'package:flutter_test/flutter_test.dart';`, `import 'package:${pkg}/genesis/dart-gen-bs/gen_${seedSlug}.dart';`, `import 'package:${pkg}/genesis/dart-gen-bs/gen_${slug}.dart';`,
    'void main() {', `  testWidgets(${lit(`צורה: ${title} ⇒ ${shp.atom}`)}, (tester) async {`, '    seedExamples();', `    await tester.pumpWidget(const MaterialApp(home: ${cls}()));`, '    await tester.pump();',
    ...exp.map((t) => `    expect(find.text(${lit(t)}), findsWidgets, reason: ${lit(`${shp.atom} על הדוגמאות החזיר «${t}»`)});`), '  });', '}', ''].join('\n') : null;
  return { code, test, cols, expect: exp };
}
