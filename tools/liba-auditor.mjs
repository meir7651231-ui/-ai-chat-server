#!/usr/bin/env node
// auditor-hold: one check for one claim (docs/CLAIM-SCHEMA.md). Input: a verify/queue item {type, args}. Output: the
// evidence to write to evidence/log/items/<id> - {type, exitCode, stdout, at}. Only known checks run, with arguments
// validated against a whitelist: a db row never becomes a shell command.
//   node tools/liba-auditor.mjs '{"type":"tests","args":{"file":"tests/zman.test.js"}}'
import { execFileSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const HOSTS = ['github.com', 'raw.githubusercontent.com', 'claude.ai', 'objects.githubusercontent.com']
const run = (cmd, args, t) => { try { return { exitCode: 0, stdout: execFileSync(cmd, args, { cwd: ROOT, timeout: t || 600000, stdio: ['ignore', 'pipe', 'pipe'] }).toString() } }
  catch (e) { return { exitCode: e.status == null ? 1 : e.status, stdout: String(e.stdout || '') + String(e.stderr || e.message || '') } } }
export function check(item) { const a = (item && item.args) || {}
  switch (item && item.type) {
    case 'tests': { const f = String(a.file || ''); if (!/^tests\/[\w.-]+\.js$/.test(f) || !existsSync(join(ROOT, f))) return { exitCode: 2, stdout: 'refused: not a test file in tests/' }; return run('node', [f]) }
    case 'build': return run('node', ['liba/build.mjs', '--check'])
    case 'pr': { const n = String(a.number || ''); if (!/^\d{1,6}$/.test(n)) return { exitCode: 2, stdout: 'refused: a PR number' }; return run('gh', ['pr', 'view', n, '--json', 'state,mergedAt,title']) }
    case 'apk': { const r = run('curl', ['-fsSL', '--max-time', '20', String(a.url || 'https://raw.githubusercontent.com/meir7651231-ui/-ai-chat-server/liba-android/version.json')], 30000)
      if (r.exitCode) return r; try { const pub = JSON.parse(r.stdout), mine = JSON.parse(readFileSync(join(ROOT, 'version.json'), 'utf8')); const same = +pub.versionCode === +mine.versionCode
        return { exitCode: same ? 0 : 1, stdout: `published ${pub.versionCode}, repo ${mine.versionCode}` } } catch (e) { return { exitCode: 1, stdout: 'not json' } } }
    case 'file': { const p = resolve(ROOT, String(a.path || '')); if (!p.startsWith(ROOT + '/') || !existsSync(p)) return { exitCode: 1, stdout: 'no such file in the repo' }
      const sha = createHash('sha256').update(readFileSync(p)).digest('hex'); return { exitCode: a.sha && a.sha !== sha ? 1 : 0, stdout: 'sha256 ' + sha } }
    case 'url': { let u; try { u = new URL(String(a.url || '')) } catch { return { exitCode: 2, stdout: 'refused: not a url' } }
      if (u.protocol !== 'https:' || !HOSTS.includes(u.hostname)) return { exitCode: 2, stdout: 'refused: not a known https host' }
      const r = run('curl', ['-sI', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '20', u.href], 30000); return { exitCode: r.stdout.trim() === '200' ? 0 : 1, stdout: 'http ' + r.stdout.trim() } }
    default: return { exitCode: 2, stdout: 'refused: unknown check' } } }
if (process.argv[1] && process.argv[1].endsWith('liba-auditor.mjs')) { let item; try { item = JSON.parse(process.argv[2] || '{}') } catch { item = {} }
  const r = check(item); console.log(JSON.stringify({ type: item.type || '', exitCode: r.exitCode, stdout: String(r.stdout).trim().split('\n').slice(-3).join(' | ').slice(0, 400), at: Date.now() })) }
