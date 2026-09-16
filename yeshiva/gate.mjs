#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/gate.mjs — השער הישיבתי במשטרה (הכרעה-27 · "תחבר כבר את הכל").
//  ────────────────────────────────────────────────────────────────────────
//  מה הוא אוכף — שלושה דברים, כולם מדידים:
//   1) **טריות:** הפסק שבדיסק (yeshiva/psak/ · yeshiva/out/) ≡ ריצה טרייה.
//      פסק ישן בדיסק = ירוק-חלול (L27); דריפט ⇒ אדום + שחזור-מדויק (עץ-נח · L14).
//   2) **רצפת-ההכרעה:** המנוע פוסק לבד **רק-עולה**, מתגים **רק-יורדים**.
//   3) **אנטי-משחק:** הכיסוי (פירוקים · ממצאים) רק-עולה — אסור להוריד מתגים
//      ע"י צמצום-הנמדד.
//  fail-closed (L27): 0 פירוקים / 0 ממצאים = הכלי שבור, לא הנתונים ⇒ exit 2.
//  שימוש: node yeshiva/gate.mjs [--gate]
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = JSON.parse(fs.readFileSync(path.join(HERE, 'yeshiva-baseline.json'), 'utf8'));
const DIRS = ['psak', 'out'].map((d) => path.join(HERE, d));

const snap = (d) => { try { return Object.fromEntries(fs.readdirSync(d).map((f) => [f, fs.readFileSync(path.join(d, f), 'utf8')])); } catch { return {}; } };
const restore = (d, s) => { try { for (const f of fs.readdirSync(d)) if (!(f in s)) fs.unlinkSync(path.join(d, f)); } catch {} for (const [f, c] of Object.entries(s)) { try { fs.writeFileSync(path.join(d, f), c); } catch {} } };
const drift = (d, s) => { const now = snap(d); const out = []; for (const f of new Set([...Object.keys(s), ...Object.keys(now)])) if (s[f] !== now[f]) out.push(path.basename(d) + '/' + f); return out; };

const run = (script, args) => spawnSync(process.execPath, [path.join(HERE, script), ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const before = DIRS.map(snap);
const rd = run('read.mjs', ['--all']);
const ap = run('apply.mjs', ['--all', '--json']);
if (rd.status !== 0 || ap.status !== 0) {
  console.error(`🛠️ yeshiva: read=${rd.status} apply=${ap.status} — הכלי שבור, לא הנתונים (fail-closed)`);
  DIRS.forEach((d, i) => restore(d, before[i]));
  process.exit(2);
}

let J; try { J = JSON.parse(String(ap.stdout).trim().split('\n').pop()); } catch { J = null; }
const per = (J && J.per || []).filter((x) => !x.skipped);
const perukim = per.length;
const findings = per.reduce((a, x) => a + (x.findings || 0), 0);
const decided = per.reduce((a, x) => a + (x.decided || 0), 0);
const switches = per.reduce((a, x) => a + (x.switches || 0), 0);
if (!perukim || !findings) {
  console.error(`🛠️ yeshiva: ${perukim} פירוקים · ${findings} ממצאים — הכלי שבור, לא הנתונים (fail-closed)`);
  DIRS.forEach((d, i) => restore(d, before[i]));
  process.exit(2);
}

const fails = [];
const stale = DIRS.flatMap((d, i) => drift(d, before[i]));
if (stale.length) fails.push(`${stale.length} קבצי-פסק אינם טריים: ${stale.slice(0, 6).join(' · ')}${stale.length > 6 ? ' …' : ''} (הרץ read.mjs/apply.mjs ו-commit)`);
DIRS.forEach((d, i) => restore(d, before[i]));   // עץ-נח תמיד (L14)

if (decided < BASE.decided) fails.push(`${decided} פסק-לבד < רצפה ${BASE.decided} (הכרעה רק-עולה)`);
if (switches > BASE.switches) fails.push(`${switches} מתגים > רצפה ${BASE.switches} (מתגים רק-יורדים)`);
if (perukim < BASE.perukim) fails.push(`${perukim} פירוקים < רצפה ${BASE.perukim} (כיסוי רק-עולה)`);
if (findings < BASE.findings) fails.push(`${findings} ממצאים < רצפה ${BASE.findings} (כיסוי רק-עולה)`);

console.log(`  ${perukim} פירוקים · ${findings} ממצאים · ${decided} פסק המנוע לבד · ${switches} מתגים (רצפה ${BASE.decided}/${BASE.switches})`);
if (fails.length) { for (const m of fails) console.error('🚨 yeshiva: ' + m); process.exit(1); }
const up = decided - BASE.decided, down = BASE.switches - switches;
console.log(`✅ yeshiva: הפסק טרי · ${decided}/${findings} הכריע המנוע לבד${up ? ` ⬆ ${up}` : ''}${down ? ` · מתגים ⬇ ${down} — עדכן את המניפסט` : ''}`);
