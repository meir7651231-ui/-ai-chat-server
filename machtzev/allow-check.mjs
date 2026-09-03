#!/usr/bin/env node
/** מחצב · allow-check — trailers `Allow:` (PROTOCOL v4 §6 · שלב 6 · סבב-3: R3-4.6 · R3-5.13). ALLOW = trailer, לא קובץ.
 *  פורמט: `Allow: <kind>[:<scope>] <סיבה>` — kinds: pins-write:<glob> · baseline:<file> · floor:<n> · gate-args:<id> · retry-clear:<gate> ·
 *  corpus · yellow-push · push-main. סיבה = `L<n>` / `L<תאריך>-<gate>-<sha6>` שקיים ב-LEARNINGS.md, או `הכרעה-<X>` שקיימת ב-PROTOCOL §11 / LAW / DECISIONS.
 *  scope `*`/`**` (מפתח-מאסטר) נדחה. floor-drop מכוסה רק ע"י floor:<ערך-חדש>. args-change מכוסה רק ע"י gate-args:<id>.
 *  שימוש: --msg <file> [--issues <file>] [--pins <file>] [--kind <kind>] [--root <repo>]. יציאה 0/1. אין הרצה, אין כתיבה. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const KINDS = ['pins-write', 'baseline', 'floor', 'gate-args', 'retry-clear', 'corpus', 'yellow-push', 'push-main'];
const NEED_SCOPE = { 'pins-write': true, baseline: true, floor: true, 'gate-args': true, 'retry-clear': true, corpus: false, 'yellow-push': false, 'push-main': false };
const ROOT = (() => { const r = opt('--root'); if (r) return path.resolve(r); try { return execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return process.cwd(); } })();
const readOr = (f) => { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch { return ''; } };
export function reasonExists(reason) {
  if (/^L[\w-]+$/.test(reason)) return new RegExp(`^## ${reason.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'm').test(readOr('machtzev/LEARNINGS.md'));
  const m = reason.match(/^(?:הכרעה|decision)-(.+)$/); if (!m) return false;
  const x = m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\|\\s*\\*\\*${x}\\*\\*`).test(readOr('machtzev/PROTOCOL.md')) || new RegExp(`הכרעה[- ]${x}\\b`).test(readOr('LAW.md') + readOr('machtzev/DECISIONS.md') + readOr('machtzev/PROTOCOL.md'));
}
export function parseAllows(msg) {
  const out = [], bad = [];
  for (const line of msg.split('\n')) {
    const m = line.match(/^Allow:\s*(.+?)\s*$/); if (!m) continue;
    const t = m[1].match(/^([a-z-]+)(?::([^\s]+))?\s+(L[\w-]+|הכרעה-[A-Za-z0-9א-ת.-]+|decision-[A-Za-z0-9.-]+)$/);
    if (!t || !KINDS.includes(t[1]) || (NEED_SCOPE[t[1]] && !t[2]) || (!NEED_SCOPE[t[1]] && t[2])) { bad.push(`פורמט: "${line}"`); continue; }
    if (t[2] && /^\*+$/.test(t[2].replace(/\//g, ''))) { bad.push(`scope-מאסטר אסור: "${line}"`); continue; }
    if (!reasonExists(t[3])) { bad.push(`סיבה לא קיימת (L-id ב-LEARNINGS / הכרעה ב-PROTOCOL §11·LAW·DECISIONS): "${line}"`); continue; }
    out.push({ kind: t[1], scope: t[2] || '', reason: t[3], line });
  }
  return { allows: out, bad };
}
const glob = (g, f) => new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*') + '$').test(f);
const covers = (allows, kind, f) => allows.some((a) => a.kind === kind && (glob(a.scope, f) || glob(a.scope, path.basename(f))));
if (import.meta.url === `file://${process.argv[1]}`) {
  const msgFile = opt('--msg'); if (!msgFile) { console.error('usage: allow-check --msg <file> [--issues f] [--pins f] [--kind k] [--root dir]'); process.exit(1); }
  const msg = fs.readFileSync(msgFile, 'utf8').split('\n').filter((l) => !l.startsWith('#')).join('\n');
  const { allows, bad } = parseAllows(msg);
  const errs = bad.map((b) => `Allow שגוי — ${b}. תחביר: Allow: <kind>[:<scope>] <L-id|הכרעה-N>; kinds: ${KINDS.join(' · ')}`);
  const kind = opt('--kind');
  if (kind) { if (errs.length) { errs.forEach((e) => console.error('❌ ' + e)); process.exit(1); } process.exit(allows.some((a) => a.kind === kind) ? 0 : 1); }
  const issuesFile = opt('--issues');
  if (issuesFile && fs.existsSync(issuesFile)) {
    for (const raw of fs.readFileSync(issuesFile, 'utf8').split('\n').map((l) => l.replace(/^\s*·\s*/, '').trim()).filter(Boolean)) {
      let m;
      if ((m = raw.match(/^baseline גדל \(([^)]+)\)/)) || (m = raw.match(/^baseline נמחק \(([^)]+)\)/))) { const f = path.basename(m[1]); if (!covers(allows, 'baseline', f)) errs.push(`החלשה בלי Allow: ${raw} ⇒ נדרש "Allow: baseline:${f} <L-id|הכרעה-N>"`); }
      else if ((m = raw.match(/^ראצ׳ט ירד \(([^)]+?)\.([^)]+)\): (\d+) → (\d+)/))) {
        const f = path.basename(m[1]), to = m[4];
        const ok = f === 'wired-floor.json' ? allows.some((a) => a.kind === 'floor' && a.scope === to) : covers(allows, 'baseline', f);
        if (!ok) errs.push(`החלשה בלי Allow: ${raw} ⇒ נדרש "Allow: ${f === 'wired-floor.json' ? 'floor:' + to : 'baseline:' + f} <L-id|הכרעה-N>"`);
      }
      else if ((m = raw.match(/^ראצ׳ט ירד \(([^)]+?)\.(.+)\)$/))) { const f = path.basename(m[1]); if (f === 'wired-floor.json' || !covers(allows, 'baseline', f)) errs.push(`החלשה בלי Allow: ${raw} ⇒ נדרש "Allow: baseline:${f} <L-id|הכרעה-N>"`); }
      else if ((m = raw.match(/^ארגומנטים השתנו: ([a-z-]+)/))) { if (!allows.some((a) => a.kind === 'gate-args' && a.scope === m[1])) errs.push(`שינוי-ארגומנטים בלי Allow: ${raw} ⇒ נדרש "Allow: gate-args:${m[1]} <L-id|הכרעה-N>"`); }
      else errs.push(`החלשת-פרוטוקול שאין לה Allow (שער/skip/סקריפט/מניפסט — הכרעת-בעלים ממוספרת + עריכת gates.tsv/police בלבד): ${raw}`);
    }
  }
  const pinsFile = opt('--pins');
  if (pinsFile && fs.existsSync(pinsFile)) {
    for (const f of fs.readFileSync(pinsFile, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean)) {
      if (!covers(allows, 'pins-write', f)) errs.push(`קובץ-פרוטוקול ${f} השתנה בלי "Allow: pins-write:${path.basename(f)} <L-id|הכרעה-N>"`);
    }
  }
  if (errs.length) { errs.forEach((e) => console.error('❌ ' + e)); process.exit(1); }
  if (allows.length) console.log(`✓ Allow: ${allows.map((a) => a.kind + (a.scope ? ':' + a.scope : '') + ' (' + a.reason + ')').join(' · ')}`);
  process.exit(0);
}
