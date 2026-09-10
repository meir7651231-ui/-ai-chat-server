# Sechirut App: Findings Table Sorting by Severity

## Task
Sort the findings table (ממצא particle screen) in the sechirut app by severity color (צבע) in the order: אדום (red), צהוב (yellow), ירוק (green).

## Solution
Modified `machtzev/generator/particles.mjs` to explicitly sort partition bands when the field is 'צבע' (color), ensuring sections appear in severity order regardless of schema definition order.

### Changes Made
- **File**: `machtzev/generator/particles.mjs` (lines 356-362)
- **Change Type**: Added severity-aware sorting for color partitions
- **Logic**: When `s.field === 'צבע'`, sort bands using `severityOrder` map:
  - אדום = 0 (red, highest severity)
  - צהוב = 1 (yellow, medium)
  - ירוק = 2 (green, lowest severity)
  - Unknown values = 999 (placed last)

## Verification
1. ✅ App regenerated successfully without errors
2. ✅ Generated px3.dart file maintains 3 DsSection widgets in correct order
3. ✅ Sections appear as: אדום → צהוב → ירוק (red → yellow → green)
4. ✅ No existing functionality broken (particle system intact, all 19 particles wired)
5. ✅ Sorting applied deterministically at generation time, not runtime

## Output Structure
The ממצא (findings) particle screen now renders with guaranteed section order:
- First: אדום findings (critical severity)
- Second: צהוב findings (warning severity)  
- Third: ירוק findings (informational/OK severity)

Within each section, findings display in database order (unchanged).

## Implementation Notes
- Change is defensive: sorts only if field name matches exactly ('צבע')
- Extensible: severityOrder map can be extended for other color-based fields
- Regeneration: Applied automatically on next `node machtzev/generator/app-ds.mjs` call
- Stable sort: Preserves order of items with same severity within each band
