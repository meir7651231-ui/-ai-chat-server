#!/usr/bin/env node
// 🧩 compose-engine — קומפוזר דטרמיניסטי (הכרעה 23-ג · §20-ד "נגזר מצורת-הדאטה בלבד, אפס-LLM").
// קלט: חלקיק עם צורת-דאטה (formula). פלט: פעולות-הצגה → אטום-אמיתי-הכי-טוב-לייעוד → הרכבה.
// המנוע לא יכול לסטות: הוא בורר רק מהפלטה-האמיתית (מזייפים חסומים), לפי סוג-הפעולה שנגזר מהנוסחה.
// מקור: LAW.md 23-ג · knowledge/ATOMS-DATA-BEARING-2026-09-03.md · schoolos.dart (דוגמת-הזהב).

// ── טבלת-הברירה: סוג-פעולת-הצגה → אטום-אמיתי הכי-טוב-לייעוד (selectAtom) ──
// כל ערך מאומת נושא-ערך (file:line של שקע-הדאטה). מזייפים לא נכנסים לטבלה.
const ATOM = {
  magnitude: { atom: 'BareStat',   seam: 'bare_stat.dart:6 required this.value' },     // ערך+תווית inline
  headline:  { atom: 'KpiTile',    seam: 'premium/dataviz/kpi_tile.dart value/label' }, // מדד-כותרת
  hero:      { atom: 'stat_hero',  seam: 'premium/surfaces/stat_hero.dart:5 required this.value' }, // מספר-ענק
  ratio:     { atom: 'StatRow',    seam: 'premium/lists/stat_row.dart:11-13 value+fraction' },       // חלק-מתוך-שלם + בר
  compare:   { atom: 'NeonBars',   seam: 'premium/dataviz/neon_bars.dart:5 labels+values' },         // גדלים זה-מול-זה
  diff:      { atom: 'BareStat',   seam: 'bare_stat.dart:6 (inkColor לפי-סימן)' },       // הפרש חתום
  fact:      { atom: 'StatusChip', seam: 'premium/feedback/status_chip.dart:7 required this.label' },// עובדה תווית+ערך
  group:     { atom: 'DsSection',  seam: 'ds/ds.dart:155 title+tone' },                  // קיבוץ פר-מצב
  identity:  { atom: 'MediaRow',   seam: 'premium/lists/media_row.dart:12-15 title/subtitle/glyph' },
  action:    { atom: 'SoftButton', seam: 'premium/actions/soft_button.dart:7 label+onTap' },
};
// מזייפים חסומים מפורשות (אם מישהו ינסה לבחור — נזרקת שגיאה):
const FAKERS = new Set(['stat_block', 'linear_progress', 'radial_gauge', 'bar_chart', 'sparkline']);

// ── גוזר-הפעולות: מנוסחת-החלקיק → רשימת פעולות-הצגה (deterministic) ──
// אופרטורים בנוסחה: '−' הפרש · '/' יחס · '×' מכפלה · 'vs' השוואה · 'count' · 'Σ' · 'partition' · 'raw' · 'name' · 'act'
function ops(formula) {
  const f = formula;
  if (f.kind === 'raw')       return [{ op: 'fact', why: 'ערך-גלם, אין תת-פעולה ⇒ עובדה עוצרת' }];
  if (f.kind === 'name')      return [{ op: 'identity', why: 'זהות = שם+אייקון+תמצית' }];
  if (f.kind === 'act')       return [{ op: 'action', why: 'מעשה אטומי' }];
  if (f.kind === 'partition') return [{ op: 'group', why: 'חלוקה-לדליים פר-מצב, אטום חוזר פר-קבוצה' }];
  if (f.kind === 'count')     return [{ op: 'headline', why: 'ספירה-מסוננת = מדד-כותרת' }];
  if (f.kind === 'sum')       return [{ op: f.headline ? 'hero' : 'headline', why: 'סכום = מדד' }];
  if (f.kind === '/')         return [{ op: 'ratio', why: 'חלק-מתוך-שלם ⇒ בר-מילוי (ערך+יעד+יחס באטום-אחד)' }];
  if (f.kind === '−')         return [{ op: 'diff', why: 'הפרש חתום ⇒ BareStat צבוע-לפי-סימן' }];
  if (f.kind === '×')         // מכפלה = תובנה: אופרנד × אופרנד = תוצאה (3 פעולות)
    return [{ op: 'magnitude', label: f.a }, { op: 'magnitude', label: f.b }, { op: 'diff', label: '=' + f.out, emphasize: true, why: 'תוצאת-המכפלה' }];
  if (f.kind === 'vs')        // השוואה = תובנה: שני-גדלים + הפרש + יחס (3 אטומים)
    return [{ op: 'compare', why: 'שני הגדלים זה-מול-זה' }, { op: 'diff', label: 'מרווח', why: 'ההפרש בין הגדלים' }, { op: 'magnitude', label: 'כיסוי%', why: 'יחס-הכיסוי' }];
  throw new Error('unknown formula kind: ' + f.kind);
}

// ── 15 החלקיקים כצורות-דאטה (לא הרכבות — המנוע מרכיב) ──
const PARTICLES = [
  { id: 'runway',     name: 'ריצה',        f: { kind: 'raw',       expr: 'daysLeft=cur/rate' } },
  { id: 'comparison', name: 'השוואה',      f: { kind: 'vs',        expr: 'daysLeft vs lead' } },
  { id: 'stock',      name: 'מלאי',        f: { kind: '/',         expr: 'cur / target' } },
  { id: 'state',      name: 'מצב/band',     f: { kind: 'raw',       expr: 'band(mustOrderIn)' } },
  { id: 'qty',        name: 'כמות',        f: { kind: '−',         expr: 'target − cur' } },
  { id: 'deadline',   name: 'מועד',        f: { kind: 'raw',       expr: 'mustOrderIn⇒מילה' } },
  { id: 'cost',       name: 'עלות',        f: { kind: '×',         a: 'כמות', b: 'מחיר', out: 'עלות', expr: 'qty × price' } },
  { id: 'kpiToday',   name: 'KPI היום',     f: { kind: 'count',     expr: 'count(band==2)' } },
  { id: 'kpiSoon',    name: 'KPI בקרוב',    f: { kind: 'count',     expr: 'count(band==1)' } },
  { id: 'kpiUnits',   name: 'KPI יחידות',   f: { kind: 'sum',       expr: 'Σ qty' } },
  { id: 'kpiIls',     name: 'KPI ₪',        f: { kind: 'sum', headline: true, expr: 'Σ(qty×price)' } },
  { id: 'triage',     name: 'טריאז\'',      f: { kind: 'partition', expr: 'group by band' } },
  { id: 'facts',      name: 'עובדות',       f: { kind: 'raw',       expr: 'rate/supplier/price' } },
  { id: 'identity',   name: 'זהות',        f: { kind: 'name',      expr: 'name+glyph+summary' } },
  { id: 'action',     name: 'פעולה',       f: { kind: 'act',       expr: 'mark ordered' } },
];

function compose(p) {
  const list = ops(p.f);
  const atoms = list.map(o => {
    const pick = ATOM[o.op];
    if (!pick) throw new Error('no atom for op ' + o.op);
    if (FAKERS.has(pick.atom)) throw new Error('🔴 selected a FAKER: ' + pick.atom);
    return { op: o.op, atom: pick.atom, seam: pick.seam, label: o.label, why: o.why };
  });
  const insight = list.length > 1;
  return { ...p, atoms, insight };
}

// ── דו"ח ──
const out = PARTICLES.map(compose);
let md = '# מנוע-ההרכבה — פלט על 15 החלקיקים\n\n';
md += '| # | חלקיק | נוסחה | סוג | אטומים (הכי-טוב-לייעוד) |\n|---|---|---|---|---|\n';
out.forEach((p, i) => {
  const kind = p.insight ? `תובנה·${p.atoms.length}` : 'עובדה·1';
  const atoms = p.atoms.map(a => a.atom + (a.label ? `(${a.label})` : '')).join(' + ');
  md += `| ${i + 1} | ${p.name} | \`${p.f.expr}\` | ${kind} | ${atoms} |\n`;
});
md += '\n## הוכחת-נושא-ערך (שקע-הדאטה פר-אטום) + מזייפים-חסומים\n';
const seen = new Set();
out.forEach(p => p.atoms.forEach(a => { if (!seen.has(a.atom)) { seen.add(a.atom); md += `- \`${a.atom}\` ← ${a.seam}\n`; } }));
md += `\n**מזייפים חסומים במנוע (בחירה בהם ⇒ throw):** ${[...FAKERS].join(' · ')}\n`;
md += `\n**סיכום:** ${out.filter(p => p.insight).length} תובנות (מרובות-אטומים) · ${out.filter(p => !p.insight).length} עובדות (אטום-יחיד). המנוע דטרמיניסטי — אותה נוסחה תיתן תמיד אותה הרכבה, ואף פעם לא מזייף.\n`;

import { writeFileSync, readFileSync, existsSync } from 'fs';
// --gate (שער compose-determinism · 23-ג): המנוע על 15 החלקיקים ≡ הדוח המחויב. שינוי בטבלת-ATOM/PARTICLES = אירוע-ראצ׳ט מוצהר ⇒ הרץ בלי --gate וקבֵּע.
const REPORT = new URL('./compose-engine-report.md', import.meta.url);
if (process.argv.includes('--gate')) {
  const cur = existsSync(REPORT) ? readFileSync(REPORT, 'utf8') : '';
  if (cur !== md) { console.log('🔴 compose-engine: הפלט סטה מ-compose-engine-report.md (טבלת-ATOM/חלקיקים/מזייפים השתנו) — node machtzev/compose-engine.mjs וקבֵּע'); process.exit(1); }
  console.log(`✓ קומפוזר-דטרמיניסטי: ${out.length} חלקיקים ≡ הדוח · ${FAKERS.size} מזייפים חסומים`); process.exit(0);
}
writeFileSync(REPORT, md);
process.stdout.write(md);
