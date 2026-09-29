#!/usr/bin/env node
// liba-call.html is a build output. A hand edit to it is lost on the next build and never reaches the
// sources - so the file must always be exactly what liba/src builds to.
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
try { console.log(execFileSync('node', [join(root, 'liba/build.mjs'), '--check'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()) }
catch (e) { console.error(String(e.stderr || e.stdout || e).trim()); process.exit(1) }
