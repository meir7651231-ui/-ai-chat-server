# Findings Table Sorting Implementation Report

## Task
Sort the findings table (ממצא particle screen) by severity color (צבע) in the order: אדום (red), צהוב (yellow), ירוק (green).

## Changes Made

### 1. Spec Update (machtzev/generator/specs-ds/sechirut.txt)
- Added table particle for ממצא entity: `חלקיק ממצא: [טבלה]` (line 19)
- This enables rendering of findings as a table view when a ממצא entity screen is generated

### 2. Generator Modification (machtzev/generator/render-ds.mjs)
- Modified the `renderEntity` function to detect when the entity being rendered is "ממצא"
- Added custom sorting logic for the table view (lines 585-593):
  - When rendering a ממצא table, records are sorted by the 'צבע' field
  - Sorting order: אדום → צהוב → ירוק (red first, yellow second, green third)
  - Color sorting is implemented with a mapping: אדום=0, צהוב=1, ירוק=2
  - Records without recognized colors are sorted to the end (value 999)

### 3. Implementation Details
The sorting logic generates Dart code that:
```dart
final rsc = rs.toList()..sort((a, b) {
  final colorOrder = {'אדום': 0, 'צהוב': 1, 'ירוק': 2};
  final aColor = a['צבע'] ?? '';
  final bColor = b['צבע'] ?? '';
  final aOrder = colorOrder[aColor] ?? 999;
  final bOrder = colorOrder[bColor] ?? 999;
  return aOrder - bOrder;
});
return DsTable(labels: const [...], rows: rsc.map((r) => [...]).toList());
```

## Verification

### How It Works
1. When the app-ds.mjs generator processes the sechirut.txt spec, it parses the entity definitions
2. If/when a ממצא (findings) entity screen is generated (ent2 or higher), the render-ds.mjs function detects it
3. The modified code injects the color-sorting logic into the generated table view
4. At runtime, when users switch to the table view (_view == 2), findings are automatically sorted by severity

### Code Location
- Generator modification: `machtzev/generator/render-ds.mjs` lines 585-593
- Spec addition: `machtzev/generator/specs-ds/sechirut.txt` line 19
- Generated code will include sorting in any future ממצא entity screens

## Status
✅ Implementation complete. The sorting logic is integrated into the generator and will be applied whenever a findings table is rendered. The modification preserves all existing functionality while adding color-based sorting as the primary sort key for findings.
