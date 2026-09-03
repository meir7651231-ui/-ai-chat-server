#!/usr/bin/env node
/** מחצב · allow-check — trailers `Allow:` (PROTOCOL v4 §6 · שלב 6). ALLOW = trailer בגוף ה-commit, לא קובץ (R2-3.1 · R2-5.8).
 *  פורמט: `Allow: <kind>:<scope> <L<n>|הכרעה-<X>|decision-<X>>` — kinds: pins-write:<glob> · baseline:<file> · floor:<n> · corpus · yellow-push · push-main.
 *  שימוש: --msg <file> [--issues <file>] [--pins <file>] [--kind <kind>]
 *    --issues: שורות-החלשה מ-ratchet-direction (baseline גדל / ראצ׳ט ירד) — כל שורה חייבת trailer מכסה; "skip חדש"/"שער נמחק"/"סקריפט הוחלף" לעולם לא מכוסים.
 *    --pins:   קבצי-חוקה (STATIC-docs) שהשתנו — כל אחד חייב `pins-write:<glob>` תואם.
 *    --kind:   מחזיר 0 אם קיים trailer מהסוג (yellow-push · push-main · corpus) — ל-pre-push/pre-tool.
 *  יציאה: 0 מכוסה · 1 חסר/פורמט-שגוי. אין הרצה, אין כתיבה. */
import fs from 'node:fs';
import path from 'node:path';
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const KINDS = ['pins-write', 'baseline', 'floor', 'corpus', 'yellow-push', 'push-main'];
const NEED_SCOPE = { 'pins-write': true, baseline: true, floor: true, corpus: false, 'yellow-push': false, 'push-main': false };
export function parseAllows(msg) {
  const out = [], bad = [];
  for (const line of msg.split('\n')) {
    const m = line.match(/^Allow:\s*(.+?)\s*$/); if (!m) continue;
    const t = m[1].match(/^([a-z-]+)(?::([^\s]+))?\s+(L\d+|הכרעה-[A-Za-z0-9א-ת]+|decision-[A-Za-z0-9]+)$/);
    if (!t || !KINDS.includes(t[1]) || (NEED_SCOPE[t[1]] && !t[2]) || (!NEED_SCOPE[t[1]] && t[2])) { bad.push(line); continue; }
    out.push({ kind: t[1], scope: t[2] || '', reason: t[3], line });
  }
  return { allows: out, bad };
}
const glob = (g, f) => new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*') + '$').test(f);
if (import.meta.url === `file://${process.argv[1]}`) {
  const msgFile = opt('--msg'); if (!msgFile) { console.error('usage: allow-check --msg <file> [--issues f] [--pins f] [--kind k]'); process.exit(1); }
  const msg = fs.readFileSync(msgFile, 'utf8').split('\n').filter((l) => !l.startsWith('#')).join('\n');
  const { allows, bad } = parseAllows(msg);
  const errs = [];
  for (const b of bad) errs.push(`פורמט Allow שגוי: "${b}" — Allow: <kind>[:<scope>] <L-id|הכרעה-N>; kinds: ${KINDS.join(' · ')}`);
  const kind = opt('--kind');
  if (kind) { if (errs.length) { errs.forEach((e) => console.error('❌ ' + e)); process.exit(1); } process.exit(allows.some((a) => a.kind === kind) ? 0 : 1); }
  const issuesFile = opt('--issues');
  if (issuesFile && fs.existsSync(issuesFile)) {
    for (const raw of fs.readFileSync(issuesFile, 'utf8').split('\n').map((l) => l.replace(/^\s*·\s*/, '').trim()).filter(Boolean)) {
      let m;
      if ((m = raw.match(/^baseline גדל \(([^)]+)\)/))) { const f = path.basename(m[1]); if (!allows.some((a) => a.kind === 'baseline' && glob(a.scope, f))) errs.push(`החלשה בלי Allow: ${raw} ⇒ נדרש "Allow: baseline:${f} <L-id|הכרעה-N>"`); }
      else if ((m = raw.match(/^ראצ׳ט ירד \(([^)]+)\.([^)]+)\): (\d+) → (\d+)/))) {
        const f = path.basename(m[1]), to = m[4];
        const ok = allows.some((a) => (a.kind === 'baseline' && glob(a.scope, f)) || (a.kind === 'floor' && f === 'wired-floor.json' && a.scope === to));
        if (!ok) errs.push(`החלשה בלי Allow: ${raw} ⇒ נדרש "Allow: ${f === 'wired-floor.json' ? 'floor:' + to : 'baseline:' + f} <L-id|הכרעה-N>"`);
      }
      else errs.push(`החלשת-פרוטוקול שאין לה Allow (שער/skip/סקריפט — הכרעת-בעלים ממוספרת בלבד): ${raw}`);
    }
  }
  const pinsFile = opt('--pins');
  if (pinsFile && fs.existsSync(pinsFile)) {
    for (const f of fs.readFileSync(pinsFile, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean)) {
      if (!allows.some((a) => a.kind === 'pins-write' && (glob(a.scope, f) || glob(a.scope, path.basename(f))))) errs.push(`קובץ-חוקה ${f} השתנה בלי "Allow: pins-write:${path.basename(f)} <L-id|הכרעה-N>"`);
    }
  }
  if (errs.length) { errs.forEach((e) => console.error('❌ ' + e)); process.exit(1); }
  if (allows.length) console.log(`✓ Allow: ${allows.map((a) => a.kind + (a.scope ? ':' + a.scope : '') + ' (' + a.reason + ')').join(' · ')}`);
  process.exit(0);
}
