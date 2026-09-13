#!/usr/bin/env node
// 🚔 harness/police.mjs — המכונה, בגרסה שאינה קשורה לשום פרויקט.
//   הפסק ניתן ע"י תוכנית, לא ע"י המודל ולא ע"י בן-אדם. הכל מגיע מ-harness.json שיושב בריפו.
//
//   שימוש:
//     node harness/police.mjs --baseline            # לפני שנוגעים: build + חתימות ⇒ .harness/baseline.txt
//     node harness/police.mjs [--scope <תבנית>] [--claims claims.json] [--out report.json]
//
//   שערי-חובה (כולם מוגדרים ב-harness.json; שער בלי הגדרה מדולג ומדווח ⚪):
//     build        · פקודת-הבנייה של הפרויקט מסתיימת ב-0
//     no_hand_edit · הפלט אחרי build זהה לפלט שלפניו ⇒ אף אחד לא ערך ידנית קובץ מחולל
//     in_scope     · אף קובץ-פלט מחוץ ל--scope לא השתנה מול הבסיס (רדיוס-הפגיעה)
//     gates        · כל פקודות-השערים של הפרויקט מסתיימות ב-0
//     verify       · פקודת-האימות (קומפילציה/טסטים) מסתיימת ב-0
//     forbid_diff  · תבניות אסורות בשורות שנוספו לקוד-המקור
//     forbid_out   · תבניות אסורות בפלט המחולל
//     no_orphans   · אין קובץ-פלט בלי מקור שמייצר אותו
//   טענות: claims.json = {"claims":[{"check":"<id>","text":"…"}],"notes":"…"} — כל טענה מסומנת CONFIRMED / FALSE / UNVERIFIED.
//   יציאה: 0 = DONE · 1 = NOT DONE · 2 = תקלת-הגדרה.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const argv = process.argv.slice(2);
const opt = (k, d = null) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const has = (k) => argv.includes(k);
const ROOT = path.resolve(opt('--root', '.'));
const CFG_PATH = opt('--config', path.join(ROOT, 'harness.json'));
// ── --init: מזהה את הפרויקט וכותב harness.json פותח (אפס-הגדרות למתחיל) ──
if (has('--init')) {
  const R0 = (c) => spawnSync(c, { cwd: ROOT, shell: true, encoding: 'utf8' });
  const j = (f) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch { return null; } };
  const pkg = j('package.json'); const cfg = { name: path.basename(ROOT), outputs_cmd: 'git ls-files -z | xargs -0 sha256sum' };
  const scripts = (pkg && pkg.scripts) || {};
  if (pkg) { if (scripts.build) cfg.build = 'npm run build';
             cfg.verify = scripts.test ? 'npm test' : (scripts.typecheck ? 'npm run typecheck' : (fs.existsSync(path.join(ROOT, 'tsconfig.json')) ? 'npx tsc --noEmit' : null));
             if (scripts.lint) cfg.gates = [{ name: 'lint', cmd: 'npm run lint' }]; }
  else if (fs.existsSync(path.join(ROOT, 'pubspec.yaml'))) { cfg.verify = 'flutter test'; cfg.gates = [{ name: 'analyze', cmd: 'flutter analyze 2>&1 | grep -c "^ *error •" | grep -qx 0' }]; }
  else if (fs.existsSync(path.join(ROOT, 'pyproject.toml')) || fs.existsSync(path.join(ROOT, 'requirements.txt'))) { cfg.verify = 'python -m pytest -q'; }
  else if (fs.existsSync(path.join(ROOT, 'go.mod'))) { cfg.build = 'go build ./...'; cfg.verify = 'go test ./...'; }
  else if (fs.existsSync(path.join(ROOT, 'Cargo.toml'))) { cfg.build = 'cargo build'; cfg.verify = 'cargo test'; }
  if (!cfg.verify) delete cfg.verify;
  cfg.mandatory = ['in_scope', ...(cfg.build ? ['build', 'no_hand_edit'] : []), ...(cfg.gates ? ['gates'] : []), ...(cfg.verify ? ['verify'] : [])];
  cfg.state_dir = '.harness'; cfg.timeout_s = 900;
  if (R0('git rev-parse --is-inside-work-tree').status !== 0) { console.error('✗ זה לא ריפו git — המנוע צריך git כדי לדעת מה השתנה'); process.exit(2); }
  fs.writeFileSync(CFG_PATH, JSON.stringify(cfg, null, 2) + '\n');
  console.log(`📝 נכתב ${path.relative(ROOT, CFG_PATH)}:`);
  console.log(`   מה משתנה: כל קובץ ש-git עוקב אחריו`);
  console.log(`   ${cfg.build ? 'בנייה: ' + cfg.build : 'בנייה: אין (השער מדולג)'}`);
  console.log(`   ${cfg.verify ? 'אימות: ' + cfg.verify : '⚠ אימות: לא נמצאה פקודת-טסטים — מלא ידנית את "verify", זה השער הכי חשוב'}`);
  console.log(`   ${cfg.gates ? 'שערים: ' + cfg.gates.map((g) => g.name).join(', ') : 'שערים: אין'}`);
  console.log(`\nהצעד הבא:  node ${path.relative(ROOT, process.argv[1])} --baseline    (לפני שהסוכן נוגע)`);
  process.exit(0);
}
if (!fs.existsSync(CFG_PATH)) { console.error(`✗ אין ${path.relative(ROOT, CFG_PATH)} — הרץ:  node ${path.relative(ROOT, process.argv[1])} --init`); process.exit(2); }
const CFG = JSON.parse(fs.readFileSync(CFG_PATH, 'utf8'));
const HDIR = path.join(ROOT, CFG.state_dir || '.harness');
const BASE = opt('--baseline-file', path.join(HDIR, 'baseline.txt'));
const SCOPE = opt('--scope', CFG.default_scope || null);
const TIMEOUT = (CFG.timeout_s || 600) * 1000;

const sh = (cmd, cwd = ROOT) => spawnSync(cmd, { cwd, shell: true, encoding: 'utf8', maxBuffer: 128 * 1024 * 1024, timeout: TIMEOUT, killSignal: 'SIGKILL' });
const tail = (r, n = 3) => ((r.stderr || '') + (r.stdout || '')).split('\n').filter(Boolean).slice(-n).join(' ‖ ').slice(0, 300);

// ── רשימת קובצי-הפלט + חתימותיהם (הגדרת ה"פלט" מגיעה מהקונפיג) ──
const outputsCmd = CFG.outputs_cmd || (CFG.outputs ? `find ${CFG.outputs.map((o) => `'${o}'`).join(' ')} -type f 2>/dev/null | sort | xargs -r sha256sum` : null);
const OUTC = outputsCmd || 'git ls-files -z | xargs -0 sha256sum';   // בלי הגדרה: כל מה ש-git עוקב אחריו (שער-רדיוס עובד ביום הראשון)
const hashes = () => sh(OUTC).stdout || '';

// ── מצב --baseline: בונים פעם אחת ושומרים חתימות ──
if (has('--baseline')) {
  if (CFG.build) { const r = sh(CFG.build); if (r.status !== 0) { console.error(`✗ build נכשל: ${tail(r)}`); process.exit(2); } }
  fs.mkdirSync(HDIR, { recursive: true });
  const h = hashes(); fs.writeFileSync(BASE, h);
  console.log(`📌 בסיס נשמר: ${h.split('\n').filter(Boolean).length} קבצים ⇒ ${path.relative(ROOT, BASE)}`);
  process.exit(0);
}

const R = {}, detail = {};

// 1 · build + אין-עריכה-ידנית (הפלט אחרי build זהה לפלט שלפניו)
if (CFG.build) {
  const pre = hashes();
  const r = sh(CFG.build);
  R.build = r.status === 0; if (!R.build) detail.build_error = tail(r, 5);
  R.no_hand_edit = pre === hashes();
} else { R.build = null; R.no_hand_edit = null; }

const post = hashes();

// 2 · רדיוס-הפגיעה: מה מותר היה להשתנות
if (fs.existsSync(BASE)) {
  const parse = (t) => new Map(t.split('\n').filter(Boolean).map((l) => { const i = l.indexOf(' '); return [l.slice(i).trim().replace(/^\*/, ''), l.slice(0, i)]; }));
  const a = parse(fs.readFileSync(BASE, 'utf8')), b = parse(post);
  const scopeRe = SCOPE ? new RegExp(SCOPE) : null;
  const allowRe = CFG.always_allowed ? new RegExp(CFG.always_allowed) : null;
  const changed = [];
  for (const [f, h] of b) if (a.get(f) !== h) changed.push(f);
  for (const f of a.keys()) if (!b.has(f)) changed.push(f + ' (נמחק)');
  const outside = changed.filter((f) => !(scopeRe && scopeRe.test(f)) && !(allowRe && allowRe.test(f)));
  R.in_scope = outside.length === 0;
  detail.changed_in_scope = changed.length - outside.length;
  detail.changed_outside = outside.slice(0, 10);
} else { R.in_scope = null; detail.baseline = 'חסר — הרץ --baseline לפני העבודה'; }

// 3 · שערי-הפרויקט
if (CFG.gates?.length) {
  const res = {};
  for (const g of CFG.gates) { const name = typeof g === 'string' ? g : g.name; const cmd = typeof g === 'string' ? g : g.cmd; const r = sh(cmd); res[name] = r.status; if (r.status !== 0) (detail.gate_errors ??= {})[name] = tail(r); }
  R.gates = Object.values(res).every((s) => s === 0); detail.gates = res;
} else R.gates = null;

// 4 · אימות: קומפילציה / טסטים
if (CFG.verify) {
  if (CFG.verify_pre) sh(CFG.verify_pre);
  const r = sh(CFG.verify);
  R.verify = r.status === 0; if (!R.verify) detail.verify_error = tail(r, 6);
} else R.verify = null;

// 4b · חבילת-השערים האוניברסלית: כשלי-סוכן שאינם תלויים בשום פרויקט או שפה.
//      פועלת כברירת-מחדל (`universal: false` בקונפיג מכבה). מקור-האמת = ה-diff מול HEAD.
if (CFG.universal !== false) {
  const diff = sh(CFG.diff_cmd || 'git diff HEAD').stdout || '';
  const files = []; let cur = null;
  for (const l of diff.split('\n')) {
    const m = l.match(/^\+\+\+ b\/(.+)$/); if (m) { cur = { f: m[1], add: [], del: [] }; files.push(cur); continue; }
    if (!cur) continue;
    if (l.startsWith('+') && !l.startsWith('+++')) cur.add.push(l.slice(1));
    else if (l.startsWith('-') && !l.startsWith('---')) cur.del.push(l.slice(1));
  }
  const isTest = (f) => /(^|\/)(test|tests|spec|__tests__)\//.test(f) || /[._-](test|spec)\.[a-z]+$/i.test(f) || /_test\.[a-z]+$/.test(f);
  const noComment = (l) => !/^\s*(\/\/|#|\*|--)/.test(l);
  const hits = {};
  const flag = (k, msg) => { (hits[k] ??= []).push(msg.slice(0, 140)); };

  // (1) הטסטים לא הוחלשו — הכשל הקלאסי: הסוכן משנה את הטסט כדי שיעבור
  const SKIP = /\b(it|test|describe|context)\.(skip|todo)\b|\bx(it|describe|test)\s*\(|@(Ignore|Disabled)\b|\bt\.Skip\(|@pytest\.mark\.(skip|xfail)|\bskip\s*:\s*true|\.skip\s*\(/;
  const DECL = /\b(it|test|describe)\s*\(|\bdef test_|\bfunc Test[A-Z]|#\[test\]|@Test\b/g;
  const ASSERT = /\b(assert|expect|should|require\.)/;
  for (const F of files.filter((x) => isTest(x.f))) {
    const dAdd = (F.add.join('\n').match(DECL) || []).length, dDel = (F.del.join('\n').match(DECL) || []).length;
    if (dDel > dAdd) flag('tests_not_weakened', `${F.f}: נמחקו ${dDel - dAdd} טסטים`);
    const aAdd = F.add.filter((l) => ASSERT.test(l)).length, aDel = F.del.filter((l) => ASSERT.test(l)).length;
    if (aDel > aAdd) flag('tests_not_weakened', `${F.f}: נמחקו ${aDel - aAdd} בדיקות(assert)`);
    for (const l of F.add) if (SKIP.test(l) && noComment(l)) { flag('tests_not_weakened', `${F.f}: הושבת טסט — ${l.trim()}`); break; }
  }

  // (2) אין סוד בקוד
  const SEC = [/(api[_-]?key|secret|passwd|password|token|bearer)\s*[:=]\s*['"][^'"\s]{12,}/i, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /\bsk-[A-Za-z0-9]{20,}/, /AKIA[0-9A-Z]{16}/, /ghp_[A-Za-z0-9]{20,}/];
  for (const F of files) for (const l of F.add) if (noComment(l) && SEC.some((re) => re.test(l))) { flag('no_secrets', `${F.f}: ${l.trim()}`); break; }

  // (3) אין שאריות-ניפוי
  const DBG = /\bconsole\.(log|debug)\s*\(|\bdebugger\b|\bprint\s*\(|\bdbg!\s*\(|\bfmt\.Print(ln)?\s*\(|\bvar_dump\s*\(/;
  for (const F of files.filter((x) => !isTest(x.f))) for (const l of F.add) if (DBG.test(l) && noComment(l)) { flag('no_debug_left', `${F.f}: ${l.trim()}`); break; }

  // (4) אין בליעת-שגיאות שקטה
  const SWALLOW = /catch\s*(\([^)]*\))?\s*\{\s*\}|except\s*:\s*pass\b|catch\s*\{\s*\}|\brescue\s*;?\s*end\b|_\s*=\s*err\b/;
  for (const F of files) for (const l of F.add) if (SWALLOW.test(l) && noComment(l)) { flag('no_swallowed_errors', `${F.f}: ${l.trim()}`); break; }

  // (5) תלות חדשה = החלטה, לא תופעת-לוואי
  const MAN = /(^|\/)(package\.json|go\.mod|Cargo\.toml|pubspec\.yaml|requirements\.txt|pyproject\.toml|Gemfile|composer\.json)$/;
  const depNames = (txt, f) => {   // שמות-תלויות בלבד, לא כל שורה במניפסט
    try {
      if (/\.json$/.test(f)) { const o = JSON.parse(txt); return new Set([...Object.keys(o.dependencies || {}), ...Object.keys(o.devDependencies || {}), ...Object.keys(o.require || {})]); }
      if (/go\.mod$/.test(f)) return new Set([...txt.matchAll(/^\s*([\w.\-\/]+)\s+v[\d]/gm)].map((m) => m[1]));
      const out = new Set(); let inDeps = false;
      for (const l of txt.split('\n')) {
        if (/^\s*(\[.*dependencies.*\]|dependencies:|dev_dependencies:|require)/i.test(l)) { inDeps = true; continue; }
        if (/^\S/.test(l) && !/^\s/.test(l) && inDeps && !/^\s*[\w@.\/-]+\s*[:=]/.test(l)) inDeps = false;
        const m = inDeps && l.match(/^\s+['"]?([\w@.\/-]+)['"]?\s*[:=]/); if (m) out.add(m[1]);
      }
      return out;
    } catch { return null; }
  };
  for (const F of files.filter((x) => MAN.test(x.f))) {
    const now = fs.existsSync(path.join(ROOT, F.f)) ? fs.readFileSync(path.join(ROOT, F.f), 'utf8') : '';
    const was = sh(`git show HEAD:'${F.f}'`).stdout || '';
    const A = depNames(now, F.f), B = depNames(was, F.f);
    if (A && B) { const neu = [...A].filter((d) => !B.has(d)); if (neu.length) flag('deps_declared', `${F.f}: תלויות חדשות — ${neu.join(', ')}`); }
    else if (F.add.length) flag('deps_declared', `${F.f}: המניפסט השתנה (${F.add.length} שורות)`);
  }

  // (6) אין מחיקת-קבצים בלי שנתבקשה
  const deleted = (sh('git diff HEAD --diff-filter=D --name-only').stdout || '').split('\n').filter(Boolean);
  if (deleted.length) flag('no_deletions', `${deleted.length} קבצים נמחקו: ${deleted.slice(0, 3).join(' ')}`);

  const UNIV = ['tests_not_weakened', 'no_secrets', 'no_debug_left', 'no_swallowed_errors', 'deps_declared', 'no_deletions'];
  const off = new Set(CFG.universal_off || []);
  for (const k of UNIV) if (!off.has(k)) { R[k] = !hits[k]; if (hits[k]) (detail.universal ??= {})[k] = hits[k].slice(0, 3); }
}

// 5 · תבניות אסורות בשורות שנוספו לקוד-המקור
if (CFG.forbid_in_diff?.length) {
  const diff = sh(CFG.diff_cmd || 'git diff HEAD').stdout || '';
  const added = diff.split('\n').filter((l) => l.startsWith('+') && !l.startsWith('+++')).map((l) => l.slice(1));
  const hits = [];
  for (const f of CFG.forbid_in_diff) { const re = new RegExp(f.pattern); const bad = added.filter((l) => re.test(l) && !(f.unless && new RegExp(f.unless).test(l))); if (bad.length) hits.push(`${f.name}: ${bad[0].trim().slice(0, 100)}`); }
  R.forbid_diff = hits.length === 0; detail.forbid_diff = hits;
} else R.forbid_diff = null;

// 6 · תבניות אסורות בפלט המחולל
if (CFG.forbid_in_output?.length) {
  const files = post.split('\n').filter(Boolean).map((l) => l.slice(l.indexOf(' ')).trim().replace(/^\*/, ''));
  const hits = [];
  for (const f of CFG.forbid_in_output) {
    const re = new RegExp(f.pattern), only = f.files ? new RegExp(f.files) : null;
    for (const rel of files) { if (only && !only.test(rel)) continue; const p = path.join(ROOT, rel); if (!fs.existsSync(p)) continue; const t = fs.readFileSync(p, 'utf8'); if (re.test(t)) { hits.push(`${f.name}: ${rel}`); break; } }
  }
  R.forbid_out = hits.length === 0; detail.forbid_out = hits;
} else R.forbid_out = null;

// 7 · יתומים: קובץ-פלט שאין לו מקור
if (CFG.orphans) {
  const { produced, name_from, sources_cmd } = CFG.orphans;
  const known = new Set((sh(sources_cmd).stdout || '').split('\n').map((s) => s.trim()).filter(Boolean));
  (CFG.orphans.also_known || []).forEach((k) => known.add(k));
  const baseFiles = new Set(fs.existsSync(BASE) ? fs.readFileSync(BASE, 'utf8').split('\n').map((l) => l.slice(l.indexOf(' ')).trim()).filter(Boolean) : []);
  const prodRe = new RegExp(produced), nameRe = new RegExp(name_from);
  const files = post.split('\n').filter(Boolean).map((l) => l.slice(l.indexOf(' ')).trim().replace(/^\*/, ''));
  const orphans = files.filter((f) => prodRe.test(f) && !baseFiles.has(f)).filter((f) => { const m = path.basename(f).match(nameRe); return m && !known.has(m[1]); });
  R.no_orphans = orphans.length === 0; detail.orphans = orphans.slice(0, 8);
} else R.no_orphans = null;

// ── פסק ──
const UNIVERSAL = CFG.universal === false ? [] : ['tests_not_weakened', 'no_secrets', 'no_debug_left', 'no_swallowed_errors', 'deps_declared', 'no_deletions'].filter((k) => !(CFG.universal_off || []).includes(k));
const MANDATORY = [...(CFG.mandatory || ['build', 'no_hand_edit', 'in_scope', 'gates', 'verify', 'forbid_diff', 'forbid_out', 'no_orphans']), ...UNIVERSAL];
const missing = MANDATORY.filter((k) => R[k] === false);
const done = missing.length === 0;

let claims = { claims: [], notes: '' };
const cf = opt('--claims'); try { if (cf && fs.existsSync(cf)) claims = JSON.parse(fs.readFileSync(cf, 'utf8')); } catch { claims.notes = '(claims.json לא נקרא)'; }
const rows = (claims.claims || []).map((c) => ({ text: String(c.text || '').slice(0, 160), check: c.check, verdict: !(c.check in R) || R[c.check] === null ? 'UNVERIFIED' : R[c.check] ? 'CONFIRMED' : 'FALSE' }));

const sig = crypto.createHash('sha256').update(post + JSON.stringify(R)).digest('hex').slice(0, 16);
const report = { project: CFG.name || path.basename(ROOT), scope: SCOPE, verdict: done ? 'DONE' : 'NOT DONE', missing, checks: R, detail, claims: rows, false_claims: rows.filter((c) => c.verdict === 'FALSE').length, signature: sig, at: new Date().toISOString() };

const icon = (v) => v === true ? '✅' : v === null ? '⚪ (לא מוגדר)' : '❌';
let md = `# 🚔 ${report.project}${SCOPE ? ` · scope=${SCOPE}` : ''} · ${sig}\n\n| שער | תוצאה |\n|---|---|\n`;
for (const k of MANDATORY) md += `| ${k} | ${icon(R[k])} |\n`;
if (detail.build_error) md += `\nbuild: ${detail.build_error}\n`;
if (detail.changed_outside?.length) md += `\n**מחוץ לרדיוס (${detail.changed_outside.length}):** ${detail.changed_outside.join(' · ')}\n`;
if (detail.gate_errors) md += `\nשערים אדומים: ${Object.entries(detail.gate_errors).map(([k, v]) => `${k} — ${v}`).join(' ‖ ')}\n`;
if (detail.verify_error) md += `\nverify: ${detail.verify_error}\n`;
if (detail.forbid_diff?.length) md += `\nתבנית אסורה בקוד: ${detail.forbid_diff.join(' ‖ ')}\n`;
if (detail.forbid_out?.length) md += `\nתבנית אסורה בפלט: ${detail.forbid_out.join(' ‖ ')}\n`;
if (detail.orphans?.length) md += `\nקבצים יתומים (מחק אותם): ${detail.orphans.join(' ')}\n`;
if (detail.universal) md += '\n' + Object.entries(detail.universal).map(([k, v]) => `**${k}:** ${v.join(' ‖ ')}`).join('\n') + '\n';
if (detail.baseline) md += `\n⚠ ${detail.baseline}\n`;
if (rows.length) md += `\n## טענות מול המכונה\n| טענה | שער | פסק |\n|---|---|---|\n` + rows.map((c) => `| ${c.text.replace(/\|/g, '/')} | ${c.check} | ${c.verdict} |`).join('\n') + '\n';
md += `\n## פסק: **${report.verdict}**${done ? '' : ' — חסר: ' + missing.join(', ')}\n`;

const out = opt('--out');
if (out) { fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true }); fs.writeFileSync(out, JSON.stringify(report, null, 1)); fs.writeFileSync(out.replace(/\.json$/, '.md'), md); }
console.log(md);
process.exit(done ? 0 : 1);
