#!/usr/bin/env node
/** מחצב · pretool-selftest — הוכחת-ירי ל-`.claude/hooks/pre-tool.sh` (שלב 2 · PROTOCOL §6).
 *  fixtures: selftest-fixtures/pretool.tsv (expect · tool · input). כל שורה מוזנת ל-hook כ-JSON של PreToolUse
 *  (tool_name · tool_input · cwd=ROOT) עם PRETOOL_SELFTEST=1 (מבטל bypass-קבצים — env רק מחמיר).
 *  אדום = שורה שלא יורה כמצופה, או hook חסר/לא-מריץ (fail-closed). */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as R from './root.mjs';
const HOOK = path.join(R.ROOT, '.claude/hooks/pre-tool.sh');
const TSV = path.join(path.dirname(fileURLToPath(import.meta.url)), 'selftest-fixtures/pretool.tsv');
if (!fs.existsSync(HOOK)) { console.log('🚨 pre-tool.sh חסר — שלב 2 לא מותקן'); process.exit(1); }
const rows = fs.readFileSync(TSV, 'utf8').split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.split('\t'));
let ok = 0; const bad = [];
for (const [exp, tool, input] of rows) {
  const tool_input = tool === 'Bash' ? { command: input } : { file_path: input.replace(/^\/x\//, R.ROOT + '/') };
  const r = spawnSync('bash', [HOOK], { input: JSON.stringify({ tool_name: tool, tool_input, cwd: R.ROOT, hook_event_name: 'PreToolUse' }), env: { PATH: process.env.PATH || '', HOME: process.env.HOME || '/tmp', PRETOOL_SELFTEST: '1' }, encoding: 'utf8', timeout: 10000 });
  const got = r.status === null ? 'timeout' : String(r.status);
  if (got === exp) ok++; else bad.push(`  ✗ ${tool} ${JSON.stringify(input)} — ציפיתי ${exp}, קיבלתי ${got}${r.stderr ? ' · ' + r.stderr.trim().split('\n')[0].slice(0, 100) : ''}`);
}
if (bad.length) { console.log(`🚨 pre-tool: ${bad.length}/${rows.length} fixtures לא יורים כמצופה`); bad.forEach((b) => console.log(b)); process.exit(1); }
console.log(`✓ pre-tool: ${ok}/${rows.length} fixtures יורים כמצופה (${rows.filter((r) => r[0] === '2').length} חסומים · ${rows.filter((r) => r[0] === '0').length} עוברים)`);
