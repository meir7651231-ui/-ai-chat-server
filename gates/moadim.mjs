#!/usr/bin/env node
// shabbat-engine: the yom tov table the page and the phone read must be what tools/gen-moadim.mjs makes
import { spawnSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const r = spawnSync('node', [join(dirname(fileURLToPath(import.meta.url)), '..', 'tools/gen-moadim.mjs'), '--check'], { encoding: 'utf8' })
process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || ''); process.exit(r.status)
