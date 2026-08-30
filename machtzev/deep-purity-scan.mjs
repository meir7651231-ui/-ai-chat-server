#!/usr/bin/env node
/** 🔬 מחצב · סורק-טוהר-עומק (הכרעה 19: גם קבועים ושמות-דומיין הם דאטה).
 *  סורק כל אטום-מנגנון ב-new/atoms ומסווג הפרות:
 *    heb    — ליטרל-עברי בקוד (דאטה-תצוגה במנגנון)
 *    table  — טבלה/מערך/אובייקט קבוע בגוף (דאטת-דומיין מוטמעת, כמו ['pickup',...])
 *    domstr — מחרוזת-דומיין לטינית (שמות, קידומות, כתובות — 'maor_...', '972', 'wa.me')
 *    magic  — מספר-קסם (קבוע-דומיין מספרי; 0/1/2/־1 מבניים מוחרגים)
 *  אטום-דאטה טהור (צורת-דאטה) אינו הפרה — הוא הבית הנכון של דאטה.
 *  פלט: machtzev/emit/DEEP-PURITY-FINDINGS.md ממוין לפי חומרה + סיכום למסוף. */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = new URL('../', import.meta.url).pathname;
const DIRS = ['new/atoms', 'new/boxes'];
const HEB = /[֐-׿]/;
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
// צורת-דאטה: הכרזת-ליטרל ברמת-המודול בלבד (עמודה 0) — const מוזח בתוך פונקציה איננו אטום-דאטה
const isPureData = (code) => {
  // בדיקת-הצורה על שלד-הקוד — תוכן-מחרוזות ממוסך ("for"/"if" בתוך ערך אינם זרימת-בקרה)
  const skel = code.replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, '""');
  return (/^export\s+(?:const\s+\w+\s*=\s*(?:[\[{]|-?\d|['"])|function\s+\w+\s*\(\)\s*\{\s*return\s+[\[{])/m.test(skel) ||
    /^const\s+\w+\s*=\s*[\[{]/m.test(skel)) &&
  !/\b(if|for|while|switch)\b/.test(skel) && !/=>(?!\s*[\[{('"`0-9])/.test(skel) &&
  !/^(?:export\s+)?(?:const\s+\w+\s*=\s*(?:async\s*)?\(|function\s+\w+\s*\([^)])/m.test(skel);
};
// ── ליבת-הסריקה v2: AST-אמת (typescript) — אותו לקסר של מנוע-הטיהור, אפס-רגקס-על-קוד ──
import { createRequire } from 'node:module';
const _req = createRequire('/home/user/maor-system/');
const _ts = _req('typescript');
const findings = [];
const staticLit = (n) => {
  if (!n) return false;
  if (_ts.isStringLiteral(n) || _ts.isNumericLiteral(n) || n.kind === _ts.SyntaxKind.TrueKeyword || n.kind === _ts.SyntaxKind.FalseKeyword || n.kind === _ts.SyntaxKind.NullKeyword) return true;
  if (_ts.isPrefixUnaryExpression(n) && n.operator === _ts.SyntaxKind.MinusToken) return staticLit(n.operand);
  if (_ts.isArrayLiteralExpression(n)) return n.elements.every(staticLit);
  if (_ts.isObjectLiteralExpression(n)) return n.properties.every(pp => _ts.isPropertyAssignment(pp) && (_ts.isIdentifier(pp.name) || _ts.isStringLiteral(pp.name)) && staticLit(pp.initializer));
  return false;
};
for (const dir of DIRS) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs)) {
    if (!f.endsWith('.mjs') || f.endsWith('.test.mjs')) continue;
    const raw = fs.readFileSync(path.join(abs, f), 'utf8');
    const code = strip(raw);
    if (isPureData(code)) continue;
    const sf = _ts.createSourceFile('x.mjs', raw, _ts.ScriptTarget.ES2022, true);
    const cats = { heb: [], table: [], domstr: [], magic: [] };
    const rawLines = raw.split('\n');
    const lineOf = (pos) => raw.slice(0, pos).split('\n').length - 1;
    let exempt6 = 0;
    const isLaw6 = (pos) => {
      const ln = lineOf(pos);
      for (let q = Math.max(0, ln - 2); q <= ln; q++) if (rawLines[q] && (rawLines[q].includes('חוק-6') || rawLines[q].includes('פרוטוקול-חיצוני'))) { exempt6++; return true; }
      return false;
    };
    const seen = (arr, v, cap) => { if (arr.length < cap) arr.push(String(v).slice(0, 30)); };
    const consider = (text, pos) => {
      if (pos !== undefined && isLaw6(pos)) return;
      if (HEB.test(text)) { seen(cats.heb, text, 4); return; }
      if (/[a-zA-Z]{3,}/.test(text)) seen(cats.domstr, text, 4);
    };
    const walk = (n) => {
      if (_ts.isImportDeclaration(n) || _ts.isExportDeclaration(n)) return;
      if (_ts.isStringLiteral(n)) { consider(n.text, n.getStart(sf)); return; }
      if (n.kind === _ts.SyntaxKind.NoSubstitutionTemplateLiteral) { consider(n.text, n.getStart(sf)); return; }
      if (_ts.isTemplateExpression(n)) {
        consider(n.head.text, n.getStart(sf));
        for (const sp of n.templateSpans) { walk(sp.expression); consider(sp.literal.text, sp.literal.getStart(sf)); }
        return;
      }
      if (_ts.isVariableStatement(n) && n.parent === sf) {
        for (const d of n.declarationList.declarations)
          if (d.initializer && (_ts.isArrayLiteralExpression(d.initializer) || _ts.isObjectLiteralExpression(d.initializer)) && staticLit(d.initializer)
              && (d.initializer.elements?.length || d.initializer.properties?.length)) {   // ליטרל-ריק {}/[] = אפס-דאטה, לא טבלה
            const isExp = (n.modifiers || []).some(m => m.kind === _ts.SyntaxKind.ExportKeyword);
            if (!isExp) seen(cats.table, raw.slice(d.getStart(sf), Math.min(d.getStart(sf) + 44, d.end)).replace(/\s+/g, ' '), 3);
          }
        _ts.forEachChild(n, walk);
        return;
      }
      if (_ts.isNumericLiteral(n)) {
        const val = parseFloat(n.text);
        if (val >= 10 && !/^0[xbo]/i.test(n.text) && !(Number.isInteger(val) && (val & (val - 1)) === 0)) {
          const p2 = n.parent;
          const bitwise = p2 && _ts.isBinaryExpression(p2) && /[&|^]|<<|>>/.test(p2.operatorToken.getText(sf));
          if (!bitwise && !isLaw6(n.getStart(sf))) seen(cats.magic, n.text, 6);
        }
        return;
      }
      _ts.forEachChild(n, walk);
    };
    walk(sf);
    const score = cats.heb.length * 4 + cats.table.length * 3 + cats.domstr.length * 2 + cats.magic.length;
    if (score > 0) findings.push({ f: path.join(dir, f), score, cats });
  }
}
findings.sort((a, b) => b.score - a.score);
const BASELINE = path.join(ROOT, 'machtzev/deep-purity-baseline.json');
const arg = process.argv[2] || '--report';
if (arg === '--baseline') {
  fs.writeFileSync(BASELINE, JSON.stringify(findings.map(x => x.f).sort(), null, 0));
  console.log(`baseline טוהר-עומק נכתב: ${findings.length} אטומים (חוב-מנוהל).`);
} else if (arg === '--gate') {
  const base = fs.existsSync(BASELINE) ? new Set(JSON.parse(fs.readFileSync(BASELINE, 'utf8'))) : new Set();
  const fresh = findings.filter(x => !base.has(x.f));
  if (fresh.length) {
    console.error(`✗ שער-טוהר-עומק: ${fresh.length} אטומים חדשים עם דאטה-במנגנון (הכרעה 19 — קבועים ושמות-דומיין = דאטה):`);
    fresh.slice(0, 20).forEach(x => console.error(`   + ${x.f} (ציון ${x.score})`));
    console.error('   פרק לפי תבנית-הלוח: מנגנון-עיוור + אטום-דאטה + חיווט-בקופסה (heb-cal-box).');
    process.exit(1);
  }
  console.log(`✓ שער-טוהר-עומק: אפס זיהום-חדש · חוב-מנוהל ${findings.length}/${base.size} (רק יורד — הכרעה 19)`);
} else { // --report
  const lines = ['# 🔬 ממצאי טוהר-עומק (הכרעה 19) — דאטה בתוך מנגנון', '',
    `נסרקו אטומי-מנגנון ב-${DIRS.join(' · ')} · הפרות: ${findings.length}`, '',
    '| אטום | ציון | עברית | טבלאות | מחרוזות-דומיין | מספרי-קסם |', '|---|---|---|---|---|---|'];
  for (const x of findings) lines.push(`| ${x.f} | ${x.score} | ${x.cats.heb.join(' · ') || '—'} | ${x.cats.table.join(' · ') || '—'} | ${x.cats.domstr.join(' · ') || '—'} | ${x.cats.magic.join(' ') || '—'} |`);
  fs.mkdirSync(path.join(ROOT, 'machtzev/emit'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'machtzev/emit/DEEP-PURITY-FINDINGS.md'), lines.join('\n') + '\n');
  const t = { heb: 0, table: 0, domstr: 0, magic: 0 };
  for (const x of findings) for (const k in t) if (x.cats[k].length) t[k]++;
  console.log(`🔬 טוהר-עומק: ${findings.length} אטומים עם דאטה-במנגנון · עברית:${t.heb} · טבלאות:${t.table} · דומיין:${t.domstr} · קסם:${t.magic}`);
  console.log('   הדוח: machtzev/emit/DEEP-PURITY-FINDINGS.md');
}
