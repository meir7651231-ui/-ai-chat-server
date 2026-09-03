/** מחצב · dart-bin — פותר-Dart אחד לכל הכלים (c2 של PROTOCOL §12).
 *  סדר: DART_BIN ⇒ $HOME/dart-sdk (session-start) ⇒ /home/user/flutter ⇒ PATH. אין ⇒ null.
 *  requireDart(): אין בינארי ⇒ exit 2 עם `tool=dart` (L34: אין-כלי ≠ כשל). police.mjs ממיין 2 כ-yellow:tool
 *  ומאמת שהכלי באמת חסר (צהוב עם כלי-קיים = אדום). היום synth דילג בשקט (exit 0) — לא עוד. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
export function resolveDart() {
  const cands = [process.env.DART_BIN, path.join(process.env.HOME || '', 'dart-sdk/bin/dart'), '/home/user/flutter/bin/dart'];
  for (const c of cands) if (c && fs.existsSync(c)) return c;
  try { return execFileSync('bash', ['-lc', 'command -v dart'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null; } catch { return null; }
}
export function requireDart(what = '') {
  const d = resolveDart();
  if (d) return d;
  console.error(`🟡 YELLOW tool=dart — אין בינארי Dart${what ? ' (' + what + ')' : ''}. הגדר DART_BIN או הרץ session-start (L34: אין-כלי ≠ כשל)`);
  process.exit(2);
}
