// 🧩 insight — מנוע-הרכבה לתצוגה (הכרעת-בעלים 23.9 «יש את כל המנועים? ⇒ כן, חסר החיבור ⇒ תחבר»).
//   חוק 23-ב/ג/ד + הכרעה 23-ג («מד-ניטור = מד + בדיקת-סף + כרזה + סטטוס»): תובנה ⇒ פעולות-יסוד ⇒ אטום לכל פעולה (הישיבה פוסקת) ⇒
//   חיווט **מהנתונים האמיתיים** (appStore) לתוך מסך אחד ⇒ מניפסט-הרכבה כדאטה (PURPOSE §3). אפס סליידר, אפס ערך-מומצא.
//   הצורה: «<שדה> <יחס> <מספר>» על ישות ⇒ פעולות: headline (כמה חורגים) · ratio (חלק מהכלל) · alert (כשיש) · table (מי חורג).
//   פעולה בלי אטום-שורד ⇒ נרשמת «אין» במניפסט והמסך מורכב מהשאר — לא מומצא, לא מוסתר.
import fs from 'node:fs';
import path from 'node:path';
import { searchOp, wireAtom } from './particles.mjs';
import { makeConsts, write } from './render-ds.mjs';
import { buildAtlas } from './atlas.mjs';
import { isPaper, skinWired } from './look.mjs';
import { judge, ledgerLine, KIND } from '../../yeshiva/atom-psak.mjs';
import * as R from '../root.mjs';

let ATL = null; const widgetOf = (cls) => ((ATL ||= buildAtlas({ forge: isPaper() })).widgets.find((w) => w.cls === cls) || null);
const impOf = (w) => `import '../${w.file.startsWith('dart-') ? w.file : 'dart-ui-bs/' + w.file}';`;

/** תובנת-סף על ישות ⇒ מסך אחד מורכב. live = { slug, field, op:'<'|'>', n } · entity = { name, fields[] } · name = מילות-הבעלים */
export function emitInsight({ slug, cls, name, live, entity }) {
  const { k, dump } = makeConsts(slug);
  const imports = new Set(["import '../dart-ui-bs/ds/ds.dart';", "import '../dart-ui-bs/ds/ds_store.dart';"]);
  const ledger = [];
  const manifest = { purpose: name, kind: KIND.shiur, source: { entity: entity.name, field: live.field, op: live.op, n: live.n }, ops: [], flow: [] };
  // ── הנתונים המשותפים (חוק 23-ד: מחברים בהחלטה): כל האטומים קוראים מאותו br/rs ──
  const cond = `(double.tryParse(r[${k(live.field)}] ?? '') ?? double.nan) ${live.op} ${live.n}`;
  const descField = entity.fields[0] || live.field;
  const pick = (op, need, ctx, purpose) => {
    const pk = searchOp(op, `${name} ${entity.name}`, null, 12);
    const r = judge({ purpose: { kind: purpose || KIND.fact, need, text: `${op} · ${name}` }, cands: [...pk.atoms, ...pk.alts], widgetOf, skinWired, wire: (c) => wireAtom(c, ctx) });
    ledger.push(ledgerLine(`${name} · ${op}`, r));
    manifest.ops.push({ op, need, atom: r.pick ? r.pick.cls : null, filled: r.pick ? r.pick.filled : [], rulings: r.rulings.map((x) => `${x.cls}: ${x.verdict} · ${x.move} — ${x.why}`) });
    if (r.pick) imports.add(impOf(r.pick));
    return r.pick;
  };
  const parts = [];
  // 1 · כמה חורגים (headline): label+value ⇐ br.length
  const head = pick('headline', ['label', 'value'], { label: k(name), value: { str: 'br.length.toString()', num: 'br.length.toDouble()' }, sub: k(`${entity.name} · ${live.field} ${live.op} ${live.n}`), glyph: k('🔔') });
  if (head) { parts.push({ call: head.call }); manifest.flow.push('br.length ⇒ headline.value'); }
  // 2 · חלק מהכלל (ratio): fraction ⇐ br/rs
  const ratio = pick('ratio', ['fraction'], { label: k(name), value: { str: "'${br.length}/${rs.length}'", num: 'br.length.toDouble()' }, fraction: 'rs.isEmpty ? 0.0 : br.length / rs.length', sub: k(entity.name), glyph: k('📊') });
  if (ratio) { parts.push({ call: ratio.call }); manifest.flow.push('br.length / rs.length ⇒ ratio.fraction'); }
  // 3 · כרזה כשיש חורגים (alert): message ⇐ מילות-הבעלים; מוצג רק כש-br לא ריק
  const alert = pick('alert', ['message'], { message: k(`${entity.name}: ${live.field} ${live.op} ${live.n}`), label: k(name), sub: k(`${live.field} ${live.op} ${live.n}`), tone: 2, glyph: k('⚠️') });   // הכרזה = מילות-הבעלים בלבד
  if (alert) { parts.push({ cond: 'br.isNotEmpty', call: alert.call }); manifest.flow.push('br.isNotEmpty ⇒ alert'); }
  // 4 · מי חורג (table): labels ⇐ [שדה-שם, שדה-הסף] · rows ⇐ br
  const table = pick('table', ['labels', 'rows'], { labels: [k(descField), k(live.field)], rows: `[for (final r in br) [r[${k(descField)}] ?? '', r[${k(live.field)}] ?? '']]`, label: k(name) });
  if (table) { parts.push({ cond: 'br.isNotEmpty', call: table.call }); manifest.flow.push('br ⇒ table.rows'); }
  const missing = manifest.ops.filter((o) => !o.atom).map((o) => o.op);
  const code = `// 🧩 חולל ע"י מנוע-ההרכבה (insight · הכרעת-בעלים 23.9) — תובנת-סף על נתונים אמיתיים: ${manifest.ops.filter((o) => o.atom).map((o) => o.op).join(' ⊕ ') || '—'}${missing.length ? ` · בלי אטום: ${missing.join(', ')}` : ''}. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
${[...imports].sort().join('\n')}
import 'package:flutter/material.dart';

class ${cls} extends StatelessWidget {
  const ${cls}({super.key});
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {
    final rs = appStore.records('${live.slug}');
    final br = rs.where((r) => ${cond}).toList();
    return DsScaffold(title: ${k(name)}, subtitle: br.length.toString() + ' / ' + rs.length.toString() + ' ' + ${k(entity.name)}, icon: ${k('🔔')}, children: [
${parts.map((p) => `      ${p.cond ? `if (${p.cond}) ` : ''}Padding(padding: const EdgeInsets.only(bottom: 10), child: ${p.call}),`).join('\n')}
      if (br.isEmpty) Padding(padding: const EdgeInsets.only(top: 24), child: Center(child: Text(${k(`${entity.name}: 0 ${live.field} ${live.op} ${live.n}`)}, style: TextStyle(color: DsLook.of(context).muted)))),
    ]);
  });
}
`;
  write(slug, code, dump());
  fs.writeFileSync(path.join(R.outDir(), `insight_${slug}.json`), JSON.stringify(manifest, null, 1));
  return { cls, ops: manifest.ops.length, wired: manifest.ops.filter((o) => o.atom).length, missing, ledger, manifest };
}
