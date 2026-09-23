// 🧩 insight — מנוע-הרכבה לתצוגה (הכרעת-בעלים 23.9 «יש את כל המנועים? ⇒ כן, חסר החיבור ⇒ תחבר»).
//   חוק 23-ב/ג/ד + הכרעה 23-ג («מד-ניטור = מד + בדיקת-סף + כרזה + סטטוס»): תובנה ⇒ פעולות-יסוד ⇒ אטום לכל פעולה (הישיבה פוסקת) ⇒
//   חיווט **מהנתונים האמיתיים** (appStore) לתוך מסך אחד ⇒ מניפסט-הרכבה כדאטה (PURPOSE §3). אפס סליידר, אפס ערך-מומצא.
//   הצורה: «<שדה> <יחס> <מספר>» על ישות = תנאי-על-קבוצה ⇒ התוצאות שהוא מכיל (insight.data.json: מונה · חלק · יש/אין · תת-קבוצה) ⇒ compose-engine.ops(kind) ⇒ פעולות.
//   פעולה בלי אטום-שורד ⇒ **יורדים** (חוק 23-ב): decompose[op] ⇒ תת-פעולות עד עובדות; רק כשגם זה אין ⇒ «אין» במניפסט. ואז אימות מול הייעוד: מבחן-קבלה מהדוגמאות של הבעלים.
import fs from 'node:fs';
import path from 'node:path';
import { searchOp, wireAtom } from './particles.mjs';
import { makeConsts, write } from './render-ds.mjs';
import { buildAtlas } from './atlas.mjs';
import { isPaper, skinWired } from './look.mjs';
import { roleOf, judge, ledgerLine, KIND } from '../../yeshiva/atom-psak.mjs';
import { wireForge, forgeCands } from './forge-wire.mjs';   // חיבור 1: המועמדים המדודים (forge) + חיווט-חריצים לפי צורה
import { ops as opsOfKind } from '../compose-engine.mjs';   // צורה ⇒ פעולות-יסוד (הטבלה הקיימת, לא רשימה שלי)
import * as R from '../root.mjs';
const D = JSON.parse(fs.readFileSync(new URL('./insight.data.json', import.meta.url), 'utf8'));

let ATL = null; const widgetOf = (cls) => ((ATL ||= buildAtlas({ forge: isPaper() })).widgets.find((w) => w.cls === cls) || null);
const impOf = (w) => `import '../${w.file.startsWith('dart-') ? w.file : 'dart-ui-bs/' + w.file}';`;

const REG = path.join(R.GEN_DIR, 'knowledge', 'composites.json');
/** אינדקס-היכולות-המורכבות (PURPOSE §3): מניפסטים שהבעלים רשם ⇒ בפעם הבאה מועמדים ראשונים (ועדיין נפסקים — הכרעה-27). רישום = פקודה מפורשת, לא בזמן-בנייה. */
export const readComposites = () => { try { return JSON.parse(fs.readFileSync(REG, 'utf8')).composites || []; } catch { return []; } };
export function registerComposite(manifestPath) {
  const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const cur = readComposites().filter((c) => c.key !== m.key);
  cur.push({ key: m.key, shape: m.shape, purpose: m.purpose, decision: m.decision, ops: m.ops.map((o) => ({ op: o.op, atom: o.atom })), flow: m.flow });
  fs.mkdirSync(path.dirname(REG), { recursive: true });
  fs.writeFileSync(REG, JSON.stringify({ _: 'אינדקס-יכולות-מורכבות (insight): יכולת = תיאור-דאטה של הרכבה — אילו אטומים, איזה חיווט, לאיזו מטרה. נרשם בפקודה, לא בבנייה.', composites: cur }, null, 1) + '\n');
  return cur.length;
}
/** תובנת-סף על ישות ⇒ מסך אחד מורכב. live = { slug, field, op:'<'|'>', n } · entity = { name, fields[] } · name = מילות-הבעלים */
export function emitInsight({ slug, cls, name, live, entity, expect = null, seedSlug = null, words = null, decide = null }) {
  // decide = { name, file, proven, examples } — אטום-ההחלטה מהקטלוג, מוכח בהרצה (behavior-plan) על הדוגמאות של הבעלים; בלי החלטה מוכחת ⇒ ההשוואה נכתבת ביד ומדווחת
  const said = words || `${live.field} ${live.op} ${live.n}`;   // מילות-הבעלים («ציון מתחת ל-55»), לא סימן (RTL הופך «<»)
  const { k, dump } = makeConsts(slug);
  const imports = new Set(["import '../dart-ui-bs/ds/ds.dart';", "import '../dart-ui-bs/ds/ds_store.dart';"]);
  const ledger = [];
  const manifest = { key: `predicateOverSet·${live.op}`, shape: 'predicateOverSet', purpose: name, kind: KIND.shiur, source: { entity: entity.name, field: live.field, op: live.op, n: live.n }, ops: [], flow: [] };
  const prior = readComposites().find((c) => c.key === manifest.key) || null;   // יכולת רשומה עם אותה צורה ⇒ האטומים שלה מועמדים ראשונים (ועדיין נפסקים)
  manifest.prior = prior ? { ops: prior.ops } : null;
  // ── הנתונים המשותפים (חוק 23-ד: מחברים בהחלטה): כל האטומים קוראים מאותו br/rs ──
  const numOf = `(double.tryParse(r[${k(live.field)}] ?? '') ?? double.nan)`;
  const cond = decide && decide.name ? `${decide.name}(${numOf}, ${live.n})` : `${numOf} ${live.op} ${live.n}`;
  if (decide && decide.file) imports.add(`import '../${decide.file}';`);
  manifest.decision = decide ? { atom: decide.name, file: decide.file, proven: !!decide.proven, examples: decide.examples || [] } : { atom: null, why: 'אין אטום-החלטה מוכח ⇒ השוואה ביד (מדווח)' };
  const descField = entity.fields[0] || live.field;
  const pick = (op, need, ctx, purpose) => {
    const pk = searchOp(op, `${name} ${entity.name}`, null, 12);
    const first = prior ? prior.ops.filter((o) => o.op === op && o.atom).map((o) => o.atom) : [];
    const r = judge({ purpose: { kind: purpose || KIND.fact, need, text: `${op} · ${name}`, role: roleOf(op) }, cands: [...new Set([...first, ...pk.atoms, ...pk.alts, ...forgeCands(op, roleOf(op))])], widgetOf, skinWired, wire: (c) => wireForge(c, ctx, { widgetOf, wireAtom }) });
    ledger.push(ledgerLine(`${name} · ${op}`, r));
    manifest.ops.push({ op, need, atom: r.pick ? r.pick.cls : null, filled: r.pick ? r.pick.filled : [], rulings: r.rulings.map((x) => `${x.cls}: ${x.verdict} · ${x.move} — ${x.why}`) });
    if (r.pick) imports.add(impOf(r.pick));
    return r.pick;
  };
  const parts = [];
  const ctxFor = (op, value, label) => ({
    label: k(label || name), message: k(`${entity.name}: ${said}`), glyph: k(op === 'alert' ? '⚠️' : '🔔'), tone: 2,
    value: /^br\.length \/ rs\.length$/.test(value) ? { str: "'${br.length}/${rs.length}'", num: 'br.length.toDouble()' } : /\.length$/.test(value) ? { str: `${value}.toString()`, num: `${value}.toDouble()` } : { str: `${value}.toString()`, num: '0.0' },
    fraction: 'rs.isEmpty ? 0.0 : br.length / rs.length', sub: k(`${entity.name} · ${said}`),
    labels: [k(descField), k(live.field)], rows: `[for (final r in br) [r[${k(descField)}] ?? '', r[${k(live.field)}] ?? '']]`,
  });
  // רזולוציה רקורסיבית: פעולה ⇒ פסק; אין שורד ⇒ decompose[op] ⇒ תת-פעולות (עד maxDepth) ⇒ עובדות
  const resolve = (op, value, label, depth, cond) => {
    const w = pick(op, NEEDS[op] || ['label'], ctxFor(op, value, label));
    if (w) { parts.push({ cond, call: w.call }); manifest.flow.push(`${value} ⇒ ${op}(${w.cls})`); return true; }
    // «חוצבים ומרכיבים»: לפני שיורדים — מה יש בקטלוג-השברים של הזהב (quarry-golden ⇒ render-module) לפעולה הזאת. נרשם כחלופה (הצעה — נבנית רק בבקשה, כמו כל זהב), לא נבנה לבד
    try { const G = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'golden-fragments.json'), 'utf8')); const fr = (G.fragments || G).filter((f) => (f.ops || []).includes(op)); if (fr.length) { const byMod = {}; for (const f of fr) byMod[f.module] = (byMod[f.module] || 0) + 1; (manifest.alternatives ||= []).push({ op, goldenFragments: fr.length, modules: byMod, note: 'שברי-זהב (כהים, ליטרלים) — לבנייה דרך render-module בבקשה מפורשת' }); manifest.flow.push(`${op}: ${fr.length} שברי-זהב בקטלוג (${Object.keys(byMod).length} מודולים) — הצעה, לא נבנה`); } } catch { /* אין קטלוג ⇒ אין חלופה */ }
    const sub = D.decompose[op];
    if (!sub || depth >= D.maxDepth) return false;
    manifest.flow.push(`${op}: אין אטום ⇒ מפרקים ל-${sub.map((x) => x.op).join('+')}`);
    let any = false; for (const x of sub) any = resolve(x.op, x.value || value, x.label ? `${name} · ${x.label === 'part' ? said : entity.name}` : label, depth + 1, cond) || any;
    return any;
  };
  const NEEDS = { headline: ['label', 'value'], ratio: ['fraction'], alert: ['message'], table: ['labels', 'rows'], ring: ['value'], gauge: ['value'] };
  for (const res of D.predicateOverSet) {
    const opList = res.kind ? opsOfKind({ kind: res.kind }).map((o) => o.op) : [res.op];
    for (const op of opList) resolve(op, res.value, null, 0, res.result === 'any' || res.result === 'subset' ? 'br.isNotEmpty' : null);
  }
  const missing = manifest.ops.filter((o) => !o.atom).map((o) => o.op).filter((op, i, a) => a.indexOf(op) === i);
  const code = `// 🧩 חולל ע"י מנוע-ההרכבה (insight · הכרעת-בעלים 23.9) — תובנת-סף על נתונים אמיתיים: ${manifest.ops.filter((o) => o.atom).map((o) => o.op).join(' ⊕ ') || '—'}${missing.length ? ` · בלי אטום: ${missing.join(', ')}` : ''}. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
${[...imports].sort().join('\n')}
import 'package:flutter/material.dart';

class ${cls} extends StatelessWidget {
  const ${cls}({super.key});
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {
    final rs = appStore.records('${live.slug}');
    final br = rs.where((r) => ${cond}).toList()..sort((a, b) => ${live.op === '<' ? '' : '-'}((double.tryParse(a[${k(live.field)}] ?? '') ?? 0) - (double.tryParse(b[${k(live.field)}] ?? '') ?? 0)).sign.toInt());   // ההחלטה מניעה את הסדר: החורג ביותר ראשון (23-ד)
    return DsScaffold(title: ${k(name)}, subtitle: br.length.toString() + ' / ' + rs.length.toString() + ' ' + ${k(entity.name)}, icon: ${k('🔔')}, children: [
${parts.map((p) => `      ${p.cond ? `if (${p.cond}) ` : ''}Padding(padding: const EdgeInsets.only(bottom: 10), child: ${p.call}),`).join('\n')}
      if (br.isEmpty) Padding(padding: const EdgeInsets.only(top: 24), child: Center(child: Text(${k(`${entity.name}: 0 · ${said}`)}, style: TextStyle(color: DsLook.of(context).muted)))),
    ]);
  });
}
`;
  write(slug, code, dump());
  // אימות מול הייעוד (THE-WAY 6 · L110): מבחן-קבלה מהדוגמאות של הבעלים — המספר והחורגים חייבים להופיע על המסך. אין דוגמאות ⇒ אין מבחן (לא ממציאים)
  let accept = null;
  if (expect && seedSlug) {
    const texts = [String(expect.count), ...expect.rows.flat()].filter((t) => t && String(t).trim());
    manifest.accept = { count: expect.count, rows: expect.rows };
    accept = `// 🎯 מבחן-קבלה מול הייעוד (insight) — מהדוגמאות של הבעלים. חולל; אל תערוך.
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:buildsmart/genesis/dart-gen-bs/gen_${slug}.dart';
import 'package:buildsmart/genesis/dart-gen-bs/gen_${seedSlug}.dart';
void main() {
  testWidgets('ייעוד: ${name.replace(/'/g, '')} ⇒ ${expect.count} ${expect.rows.map((r) => r.join('/')).join(', ')}', (tester) async {
    seedExamples();
    await tester.pumpWidget(const MaterialApp(home: ${cls}()));
    await tester.pump();
${texts.map((t) => `    expect(find.textContaining('${String(t).replace(/'/g, "\\'")}'), findsWidgets, reason: 'הייעוד דורש «${String(t).replace(/'/g, '')}» על המסך');`).join('\n')}
  });
}
`;
    fs.writeFileSync(path.join(R.outDir(), `gen_${slug}_accept_test.dart`), accept);
  }
  fs.writeFileSync(path.join(R.outDir(), `insight_${slug}.json`), JSON.stringify(manifest, null, 1));
  return { cls, ops: manifest.ops.length, wired: manifest.ops.filter((o) => o.atom).length, missing, ledger, manifest, accept: !!accept };
}

// CLI: node machtzev/generator/insight.mjs --register <insight_*.json>   (רישום מפורש של יכולת מורכבת לאינדקס — הכרעת-בעלים, לא אוטומטי)
if (process.argv[1] && import.meta.url === 'file://' + process.argv[1] && process.argv.includes('--register')) {
  const f = process.argv[process.argv.indexOf('--register') + 1];
  console.log(`📇 נרשמו ${registerComposite(f)} יכולות מורכבות ⇒ ${REG}`);
}
