#!/usr/bin/env node
// 🔒 harness/guard.mjs — שכבת-המניעה. מה שאי-אפשר לתקן בדיעבד, מונעים מראש.
//   המכונה (police.mjs) מגלה נזק אחרי שקרה. הקובץ הזה מונע שלוש משפחות של נזק שאין ממנו חזרה:
//     1. פקודות-הרס  — הסוכן לא יכול להריץ deploy/reset-db/migrate; הן מוחלפות בבדל שיוצא 2 עם הסבר.
//     2. שכתוב-היסטוריה — commit/push חסומים ע"י hook, כך שהעבודה נשארת ניתנת-לבדיקה.
//     3. חבלה-בשופט — harness.json, police.mjs והבסיס נחתמים; שינוי בהם = שער אדום (harness_intact).
//
//   שימוש:
//     node harness/guard.mjs --arm       # לפני שהסוכן נוגע (run.sh עושה את זה לבד)
//     node harness/guard.mjs --disarm    # מחזיר הכל בדיוק כפי שהיה
//     node harness/guard.mjs --status
//     node harness/guard.mjs --tools     # מדפיס ALLOW=/DENY= עבור claude -p (--open = בלי רשימת-היתר, לשימוש אינטראקטיבי)
//
//   הגדרה (harness.json → "guard"): { "quarantine": [...], "deny": [...], "allow": [...],
//                                     "block_commits": true, "allow_network": false }
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);
const opt = (k, d = null) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const has = (k) => argv.includes(k);
const ROOT = path.resolve(opt('--root', '.'));
const CFG_PATH = opt('--config', path.join(ROOT, 'harness.json'));
if (!fs.existsSync(CFG_PATH)) { console.error(`✗ אין ${path.relative(ROOT, CFG_PATH)} — הרץ תחילה: node harness/police.mjs --init`); process.exit(2); }
const CFG = JSON.parse(fs.readFileSync(CFG_PATH, 'utf8'));
const G = CFG.guard || {};
const HDIR = path.join(ROOT, CFG.state_dir || '.harness');
const ARMED = path.join(HDIR, 'ARMED.json');
const QDIR = path.join(HDIR, 'quarantine');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const HREL = path.relative(ROOT, HERE) || 'harness';
const sha = (p) => (fs.existsSync(p) ? crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') : null);
const sh = (c) => spawnSync(c, { cwd: ROOT, shell: true, encoding: 'utf8' });

// ── רשימת-האיסור המובנית: פקודות שאף משימת-קוד לא צריכה, ושעולה ביוקר לגלות אותן בדיעבד ──
const DENY_BASE = [
  // היסטוריה: הסוכן לא כותב את הרשומה שעליה שופטים אותו
  'Bash(git commit *)', 'Bash(git push *)', 'Bash(git reset *)', 'Bash(git checkout *)', 'Bash(git restore *)',
  'Bash(git stash *)', 'Bash(git clean *)', 'Bash(git rebase *)', 'Bash(git filter-branch *)', 'Bash(git update-ref *)',
  // מחיקה בלתי-הפיכה
  'Bash(rm -r*)', 'Bash(rm -f*)', 'Bash(sudo *)', 'Bash(chattr *)', 'Bash(chmod -R *)', 'Bash(dd *)', 'Bash(mkfs*)', 'Bash(truncate *)',
  // עולם-אמיתי: פריסה, תשתית, פרסום
  'Bash(gh pr merge *)', 'Bash(gh release *)', 'Bash(npm publish*)', 'Bash(docker push *)',
  'Bash(kubectl *)', 'Bash(terraform apply*)', 'Bash(terraform destroy*)', 'Bash(aws *)', 'Bash(gcloud *)',
  'Bash(firebase deploy*)', 'Bash(vercel *)', 'Bash(heroku *)', 'Bash(fly deploy*)', 'Bash(ssh *)', 'Bash(scp *)',
  // השופט: אסור לגעת במנוע, בהגדרה, ובבסיס-ההשוואה
  `Edit(./${HREL}/**)`, `Edit(./${path.relative(ROOT, CFG_PATH)})`, `Edit(./${path.relative(ROOT, HDIR)}/**)`,   // Edit(path) חל על כל כלי-הכתיבה; Write(path) אינו כלל-הרשאות תקף וה-CLI דוחה את כל הריצה בגללו
  'Bash(* --baseline*)', 'Bash(*guard.mjs*)',
];
const DENY_NET = ['Bash(curl *)', 'Bash(wget *)', 'Bash(nc *)'];
const ALLOW_BASE = [
  'Read', 'Glob', 'Grep', 'Edit', 'Write', 'TodoWrite',
  'Bash(ls *)', 'Bash(cat *)', 'Bash(head *)', 'Bash(tail *)', 'Bash(sed -n *)', 'Bash(grep *)', 'Bash(rg *)',
  'Bash(find *)', 'Bash(wc *)', 'Bash(diff *)', 'Bash(sort *)', 'Bash(uniq *)', 'Bash(awk *)', 'Bash(cut *)', 'Bash(tr *)',
  'Bash(echo *)', 'Bash(printf *)', 'Bash(pwd)', 'Bash(true)', 'Bash(mkdir *)', 'Bash(cp *)', 'Bash(sha256sum *)',
  'Bash(git diff *)', 'Bash(git status *)', 'Bash(git log *)', 'Bash(git show *)', 'Bash(git ls-files *)',
  'Bash(node *)', 'Bash(npm test*)', 'Bash(npm run *)', 'Bash(npx *)', 'Bash(pytest*)', 'Bash(python -m pytest*)',
  'Bash(go test*)', 'Bash(go build*)', 'Bash(cargo *)', 'Bash(flutter *)', 'Bash(dart *)', 'Bash(make *)',
];
// פקודות-הפרויקט עצמו (בנייה, אימות, שערים) תמיד מותרות — אחרת הסוכן לא יכול להריץ את השער שלפיו שופטים אותו
const own = [CFG.build, CFG.verify, CFG.verify_pre, ...(CFG.gates || []).map((g) => (typeof g === 'string' ? g : g.cmd))].filter(Boolean);
const OWN = own.flatMap((c) => { const w = c.trim().split(/\s+/)[0]; return [`Bash(${c})`, ...(/^[\w.\/-]+$/.test(w) ? [`Bash(${w} *)`] : [])]; });
const uniq = (a) => [...new Set(a)].join(',');
const DENY = uniq([...DENY_BASE, ...(G.allow_network ? [] : DENY_NET), ...(G.deny || [])]);
const ALLOW = uniq([...ALLOW_BASE, ...OWN, ...(G.allow || [])]);

if (has('--tools')) {
  if (has('--json')) console.log(JSON.stringify({ allow: ALLOW.split(','), deny: DENY.split(',') }, null, 1));
  else { console.log(`ALLOW='${has('--open') ? '' : ALLOW}'`); console.log(`DENY='${DENY}'`); }
  process.exit(0);
}

if (has('--status')) {
  if (!fs.existsSync(ARMED)) { console.log('🔓 לא דרוך'); process.exit(1); }
  const s = JSON.parse(fs.readFileSync(ARMED, 'utf8'));
  const bad = Object.entries(s.integrity).filter(([f, h]) => sha(path.join(ROOT, f)) !== h).map(([f]) => f);
  console.log(`🔒 דרוך מאז ${s.at}`);
  console.log(`   בהסגר: ${s.quarantined.length ? s.quarantined.map((q) => q.f).join(', ') : '—'}`);
  console.log(`   commit/push: ${s.hooks.length ? 'חסום' : 'פתוח'}`);
  console.log(`   שלמות-השופט: ${bad.length ? '❌ שונו: ' + bad.join(', ') : '✅'}`);
  process.exit(bad.length ? 1 : 0);
}

// ── בדל: מחליף פקודה הרסנית. נבחר לפי סיומת כדי שגם `node x.mjs` וגם `./x.sh` ייכשלו עם הודעה ברורה ──
const stub = (f) => {
  const msg = `🔒 ${f} בהסגר לזמן המשימה (harness/guard.mjs). זו פקודה הרסנית — אם באמת צריך אותה, בקש מבן-אדם.`;
  if (/\.(mjs|js|cjs|ts)$/.test(f)) return `#!/usr/bin/env node\nconsole.error(${JSON.stringify(msg)});\nprocess.exit(2);\n`;
  if (/\.py$/.test(f)) return `#!/usr/bin/env python3\nimport sys\nprint(${JSON.stringify(msg)}, file=sys.stderr)\nsys.exit(2)\n`;
  return `#!/bin/sh\necho ${JSON.stringify(msg)} >&2\nexit 2\n`;
};

if (has('--arm')) {
  if (fs.existsSync(ARMED)) { console.error('✗ כבר דרוך. הרץ --disarm קודם.'); process.exit(2); }
  fs.mkdirSync(QDIR, { recursive: true });
  const state = { at: new Date().toISOString(), quarantined: [], hooks: [], integrity: {}, immutable: [] };

  for (const rel of G.quarantine || []) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) { console.error(`  ⚠ ${rel} — לא קיים, מדולג`); continue; }
    const save = path.join(QDIR, rel.replace(/[/\\]/g, '__'));
    fs.copyFileSync(p, save);
    const mode = fs.statSync(p).mode;
    fs.writeFileSync(p, stub(rel)); fs.chmodSync(p, mode);
    if (spawnSync('chattr', ['+i', p]).status === 0) state.immutable.push(rel);
    const clean = sh(`git diff --quiet -- '${rel}' && git diff --cached --quiet -- '${rel}'`).status === 0;
    state.quarantined.push({ f: rel, save: path.relative(ROOT, save), mode, clean });
  }

  if (G.block_commits !== false) {
    const raw = (sh('git rev-parse --git-path hooks').stdout || '').trim();
    if (raw) {
      const dir = path.isAbsolute(raw) ? raw : path.join(ROOT, raw);
      fs.mkdirSync(dir, { recursive: true });
      for (const h of ['pre-commit', 'pre-push']) {
        const p = path.join(dir, h);
        if (fs.existsSync(p)) { fs.copyFileSync(p, path.join(QDIR, `hook__${h}`)); state.hooks.push({ h, p, had: true }); }
        else state.hooks.push({ h, p, had: false });
        fs.writeFileSync(p, `#!/bin/sh\necho "🔒 ${h} חסום ע\\"י harness/guard.mjs — הסוכן לא כותב את ההיסטוריה שעליה שופטים אותו." >&2\nexit 1\n`);
        fs.chmodSync(p, 0o755);
      }
    }
  }

  // שלמות-השופט: מי ששופט לא ייערך ע"י הנשפט. כולל את הבסיס — אחרת אפשר "לאפס" את רדיוס-הפגיעה.
  const judged = [path.relative(ROOT, CFG_PATH),
    ...fs.readdirSync(HERE).filter((x) => /\.(mjs|js|sh)$/.test(x)).map((x) => path.relative(ROOT, path.join(HERE, x))),
    path.join(path.relative(ROOT, HDIR), 'baseline.txt')];
  for (const f of judged) { const h = sha(path.join(ROOT, f)); if (h) state.integrity[f] = h; }
  const bl = path.join(HDIR, 'baseline.txt');
  if (fs.existsSync(bl) && spawnSync('chattr', ['+i', bl]).status === 0) state.immutable.push(path.relative(ROOT, bl));

  fs.writeFileSync(ARMED, JSON.stringify(state, null, 1));
  console.log('🔒 דרוך.');
  console.log(`   בהסגר: ${state.quarantined.length ? state.quarantined.map((q) => q.f).join(', ') : '— (אין "quarantine" ב-harness.json)'}`);
  console.log(`   commit/push: ${state.hooks.length ? 'חסום' : 'לא (אין תיקיית-hooks)'}`);
  console.log(`   נחתמו נגד-חבלה: ${Object.keys(state.integrity).length} קבצים${state.immutable.length ? ` · ${state.immutable.length} גם ננעלו ברמת-הקובץ` : ' (chattr לא זמין — הנעילה היא ע"י חתימה בלבד)'}`);
  console.log(`   פקודות חסומות ל-claude: ${DENY.split(',').length}`);
  process.exit(0);
}

if (has('--disarm')) {
  if (!fs.existsSync(ARMED)) { console.log('🔓 לא היה דרוך'); process.exit(0); }
  const s = JSON.parse(fs.readFileSync(ARMED, 'utf8'));
  for (const rel of s.immutable) spawnSync('chattr', ['-i', path.join(ROOT, rel)]);
  for (const q of s.quarantined) { const p = path.join(ROOT, q.f); fs.copyFileSync(path.join(ROOT, q.save), p); fs.chmodSync(p, q.mode);
    if (q.clean) sh(`git add -- '${q.f}'`);   // הבדל היה נקי בדריכה ⇒ שיהיה נקי גם עכשיו, גם באינדקס (אחרת הבדל נשאר staged)
  }
  for (const h of s.hooks) { if (h.had) fs.copyFileSync(path.join(QDIR, `hook__${h.h}`), h.p); else fs.rmSync(h.p, { force: true }); }
  const bad = Object.entries(s.integrity).filter(([f, hh]) => sha(path.join(ROOT, f)) !== hh).map(([f]) => f);
  fs.rmSync(ARMED, { force: true }); fs.rmSync(QDIR, { recursive: true, force: true });
  console.log(`🔓 שוחרר · הוחזרו ${s.quarantined.length} קבצים, ${s.hooks.length} hooks`);
  if (bad.length) console.log(`   ⚠ במהלך המשימה שונו קובצי-שופט: ${bad.join(', ')}`);
  process.exit(0);
}

console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 16).join('\n').replace(/^\/\/ ?/gm, ''));
process.exit(2);
