// 🔬 pixel-forge-audit · run — המנוע-המלא: ORIG (Playwright) → מחולל-Dart → flutter test (FORGE) →
// דיף+דירוג+גיליונות → summary. שימוש: node machtzev/audit/run.mjs [family…]  (בלי ארגומנט = הכל).
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const fams = process.argv.slice(2).filter(a => !a.startsWith('-'));
const BS = '/home/user/buildsmart/app_flutter';
const FLUTTER = '/home/user/flutter/bin/flutter';
const run = (cmd, args, opts = {}) => { console.log(`\n▶ ${cmd} ${args.join(' ')}`); execFileSync(cmd, args, { stdio: 'inherit', ...opts }); };

// 1) מקור
run('node', [path.join(HERE, 'gen-orig.mjs'), ...fams]);
// 2) מחולל-Dart (מ-index.json שנכתב ב-1)
run('node', [path.join(HERE, 'gen-forge-dart.mjs')]);
// 3) FORGE — flutter test מצייר את כל האטומים
run(FLUTTER, ['test', 'test/zz_pixel_audit_test.dart'], { cwd: BS, env: { ...process.env, PATH: `/home/user/flutter/bin:${process.env.PATH}` } });
// 4) דיף + דוח + גיליונות
run('node', [path.join(HERE, 'diff.mjs')]);

console.log('\n✅ pixel-forge-audit הושלם — ראה machtzev/audit/shots/report.md + shots/diff/');
