#!/usr/bin/env node
/**
 * step test-gate-real: do the tests catch real bugs? Each mutation below is a bug that already happened in the
 * field, or the exact code that prevents one. For each: a throwaway worktree, the bug put back, the page built,
 * the whole suite run. A mutation the suite does not notice is a hole in the tests, reported by name.
 *
 *   node tests/mutate.mjs          all of them (a few minutes)
 *   node tests/mutate.mjs 3 7      only those
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync, symlinkSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const WT = process.env.LIBA_MUT_WT || '/tmp/claude-0/liba-mut-wt'
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim()

const M = [
  ['הזרקת HTML מכותרת משימה', '11-render.js', '${esc(t.title||t.id)}', '${t.title||t.id}'],
  ['הקראה כפולה אחרי רענון', '07-db.js', 'if(spokenDone(d.id)){', 'if(false){'],
  ['משפט שנאמר תוך כדי דיבור לא יוצא מהתור', '12-flow.js', "}finally{transition('IDLE','spoke');drainQ();}", "}finally{transition('IDLE','spoke');}"],
  ['ack שלא מסמן spoken', '08-inbox.js', "update({spoken:true,spokenAt:Date.now()});}catch(e){fail('P_ACK',e,'inbox')", "update({spokenAt:Date.now()});}catch(e){fail('P_ACK',e,'inbox')"],
  ['שקט שלא נאכף', '08-inbox.js', 'if(quietUntil>Date.now())return false;', ''],
  ['משפט למנהל הולך עם התג של ליבה', '13-send.js', "(o||owner)==='manager'?'[ליבה→מנהל] ':'[ליבה] '", "'[ליבה] '"],
  ['שליחה כפולה של אותו משפט', '13-send.js', 'Date.now()-lastSent.ts<5000', 'Date.now()-lastSent.ts<0'],
  ['קול שנפל מחזיק את התור שתי דקות', '04-speech.js', 'if(appBeats()){let w=setTimeout(lost,BEAT_LOST);', 'if(false){let w=setTimeout(lost,BEAT_LOST);'],
  ['המספר של הבקשה לא נוסע לקלוד', '13-send.js', 'deliverWithRetry(text+reqMark(reqId),tag)', 'deliverWithRetry(text,tag)'],
  ['טלמטריה בלי דה-דופ', '02-trace.js', 'if(L){L.n++;trQueue(L);return;}', 'if(false){L.n++;trQueue(L);return;}'],
  ['הודעה שפגה נקראת בכל זאת', '08-inbox.js', 'if(!d.local&&expired(d)){', 'if(false&&expired(d)){'],
  ['תשובה לא נקשרת לבקשה', '12-flow.js', 'if(d.re&&!d.local)bindReply(d);', ''],
]
const pick = process.argv.slice(2).map(Number).filter(Boolean)
const todo = M.map((m, i) => [i + 1, m]).filter(([n]) => !pick.length || pick.includes(n))

const head = git('rev-parse', 'HEAD')
if (!existsSync(join(WT, '.git'))) git('worktree', 'add', '--detach', WT, head)
const wt = (...a) => execFileSync('git', a, { cwd: WT, encoding: 'utf8' })
if (!existsSync(join(WT, 'node_modules'))) symlinkSync(join(ROOT, 'node_modules'), join(WT, 'node_modules'))

let caught = 0; const holes = []
for (const [n, [name, file, from, to]] of todo) {
  wt('checkout', '-f', '--detach', head); wt('clean', '-fdq', '-e', 'node_modules')
  const f = join(WT, 'liba/src', file), src = readFileSync(f, 'utf8')
  if (src.split(from).length !== 2) { console.log(`  ✗ ${n}. ${name} — המוטציה לא מצאה את היעד שלה ב-${file}; הרתמה התיישנה`); process.exit(2) }
  writeFileSync(f, src.replace(from, to))
  const build = spawnSync('node', ['liba/build.mjs'], { cwd: WT, encoding: 'utf8' })
  const suite = build.status === 0 ? spawnSync('bash', ['-lc', 'node tests/page.test.js && node tests/page.e2e.js && node tests/bridge.e2e.js'], { cwd: WT, encoding: 'utf8' }) : build
  const red = suite.status !== 0
  const why = red ? ((suite.stdout || '').match(/^FAIL .*/m) || [build.status ? 'build נכשל' : ''])[0].slice(0, 90) : ''
  if (red) { caught++; console.log(`  ✓ ${n}. ${name} — נתפס: ${why}`) } else { holes.push(name); console.log(`  ✗ ${n}. ${name} — הבדיקות לא שמו לב`) }
}
wt('checkout', '-f', '--detach', head)
console.log(`\n${caught}/${todo.length} מוטציות נתפסו${holes.length ? ' · חורים: ' + holes.join('; ') : ''}`)
process.exit(caught === todo.length ? 0 : 1)
