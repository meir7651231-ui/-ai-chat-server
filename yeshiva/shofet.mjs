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
  for (const b of buffers) out.push({ raw_text: `${app}: אזור-המתנה «${b.seg}» — ממתינים מצטברים עד תקרה ${b.ceiling}, משוחררים ${b.batch} בכל ${b.everyMin} דקות.`, where: b.seg, structure: { waiting: true } });
  for (const a of alerts) out.push({ raw_text: `${app}: ${a.seg} — ההתראה נדלקת כשהערך חוצה ${a.n} ונכבית כשהוא חוזר מתחת ל-${a.n}, באותה נקודה בדיוק.`, where: a.seg, kind: 'feedback_loop', structure: { same_threshold: true } });
  if (feeds.length === 1) out.push({ raw_text: `${app}: הנתונים של «${feeds[0]}» מגיעים ממקור חיצוני אחד בלבד; האפליקציה מושכת ממנו כל כמה שניות.`, where: `מקור «${feeds[0]}»`, kind: 'failure_point', structure: { single_dependency: true } });
  return out;
}
