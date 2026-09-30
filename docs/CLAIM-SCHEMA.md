# claim — how a session tells ליבה where a fact came from

Every `inbox/<id>` message that reports a fact (done, passed, failed, merged, ready, sent, installed, fixed…) carries:

```json
"claim": {
  "grade": "measured | quoted | inferred",
  "source": { "kind": "cmd | file | url | api | human", "ref": "what exactly", "at": 1790000000000, "by": "session or person" },
  "raw": "the output line the claim rests on (optional, short)",
  "ttlSec": 3600,
  "verify": { "type": "tests | pr | build | apk | file | url", "args": { } }
}
```

- **measured** — you ran it and saw the result (`source.kind: cmd`, `ref: "node tests/page.e2e.js"`, `raw: "כל הבדיקות עברו"`).
- **quoted** — someone else said it (a PR page, another session, Meir).
- **inferred** — you concluded it from other facts. Say so.
- **verify** (optional) — ask ליבה to check before she says it. She holds the message up to 60 seconds while
  `verify/queue/items/<inbox id>` waits for a checker; the checker writes `evidence/log/items/<inbox id>`
  `{exitCode, stdout, at, type}`. With evidence she says "נמדד … בדקתי לפני N דקות"; if the check failed she says so;
  with no evidence in time she says it as quoted — "הסשן אמר, לא בדקתי".

A factual message **without** a claim is not said as a fact. ליבה says "<who> אומר ש…, בלי מקור. ביקשתי ממנו מקור.",
writes `evidence/missing/items/<id>`, and sends the session one line tagged `[ליבה?מקור] `. Answer it with a new
message that carries the claim.

## The checker

`node tools/liba-auditor.mjs '<verify item JSON>'` runs one check and prints the evidence JSON to write. It runs only
what it knows: a test file under `tests/`, `node liba/build.mjs --check`, `gh pr view <number>`, the published
`version.json` against the repo's, a file's existence and sha256 inside the repo, an https HEAD to a known host.
Anything else is refused — a queue item can never make it run a command.
