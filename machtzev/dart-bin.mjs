/** מחצב · dart-bin — **פותר-כלים אחד** לכל המנועים (c2 של PROTOCOL §12): Dart · Flutter · פרסור-פלט-analyze.
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

/** נתיב ל-flutter, או null. **פותר אחד לשני הצרכנים** (nl-smoke --compile · behavior-plan צעד-6).
 *  סדר: FLUTTER_BIN ⇒ $FLUTTER (הבינארי עצמו · <FLUTTER>/flutter · <FLUTTER>/bin/flutter) ⇒ /root/flutter/bin ⇒ /home/user/flutter/bin ⇒ PATH.
 *  הרקע (17.9, w-goal-flutter): היו **שני** פותרים — nl-smoke ראה `$FLUTTER · /root · PATH`,
 *  ‏behavior-plan ראה `/home/user/flutter/bin · $FLUTTER_BIN` — ולכן צעד-6 דיווח «flutter analyze: לא-זמין»
 *  על מכונה שבה Flutter מותקן ו-nl-smoke מצא אותו באותו רגע. שני פותרים = שתי אמיתות שסוחפות בשקט (L110).
 *  `isFile` ולא `existsSync`: תיקייה בשם `flutter` אינה בינארי (‏FLUTTER=<sdk-root> החזיר קודם את התיקייה). */
export function resolveFlutter() {
  const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };
  const F = (process.env.FLUTTER || '').replace(/\/+$/, '');
  const cands = [process.env.FLUTTER_BIN, F, F && path.join(F, 'flutter'), F && path.join(F, 'bin/flutter'),
    F && path.join(F.replace(/\/flutter$/, ''), 'flutter'), '/root/flutter/bin/flutter', '/home/user/flutter/bin/flutter'];
  for (const c of cands) if (c && isFile(c)) return c;
  try { return execFileSync('bash', ['-lc', 'command -v flutter'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null; } catch { return null; }
}

/** פרסור פלט `flutter analyze` — **עותק אחד** לשני הצרכנים. מחזיר {errs, warnN, infoN, issues, miscount}.
 *  ⚠️ הכלי **מיישר את עמודת-החומרה לרוחב הארוכה-ביותר בפלט**: כשיש `warning` (7 תווים) המילה יושבת
 *  בעמודה 0 ו-`^\s+warning •` דיווח **0 אזהרות** מול 75 אמיתיות (w-compile-gate §ז). לכן `^\s*`.
 *  ‏`miscount`: הספירה המפורקת נבדקת מול «N issues found» של הכלי עצמו — תת-ספירה = אזעקה, לא ירוק. */
export function parseAnalyze(text, status = 0, err = null) {
  const s = String(text == null ? '' : text);
  const lines = s.split('\n');
  const sev = (k) => lines.filter((l) => new RegExp(`^\\s*${k} •`).test(l));
  const errs = sev('error').map((l) => {
    const m = l.match(/^\s*error • (.*) • (\S+):(\d+):(\d+) • (\S+)\s*$/);
    return m ? { msg: m[1], file: m[2], line: +m[3], col: +m[4], code: m[5], raw: l.trim() } : { msg: l.trim(), file: '?', line: 0, col: 0, code: '?', raw: l.trim() };
  });
  const warnN = sev('warning').length, infoN = sev('info').length;
  const issues = ((s.match(/^(\d+) issues? found\./m) || [])[1] ?? (/No issues found!/.test(s) ? '0' : null));
  let miscount = '';
  if (issues === null) miscount = `🚨 analyze לא הפיק שורת-סיכום (exit ${status}${err ? ' · ' + err.message : ''}) — אין ראיה, ולכן אין ירוק`;
  else if (+issues !== errs.length + warnN + infoN) miscount = `🚨 ספירה לא-סוגרת: ${errs.length}+${warnN}+${infoN} ≠ ${issues} «issues found» — הפלט השתנה, הפרסור לא`;
  return { errs, warnN, infoN, issues, miscount };
}
