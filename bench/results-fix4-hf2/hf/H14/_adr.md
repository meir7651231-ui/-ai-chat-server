# ADR: Sort ממצא (Findings) by Color Severity

## Context
The sechirut app (rental contract checker) displays findings (ממצא) with a color field indicating severity:
- אדום (red) - critical issues
- צהוב (yellow) - warnings  
- ירוק (green) - informational

The findings are currently displayed in a partition by color (line 17 of spec) in the תיק detail report.

## Decision
Add sorting logic to the particle rendering to ensure findings are sorted by color severity in the required order: אדום (1st), צהוב (2nd), ירוק (3rd).

## Approach
Since the partition is defined by the color field, and the enum values are already in the correct order in the spec (line 9: `צבע{אדום|צהוב|ירוק}`), the partitions should render in the correct order.

However, to explicitly enforce sorting by severity color for any list/table of findings, I'll add a sort directive to the partition particle definition in the spec.

## Implementation  
1. Check if the current spec rendering produces findings in the correct color order
2. If not, add sort specification to ensure findings are sorted by color value priority
3. Verify no other apps' output changes (byte-identical check)
4. Run gates to verify correctness

## Alternative Rejected
- Modifying the engine code directly: Would risk affecting other particles; prefer spec-level configuration
