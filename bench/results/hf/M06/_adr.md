# ADR: Add `קרוב` computed field to person entity (panuy.txt)

## Opening Question (Protocol ג.1)

**Question:** Should the `קרוב` field be a simple computed text field (like existing mRishuaSquare)?

**Assumed Answer:** YES. The field should be added as a computed text line in the person entity:
- When `מרחק בריבוע < 100` → displays "קרוב"
- Otherwise → displays "רחוק"
- Uses same syntax as other computed fields (`מרחק בקמ = sqrt(...)`)
- No new helper functions needed (can inline the ternary logic in spec)

## Why this approach:
- Matches existing pattern (see `מרחק בקמ = sqrt(מרחק בריבוע)`)
- Simple threshold logic (distance < 100)
- Text output (not numeric)
- No UI complexity (just another field like the others)
