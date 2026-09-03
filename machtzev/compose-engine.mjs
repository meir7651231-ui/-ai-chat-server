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
  // ── פעולות-מסך-מלא (גלים 2–4 · אטומי-מדף-אמת, סוכני-חקר 3.9) ──
  search:    { atom: 'DsSearch',      seam: 'ds/ds_search.dart:5 value+onChanged (מבוקר)' },              // איתור · תצוגה
  match:     { atom: 'smartFilter',   seam: 'dart-maor/smart-filter.dart:84 ⊕smartScore⊕normSearch (לוגיקה §21)' }, // איתור · מנוע
  filter:    { atom: 'FilterChipPill', seam: 'screens__manager_dashboard_screen/filter_chip_pill.dart:7 selected+onTap (מבוקר)' }, // חריגה · תצוגה
  predicate: { atom: 'finderMatches', seam: 'dart-maor/finder-matches.dart:23 locks+axisValue (לוגיקה §21)' }, // חריגה · מנוע
  serialize: { atom: 'toCsv',         seam: 'dart-maor/to-csv.dart ⊕csvEscape⊕exportAllowed (לוגיקה §21)' }, // ייצוא · מנוע
  switch:    { atom: 'SegmentedSwitch', seam: 'premium/actions/segmented_switch.dart items+selected+onSelect' }, // בורר · תצוגה
  role:      { atom: 'roleOf',         seam: 'dart-maor/role-of.dart admin/teacher/staff (לוגיקה §21)' },        // הרשאות · מנוע
  grant:     { atom: 'canGrantedAction', seam: 'dart-maor/can-granted-action.dart גידור-פר-מפתח (לוגיקה §21)' }, // הרשאות · מנוע
  alert:     { atom: 'AlertBanner',    seam: 'premium/feedback/alert_banner.dart message+tone+glyph' },          // אוטומציה · תצוגה
  expiry:    { atom: 'expiringIntakes', seam: 'dart-maor/expiring-intakes.dart ⊕shopExpiryWarnDays (לוגיקה §21)' }, // פקיעה · מנוע
  capital:   { atom: 'warehouseValue', seam: 'dart-maor/warehouse-value.dart Σqty×cost (לוגיקה §21)' },          // הון-כלוא · מנוע
  table:     { atom: 'DsTable',       seam: 'ds/ds_table.dart:7 labels+rows+מיון' },                      // הצגת-אוסף (לא DataGrid)
  panel:     { atom: 'GlassCard',     seam: 'premium/surfaces/glass_card.dart:5 required this.child' },   // מיכל-פריט-נבחר
  timeline:  { atom: 'TimelineItem',  seam: 'premium/lists/timeline_item.dart title+time+body' },         // שורת-תנועה (לא timeline_flow)
  empty:     { atom: 'EmptyState',    seam: 'premium/feedback/empty_state.dart glyph+message' },          // מצב אין-תוצאות
};
// מזייפים חסומים מפורשות (אם מישהו ינסה לבחור — נזרקת שגיאה):
// הערה: הסוכנים זיהו בבייטים 4 מזייפים נוספים (DataGrid·timeline_flow·shimmer_skeleton·StatBlock,
// ראה knowledge/COMPOSE-INVENTORY-2026-09-03.md). לא נוספו כאן במכוון — FAKERS = SSOT לשער no-fakers
// חוצה-הריפו (בעלות-המחולל), והוספה תגרור חוב-מחולל קיים; שדרוג-הרשימה = הכרעת בעל-המחולל.
// למסך-המלאי אין צורך: אף אחד מ-6 החלקיקים החדשים לא ממפה למזייף (הטבלה=DsTable, התנועות=TimelineItem — התחליפים).
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
  // ── פעולות-מסך-מלא ──
  if (f.kind === 'search')    // איתור = תובנה: תצוגה(קלט-מבוקר) ⊕ לוגיקה(ניקוד-רב-מילתי+נרמול-עברי) — 23-ג
    return [{ op: 'search', why: 'קלט-חיפוש מבוקר (value+onChanged)' }, { op: 'match', why: 'מנוע-התאמה: smartFilter⊕smartScore⊕normSearch (רב-מילתי AND, לא .contains)' }];
  if (f.kind === 'filter')    // חריגה = תובנה: תצוגה(צ׳יפ) ⊕ לוגיקה(מנוע-פרדיקט-רב-צירי) — 23-ג
    return [{ op: 'filter', why: 'צ׳יפ-סינון מבוקר (selected+onTap)' }, { op: 'predicate', why: 'מנוע-פרדיקט: finderMatches (נעילות-AND, לא בוליאני-ידני)' }];
  if (f.kind === 'table')     return [{ op: 'table', why: 'הצגת-אוסף = טבלה (labels+rows+מיון); DataGrid מזייף ⇒ נחסם' }];
  if (f.kind === 'empty')     return [{ op: 'empty', why: 'מצב אין-תוצאות = glyph+message' }];
  if (f.kind === 'export')    // ייצוא = תובנה: תצוגה(כפתור-הפעלה) ⊕ לוגיקה(סריאליזציה-בטוחה) — 23-ג
    return [{ op: 'action', why: 'כפתור-הפעלת-הייצוא (label+onTap)' }, { op: 'serialize', why: 'מנוע: toCsv⊕csvEscape (BOM+חסימת-הזרקה, לא join ידני)' }];
  if (f.kind === 'perm')      // הרשאות = תובנה: תצוגה(בורר-תפקיד) ⊕ לוגיקה(תפקיד + גידור-פעולה) — 23-ג · חוק-6
    return [{ op: 'switch', why: 'בורר-תפקיד (זהות-מוזרקת, חוק-6)' }, { op: 'role', why: 'מנוע: roleOf ⇒ admin/teacher/staff' }, { op: 'grant', why: 'מנוע: canGrantedAction ⇒ הצג/הסתר-פעולה פר-מפתח' }];
  if (f.kind === 'auto')      // אוטומציה = תובנה: תצוגה(התראה) ⊕ לוגיקה(זיהוי-פקיעה + הון-כלוא) — 23-ג פרואקטיבי
    return [{ op: 'alert', why: 'באנר-התראה (message+tone+glyph)' }, { op: 'expiry', why: 'מנוע: expiringIntakes ⊕ shopExpiryWarnDays (מה פוקע תוך החלון)' }, { op: 'capital', why: 'מנוע: warehouseValue על מלאי-מת (הון-כלוא)' }];
  if (f.kind === 'log')       // יומן = תובנה: כותרת-קיבוץ (Σ) + שורת-תנועה פר-רשומה (2 אטומים)
    return [{ op: 'group', label: 'כותרת+Σ', why: 'כותרת-היומן נושאת מונה+Σעלות' }, { op: 'timeline', why: 'שורת-תנועה פר-רשומה (title/time/body); timeline_flow מזייף ⇒ נחסם' }];
  if (f.kind === 'panel')     // פאנל-פריט = תובנה: מיכל + זהות + מצב(יחס) + תנועות + פעולה (5 אטומים)
    return [{ op: 'panel', why: 'מיכל-פריט-נבחר (GlassCard child) מארח את תת-החלקיקים' },
            { op: 'identity', why: 'זהות-הפריט (שם/מק״ט/קטגוריה)' },
            { op: 'ratio', label: 'מלאי מול יעד', why: 'מצב-אמת = יחס במילוי-בר' },
            { op: 'timeline', why: 'תנועות-הפריט (intakeLog מסונן)' },
            { op: 'action', why: 'פעולות על הפריט (קבלה/הוצאה/מלא/הזמן)' }];
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
  // ── גלים 2–4: פעולות מסך-מלא (איתור · חריגה · אוסף · יומן · פאנל · ריק) ──
  { id: 'locate',     name: 'איתור',       f: { kind: 'search',    expr: 'q ⇒ ניקוד-רב-מילתי-מנורמל (smartScore)' } },
  { id: 'exception',  name: 'זיהוי-חריגה', f: { kind: 'filter',    expr: 'נעילת-ציר-AND (finderMatches)' } },
  { id: 'table',      name: 'טבלה',        f: { kind: 'table',     expr: 'records × 10 שדות-אמת' } },
  { id: 'movements',  name: 'תנועות',      f: { kind: 'log',       expr: 'intakeLog ⇒ rows+Σcost' } },
  { id: 'itempanel',  name: 'פאנל-פריט',   f: { kind: 'panel',     expr: 'GlassCard(זהות+מצב+תנועות+פעולה)' } },
  { id: 'emptyst',    name: 'מצב-ריק',     f: { kind: 'empty',     expr: 'shown==0' } },
  { id: 'export',     name: 'ייצוא',       f: { kind: 'export',    expr: 'items ⇒ CSV+BOM (toCsv⊕csvEscape)' } },
  { id: 'permissions', name: 'הרשאות',     f: { kind: 'perm',      expr: 'role ⇒ show/hide (roleOf⊕canGrantedAction)' } },
  { id: 'automation', name: 'אוטומציות',   f: { kind: 'auto',      expr: 'פקיעה + מלאי-מת ⇒ התראה (expiringIntakes⊕warehouseValue)' } },
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
let md = `# מנוע-ההרכבה — פלט על ${PARTICLES.length} החלקיקים\n\n`;
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
