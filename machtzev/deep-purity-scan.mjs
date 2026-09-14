#!/usr/bin/env node
/** 🔬 מחצב · סורק-טוהר-עומק (הכרעה 19: גם קבועים ושמות-דומיין הם דאטה).
 *  סורק כל אטום-מנגנון ב-new/atoms ומסווג הפרות:
 *    heb    — ליטרל-עברי בקוד (דאטה-תצוגה במנגנון)
 *    table  — טבלה/מערך/אובייקט קבוע בגוף (דאטת-דומיין מוטמעת, כמו ['pickup',...])
 *    domstr — מחרוזת-דומיין לטינית (שמות, קידומות, כתובות — 'maor_...', '972', 'wa.me')
 *    magic  — מספר-קסם (קבוע-דומיין מספרי; 0/1/2/־1 מבניים מוחרגים)
 *  אטום-דאטה טהור (צורת-דאטה) אינו הפרה — הוא הבית הנכון של דאטה.
 *  הצהרות-מטרה מחריגות ליטרל (המנוע מביא את המטרה — "purpose-first"):
 *    'חוק-6'/'פרוטוקול-חיצוני' — זהות/סוד/פרוטוקול-דפדפן-או-רשת · 'קבוע-מתמטי' — קבוע מתמטי/יחידת-זמן/מבני/ברירת-מחדל-אלגוריתם (לא נתון-לקוח; ההתאמה האמיתית עוברת דרך שקע-מוזרק).
 *  פלט: machtzev/emit/DEEP-PURITY-FINDINGS.md ממוין לפי חומרה + סיכום למסוף. */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = R.ROOT;
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
import { requireTs } from './lib-ts.mjs';
import * as R from './root.mjs';
const _ts = requireTs();
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
      for (let q = Math.max(0, ln - 2); q <= ln; q++) if (rawLines[q] && (rawLines[q].includes('חוק-6') || rawLines[q].includes('פרוטוקול-חיצוני') || rawLines[q].includes('קבוע-מתמטי'))) { exempt6++; return true; }
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
        if (val >= 10 && !/^0[xbo]/i.test(n.getText(sf)) && !(Number.isInteger(val) && (val & (val - 1)) === 0)) {   // getText: הטקסט-המקורי (n.text מנורמל לעשרוני ⇒ מפספס hex)
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

// ══ גלאי-סיכוני-נכונות (הכרעת-בעלים 14.9) ═══════════════════════════════════
// השער שאל עד כה «האם האטום נקי?» בלבד. הוא לא שאל «האם המקור נכון?» —
// ולכן אטום שחוצב verbatim מקוד שבולע תעודת-זהות עבר כתקין, עם חוזה וזהב.
// הגלאים והמסננים הועתקו כלשונם מ-gen-max (deepFindings); הם נולדו מ-false-positive
// שנתפס בהרצה, ובלעדיהם השער צועק זאב: קבועי-לוח היו נחשבים מדיניות.
const DEEP_CRIT = /(^|[^a-z])id$|idnum|^hok$|extid|^rid|passw|iban|acct|amount|seq|dek|token/i;
const DEEP_CAL = new Set(['7', '10', '12', '24', '30', '31', '42', '52', '60', '90', '100', '180', '360', '365', '366', '1000', '3600']);
function deepFindings(dbody) {
  const out = [];
  const seenCo = new Set();
  for (const m of dbody.matchAll(/(\w+)\.(\w+)\s*(\|\||\?\?)\s*(\w+)\.(\w+)/g)) {
    const [, o1, f1, op, o2, f2] = m;
    if (o1 !== o2 && f1 === f2 && !seenCo.has(f1)) {
      seenCo.add(f1); const crit = DEEP_CRIT.test(f1);
      out.push({ sev: crit ? 3 : 1, kind: 'בליעה-שקטה', snippet: m[0], text: `'${f1}' מאוחד ${o1}.${f1} ${op} ${o2}.${f1} — אם שונים, אחד אובד בשקט${crit ? ' (קריטי — זהות/כסף!)' : ''}` });
    }
  }
  const seenLit = new Set();
  for (const m of dbody.matchAll(/(?:[<>]=?|===?|!==?)\s*(\d{2,})|(\d{2,})\s*(?:[<>]=?|===?|!==?)/g)) {
    const lit = m[1] || m[2];
    if (+lit >= 3 && !DEEP_CAL.has(lit) && !seenLit.has(lit)) { seenLit.add(lit); out.push({ sev: 1, kind: 'קבוע-קסם', snippet: m[0], text: `'${lit}' מקובע בהשוואה — מועמד למדיניות/הגדרה` }); }
  }
  const seqM = dbody.match(/\b(?:seq|serial|counter|receiptseq|donationseq|shopreceiptseq)\w*\+\+/i);
  if (seqM) out.push({ sev: 3, kind: 'רצף-מונה', snippet: seqM[0], text: 'מונה (seq++) בונה מזהה — רציפות קבלות-מס; אין הוכחת-רצף בגוף' });
  const moneyM = dbody.match(/reduce\([^\n]*\+[^\n]*\.(?:amount|ils|usd|price)\b/i) || dbody.match(/\.(?:amount|price)\s*[+*]/i);
  if (moneyM) out.push({ sev: 1, kind: 'חשבון-כסף-בצפים', snippet: moneyM[0], text: 'סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות)' });
  const utcM = dbody.match(/new Date\(\)\.toISOString\(\)\.slice\(0,\s*10\)/);
  if (utcM) out.push({ sev: 3, kind: 'תאריך-UTC', snippet: utcM[0], text: 'תאריך-מקומי דרך UTC — סביב חצות יוצא יום שגוי; isoToday() (באג-מתועד)' });
  if (/JSON\.parse\(/.test(dbody) && /(getItem|sessionStorage|localStorage|\.text\(\)|clipboard|atob|response|readText)/.test(dbody) && !/\btry\b/.test(dbody))
    out.push({ sev: 2, kind: 'JSON.parse-לא-מוגן', snippet: 'JSON.parse(', text: 'JSON.parse של נתון-חיצוני בלי try — נתון-פגום מפיל את הפונקציה' });
  return out;
}
// סריקת-נכונות על **כל** המדפים (גם Dart — הבליעה נסעה עם הפורט).
const CORR_DIRS = ['new/atoms', 'new/boxes', 'new/dart-maor', 'new/dart'];
const corr = [];
const walkAll = (d) => { let o = []; if (!fs.existsSync(d)) return o;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) { const q = path.join(d, e.name);
    if (e.isDirectory()) o = o.concat(walkAll(q));
    else if (/\.(mjs|dart)$/.test(e.name) && !/[._]test\.(mjs|dart)$/.test(e.name)) o.push(q); } return o; };
for (const dir of CORR_DIRS) for (const abs of walkAll(path.join(ROOT, dir))) {
  const rel = path.relative(ROOT, abs);
  for (const x of deepFindings(fs.readFileSync(abs, 'utf8'))) corr.push({ f: rel, ...x, key: `${rel}::${x.kind}::${x.snippet}` });
}
const corrCrit = corr.filter((x) => x.sev === 3);

findings.sort((a, b) => b.score - a.score);
const BASELINE = path.join(ROOT, 'machtzev/deep-purity-baseline.json');
const arg = process.argv[2] || '--report';
// הבסיס נושא שתי רשימות. מערך-ישן נקרא כטוהר-בלבד (תאימות-לאחור).
const readBase = () => { if (!fs.existsSync(BASELINE)) return { purity: [], correctness: [] };
  const j = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  return Array.isArray(j) ? { purity: j, correctness: [] } : { purity: j.purity || [], correctness: j.correctness || [] }; };
if (arg === '--baseline') {
  fs.writeFileSync(BASELINE, JSON.stringify({ purity: findings.map(x => x.f).sort(), correctness: corrCrit.map(x => x.key).sort() }, null, 1));
  console.log(`baseline נכתב: טוהר ${findings.length} · נכונות-קריטית ${corrCrit.length} (חוב-מנוהל, רק יורד).`);
} else if (arg === '--gate') {
  const b = readBase();
  const base = new Set(b.purity), baseC = new Set(b.correctness);
  const freshC = corrCrit.filter(x => !baseC.has(x.key));
  if (freshC.length) {
    console.error(`✗ שער-נכונות: ${freshC.length} סיכוני-נכונות חדשים (זהות/כסף/רצף/תאריך):`);
    freshC.slice(0, 20).forEach(x => console.error(`   🔴 ${x.f} · ${x.kind} · ${x.snippet}`));
    console.error('   verbatim מהמקור אינו הוכחת-נכונות: אטום מוכח יכול לשאת באג-מקור.');
    process.exit(1);
  }
  const fresh = findings.filter(x => !base.has(x.f));
  if (fresh.length) {
    console.error(`✗ שער-טוהר-עומק: ${fresh.length} אטומים חדשים עם דאטה-במנגנון (הכרעה 19 — קבועים ושמות-דומיין = דאטה):`);
    fresh.slice(0, 20).forEach(x => console.error(`   + ${x.f} (ציון ${x.score})`));
    console.error('   פרק לפי תבנית-הלוח: מנגנון-עיוור + אטום-דאטה + חיווט-בקופסה (heb-cal-box).');
    process.exit(1);
  }
  console.log(`✓ שער-טוהר-עומק: אפס זיהום-חדש · חוב-מנוהל ${findings.length}/${base.size} (רק יורד — הכרעה 19)`);
  console.log(`✓ שער-נכונות: אפס סיכון-קריטי חדש · חוב ${corrCrit.length}/${baseC.size} · ממצאים נוספים ${corr.length - corrCrit.length} (דיווח)`);
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
  const cl = ['# 🩺 ממצאי-נכונות — האם המקור נכון (לא רק נקי)', '',
    `נסרקו ${CORR_DIRS.join(' · ')} · ממצאים: ${corr.length} · 🔴 קריטיים: ${corrCrit.length}`, '',
    '| חומרה | קובץ | סוג | קטע | הסבר |', '|---|---|---|---|---|'];
  for (const x of [...corr].sort((a, b) => b.sev - a.sev))
    cl.push(`| ${x.sev === 3 ? '🔴' : x.sev === 2 ? '🟠' : '🟡'} | ${x.f} | ${x.kind} | \`${x.snippet}\` | ${x.text} |`);
  fs.writeFileSync(path.join(ROOT, 'machtzev/emit/CORRECTNESS-FINDINGS.md'), cl.join('\n') + '\n');
  const ck = {}; for (const x of corr) ck[x.kind] = (ck[x.kind] || 0) + 1;
  console.log(`🩺 נכונות: ${corr.length} ממצאים · 🔴 ${corrCrit.length} · ` + Object.entries(ck).map(([k, v]) => `${k}:${v}`).join(' · '));
  console.log('   הדוח: machtzev/emit/CORRECTNESS-FINDINGS.md');
}
