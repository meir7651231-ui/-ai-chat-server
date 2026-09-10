# ADR: Sort Meeting Particle by Date then Time

## Context
The פגישה (meetings) particle table in calendar.txt currently has no sorting. When the table view is displayed (_view == 3), records are shown in insertion order.

## Decision
Add a particle definition to calendar.txt with the `מיון:` directive to sort by מועד (date) ascending, then שעה (time) ascending. This is a spec-level fix.

Syntax: `חלקיק פגישה: [טבלה] מה, מועד, שעה, מקום, הערה | מיון: מועד עולה, שעה עולה`

This leverages the spec language's built-in particle sorting feature (SPEC-LANG.md line 17) rather than modifying engine logic.

## Rationale
- Spec-first approach: Protocol requires fixing in spec language before touching engine
- Spec language explicitly supports particle sorting with מיון directive
- Minimal change: One line added to calendar.txt
- No engine changes needed → other apps stay byte-identical
- Dates are sorted ascending (עולה), times are sorted ascending
- Spec language handles type detection (date fields recognized, proper ordering)

## Alternatives Rejected
1. Hand-edit generated Dart: Violates protocol (never edit generated outputs)
2. Modify engine sorting logic: Not needed if spec language can express it

## Consequences
- Table view will now display meetings sorted by date then time
- List/board/calendar views unchanged (only particle's table view affected)
- Regeneration required (app-ds.mjs)

## Verification
- Machine report (police-bench.mjs) confirms:
  - No hand-edits in new/ directory (byte-identical-others passes)
  - Generated Dart compiles without errors
  - Gates pass (new gates may be added if threshold reached)
  - No orphan files
