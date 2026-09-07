#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  truth.mjs — מקור-האמת-האחד (נגזר-מהבייטים · דטרמיניסטי · אפס-הערכה).
//  כל מספר על הענף נמדד כאן מהקוד עצמו, חוצה 3 השכבות (תצוגה·לוגיקה·דאטה).
//  אסור לצטט מספר על הענף שלא יצא מכאן. `--gate` נכשל אם TRUTH.md סטה מהמדידה.
//  אפס תופעות-לוואי (קריאה בלבד; ייבוא render-ds בונה census/engines בזיכרון).
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { selectVaried, listMapEngines } from './generator/render-ds.mjs';
import * as R from './root.mjs';

const ROOT = R.ROOT;
const G = path.join(ROOT, 'machtzev/generator');
const rd = (p) => { try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); } catch { return ''; } };
const rj = (p) => { try { return JSON.parse(fs.readFileSync(path.join(G, p), 'utf8')); } catch { return []; } };
const nd = (d, re = /\.(mjs|dart)$/) => { try { return fs.readdirSync(path.join(ROOT, d)).filter((f) => re.test(f) && !/\.test\.|_test\.|\.contract\./.test(f)).length; } catch { return 0; } };

// ── שכבת-תצוגה ──
const census = rj('atom-index.json');   // c4ב · הכרעה C: האינדקס הוא האורקל (554); atom-census.json (522, ישן) נמחק
const seam = {}; for (const a of census) seam[a.seam] = (seam[a.seam] || 0) + 1;
const _rS = /^String\??$/, _rLS = /^List<String>\??$/, _rLLS = /^List<List<String>>\??$/, _rLD = /^List<double>\??$/, _rI = /^int\??$/;
const ASPECTS = {
  kpi: [{ value: { re: /^(value|val|amount|total|count|num)$/, ty: _rS }, label: { re: /^(label|title|caption|name|sub)$/, ty: _rS } }, (a) => a.caps.includes('kpi') && a.seam === 'fields'],
  board: [{ stages: { re: /^stages$/ }, records: { re: /^records$/ }, stageOf: { re: /^stageOf$/ }, titleOf: { re: /^titleOf$/ }, onMove: { re: /^onMove$/ } }, (a) => a.seam === 'collection'],
  nav: [{ label: { re: /^(label|title|name|text)$/, ty: _rS }, onTap: { re: /^onTap$/ } }, (a) => a.seam === 'fields'],
  tbl: [{ labels: { re: /^(labels|cols|columns|headers)$/, ty: _rLS }, rows: { re: /^(rows|data)$/, ty: _rLLS } }, (a) => a.caps.includes('list') && a.seam === 'collection'],
  trend: [{ labels: { re: /^(labels|cols)$/, ty: _rLS }, values: { re: /^(values|data|series)$/, ty: _rLD } }, (a) => a.caps.includes('trend') && a.seam === 'series'],
  prog: [{ pct: { re: /^(pct|percent|value|val)$/, ty: _rI } }, (a) => a.caps.includes('progress') && a.seam === 'fields'],
  card: [{ title: { re: /^(title|name|label|head|caption)$/, ty: _rS }, sub: { re: /^(sub|subtitle|desc|body|note|caption)$/, ty: _rS } }, (a) => a.caps.includes('card') && a.seam === 'fields'],
};
const dispReach = {}; const dispAll = new Set();
for (const [n, [spec, pred]] of Object.entries(ASPECTS)) {
  const s = new Set(); for (let seed = 0; seed < 400; seed++) { const r = selectVaried(spec, pred, seed); if (r) s.add(r.cls); }
  dispReach[n] = s.size; for (const x of s) dispAll.add(x);
}

// ── שכבת-לוגיקה ──
const logic = rj('logic-census.json');
const wireable = logic.filter((x) => x.wireable).length;
const engines = listMapEngines();
// c3ג · מכנה כן (הכרעה N): לא כל אטום ניתן-לחיווט. תצוגה: fields עם ≥1 שקע-String, collection, series; לוגיקה: wireable.
const opsMap = rj('ops-map.json');
const fakers = (() => { const m = rd('machtzev/compose-engine.mjs').match(/const FAKERS = new Set\(\[([^\]]*)\]\)/); return new Set(m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : []); })();
// L92 · כשירות-תצוגה מוכרעת ע"י סנסוס-הפעולות (op-census: שקע-דאטה/מבני קיים ⇒ op≠zero), לא ע"י תפר-האינדקס לבדו: 21 אטומים ש"יש להם fields" באינדקס
//       הם רקעים/ספינרים/שלדים/FAB בלי שקע-דאטה — §20-ג: אין מה להזין ⇒ מזייף ⇒ לא-כשיר. מזייפים-מוצהרים (FAKERS) לא-כשירים תמיד.
const opsArr = Array.isArray(opsMap) ? opsMap : Object.values(opsMap.atoms || opsMap || {});
const opOfCls = new Map(opsArr.filter((a) => a.layer === 'display').map((a) => [String(a.id).split('@')[0], a.op]));
const ineligibleDisp = census.filter((a) => fakers.has(a.cls) || (opOfCls.has(a.cls) ? opOfCls.get(a.cls) === 'zero' : a.seam === 'zero'));   // G21: op-census מכריע (רואה שקעים אמיתיים גם כשתפר-האינדקס אמר zero — ReportTable.rows); האינדקס רק כשאין שורת-op
const eligibleDisp = census.length - ineligibleDisp.length;   // L92 · כשיר = יש תפר-דאטה כלשהו ואינו מזייף-מוצהר (§20-ג); היה: fields∧str≥1 ∪ collection ∪ series (מדד-DS ישן)
const eligibleLogic = logic.filter((x) => Array.isArray(x.params)).length;   // L91 · G18/G19: כל מנוע עם חתימה נקראת כשיר (compat + adapter); `wireable`=102 היה קריטריון "שדה-מחושב" בלבד (ישן, נשמר כתת-שורה)
const eligible = eligibleDisp + eligibleLogic;

// ── מבנה + שערים ──
const gatesTsv = rd('machtzev/gates.tsv').split('\n').filter((l) => l && !l.startsWith('#')).length;
const gateCalls = (rd('machtzev/police.mjs').match(/^\s*gate(Dirty)?\(/gm) || []).length;

const totalAtoms = census.length + logic.length;
// L91 · הבוררים-הנוכחיים (G17 auto-skin · G18 auto-logic · G1 ops-map) — מדידה דרך המסלול הישן בלבד (selectVaried+MAP_ENGINES) שיקרה בהשמטה: "53 מחווטים" כשהבורר כבר מדרג 359+848.
const askin = rj('auto-skin.json'), alogic = rj('auto-logic.json');
const skinPicks = new Set(Object.entries(askin.skin || {}).filter(([k]) => k !== 'toneMap').map(([, v]) => v));
const skinReach = new Set(askin.reach || []);
const logicPicks = new Set(Object.values(alogic.ops || {}).map((r) => r.pick).filter(Boolean));
const logicReach = new Set(alogic.reach || []);
const chosenDisp = new Set([...dispAll, ...skinPicks]), chosenLogic = new Set([...engines, ...logicPicks]);
const coverDisp = new Set(opsArr.filter((a) => a.layer === 'display' && a.op && a.op !== 'zero' && !fakers.has(String(a.id).split('@')[0])).map((a) => String(a.id).split('@')[0]));   // G3 cover: מאגר-לפי-op
const coverLogic = new Set(opsArr.filter((a) => a.layer === 'logic' && a.op).map((a) => a.id));
const boxSrc = (() => { try { const d = path.join(ROOT, 'new/dart-boxes'); return fs.readdirSync(d).filter((f) => f.endsWith('.dart')).map((f) => fs.readFileSync(path.join(d, f), 'utf8')).join('\n'); } catch { return ''; } })();
const boxFiles = new Set([...boxSrc.matchAll(/(dart-maor|dart)\/([\w-]+)\.dart/g)].map((m) => m[1] + '/' + m[2] + '.dart'));
const boxLogic = new Set(logic.filter((x) => boxFiles.has(x.file)).map((x) => x.name));   // קופסאות-Dart = קוראים-אמיתיים (L89)
const inel = new Set(ineligibleDisp.map((a) => a.cls));
const reachDisp = new Set([...chosenDisp, ...skinReach, ...coverDisp].filter((c) => !inel.has(c))), reachLogic = new Set([...chosenLogic, ...logicReach, ...coverLogic, ...boxLogic]);
const opsMapped = (Array.isArray(opsMap) ? opsMap : Object.values(opsMap.atoms || opsMap || {})).filter((a) => a && a.layer !== 'data' && a.op).length;
const wiredTotal = chosenDisp.size + chosenLogic.size;   // נבחרו-בפועל ע"י בורר כלשהו (מסלול-DS ∪ auto-skin ∪ MAP_ENGINES ∪ auto-logic)
const reachTotal = reachDisp.size + reachLogic.size;     // כשירים-לבורר (fits / compat) — מה שהמנוע באמת שוקל
const wiredPct = (wiredTotal / totalAtoms * 100).toFixed(1);
// GENMAX·G4 — רתמת-הזהב (golden-harness.mjs): מודולי-זהב שהמנוע מרכיב-מחדש מהקטלוג ועוברים את בדיקותיהם המקוריות
const gh = (() => { try { return JSON.parse(rd('machtzev/generator/golden-harness-report.json')); } catch { return null; } })();
const goldenLine = gh ? `${gh.regenerated}/${gh.modules} מודולים · ${gh.tests}/${gh.testsTotal} בדיקות` : '— (לא הורץ)';
const gv = (() => { try { return JSON.parse(rd('machtzev/generator/gen-verify-report.json')); } catch { return null; } })();
const genverifyLine = gv ? `${gv.rendered}/${gv.screens} מסכים רונדרו-בפועל · ${gv.atoms} אטומי-תצוגה על המסך` : '— (לא הורץ)';
const layers = {
  '🔢 סה"כ אטומים מאונדקסים (תצוגה+לוגיקה)': totalAtoms,
  '🏁 זהב-מורכב-מחדש (GENMAX·G4 · render-module compose)': goldenLine,
  '🔎 פלטי-מחולל שרונדרו-בפועל (GENMAX·G5b · gen-verify)': genverifyLine,
  '🔌 מחווטים-למחולל בפועל': `${wiredTotal} (${wiredPct}%) · ${totalAtoms - wiredTotal} מפורקים-אך-לא-מחווטים`,
  '  ↳ מול כשירים-לחיווט (eligible)': `${wiredTotal}/${eligible} (${(wiredTotal / (eligible || 1) * 100).toFixed(1)}%) · כשירים: תצוגה ${eligibleDisp} (תפר≠zero ∧ לא-מזייף) + לוגיקה ${eligibleLogic} (חתימה נקראת; wireable-כשדה-מחושב ${wireable})`,
  '  ↳ נגישים-לבוררים-הנוכחיים (reach · auto-skin ∪ auto-logic ∪ cover(ops-map) ∪ קופסאות)': `${reachTotal}/${eligible} (${(reachTotal / (eligible || 1) * 100).toFixed(1)}%) · תצוגה ${reachDisp.size} · לוגיקה ${reachLogic.size}`,
  '  ↳ ממופים-לפעולת-יסוד (G1 ops-map · תצוגה+לוגיקה, כולל לא-באורקל)': `${opsMapped}/${opsArr.filter((a) => a.layer !== 'data').length}`,
  '  ↳ לא-כשירים-במכוון (§20-ג · אין-שקע-דאטה/מזייף — נספרים, לא נעלמים)': `${ineligibleDisp.length} תצוגה: ${ineligibleDisp.map((a) => a.cls).sort().join(' · ')}`,
  '  ↳ כשירים-שאף-בורר-לא-רואה (הפער האמיתי)': `${[...census.filter((a) => !ineligibleDisp.includes(a) && !reachDisp.has(a.cls)).map((a) => a.cls), ...logic.filter((x) => !reachLogic.has(x.name)).map((x) => x.name)].join(' · ') || '0 — אין'}`,
  '  ↳ חיווט-תצוגה (נבחרו: DS-selectVaried ∪ auto-skin)': `${chosenDisp.size}/${census.length} (${(chosenDisp.size / census.length * 100).toFixed(1)}%)`,
  '  ↳ חיווט-לוגיקה (נבחרו: MAP_ENGINES ∪ auto-logic)': `${chosenLogic.size}/${logic.length} (${(chosenLogic.size / logic.length * 100).toFixed(1)}%)`,
  'תצוגה · atom-index (widgets · הכרעה C)': census.length,
  '  ↳ seam': JSON.stringify(seam),
  '  ↳ נגישים-בהרכבה (selectVaried×400)': dispAll.size,
  '  ↳ פר-היבט': JSON.stringify(dispReach),
  'לוגיקה · logic-census': logic.length,
  '  ↳ wireable': wireable,
  '  ↳ מחוברים-למחולל (MAP_ENGINES)': engines.length,
  'דאטה · new/dart-data-maor': nd('new/dart-data-maor', /\.dart$/),
  'מקור-JS · new/atoms': nd('new/atoms'),
  'המרה · new/dart-maor': nd('new/dart-maor', /\.dart$/),
};
const structure = {
  'machtzev/ שורש (.mjs)': nd('machtzev', /\.mjs$/),
  'machtzev/ תת-תיקיות': (() => { try { return fs.readdirSync(path.join(ROOT, 'machtzev'), { withFileTypes: true }).filter((e) => e.isDirectory() && e.name !== 'node_modules' && !e.name.startsWith('.')).length; } catch { return 0; } })(),
  'generator/ קנוני': nd('machtzev/generator'),
  'generator/legacy/': nd('machtzev/generator/legacy'),
  'knowledge/ פעיל': nd('knowledge', /\.md$/),
  'knowledge/archive/': nd('knowledge/archive', /\.md$/),
  'שערי-משטרה (gates.tsv)': gatesTsv,
  'שערי-משטרה (police gate())': gateCalls,
};

const stamp = (o) => Object.entries(o).map(([k, v]) => `- **${k}:** ${v}`).join('\n');
const body = `# 📐 TRUTH — מקור-האמת-האחד (מחולל · נגזר-מהבייטים · אל תערוך ידנית)
> כל מספר כאן נמדד ע"י \`node machtzev/truth.mjs\` מהקוד עצמו. **אסור לצטט מספר-ענף שלא מכאן.**
> \`--gate\` נכשל אם הקובץ הזה סטה מהמדידה החיה. ריענון: \`node machtzev/truth.mjs --write\`.

## 3 השכבות של §21 (תצוגה · לוגיקה · דאטה)
${stamp(layers)}

## מבנה הענף
${stamp(structure)}

## אזהרת-אמת (הלקח שנקנה ביוקר)
"סידור-הענף" = פריסת-קבצים. "כמה/מה-מחובר" = **מדידה חוצת-3-שכבות**. אל תסיק תקרה משכבה-אחת.
המחולל מחובר: נבחרו-בפועל תצוגה=${chosenDisp.size} · לוגיקה=${chosenLogic.size} · נגישים-לבוררים ${reachTotal}/${eligible} · ממופים-לפעולה ${opsMapped}/${opsArr.filter((a) => a.layer !== 'data').length}. "נבחר" ≠ "נגיש": בורר בוחר אחד לתפקיד (L91) — מה שלא נבחר עדיין נגיש למשפט הבא.
`;

// 🔒 רַצֶ'ט-אי-נסיגה: חיווט רק-עולה. floor נשמר; --gate נכשל אם ירד מתחתיו (מונע חזרה-אחורה למטרה).
const FLOOR = path.join(ROOT, 'machtzev/wired-floor.json');
const readFloor = () => { try { return JSON.parse(fs.readFileSync(FLOOR, 'utf8')).wired || 0; } catch { return 0; } };
if (process.argv.includes('--write')) {
  fs.writeFileSync(path.join(ROOT, 'TRUTH.md'), body);
  // c5 · בלוק-אמת מחולל ב-CLAUDE.md (בין <!-- truth:begin --> ל-<!-- truth:end -->): המספרים בשער-הכניסה
  // נגזרים מהמדידה, לא נכתבים ביד (R2-4.7 · D1 תת-ספירה=אזעקה). הקובץ נעול — הבלוק פטור מכוונה: הוא פלט של truth.
  try {
    const cf = path.join(ROOT, 'CLAUDE.md'); const cur = fs.readFileSync(cf, 'utf8');
    const gatesN = (rd('machtzev/gates.tsv').split('\n').filter((l) => l && !l.startsWith('#'))).length;
    const pinsN = (rd('machtzev/pins.sha256').split('\n').filter(Boolean)).length;
    const block = `<!-- truth:begin · מחולל ע"י node machtzev/truth.mjs --write · אל תערוך ידנית -->\n` +
      `‏**${totalAtoms}** אטומים מאונדקסים (תצוגה **${census.length}** · לוגיקה **${logic.length}**) · נבחרו-בפועל-ע"י-הבוררים **${wiredTotal}** · נגישים-לבוררים **${reachTotal}** מתוך **${eligible}** כשירים (${(reachTotal / (eligible || 1) * 100).toFixed(1)}%) · ממופים-לפעולה **${opsMapped}**/${opsArr.filter((a) => a.layer !== 'data').length} · ` +
      `‏**${gatesN}** שערי-משטרה (gates.tsv) · **${pinsN}** קבצים נעולי-חתימה (pins.sha256) · זהב-מורכב-מחדש-מהקטלוג (G4) **${goldenLine}** · פלטי-מחולל שרונדרו-בפועל (G5b) **${genverifyLine}**\n<!-- truth:end -->`;
    const re = /<!-- truth:begin[^]*?<!-- truth:end -->/;
    if (re.test(cur)) { const next = cur.replace(re, block); if (next !== cur) { if (process.argv.includes('--gate')) { console.log('🔴 בלוק-האמת ב-CLAUDE.md סטה מהמחולל (R3-4.9) — node machtzev/truth.mjs --write'); process.exit(1); } fs.writeFileSync(cf, next); console.log('📐 CLAUDE.md truth-block עודכן'); } }
  } catch {}
  // c3ג · הרצפה זזה רק עם --floor (טבעת-push/CI, floor-advance) — לעולם לא מתוך hook (R2-4.5 · R2-5.7).
  if (process.argv.includes('--floor')) {
    const floor = Math.max(readFloor(), wiredTotal);   // מונוטוני — לעולם לא יורד
    fs.writeFileSync(FLOOR, JSON.stringify({ wired: floor, eligible, total: totalAtoms, note: 'רצפת-חיווט — רק-עולה. היעד: wired≡eligible (הכשירים-לחיווט), לא total.' }, null, 1) + '\n');
    console.log('📐 TRUTH.md + wired-floor=' + floor + ' נכתבו (' + wiredTotal + '/' + eligible + ' כשירים · ' + totalAtoms + ' סה"כ)');
  } else console.log('📐 TRUTH.md נכתב (' + wiredTotal + '/' + eligible + ' כשירים · ' + totalAtoms + ' סה"כ · רצפה ' + readFloor() + ' ללא שינוי; --floor להזזה)');
  process.exit(0);
}
if (process.argv.includes('--gate')) {
  const cur = rd('TRUTH.md');
  if (cur.trim() !== body.trim()) { console.error('🔴 TRUTH.md סטה מהמדידה החיה — הרץ `node machtzev/truth.mjs --write` וקבֵּע.'); process.exit(1); }
  const floor = readFloor();
  if (wiredTotal < floor) { console.error(`🔴 נסיגת-חיווט! ${wiredTotal} < רצפה ${floor} — §21 חזר-אחורה. אסור.`); process.exit(1); }
  console.log(`✓ אמת: TRUTH.md ≡ מדידה · חיווט ${wiredTotal}/${totalAtoms} ≥ רצפה ${floor} (רק-עולה)`); process.exit(0);
}
process.stdout.write(body + '\n');
