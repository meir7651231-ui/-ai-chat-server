#!/usr/bin/env node
// 🚔 police-bench — the machine. Generic report gate for the 50-task benchmark.
// usage: node police-bench.mjs --root <repo> --task <id> [--claims <claims.json>] [--out <report.json>] [--tasks <tasks.json>]
// Verdict DONE iff every mandatory check is true. Exit 0 = DONE, 1 = NOT DONE. Nothing here trusts the agent.
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import { spawnSync } from 'node:child_process';
const argv = process.argv.slice(2); const opt = (k, d = null) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const ROOT = path.resolve(opt('--root', '.')); const TID = opt('--task'); const BENCH = path.dirname(new URL(import.meta.url).pathname);
const TASKS = JSON.parse(fs.readFileSync(opt('--tasks', path.join(BENCH, 'tasks.json')), 'utf8'));
const task = TASKS.find((t) => t.id === TID); if (!task) { console.error('unknown task', TID); process.exit(2); }
const BASE = opt('--base', '/tmp/base-hashes.txt');
const claimsFile = opt('--claims'); let claims = { claims: [], notes: '' };
try { if (claimsFile && fs.existsSync(claimsFile)) claims = JSON.parse(fs.readFileSync(claimsFile, 'utf8')); } catch { claims = { claims: [], notes: '(claims.json unreadable)' }; }
const sh = (cmd, args, cwd = ROOT) => spawnSync(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 240000, killSignal: 'SIGKILL' });   /* 4 min per step: a hung/looping engine counts as a failed step */
const hashes = () => sh('bash', ['-c', 'cd new && find dart-gen-bs dart-data-bs -type f | sort | xargs sha256sum']).stdout;
const ns = task.ns; const R = {}; const detail = {};
// 1 regen (minus tighten) + hand-edit
const pre = hashes();
const { REGEN } = await import(path.join(ROOT, 'machtzev/generator/regen.mjs'));
let regenFail = 0; const regenErr = [];
for (const s of REGEN) { if (/tighten|peruk\.mjs/.test(s.rel)) continue; /* tighten: known-broken · peruk.mjs: would regenerate specs-ds/peruk*.txt from peruks/*.md and erase the agent's spec edits (benchmark treats specs-ds as the source) */ const r = sh('node', [path.join(ROOT, s.rel), ...s.args]); if (r.status !== 0) { regenFail++; regenErr.push(`${s.rel} ${s.args.join(' ')}: ${(r.stderr || '').split('\n').filter(Boolean).slice(-2).join(' | ').slice(0, 200)}`); } }
R.regen_ok = regenFail === 0; detail.regen_errors = regenErr.slice(0, 5);
const post = hashes(); R.no_hand_edit = pre === post;
// 2 byte identity of everything outside the task namespace (peruk tasks: balagan is a legitimate downstream)
const strip = (t) => t.split('\n').filter((l) => l && !l.includes(`_${ns}_`) && !l.includes('balagan')).join('\n');   /* balagan = downstream aggregate of every paper module (peruk/tasks/calendar): legitimately changes with the task's app */
if (fs.existsSync(BASE)) { const a = strip(fs.readFileSync(BASE, 'utf8')), b = strip(post); R.byte_identical_others = a === b; if (!R.byte_identical_others) { const sa = new Set(a.split('\n')), sb = new Set(b.split('\n')); detail.changed_others = [...sb].filter((l) => !sa.has(l)).map((l) => l.split(/\s+/).pop()).slice(0, 8); } } else R.byte_identical_others = null;
// 3 gates (the five generator gates)
const gates = { 'app-from-sentences': [], retarget: [], 'skin-golden': [], peruk: [], particles: [] }; const gateRes = {};
for (const g of Object.keys(gates)) { if (g === 'peruk' && /^peruk/.test(ns)) { gateRes[g] = 'skipped'; continue; } /* benchmark designates specs-ds/<ns>.txt as the source for peruk apps; the peruk gate checks specs-ds ≡ derived-from-peruks/*.md and would reject every legitimate spec edit */ const r = sh('node', [path.join(ROOT, `machtzev/generator/${g}.mjs`), '--gate']); gateRes[g] = r.status; }
R.gates_pass = Object.values(gateRes).every((s) => s === 0 || s === 'skipped'); detail.gates = gateRes;
// 4 no Hebrew in engine code (added lines, comments stripped)
const diff = sh('git', ['diff', 'HEAD', '--', 'machtzev/generator/*.mjs', 'machtzev/*.mjs']).stdout;
const heb = diff.split('\n').filter((l) => l.startsWith('+') && !l.startsWith('+++')).map((l) => l.slice(1).replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '').replace(/֐-׿/g, '').replace(/[׳״]/g, '')).filter((l) => /[֐-׿]/.test(l) && (/(===|!==|==|!=)\s*['"][^'"]*[֐-׿]/.test(l) || /['"][^'"]*[֐-׿][^'"]*['"]\s*(===|!==|==|!=)/.test(l) || /\.(includes|startsWith|endsWith|indexOf)\(\s*['"][^'"]*[֐-׿]/.test(l) || (/\/[^\/\n]*[֐-׿][^\/\n]*\/[gimsuy]*\.(test|match)\(/.test(l) || (/\/[^\/\n]*[֐-׿][^\/\n]*\//.test(l) && /\.(test|match)\(/.test(l))) || /case\s+['"][^'"]*[֐-׿]/.test(l)));   /* domain vocabulary in engine LOGIC: a Hebrew literal compared/matched/searched. Messages, spec-text builders, emitted code and morphology regexes are not violations */
R.no_hebrew_in_engine = heb.length === 0; detail.hebrew_lines = heb.slice(0, 3).map((l) => l.trim().slice(0, 100));
// 4b orphans: generated app files whose namespace has no spec (e.g. app-ds run without --name ⇒ gen_app_ent1.dart)
{ const specs = new Set(fs.readdirSync(path.join(ROOT, 'machtzev/generator/specs-ds')).filter((f) => f.endsWith('.txt')).map((f) => f.replace(/\.txt$/, '').toLowerCase().replace(/[^a-z0-9]/g, ''))); const known = new Set([...specs, 'balagan']);
  const baseFiles = new Set(fs.existsSync(BASE) ? fs.readFileSync(BASE, 'utf8').split('\n').map((l) => l.split(/\s+/).pop()).filter(Boolean) : []);   // files that exist in the baseline (e.g. the acceptance app gen_app_ent1*) are not orphans
  const orphan = (dir) => (f) => { const m = f.match(/^gen_app_([a-z0-9]*)_/); return m && !known.has(m[1]) && !baseFiles.has(dir + '/' + f); };
  const o1 = fs.readdirSync(path.join(ROOT, 'new/dart-gen-bs')).filter(orphan('dart-gen-bs')).map((f) => 'new/dart-gen-bs/' + f); const o2 = fs.readdirSync(path.join(ROOT, 'new/dart-data-bs/auto')).filter(orphan('dart-data-bs/auto')).map((f) => 'new/dart-data-bs/auto/' + f);
  detail.orphan_files = [...o1, ...o2]; R.no_orphans = detail.orphan_files.length === 0; }
// 5 dart sanity: no `.sqrt()` / `.min(` / `.max(` method calls on num (dart:math functions are top-level)
const genDir = path.join(ROOT, 'new/dart-gen-bs'); const nsFiles = fs.readdirSync(genDir).filter((f) => f.startsWith(`gen_app_${ns}_`));
const rd = (f) => { const p = path.isAbsolute(f) ? f : path.join(genDir, f); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : ''; };
const badMath = nsFiles.filter((f) => /(?<!math)\.(sqrt|min|max|pow)\(/.test(rd(f))); R.dart_math_sane = badMath.length === 0; detail.bad_math_files = badMath;
// 5b compile (optional, --compile <app_flutter copy>): mirror new/ like ship.mjs does, run flutter analyze lib/genesis; errors in this app's files = fail
const APPC = opt('--compile'); if (APPC) { const mir = sh('node', [path.join(BENCH, '..', 'repos', 'mirror.mjs'), ROOT, APPC]); const an = spawnSync('flutter', ['analyze', 'lib/genesis'], { cwd: APPC, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 420000, env: { ...process.env, PATH: '/opt/flutter/bin:' + process.env.PATH } }); const errs = ((an.stdout || '') + (an.stderr || '')).split('\n').filter((l) => /^ *error •/.test(l)); const nsErrs = errs.filter((l) => l.includes(`gen_app_${ns}_`)); R.compiles = mir.status === 0 && an.status !== null && nsErrs.length === 0; detail.compile = { errors: errs.length, ns_errors: nsErrs.length, sample: nsErrs.slice(0, 4).map((l) => l.trim().slice(0, 160)) }; }
// 6 task checks
const dataDir = path.join(ROOT, 'new/dart-data-bs/auto');
const contentOf = (screen) => rd(path.join(dataDir, `gen_app_${ns}_${screen}_content.dart`));
const genOf = (screen) => rd(`gen_app_${ns}_${screen}.dart`);
const constsFor = (screen, value) => { const out = []; const re = /const String (gen_app_\w+_c\d+) = '((?:[^'\\]|\\.)*)';/g; let m; const c = contentOf(screen); while ((m = re.exec(c))) if (m[2] === value) out.push(m[1]); return out; };
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const fileOf = (spec) => { const [kind, screen] = spec.split(':'); return kind === 'data' ? contentOf(screen) : genOf(screen); };
const allNsText = () => nsFiles.map(rd).join('\n') + fs.readdirSync(dataDir).filter((f) => f.startsWith(`gen_app_${ns}_`)).map((f) => rd(path.join(dataDir, f))).join('\n');
const sortLines = (screen) => { const L = genOf(screen).split('\n'); const out = []; L.forEach((l, i) => { if (/\.sort\(|sorted\(|_sorted\(|sortBy|orderBy|\.reversed|compareTo/.test(l)) out.push(L.slice(i, i + 9).join('\n')); }); return out; };
const checkers = {
  lit: (c) => { const t = fileOf(c.file); const n = (t.match(new RegExp(esc(c.text), 'g')) || []).length; return [n >= (c.min || 1), `${n}×`]; },
  regex: (c) => { const t = fileOf(c.file); const n = (t.match(new RegExp(c.pattern, 'g')) || []).length; return [n >= (c.min || 1), `${n}×`]; },
  absent: (c) => { const t = c.file ? fileOf(c.file) : allNsText(); const n = (t.match(new RegExp(c.pattern || esc(c.text), 'g')) || []).length; return [n === 0, `${n}×`]; },
  exists: (c) => { const t = fileOf(c.file); return [t.length > 0, t.length ? 'file' : 'missing']; },
  calc: (c) => { const ks = constsFor(c.ent, c.label); const g = genOf(c.ent); const hit = ks.filter((k) => g.includes(`_calc(${k}`) || g.includes(`_live(${k}`)); return [hit.length > 0, `consts=${ks.length} calc=${hit.length}`]; },   /* _live = conditional derived field (compileCond) — a computed field too */
  sort: (c) => { const labels = c.labels || [c.label]; const lines = sortLines(c.px); const ok = labels.every((lab) => { const ks = constsFor(c.px, lab); return lines.some((l) => ks.some((k) => l.includes(k))); }); return [ok, `sortlines=${lines.length}`]; },
  sortdesc: (c) => { const ks = constsFor(c.px, c.label); const lines = sortLines(c.px).filter((l) => ks.some((k) => l.includes(k))); const ok = lines.some((l) => /\.reversed/.test(l) || (l.indexOf('(b[') >= 0 && l.indexOf('(b[') < l.indexOf('(a[')) || /b\[[^\]]+\][^;]*?compareTo\([^;]*?a\[/.test(l.split('..sort(').pop() || '')); return [ok, `sortlines=${lines.length}`]; },
  count: (c) => { const ks = constsFor(c.px, c.label); const g = genOf(c.px); return [ks.length > 0 && /\.where\(/.test(g), `consts=${ks.length}`]; },
  math: (c) => { const g = genOf(c.ent); const imp = /import 'dart:math'/.test(g); const fn = new RegExp(`(^|[^.\\w])(math\\.)?${c.fn}\\(`, 'm').test(g); const bad = new RegExp(`(?<!math)\\.${c.fn}\\(`).test(g); return [imp && fn && !bad, `import=${imp} fn=${fn} method=${bad}`]; },
  method: (c) => { const g = genOf(c.ent); const n = (g.match(new RegExp(`\\.${c.fn}\\(\\)`, 'g')) || []).length; return [n >= 1, `${n}×`]; },
  num: (c) => { const g = genOf(c.ent); const n = (g.match(new RegExp(`(^|[^\\d.])${esc(String(c.value))}([^\\d]|$)`, 'g')) || []).length; return [n >= 1, `${n}×`]; },
  lit_any: (c) => { const hits = c.files.filter((f) => (fileOf(f).match(new RegExp(esc(c.text), 'g')) || []).length >= 1); return [hits.length > 0, hits.join(',') || 'none']; },
  sort_any: (c) => { const labels = c.labels || [c.label]; const okScreens = c.screens.filter((sc) => { const lines = sortLines(sc); return labels.every((lab) => { const ks = constsFor(sc, lab); return lines.some((l) => ks.some((k) => l.includes(k))); }); }); return [okScreens.length > 0, okScreens.join(',') || 'none']; },
  sortdesc_any: (c) => { const okScreens = c.screens.filter((sc) => { const ks = constsFor(sc, c.label); return sortLines(sc).filter((l) => ks.some((k) => l.includes(k))).some((l) => /\.reversed/.test(l) || (l.indexOf('(b[') >= 0 && l.indexOf('(b[') < l.indexOf('(a[')) || /b\[[^\]]+\][^;]*?compareTo\([^;]*?a\[/.test(l.split('..sort(').pop() || '') || /\bdesc\b|descending|reverse/i.test(l) || /return -c\b/.test(l)); }); return [okScreens.length > 0, okScreens.join(',') || 'none']; },
  dash: (c) => { const files = fs.readdirSync(dataDir).filter((f) => new RegExp(`^gen_app_${ns}_scr\\d+_content\\.dart$`).test(f)); const hit = files.filter((f) => { const scr = f.replace(`gen_app_${ns}_`, '').replace('_content.dart', ''); const ks = constsFor(scr, c.label); return ks.length && ks.some((k) => genOf(scr).includes(k)); }); return [hit.length > 0, hit.join(',') || 'no dashboard screen references the label']; },
  mathx: (c) => { const ks = constsFor(c.ent, c.label); const g = genOf(c.ent); const line = g.split('\n').find((l) => ks.some((k) => l.includes(`_calc(${k}`) || l.includes(`_live(${k}`))) || '';   /* _live = conditional field: `a > b ? a : b` is a legitimate max/min */ const fn = new RegExp(`(^|[^.\\w])(math\\.)?${c.fn}\\(`).test(line); const alt = / \? |reduce\(|\.clamp\(/.test(line); const bad = new RegExp(`(?<!math)\\.${c.fn}\\(`).test(line); return [line.length > 0 && (fn || alt) && !bad, `calc=${line.length > 0} fn=${fn} alt=${alt} method=${bad}`]; },
  columns: (c) => { const g = genOf(c.px); const m = g.match(/columns:\s*\[([^\]]*)\]/); const n = m ? (m[1].match(/_c\d+/g) || []).length : -1; return [n === c.n, `columns=${n}`]; },
};
const taskRes = [];
for (const c of task.checks) { let ok = false, info = ''; try { [ok, info] = checkers[c.kind](c); } catch (e) { info = 'err ' + e.message; } R[c.id] = ok; taskRes.push({ id: c.id, ok, info, mandatory: c.mandatory !== false }); }
// verdict
const mandatoryGeneric = ['regen_ok', 'byte_identical_others', 'no_orphans', 'gates_pass', 'no_hebrew_in_engine', 'dart_math_sane', ...(APPC ? ['compiles'] : [])];   // no_hand_edit is informational: it cannot tell a hand-edit under new/ from an un-regenerated spec edit (both are overwritten by regen, so the task checks judge the truth)
const missing = [...mandatoryGeneric.filter((k) => R[k] === false), ...taskRes.filter((t) => t.mandatory && !t.ok).map((t) => t.id)];
const done = missing.length === 0;
const claimRows = (claims.claims || []).map((c) => ({ text: String(c.text || '').slice(0, 160), check: c.check, verdict: !(c.check in R) ? 'UNVERIFIED' : R[c.check] ? 'CONFIRMED' : 'FALSE' }));
const sig = crypto.createHash('sha256').update(post + JSON.stringify(R)).digest('hex').slice(0, 16);
const report = { task: TID, ns, verdict: done ? 'DONE' : 'NOT DONE', missing, checks: R, task_checks: taskRes, detail, claims: claimRows, false_claims: claimRows.filter((c) => c.verdict === 'FALSE').length, signature: sig, at: new Date().toISOString() };
let md = `# 🚔 police-bench — ${TID} (${ns}) · signature ${sig}\n\n| check | result |\n|---|---|\n`;
for (const k of [...mandatoryGeneric, 'no_hand_edit']) { const v = R[k]; md += `| ${k}${k === 'no_hand_edit' ? ' (info)' : ''} | ${v ? '✅' : v === null ? '⚪' : '❌'} |\n`; }
for (const t of taskRes) md += `| ${t.id}${t.mandatory ? '' : ' (info)'} | ${t.ok ? '✅' : '❌'} ${t.info} |\n`;
if (detail.regen_errors?.length) md += `\nregen errors: ${detail.regen_errors.join(' ‖ ')}\n`;
if (detail.changed_others?.length) md += `\nchanged outside ${ns}: ${detail.changed_others.join(', ')}\n`;
if (detail.hebrew_lines?.length) md += `\nhebrew in engine: ${detail.hebrew_lines.join(' ‖ ')}\n`;
if (detail.orphan_files?.length) md += `\norphan generated files (no spec — delete them): ${detail.orphan_files.slice(0, 6).join(' ')}${detail.orphan_files.length > 6 ? ' …' : ''}\n`;
if (detail.compile) md += `\ncompile: analyzer errors total=${detail.compile.errors} in-app=${detail.compile.ns_errors}${detail.compile.sample.length ? ' ‖ ' + detail.compile.sample.join(' ‖ ') : ''}\n`;
if (detail.bad_math_files?.length) md += `\ninvalid dart math method calls in: ${detail.bad_math_files.join(', ')}\n`;
md += `\n## claims vs machine\n| claim | check | verdict |\n|---|---|---|\n` + claimRows.map((c) => `| ${c.text.replace(/\|/g, '/')} | ${c.check} | ${c.verdict} |`).join('\n') + '\n';
md += `\n## VERDICT: **${report.verdict}**${done ? '' : ' — missing: ' + missing.join(', ')}\n`;
const out = opt('--out'); if (out) { fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, JSON.stringify(report, null, 1)); fs.writeFileSync(out.replace(/\.json$/, '.md'), md); }
console.log(md); process.exit(done ? 0 : 1);
