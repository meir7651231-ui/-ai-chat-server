#!/usr/bin/env node
/** מחצב · המאמת-העצמאי (PROTOCOL v4 §5.2) — c5 של §12.
 *  לא חומה. עד. מריץ את כלי-המשטרה מ-tag ידוע-טוב (T) על העץ הנוכחי (H), ובודק **כיוון**: הפרוטוקול רק גדל.
 *  שימוש: node machtzev/verify-independent.mjs <T: tag|sha> <H: sha|branch> [--repo <dir>] [--report <file.json>] [--expect-sha <sha>]
 *  יציאה: 0 ירוק (מועמד-לקידום — הקידום עצמו = ack של הבעלים) · 2 צהוב/לא-מוכח (אין קידום) · 1 אדום (החלשה) · 3 tamper.
 *  צעדים (§5.2): 1 זהות (T ≡ --expect-sha) · 3 שני worktrees + קריאה דרך git show · 4 כיוון פר-commit ב-T..H
 *  (tuples gate(id,script,skip) · מניפסט-baselines · fixtures) · 5 הוכחת-ירי: fixtures של T על סקריפטי H ·
 *  6 שתי משטרות מלאות: H-tools על H · T-tools על H (MACHTZEV_ROOT) · 8 דוח תמיד. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync, spawnSync } from 'node:child_process';
const argv = process.argv.slice(2);
const opt = (f, d = null) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : d; };
const [T_REF, H_REF] = argv.filter((a, i) => !a.startsWith('--') && (i === 0 || !argv[i - 1].startsWith('--')));
const REPO = path.resolve(opt('--repo', '.'));
const REPORT = opt('--report');
const EXPECT = opt('--expect-sha');
if (!T_REF || !H_REF) { console.error('usage: verify-independent.mjs <T> <H> [--repo dir] [--report f] [--expect-sha sha]'); process.exit(2); }
const git = (...a) => execFileSync('git', ['-C', REPO, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const show = (sha, p) => { try { return git('show', `${sha}:${p}`); } catch { return null; } };
const report = { when: new Date().toISOString(), repo: REPO, T: T_REF, H: H_REF, steps: {}, verdict: 'red', advance: false };
const out = (k, v) => { report.steps[k] = v; };
const done = (verdict, code) => { report.verdict = verdict; report.advance = false; if (REPORT) fs.writeFileSync(REPORT, JSON.stringify(report, null, 1) + '\n'); console.log(`\n${verdict === 'green' ? '✅ ירוק — מועמד-לקידום (הקידום = ack של הבעלים)' : verdict === 'yellow' ? '🟡 צהוב/לא-מוכח — אין קידום' : verdict === 'tamper' ? '🚨 TAMPER' : '🚨 אדום — החלשה'} · ${JSON.stringify({ T: report.tSha, H: report.hSha })}`); process.exit(code); };

// ── 1 · זהות ──
let tSha, hSha;
try { tSha = git('rev-parse', `${T_REF}^{commit}`); hSha = git('rev-parse', `${H_REF}^{commit}`); } catch (e) { out('identity', 'rev-parse failed: ' + e.message); done('yellow', 2); }
report.tSha = tSha; report.hSha = hSha;
if (EXPECT && (EXPECT.length < 12 || !tSha.startsWith(EXPECT))) { out('identity', `tag ${T_REF}=${tSha} ≠ recorded ${EXPECT} (קידומת ≥ 12 תווים)`); done('tamper', 3); }
out('identity', { tSha, hSha, ancestor: (() => { try { git('merge-base', '--is-ancestor', tSha, hSha); return true; } catch { return false; } })() });
if (!report.steps.identity.ancestor) { out('identity_note', 'T אינו אב של H — היסטוריה שוכתבה (force/rebase של הענף)'); done('red', 1); }

// ── 3 · materialize ──
const WT = fs.mkdtempSync(path.join(os.tmpdir(), 'machtzev-verify-'));
const T = path.join(WT, 'T'), H = path.join(WT, 'H');
git('worktree', 'add', '--detach', T, tSha); git('worktree', 'add', '--detach', H, hSha);
process.on('exit', () => { try { git('worktree', 'remove', '--force', T); git('worktree', 'remove', '--force', H); fs.rmSync(WT, { recursive: true, force: true }); } catch {} });
for (const wt of [T, H]) { const nm = path.join(REPO, 'machtzev/node_modules'); if (fs.existsSync(nm) && !fs.existsSync(path.join(wt, 'machtzev/node_modules'))) fs.cpSync(nm, path.join(wt, 'machtzev/node_modules'), { recursive: true }); }

// ── 4 · כיוון פר-commit ──
const narrowsFast = (skip) => skip === 'FAST' || /^FAST(\s*&&\s*!?[A-Za-z_$][\w$]*)+$/.test(skip);   // FAST && X מדלג רק כש-FAST מדלג ⇒ צמצום, לא החלשה
const tuples = (sha) => { const s = show(sha, 'machtzev/police.mjs') || ''; return Object.fromEntries([...s.matchAll(/^\s*gate(?:Dirty)?\(\s*'([^']+)'\s*,\s*'([^']+)'(?:\s*,\s*\[[^\]]*\])?(?:\s*,\s*([^)]+))?\)/gm)].map((m) => [m[1], { script: m[2], skip: (m[3] || '').trim() }])); };
const manifest = (sha) => { const s = show(sha, 'machtzev/gates.tsv') || ''; const m = {}; for (const l of s.split('\n')) { if (!l || l.startsWith('#')) continue; const p = l.split('\t'); const b = (p[3] || '').match(/^(?:baseline=)?([^;]+);(?:dir=)?(shrink|grow)$/); m[p[0]] = { layer: p[2] || '', baseline: b ? { file: 'machtzev/' + b[1], dir: b[2] } : null }; } return m; };
const commits = git('rev-list', '--reverse', `${tSha}..${hSha}`).split('\n').filter(Boolean);
const direction = [];
let prev = tSha, weak = 0;
for (const sha of commits) {
  const a = tuples(prev), b = tuples(sha), ma = manifest(prev), mb = manifest(sha);
  const issues = [];
  for (const id of Object.keys(a)) {
    if (!b[id]) issues.push(`שער נמחק: ${id}`);
    else { if (b[id].script !== a[id].script) issues.push(`סקריפט הוחלף: ${id} ${a[id].script}→${b[id].script}`); if (b[id].skip && b[id].skip !== a[id].skip && !narrowsFast(b[id].skip)) issues.push(`skip חדש: ${id}=${b[id].skip}`); }
  }
  for (const id of Object.keys(ma)) if (!mb[id]) issues.push(`רשומת-מרשם נמחקה: ${id}`);
  for (const id of Object.keys(mb)) {
    const bl = mb[id].baseline; if (!bl) continue;
    const before = show(prev, bl.file), after = show(sha, bl.file);
    if (before === null || after === null || before === after) continue;
    let A, B; try { A = JSON.parse(before); B = JSON.parse(after); } catch { issues.push(`baseline לא-JSON: ${bl.file}`); continue; }
    if (bl.dir === 'shrink') { const sa = new Set(Array.isArray(A) ? A : Object.keys(A)); const sb = Array.isArray(B) ? B : Object.keys(B); const grew = sb.filter((x) => !sa.has(x)); if (grew.length) issues.push(`baseline גדל (${bl.file}): +${grew.length} ${grew.slice(0, 3).join(',')}`); }
    else { for (const k of Object.keys(A)) if (typeof A[k] === 'number' && typeof B[k] === 'number' && B[k] < A[k]) issues.push(`ראצ׳ט ירד (${bl.file}.${k}): ${A[k]}→${B[k]}`); }
  }
  direction.push({ sha: sha.slice(0, 8), issues }); if (issues.length) weak++;
  prev = sha;
}
out('direction', { commits: commits.length, weakenings: weak, detail: direction.filter((d) => d.issues.length) });

// ── 5 · הוכחת-ירי: fixtures של T (וגם של H) על סקריפטי H ──
const FX = path.join(WT, 'fixtures'); fs.mkdirSync(FX);
for (const src of [path.join(T, 'machtzev/selftest-fixtures'), path.join(H, 'machtzev/selftest-fixtures')]) if (fs.existsSync(src)) for (const f of fs.readdirSync(src)) fs.copyFileSync(path.join(src, f), path.join(FX, f));
const st = spawnSync('node', [path.join(H, 'machtzev/police-selftest.mjs')], { env: { ...process.env, SELFTEST_FIXTURES: FX, MACHTZEV_ROOT: '' }, encoding: 'utf8', timeout: 600000 });
const pairsH = (st.stdout.match(/זוגות-הוכחה[^:]*:\s*(\d+)\/(\d+)/) || [])[1];
const stT = spawnSync('node', [path.join(T, 'machtzev/police-selftest.mjs')], { encoding: 'utf8', timeout: 600000 });
const pairsT = (stT.stdout.match(/זוגות-הוכחה[^:]*:\s*(\d+)\/(\d+)/) || [])[1];
out('fires', { selftestHonH: st.status, pairsH: Number(pairsH ?? -1), pairsT: Number(pairsT ?? -1), failedLines: (st.stdout.match(/❌.*$/gm) || []).slice(0, 10) });

// ── 6 · שתי משטרות מלאות ──
const police = (tools, root, label) => {
  const r = spawnSync('node', [path.join(tools, 'machtzev/police.mjs')], { env: { ...process.env, MACHTZEV_ROOT: root }, encoding: 'utf8', timeout: 1800000, maxBuffer: 64 * 1024 * 1024 });
  const sum = (r.stdout.match(/המשטרה [^\n]*/) || [''])[0];
  const rec = { status: r.status, summary: sum, failed: (r.stdout.match(/^failed [^\n]*/gm) || []), yellow: (r.stdout.match(/^yellow [^\n]*/gm) || []),
    ran: (r.stdout.match(/^ran ([a-z-]+)/gm) || []).map((l) => l.slice(4)), unknownToTools: (r.stderr.match(/שער רשום שלא רץ ולא דווח: ([a-z-]+)/g) || []).map((l) => l.split(': ')[1]) };
  out(label, rec); return rec;
};
const hhR = police(H, H, 'police_H_on_H'), hh = hhR.status;
const thR = police(T, H, 'police_T_on_H'); let th = thR.status;
// שער שנוסף ב-H (במרשם, לא מוכר לכלי-T): T לא יכול לערוב לו — H-on-H ערב (ran). אדום רק אם T-tools נכשלו/צהובים/שער-T נעלם.
if (th === 1 && !thR.failed.length && !thR.yellow.length && thR.unknownToTools.length && thR.unknownToTools.every((id) => hhR.ran.includes(id))) {
  out('extra_gates_vouched_by_H', thR.unknownToTools); th = 0;
}

// ── פסק-דין ──
if (weak) done('red', 1);
if (st.status !== 0 || hh === 1 || th === 1) done('red', 1);
if (Number(pairsH) < Number(pairsT)) { out('fires_note', `unproven עלה: T ${pairsT} → H ${pairsH}`); done('red', 1); }
if (hh === 2 || th === 2) done('yellow', 2);
done('green', 0);
