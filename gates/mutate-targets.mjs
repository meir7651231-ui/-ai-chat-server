#!/usr/bin/env node
// the mutation harness must point at code that exists: a target that moved makes the mutate job fail in CI hours later
import { spawnSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const r = spawnSync('node', [join(dirname(fileURLToPath(import.meta.url)), '..', 'tests/mutate.mjs'), '--check'], { encoding: 'utf8' })
process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || ''); process.exit(r.status)
