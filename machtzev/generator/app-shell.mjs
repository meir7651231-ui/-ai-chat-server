#!/usr/bin/env node
// 🧭 app-shell — ניווט-מקשרים (GENMAX·G26 · הכרעה-27): אפליקציה, לא רשימת-מסכים.
//   הניווט נגזר מצורת-הדאטה בלבד — גרף-הקשרים: הישות שהכי-הרבה ישויות מצביעות עליה = השורש (מרכז-הכובד);
//   הישויות-הבנות = חלקים בעמוד-השורש (רשימה מסוננת לפי הרשומה + הוספה עם מילוי-מראש); הדוח והשליחה = פעולות על רשומת-השורש;
//   לוח-הבקרה = הבית; כל שאר תוצרי-המנוע (חלקיקים · סקירה · כרטיס · מסך-אמת · מערכת) = מגירת "עוד" (הרכזת הישנה, ביט-זהה).
//   אפס מילון-דומייני: שמות מהספק, אטומים מחיפוש-פתוח (switch לסרגל · group לחלקים · fact(label+value) לעובדות · action לפעולות).
import { makeConsts, write } from './render-ds.mjs';
import { searchOp, wireAtom } from './particles.mjs';
import { L, T } from './chrome.mjs';

const clsOf = (slug) => 'Gen' + slug.replace(/(^|_)([a-z0-9])/g, (_, __, c) => c.toUpperCase()) + 'Screen';
const impOf = (w) => `import '../${w.file.startsWith('dart-') ? w.file : 'dart-ui-bs/' + w.file}';`;

// השורש = הישות עם הכי-הרבה מצביעים-נכנסים (backRefs); שוויון ⇒ הראשונה בספק. אין מצביעים ⇒ אין שלד (הרכזת נשארת).
export function pickRoot(entMeta, backRefs) {
  let best = null;
  for (const e of entMeta) { const n = (backRefs[e.name] || []).length; if (n > 0 && (!best || n > best.n)) best = { e, n }; }
  if (!best && entMeta.length === 1) return entMeta[0];   // G27 · ישות יחידה = השורש (אין מצביעים, אבל יש מרכז-כובד אחד)
  return best ? best.e : null;
}

// ── עמוד-השורש (רשומה אחת): עובדות · חלק-לכל-ישות-בת (רשומות + הוספה) · דוח · (השליחה בתוך הדוח) ──
export function renderRootPage(slug, { root, children, report, title }) {
  const { k, dump } = makeConsts(slug);
  const imports = new Set([`import 'gen_${root.slug}.dart';`]);
  const firstWired = (pick, ctx) => { for (const cand of [...pick.atoms, ...pick.alts]) { const w = wireAtom(cand.split('@')[0], ctx); if (w) { imports.add(impOf(w)); return { ...w, cand }; } } return null; };
  const goal = `${root.name} ${title}`;
  const notes = [];
  // עובדות: שדות-השורש (בלי מקוננים) — אטום label+value (חיפוש fact עם צורך label+value ⇒ שורת מפתח-ערך, לא שבב)
  const factFields = root.schema.filter((f) => !(f.members && f.members.length));
  // עובדה-בכרטיס = label+value בלי גליף (אריח-KPI דורש glyph ⇒ נפסל; נשאר שורת מפתח-ערך) — משפחת-stat, צלילה ל-12 חלופות
  const facts = factFields.map((f) => firstWired(searchOp('magnitude', goal, ['label', 'value'], 12), { label: k(f.label), value: { str: `(r0[${k(f.label)}] ?? '')`, num: `(num.tryParse(r0[${k(f.label)}] ?? '') ?? 0)` }, sub: k(''), tone: 0, must: ['value'] }));
  if (facts.some((w) => !w)) notes.push(L.rootNoFact);
  const factRows = factFields.map((f, i) => facts[i] ? `if ((r0[${k(f.label)}] ?? '').trim().isNotEmpty) ${facts[i].call}` : null).filter(Boolean);
  const sectionOf = (label, children) => { const g = firstWired(searchOp('group', goal), { label, children, sub: label, tone: 0 }); return g ? (/children:/.test(g.call) ? g.call : `Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [${g.call}, ${children.join(', ')}])`) : `Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [${children.join(', ')}])`; };
  const blocks = [];
  if (factRows.length) blocks.push(sectionOf(k(L.rootFacts), factRows));
  for (const c of children) {
    imports.add(`import 'gen_${c.slug}.dart';`);
    const recs = `appStore.referencing('${c.slug}', ${k(c.link)}, id)`;
    const disp = c.descField ? `(r[${k(c.descField)}] ?? '')` : `appStore.displayOf('${c.slug}', r[AppStore.idKey] ?? '')`;
    const sub = c.subField ? `(r[${k(c.subField)}] ?? '')` : `''`;
    const open = `() => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${c.cls}(scopeField: ${k(c.link)}, scopeId: id)))`;
    const add = firstWired(searchOp('action', `${c.name} ${goal}`), { label: k(T('rootAdd', { ent: c.name })), nav: open, glyph: k('➕') });
    if (!add) notes.push(`${c.name}: ${L.rootNoAction}`);
    const rows = `for (final r in ${recs}) DsNavTile(glyph: ${k(c.icon || '🗂️')}, title: ${disp}, sub: ${sub}, onTap: ${open})`;
    blocks.push(sectionOf(`${k(c.name)} + ' · ' + ${recs}.length.toString()`, [rows, ...(add ? [add.call] : [])]));
  }
  if (report) {
    imports.add(`import 'gen_${report.slug}.dart';`);
    const rep = firstWired(searchOp('action', `${L.rootReport} ${goal}`), { label: k(L.rootReport), nav: `() => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${report.cls}(initialId: id)))`, glyph: k('📄') });
    if (rep) blocks.push(rep.call); else notes.push(`${L.rootReport}: ${L.rootNoAction}`);
  }
  const stageSub = root.stages && root.stages.length ? `const [${root.stages.map((s) => k(s)).join(', ')}][appStore.stageOf('${root.slug}', id).clamp(0, ${root.stages.length - 1})]` : k(root.name);
  const cls = clsOf(slug);
  const code = `// 🧭 חולל ע"י ניווט-מקשרים (app-shell · G26 · הכרעה-27) — עמוד-השורש: עובדות · ישויות-בנות (מסוננות לרשומה) · דוח. אל תערוך ידנית.
${notes.map((n) => '//   ⚪ ' + n).join('\n')}
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
${[...imports].sort().join('\n')}
import 'package:flutter/material.dart';

class ${cls} extends StatelessWidget {
  const ${cls}({required this.id, super.key});
  final String id;
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {
    final r0 = appStore.byId('${root.slug}', id);
    if (r0 == null) return DsScaffold(title: ${k(root.name)}, subtitle: ${k(L.rootMissing)}, icon: ${k('🗂️')}, children: const []);
    return DsScaffold(title: appStore.displayOf('${root.slug}', id), subtitle: ${stageSub}, icon: ${k(root.icon || '🗂️')}, children: [
${blocks.map((b) => `      Padding(padding: const EdgeInsets.only(bottom: 12), child: ${b}),`).join('\n')}
    ]);
  });
}
`;
  write(slug, code, dump());
  return { slug, cls, notes };
}

// ── השלד: סרגל-תחתון (בית · שורש · עוד) על IndexedStack — כל לשונית מסך שלם ──
export function renderShell(slug, { title, root, rootPage, dashboard, hub }) {
  const { k, dump } = makeConsts(slug);
  const imports = new Set([`import 'gen_${hub.slug}.dart';`, `import 'gen_${root.slug}.dart';`, `import 'gen_${rootPage.slug}.dart';`]);
  if (dashboard) imports.add(`import 'gen_${dashboard.slug}.dart';`);
  const firstWired = (pick, ctx) => { for (const cand of [...pick.atoms, ...pick.alts]) { const w = wireAtom(cand.split('@')[0], ctx); if (w) { imports.add(impOf(w)); return { ...w, cand }; } } return null; };
  const notes = [];
  const labels = [dashboard ? L.shellHome : null, root.name, L.shellMore].filter(Boolean);
  const nav = firstWired(searchOp('switch', `${title} ${labels.join(' ')}`), { items: `[${labels.map((l) => k(l)).join(', ')}]`, selected: '_t', onSelect: '(i) => setState(() => _t = i)', label: k(title) });
  if (!nav) notes.push(L.shellNoNav);
  const add = firstWired(searchOp('action', `${root.name} ${title}`), { label: k(T('rootAdd', { ent: root.name })), nav: `() => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${root.cls}()))`, glyph: k('➕') });
  const disp = root.descField ? `(r[${k(root.descField)}] ?? '')` : `appStore.displayOf('${root.slug}', r[AppStore.idKey] ?? '')`;
  const sub = root.subField ? `(r[${k(root.subField)}] ?? '')` : `''`;
  const tabs = [dashboard ? `const ${dashboard.cls}()` : null, `_RootTab()`, `const ${hub.cls}()`].filter(Boolean);
  const cls = clsOf(slug);
  const code = `// 🧭 חולל ע"י ניווט-מקשרים (app-shell · G26 · הכרעה-27) — השלד: סרגל-תחתון בית · ${root.name} · עוד. השורש נגזר מגרף-הקשרים. אל תערוך ידנית.
${notes.map((n) => '//   ⚪ ' + n).join('\n')}
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
${[...imports].sort().join('\n')}
import 'package:flutter/material.dart';

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  int _t = 0;
  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: DsTokens.bg,
    body: IndexedStack(index: _t.clamp(0, ${tabs.length - 1}), children: [${tabs.join(', ')}]),
    bottomNavigationBar: ${nav ? `SafeArea(child: Padding(padding: const EdgeInsets.fromLTRB(12, 6, 12, 10), child: Center(heightFactor: 1.0, child: ${nav.call})))` : 'null'},   // heightFactor: Center ללא-גובה מתפשט לכל הגובה שה-Scaffold מציע ⇒ הגוף נעלם
  );
}

class _RootTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {
    final rs = appStore.records('${root.slug}');
    return DsScaffold(title: ${k(root.name)}, subtitle: rs.length.toString() + ' ' + ${k(root.name)}, icon: ${k(root.icon || '🗂️')}, children: [
      ${add ? `Padding(padding: const EdgeInsets.only(bottom: 10), child: ${add.call}),` : ''}
      for (final r in rs) DsNavTile(glyph: ${k(root.icon || '🗂️')}, title: ${disp}, sub: ${sub}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${rootPage.cls}(id: r[AppStore.idKey] ?? '')))),
    ]);
  });
}
`;
  write(slug, code, dump());
  return { slug, cls, notes, nav: nav ? nav.cand : null };
}
