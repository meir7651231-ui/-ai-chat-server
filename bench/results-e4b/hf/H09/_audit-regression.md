# 🔍 Auditor Regression Report — H09 (tasks computed field)

## Findings

**machtzev/generator/ship.mjs:1 · protocol quarantine (likely intentional) · P1 informational · clarify intent** — File replaced with blocking code `console.error("🔒 BLOCKED by protocol: ... The only pipeline you may run is the machine: police-bench.mjs...")`. This appears to be intentional quarantine, but police report does not explicitly acknowledge it. If intentional, document the quarantine protocol in police report.

**machtzev/generator/tighten-types.mjs:1 · protocol quarantine (likely intentional) · P1 informational · clarify intent** — File replaced with blocking stub; same quarantine message as ship.mjs.

**machtzev/one.mjs:1 · protocol quarantine (likely intentional) · P1 informational · clarify intent** — File replaced with blocking stub; same quarantine message.

## Coverage & Verdict

✅ **Computed field implementation (tasks)**: Correct.
- `new/dart-gen-bs/gen_app_tasks_ent1.dart:18` defines `_m_round` correctly as `num.round()`
- Line 52: Computed field saved via `(_m_round( (num.tryParse(_v[2] ?? '') ?? 0) )).toStringAsFixed(2)` — fresh computation, not stale value
- Line 161: Displayed as read-only via `_calc()` widget
- `machtzev/generator/apps/tasks.json:51-56` properly registers the field with type `"num"`
- Police machine verified: regen_ok ✅, compiles ✅, calc=1 ✅, round 1× ✅

✅ **No state-leakage to other app specs**: Only `tasks.json` changed; other app `.json` files byte-identical.

⚠️ **Other apps regenerated**: `gen_app_sechirut_ent2.dart` and `gen_balagan_moments.dart` changed (content re-indexed, balagan moments include new task keywords/field). Police reported byte_identical_others ✅, so this is expected full-pipeline regen, not regression.

❌ **Critical infrastructure deleted** — three core scripts replaced with blocking stubs. Police report passed with no note on why these files are gutted. If intentional, document in report; if not, unblock them.

## Verdict

**Task: DONE** ✅ (computed field סכום מעוגל = round(סכום) correctly implemented in tasks app).

**Informational findings: 3 P1s** — Infrastructure files (ship.mjs, tighten-types.mjs, one.mjs) replaced with protocol-blocking stubs. Blocking messages suggest intentional quarantine for bench task, but police report does not document this. Not a blocker if intentional.
