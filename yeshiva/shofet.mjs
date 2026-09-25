// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/shofet.mjs — ⚖️ **המחולל שואל את השופט** (systems-engine · packages/judge — מנוע טהור, 165 חוקי-מערכות).
//  ────────────────────────────────────────────────────────────────────────
//  הכרעת-בעלים 24.9 «כמו שהישיבה היא חלק מהמחולל — גם זה» ⇒ «צא לדרך». אחות ל-`ask.mjs` (הדלת לישיבה): שכבה אחת,
//  אפס הכרעה כאן — הפסק נולד ב-`pureJudge` ומוחזר כמו שהוא.
//  מה המחולל נותן לשופט שהשופט לא יודע לבד: **שאלות-המבנה** (29). אצל השופט הן נענות ביד או בניחוש-מילים (suggestStructure,
//  ביטחון נמוך); המחולל **יודע** מה בנה — ולכן עונה רק על מה שנכון בוודאות לפי האפליקציה עצמה:
//    · התראה עם סף אחד (נדלקת ונכבית באותו מספר)        ⇒ same_threshold
//    · אזור-המתנה (תקרה · שחרור במנות)                   ⇒ waiting
//    · מקור-נתונים חיצוני יחיד                            ⇒ single_dependency
//  מה שלא ידוע בוודאות — לא מסומן (USE.md: «סמן true רק למנגנונים שבאמת קיימים. אל תנחש כדי לעזור»).
//  שם כ-where נשלח בתוך «…» (USE.md של השופט: אות-ה בתחילת שם נשמרת — «התראה», לא «תראה»).
//  🔎 איתור לפי סימן בדיסק (`packages/judge/src/engine.ts`), כמו ask.mjs; אין ⇒ { available:false, reason } — «לא-נמדד».
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SIGN = 'packages/judge/src/engine.ts';
const CANDS = () => [process.env.SYSTEMS_ENGINE, path.resolve(HERE, '../../systems-engine'), path.resolve(HERE, '../systems-engine'), path.join(os.homedir(), 'systems-engine'), '/home/user/systems-engine'].filter(Boolean);
export function judgeHome() { const tried = []; for (const d of CANDS()) { const p = path.join(d, SIGN); tried.push(p); if (fs.existsSync(p)) return d; } judgeHome.reason = `אין ${SIGN} באף אחד מ: ${tried.join(' · ')} (SYSTEMS_ENGINE=<נתיב> · clone -b systems-engine meir7651231-ui/yeshiva-engine)`; return null; }
/** פסק אחד: case = { raw_text, where, structure, kind? } ⇒ { available, verdict, violations, text } */
export function judge(c) {
  const home = judgeHome(); if (!home) return { available: false, reason: judgeHome.reason };
  const f = path.join(os.tmpdir(), `shofet-${process.pid}-${Date.now()}.json`); fs.writeFileSync(f, JSON.stringify(c));
  const cli = path.join(home, 'packages/judge/src/pure-cli.ts');
  const j = spawnSync(process.execPath, [cli, f, '--json'], { encoding: 'utf8', timeout: 20000 });
  const t = spawnSync(process.execPath, [cli, f], { encoding: 'utf8', timeout: 20000 });
  try { fs.unlinkSync(f); } catch { /* קובץ-זמני */ }
  if (j.status === 2 || !j.stdout) return { available: true, error: (j.stderr || '').slice(0, 300) || `exit ${j.status}` };
  const r = JSON.parse(j.stdout); return { available: true, verdict: r.verdict, violations: r.violations || [], rejected: j.status === 1, text: t.stdout };
}
/** המבנה מתוך מה שהמחולל בנה — עובדות בלבד. מחזיר רשימת-מקרים (אחד לכל «איפה») */
export function casesOf({ alerts = [], buffers = [], feeds = [], app = '' }) {
  const out = [];
  for (const b of buffers) out.push({ raw_text: `${app}: אזור-המתנה «${b.seg}» — ממתינים מצטברים עד תקרה ${b.ceiling}, משוחררים ${b.batch} בכל ${b.everyMin} דקות.`, where: `«${b.seg}»`, structure: { waiting: true } });
  for (const a of alerts) out.push({ raw_text: `${app}: ${a.seg} — ההתראה נדלקת כשהערך חוצה ${a.n} ונכבית כשהוא חוזר מתחת ל-${a.n}, באותה נקודה בדיוק.`, where: `«${a.seg}»`, kind: 'feedback_loop', structure: { same_threshold: true } });
  if (feeds.length === 1) out.push({ raw_text: `${app}: הנתונים של «${feeds[0]}» מגיעים ממקור חיצוני אחד בלבד; האפליקציה מושכת ממנו כל כמה שניות.`, where: `«מקור ${feeds[0]}»`, kind: 'failure_point', structure: { single_dependency: true } });
  return out;
}
/** 🎲 הוכחת-המהלך בהרצה (כמו bridge/verify של השופט): בקר-הסף של systems-engine (dynamics.threshold — תרמוסטט עם פס-מת) +
 *  Rng עם זרע קבוע ⇒ אות סינתטי סביב הסף (רעש בגודל הפער), 1000 צעדים ⇒ כמה הדלקות בלי פער ועם הפער שהבעלים נתן.
 *  זה **רעש סינתטי מוצהר**, לא נתונים: הוא בודק שהמהלך עובד על רעש בגודל הזה — לא מנבא את המערכת. */
export function simulateHysteresis({ n, off, op = '>', steps = 1000, seed = 1 }) {
  const home = judgeHome(); if (!home) return { available: false, reason: judgeHome.reason };
  const url = (p) => 'file://' + path.join(home, p);
  const js = `const D = await import(${JSON.stringify(url('packages/dynamics/src/controllers.ts'))}); const C = await import(${JSON.stringify(url('packages/core/src/rng.ts'))});
const n = ${+n}, off = ${+off}, sgn = ${op === '>' ? -1 : 1}, gap = Math.abs(n - off), steps = ${+steps};
const run = (lo, hi) => { const rng = new C.Rng(${+seed}); const ctl = D.threshold({ low: sgn * n, high: sgn * lo, on: 1 }); let prev = 0, ons = 0, v = n;
  for (let i = 0; i < steps; i++) { v = n + rng.normal(0, gap / 2); const a = ctl(sgn * v); if (a && !prev) ons++; prev = a; } return ons; };
console.log(JSON.stringify({ without: run(n, n), with: run(off, off), steps, sd: gap / 2, seed: ${+seed} }));`;
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', js], { encoding: 'utf8', timeout: 20000 });
  if (r.status !== 0) return { available: true, error: (r.stderr || '').slice(0, 300) };
  return { available: true, ...JSON.parse(r.stdout) };
}
/** 🧭 אחים של השופט (packages/engines — «מנוע אי-ידיעה» ועוד): אותו חוזה — מבנה ⇒ פסק כמו שהוא. engine = 'uncertainty' … */
export function judgeWith(engine, c) {
  const home = judgeHome(); if (!home) return { available: false, reason: judgeHome.reason };
  const cli = path.join(home, 'packages/engines/cli.ts'); if (!fs.existsSync(cli)) return { available: false, reason: `אין ${cli} (עדכן את systems-engine)` };
  const f = path.join(os.tmpdir(), `shofet-${engine}-${process.pid}-${Date.now()}.json`); fs.writeFileSync(f, JSON.stringify(c));
  const j = spawnSync(process.execPath, [cli, engine, f, '--json'], { encoding: 'utf8', timeout: 20000 }); const t = spawnSync(process.execPath, [cli, engine, f], { encoding: 'utf8', timeout: 20000 });
  try { fs.unlinkSync(f); } catch { /* קובץ-זמני */ }
  if (!j.stdout) return { available: true, error: (j.stderr || '').slice(0, 300) || `exit ${j.status}` };
  let r = null; try { r = JSON.parse(j.stdout); } catch { return { available: true, error: 'פלט לא-JSON' }; }
  return { available: true, result: r, rejected: j.status === 1, text: t.stdout };
}
/** שני מקורות לאותו מספר (שדה-נוסחה «מוחלט(א-ב)») ⇒ מקרה למנוע אי-הידיעה */
export const twoSourceCase = ({ app, ent, a, b, field }) => ({ raw_text: `${app}: לכל ${ent} שני מקורות לאותו מספר — ${a} ו${b} — והם לא תמיד מסכימים (הפער נמדד בשדה ${field}).`, subject: `«${a} מול ${b} ב${ent}»`, structure: { experts_disagree: true } });
// ══ 🌉 סימולציית-תור מהמנוע (לא נוסחה משלנו): «המתנה צפויה של קצב, עמדות, דקות-טיפול» ⇒ Model של מנוע-המערכות.
//    אותה פונקציה (SIM_FN) רצה ב-JS (ציפייה/הערות לבעלים) ומומרת ל-Dart ע"י emitTs (האפליקציה) — שוויון הוכח ב-parity-ts.
//    רמז: ρ = קצב × טיפול ÷ עמדות ≥ 1 ⇒ התור גדל בלי גבול ⇒ Infinity (לא מספר מומצא).
const SIM_FILES = ['core/src/rng.ts', 'core/src/sim.ts', 'core/src/stats.ts', 'core/src/stock.ts', 'core/src/node.ts', 'core/src/atoms.ts', 'core/src/model.ts'];
export const SIM_FN = `
function simWaitRaw(rate, servers, svc) {
  if (!(rate > 0) || !(servers >= 1) || !(svc > 0)) return NaN;
  const c = Math.floor(servers);
  if (rate * svc >= c) return Infinity;
  const n = 4000; const T = n / rate;
  const m = new Model(1);
  m.source('in', { interarrival: { kind: 'exp', mean: 1 / rate } });
  m.station('s', { servers: c, service: { kind: 'exp', mean: svc } });
  m.sink('out'); m.chain('in', 's', 'out');
  m.run(T, T / 10);
  const st = m.report().nodes.find((x) => x.id === 's');
  return st.avgWait;
}`;
/** קובץ-Dart אחד לאפליקציה: שקעי-הממיר + ליבת-המנוע (מומרת עכשיו מה-TS) + simWaitMin עם זיכרון. אין מנוע ⇒ null + reason */
export async function simEngineDart() {
  const home = judgeHome(); if (!home) return { available: false, reason: judgeHome.reason };
  const { emitTs } = await import('../machtzev/emit/ast-js-to-dart.mjs');
  const H = fs.readFileSync(path.join(HERE, '../machtzev/emit/parity-ast.mjs'), 'utf8').match(/const H = `([^]*?)`;/)[1];
  const src = SIM_FILES.map((f) => fs.readFileSync(path.join(home, 'packages', f), 'utf8')).join('\n') + '\n' + SIM_FN;
  const code = `// 🌉 מנוע-המערכות (systems-engine/core) — הומר אוטומטית מ-TS (emitTs). לא לערוך ביד: נוצר מחדש בכל בנייה.\n// ignore_for_file: type=lint, unused_element, dead_code, argument_type_not_assignable, for_in_of_invalid_type, invalid_assignment, non_bool_condition, non_bool_operand, not_iterable_spread, return_of_invalid_type\n// (strict-casts של המארח: המרה-מרומזת מ-dynamic — מותרת בקומפיילר; ההוכחה = ריצה ב-flutter test)\n${H}\n${emitTs(src)}\nfinal Map<String, double> _simMemo = {};\n/** המתנה ממוצעת (דקות) בעמדה: קצב-הגעה לדקה · עמדות · דקות-טיפול לאדם. ρ≥1 ⇒ אינסוף. */\ndouble simWaitMin(num rate, num servers, num svc) => _simMemo.putIfAbsent('$rate|$servers|$svc', () => _toNum(simWaitRaw(rate, servers, svc)).toDouble());\n`;
  return { available: true, code };
}
/** אותו חישוב ב-JS (אותו מנוע, TS ישירות) — שורות [[קצב, עמדות, טיפול], …] ⇒ [המתנה…] */
export function simWaitJs(rows) {
  const home = judgeHome(); if (!home) return { available: false, reason: judgeHome.reason };
  const js = `const M = await import(${JSON.stringify('file://' + path.join(home, 'packages/core/src/index.ts'))}); const f = new Function('Model', ${JSON.stringify(SIM_FN + '\nreturn simWaitRaw;')})(M.Model);
console.log(JSON.stringify(${JSON.stringify(rows)}.map((a) => { const v = f(...a); return Number.isFinite(v) ? v : String(v); })));`;
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', js], { encoding: 'utf8', timeout: 60000 });
  if (r.status !== 0) return { available: true, error: (r.stderr || '').slice(0, 300) };
  return { available: true, values: JSON.parse(r.stdout).map((v) => typeof v === 'string' ? Number(v) : v) };
}

// 🔗 מנוע-התלות (systems-engine/sensors/graph.reach — «מה נופל איתו»): אותה פונקציה ב-JS ובאפליקציה (emitTs). קשתות מהרשומות:
//    שדה «down» (feeds) = הרשומה ⇒ הערך · שדה «up» (depends on) = הערך ⇒ הרשומה. ערך «שם:דקות» ⇒ השם. מפתח = השדה הראשון (כמו refCount).
export const GRAPH_FN = `
function reachCountRecs(recs: Array<Record<string, string>>, key: string, down: string[], up: string[], from: string): number {
  const succ = new Map<string, string[]>();
  const vals = (s: string): string[] => String(s ?? '').split(/[,;|]/).map((x) => x.split(':')[0].trim()).filter((x) => x.length > 0);
  for (const r of recs) {
    const me = String(r[key] ?? '').trim();
    for (const f of down) for (const v of vals(r[f])) { if (me.length > 0) { const l = succ.get(me) ?? []; l.push(v); succ.set(me, l); } }
    for (const f of up) for (const v of vals(r[f])) { if (me.length > 0) { const l = succ.get(v) ?? []; l.push(me); succ.set(v, l); } }
  }
  const g: Graph = { ids: [], type: new Map<string, string>(), succ: succ, pred: new Map<string, string[]>() };
  return reach(g, [from.trim()], 'down', new Set<string>()).size - 1;
}`;
export async function graphEngineDart() {
  const home = judgeHome(); if (!home) return { available: false, reason: judgeHome.reason };
  const { emitTs } = await import('../machtzev/emit/ast-js-to-dart.mjs');
  const H = fs.readFileSync(path.join(HERE, '../machtzev/emit/parity-ast.mjs'), 'utf8').match(/const H = `([^]*?)`;/)[1];
  const g = fs.readFileSync(path.join(home, 'packages/sensors/src/graph.ts'), 'utf8');
  const src = g.match(/export interface Graph[\s\S]*?\n}\n/)[0] + g.match(/export function reach[\s\S]*?\n}\n/)[0] + GRAPH_FN;
  const body = emitTs(src);
  const code = `// 🔗 מנוע-התלות (systems-engine/sensors/graph.reach) — הומר אוטומטית מ-TS (emitTs). לא לערוך ביד: נוצר מחדש בכל בנייה.\n// ignore_for_file: type=lint, unused_element, dead_code, argument_type_not_assignable, for_in_of_invalid_type, invalid_assignment, non_bool_condition, non_bool_operand, non_bool_negation_expression, not_iterable_spread, return_of_invalid_type\n${H}\n${body}\n`;
  return { available: true, code };
}
export async function reachCountJs(recs, key, down, up, from) {
  const home = judgeHome(); if (!home) return null; const G = await import('file://' + path.join(home, 'packages/sensors/src/graph.ts'));
  const { requireTs } = await import('../machtzev/lib-ts.mjs'); const ts = requireTs(); const js = ts.transpileModule(GRAPH_FN, { compilerOptions: { target: 99 } }).outputText;
  const f = new Function('reach', js + '\nreturn reachCountRecs;')(G.reach); return f(recs, key, down, up, from);
}
