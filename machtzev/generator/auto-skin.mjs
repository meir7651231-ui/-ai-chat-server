#!/usr/bin/env node
// 🥇 auto-skin — בורר-אטום-לפי-ייעוד מכל ספריית-forge (GENMAX·G17b · הכרעה-25: "צעד-3 חייב להיות מנוע מלא").
//   לכל תפקיד-עור (ROLES של resolveSkin) המנוע מדרג את **כל** אטומי forge-manifest לפי צורה בלבד — התאמה-קשה (need)
//   ואז ניקוד-ייעוד מאותות-הצורה שה-ds-forge חוצב מה-CSS/DOM (G17a: הדגשת-מספר · button · מעוטר · אינטראקטיבי · svg ·
//   וריאנטי-tone · כיוון-פריסה · סוג-קלט). אפס מילון-שמות (§20-ד): שם-האטום לא משתתף בניקוד.
//   הפלט = auto-skin.json (role ⇒ cls + toneMap) — ה"skin" המוצהר בספק הוא **דריסה** בלבד (הכרעת-בעלים). --gate: המחויב ≡ טרי.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const GEN = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(GEN, '../..');
const MANIFEST = path.join(ROOT, 'new/dart-forge-bs/forge-manifest.json');
const OUT = path.join(GEN, 'auto-skin.json');

const isNum = (t) => /^[\d,.%₪$+\-–]+$/.test(String(t).trim());
// התפקידים + דרישת-הצורה הקשה (זהה ל-resolveSkin) + משפחות-מותרות (סדרן = שובר-שוויון מבני)
export const ROLES = {
  kpi:  { need: 'value+label' }, hero: { need: 'value+label' }, stat: { need: 'value+label' },
  navTile: { need: 'text2', fam: ['card', 'nav', 'list'] }, empty: { need: 'text2', fam: ['feedback'] },
  button: { need: 'text1', fam: ['action'] }, statusChip: { need: 'text1', fam: ['status'] }, banner: { need: 'text2', fam: ['feedback', 'status'] },
  emptyState: { need: 'text2', fam: ['feedback'] }, mediaRow: { need: 'text2', fam: ['card', 'list'] },
  section: { need: 'child+text1', fam: ['header', 'card', 'composite'] }, frame: { need: 'child', fam: ['card', 'header', 'composite'] },
  segmented: { need: 'select', fam: ['selection', 'nav', 'action', 'composite'] }, chip: { need: 'select', fam: ['selection', 'composite', 'status'] },
  meter: { need: 'value+values', fam: ['status', 'dataviz', 'card', 'list'] }, glass: { need: 'text2', fam: ['card'] }, timeline: { need: 'items2', fam: ['list', 'chat', 'card'] },
  field: { need: 'control', fam: ['input', 'composite'] }, enumField: { need: 'control', fam: ['input', 'composite'] }, numberField: { need: 'control', fam: ['input', 'composite'] },
  dateField: { need: 'control', fam: ['input', 'composite'] }, search: { need: 'control', fam: ['input', 'composite'] }, pageHeader: { need: 'text2', fam: ['header'] },
  table: { need: 'table', fam: ['spatial', 'list'] }, bars: { need: 'values', fam: ['dataviz'] }, board: { need: 'board', fam: ['spatial'] }, calendar: { need: 'calendar', fam: ['temporal', 'spatial'] },
};
const NEED_SLOTS = { 'value+label': 2, text1: 1, text2: 2, child: 0, 'child+text1': 1, 'value+values': 2 };

export function fits(a, R) {
  if (R.fam && !R.fam.includes(a.family)) return false;
  if (a.states && R.need !== 'control') return false;
  const num = a.fieldDemo.filter(isNum).length, txt = a.fieldDemo.filter((t) => /[a-z֐-׿]/.test(t)).length;
  switch (R.need) {
    case 'child': return !!a.child;
    case 'child+text1': return !!a.child && txt >= 1;
    case 'board': return !!(a.items && a.items.cells && a.items.slots >= 2) && !a.columns;   // קנבן: עמודות-פריטים עם כרטיסים, בלי שורת-כותרות (זו טבלה)
    case 'calendar': { const v = (a.items && a.items.variants) || []; return !!(a.items && a.columns && a.actions >= 2 && ['pad', 'has', 'today'].every((t) => v.includes(t))); }
    case 'table': return !!(a.items && a.items.cells && a.columns);
    case 'values': return a.values >= 3;
    case 'control': return !!a.control;
    case 'select': return !!(a.items && a.items.selectable && a.items.selected && a.items.slots >= 1);
    case 'items2': return !!(a.items && a.items.slots >= 2);
    case 'value+values': return a.values >= 1 && a.fieldSlots >= 2 && num >= 1 && num < a.fieldSlots;
    case 'value+label': return a.fieldSlots >= 2 && num >= 1 && num < a.fieldSlots;
    case 'text1': return a.fieldSlots >= 1 && num === 0;
    case 'text2': return a.fieldSlots >= 2 && num === 0;
  }
  return false;
}
const tones = (a) => ((a.items && a.items.variants) || []).filter((v) => /^tone-/.test(v));
const S = (a) => a.sig || { root: {}, slots: [], svg: false, input: null, numEmph: 0 };
const effSlots = (a) => (a.items ? Math.max(0, a.fieldSlots - a.items.demo * a.items.slots) + a.items.slots : a.fieldSlots);   // חריצים-עצמיים + תבנית-פריט אחת (לא כל הדמו)
const maxFs = (a) => Math.max(0, ...S(a).slots.map((x) => x.fs || 0));
const heading = (a) => S(a).slots.some((x) => (x.fs || 0) >= 15 && (x.fw || 0) >= 600);
const inBtn = (a) => S(a).slots.some((x) => x.inBtn) || S(a).root.tag === 'button' || S(a).root.tag === 'a';
const numLike = (t) => /^[\d,.%₪$+\-–\s]+$/.test(String(t).trim()) && /\d/.test(t);   // גם "+ 12%" (רווח פנימי) — לניקוד בלבד; fits נשאר על isNum של resolveSkin
const numSlots = (a) => a.fieldDemo.filter(numLike).length;
// כיסוי-טונים: כמה מארבעת מצבי-ה-DS (info/ok/err/warn) יש להם טוקן משלהם (0..4)
const toneCoverage = (a) => { const t = tones(a); return [/^tone-(info|neutral|accent|primary)$/, /^tone-(ok|success|good)$/, /^tone-(err|error|danger|bad)$/, /^tone-(warn|warning)$/].filter((re) => t.some((v) => re.test(v))).length; };

// ניקוד-ייעוד: חיובי = הצורה מגשימה את התפקיד · שלילי = עודף/קישוט/דאטה-שאין-לנו (§20-ג). כולו מאותות-צורה.
export function score(role, a) {
  const R = ROLES[role], s = S(a), ns = NEED_SLOTS[R.need]; let sc = 0;
  const surplus = ns == null ? 0 : Math.max(0, effSlots(a) - ns);
  switch (role) {
    case 'kpi': case 'hero': case 'stat':
      if (s.numEmph < 1.4) return null;                                             // KPI = מספר מודגש; אחרת זו כותרת עם ספרה
      sc = s.numEmph * 2 - surplus * 10 - (s.svg ? 6 : 0) - (a.items ? 6 : 0) - a.values * 6 - a.actions * 3 - (s.root.interactive ? 4 : 0) + (s.root.decorated ? 1 : 0); break;
    case 'navTile':
      if (!s.root.interactive) return null;                                          // אריח-ניווט = לחיץ
      sc = (s.svg ? 3 : 0) + (s.root.decorated ? 2 : 0) + (s.root.dir === 'column' ? 2 : 0) - surplus * 4 - (a.items ? 6 : 0); break;
    case 'empty': case 'emptyState':
      sc = (s.svg ? 2 : 0) - (s.root.interactive ? 5 : 0) - (s.root.decorated ? 1 : 0) - surplus * 4 - (a.items ? 3 : 0); break;
    case 'button':
      if (!inBtn(a)) return null;                                                     // כפתור = <button>/<a>
      sc = (tones(a).length ? 4 : 0) + toneCoverage(a) * 2 - surplus * 5 - (a.control ? 5 : 0) - Math.max(0, a.actions - 1) * 2; break;
    case 'statusChip':
      sc = (tones(a).length ? 5 : 0) + toneCoverage(a) * 2 - (s.root.interactive ? 3 : 0) - (s.svg ? 2 : 0) + (maxFs(a) && maxFs(a) <= 12 ? 2 : 0) - surplus * 4; break;
    case 'banner':
      sc = (tones(a).length ? 5 : 0) + toneCoverage(a) * 2 - (s.root.interactive ? 3 : 0) - (s.svg ? 1 : 0) - surplus * 3; break;
    case 'mediaRow':
      sc = (s.svg ? 3 : 0) + (s.root.dir === 'row' ? 3 : 0) - surplus * 3 - (a.items ? 3 : 0); break;
    case 'section':
      if (!s.root.decorated) return null;                                             // מקטע = מיכל מעוטר עם כותרת
      sc = (heading(a) ? 4 : 0) + Math.min(maxFs(a), 24) / 3 - (maxFs(a) > 24 ? 4 : 0) + (a.items ? 2 : 0) - (a.fieldDemo.some((t) => /^[A-Z]{3,}$/.test(t)) ? 2 : 0) - a.actions * 2 - surplus * 1 - (s.root.interactive ? 3 : 0) - numSlots(a) * 3; break;   // כותרת 15–24 + פעולות-נלוות = מקטע; eyebrow-באותיות-גדולות/>24 = כותרת-עמוד   // כותרת 15–24 = מקטע; >24 = הירו-של-עמוד; כפתורי-ניווט/מספרים = לא-מקטע
    case 'frame':
      if (!s.root.decorated || s.root.interactive) return null;                 // מסגרת = מיכל דומם
      sc = -effSlots(a) * 4 - (s.svg ? 2 : 0) - (a.items ? 4 : 0) - (s.root.interactive ? 2 : 0) - a.actions * 2 - a.values * 3 - numSlots(a) * 4; break;   // מסגרת = מיכל, לא KPI/גרף
    case 'segmented':
      sc = (inBtn(a) ? 3 : 0) - (s.root.interactive ? 4 : 0) - (s.svg ? 3 : 0) - (a.items.slots - 1) * 5 - a.items.cells * 5 - Math.max(0, effSlots(a) - 1) * 2; break;   // בורר-מקטעים = מסילה של טקסטים (השורש אינו הכפתור, בלי אייקונים)
    case 'chip':
      sc = (a.bare ? 2 : 0) + (s.root.interactive ? 2 : 0) - (s.root.decorated ? 2 : 0) + (a.items.slots === 1 ? 3 : 0) - a.items.cells * 5; break;   // צ׳יפ = הפריט עצמו לחיץ
    case 'meter':
      sc = -Math.max(0, a.values - 1) * 4 - surplus * 3; break;
    case 'glass':
      if (!s.root.decorated || s.root.interactive) return null;
      sc = -(s.svg ? 3 : 0) - (a.items ? 3 : 0) - surplus * 2; break;
    case 'timeline':
      { const sl = s.slots; const pair = sl.some((x, k) => k + 1 < sl.length && (x.fw || 0) >= 600 && (sl[k + 1].fw || 0) < 600 && (sl[k + 1].fs || 0) <= (x.fs || 0));   // כותרת-מודגשת ואחריה משנה-קלה = שורת-ציר (בכל מקום ברצף)
        sc = -(s.svg ? 2 : 0) + (s.root.decorated ? 1 : 0) + (a.items.slots <= 3 ? 2 : 0) + (pair ? 3 : 0) - (a.items.selectable || inBtn(a) ? 4 : 0) - a.actions * 2 - a.items.cells * 3 - Math.max(0, numSlots(a) - 1) * 2 - Math.max(0, effSlots(a) - a.items.slots) * 2 + (a.family === 'list' ? 1 : 0); break; }   // שורות פסיביות: בלי מתגים/כפתורים; תג-מונה יחיד מותר; רשימה > צ׳אט   // ציר-זמן = שורות-טקסט בלי כותרת-כרטיס, לא מפתח-ערך-מספרי
    case 'field': case 'enumField': case 'numberField': case 'dateField': case 'search': {
      const i = s.input || {}; const base = -(a.items ? 4 : 0) - Math.max(0, a.fieldSlots - 2) * 2;
      if (role === 'field') sc = base - (s.svg ? 3 : 0) - a.actions * 3 - (i.numPh ? 3 : 0) - (i.readonly ? 3 : 0) - (i.datePh ? 3 : 0);
      else if (role === 'enumField') sc = base + (i.readonly ? 5 : 0) + (s.svg ? 2 : 0) - a.actions * 3 - (i.numPh ? 3 : 0) - (i.datePh ? 3 : 0);
      else if (role === 'numberField') sc = base + (i.numPh ? 6 : 0) - (i.readonly ? 3 : 0) - a.actions * 3 - (i.datePh ? 3 : 0);
      else if (role === 'dateField') sc = base + (i.datePh ? 6 : 0) + (s.svg ? 1 : 0) - a.actions * 3 - (i.numPh ? 3 : 0);
      else sc = base + Math.min(a.actions, 1) * 4 + (i.ph ? 2 : 0) + (s.svg ? 2 : 0) - (i.readonly ? 3 : 0) - (i.numPh ? 3 : 0);
      break;
    }
    case 'pageHeader':
      sc = (maxFs(a) >= 20 ? 4 : 0) + (s.root.decorated ? 1 : 0) - (s.root.interactive ? 2 : 0) - (a.items ? 2 : 0) - surplus * 1; break;
    case 'table': sc = Math.min(a.columns, 4) * 2 + (a.items.slots >= 2 ? 2 : 0) - (a.items.variants ? 3 : 0); break;
    case 'bars': sc = Math.min(a.values, 8) - Math.max(0, a.fieldSlots - 2) * 2 - Math.max(0, (s.series || 1) - 1) * 6 - Math.max(0, (s.fills || 1) - 1) * 3; break;   // סדרה-אחת בצבע-אחד (NeonBars/DsBars = values יחיד); מוערם/מקובץ = כמה מילויים   // סדרה-אחת (NeonBars/DsBars = values יחיד); מוערם = כמה סדרות
    case 'board': sc = a.items.cells * 2; break;
    case 'calendar': sc = 0; break;
  }
  return sc;
}
export function rank(role, atoms) {
  const R = ROLES[role]; const out = [];
  for (const a of atoms) { if (!fits(a, R)) continue; const sc = score(role, a); if (sc == null) continue; out.push({ cls: a.cls, family: a.family, score: sc }); }
  const fi = (f) => (R.fam ? R.fam.indexOf(f) : 0);
  return out.sort((x, y) => y.score - x.score || fi(x.family) - fi(y.family) || (x.cls < y.cls ? -1 : 1));
}
// גשר-טונים: DS tone 0 accent · 1 success · 2 danger · 3 warning ⇒ טוקן-tone של Pure (הסמנטיקה ok/warn/err קבועה במשפחה — לא מילון-דומיין)
export function toneMapOf(a) {
  const ids = (a.items && a.items.variants) || []; if (!ids.some((v) => /^tone-/.test(v))) return null;
  const pick = (re) => ids.find((v) => re.test(v));
  const info = pick(/^tone-(info|neutral|accent|primary)$/) || ids.find((v) => /^tone-/.test(v));
  return [info, pick(/^tone-(ok|success|good)$/) || info, pick(/^tone-(err|error|danger|bad)$/) || info, pick(/^tone-(warn|warning)$/) || info];
}
export function autoSkin(overrides = {}) {
  const atoms = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).atoms;
  const skin = {}, toneMap = {}, report = {};
  for (const role of Object.keys(ROLES)) {
    const r = rank(role, atoms); report[role] = r.slice(0, 3);
    const cls = overrides[role] || (r[0] && r[0].cls); if (!cls) continue;
    skin[role] = cls;
    const a = atoms.find((x) => x.cls === cls); const tm = a && toneMapOf(a); if (tm) toneMap[role] = tm;
  }
  if (overrides.toneMap) Object.assign(toneMap, overrides.toneMap);
  if (Object.keys(toneMap).length) skin.toneMap = toneMap;
  return { skin, report };
}
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const { skin, report } = autoSkin();
  const fresh = JSON.stringify({ skin, top3: Object.fromEntries(Object.entries(report).map(([r, v]) => [r, v.map((x) => `${x.cls}:${x.score}`)])) }, null, 1) + '\n';
  if (process.argv.includes('--gate')) {
    if (!fs.existsSync(OUT) || fs.readFileSync(OUT, 'utf8') !== fresh) { console.log('🔴 autoskin: auto-skin.json ≠ בורר-טרי (הרץ node machtzev/generator/auto-skin.mjs)'); process.exit(1); }
    const bad = ['kpi', 'hero', 'stat'].filter((r) => /StatBlock|MetricTile/.test(skin[r] || ''));
    if (bad.length) { console.log(`🔴 autoskin: ${bad.join('/')} = אטום-מגמה בלי נתון-מגמה (L73)`); process.exit(1); }
    console.log(`✓ autoskin: ${Object.keys(skin).filter((k) => k !== 'toneMap').length} תפקידים נבחרו מבנית מ-${JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).atoms.length} אטומים · toneMap ${Object.keys(skin.toneMap || {}).length}`);
    process.exit(0);
  }
  fs.writeFileSync(OUT, fresh);
  for (const [role, v] of Object.entries(report)) console.log(`${role.padEnd(12)} ⇒ ${(skin[role] || '—').padEnd(36)} | ${v.map((x) => `${x.cls}(${x.score})`).join(' · ')}`);
  console.log(`✍️ auto-skin.json · ${Object.keys(skin).filter((k) => k !== 'toneMap').length} תפקידים`);
}
