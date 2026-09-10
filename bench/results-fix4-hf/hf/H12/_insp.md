# Inspection — H12: peruk17 table sorting

## Task surfaces
- **entity list**: תיק (case) with 6 fields including סיווג enum ✓
- **particle table**: [טבלה] with מיון: סיווג עולה ✓
- **hub**: navigation shell maintains structure ✓
- **report**: דוח תיק (case report) section ✓

## Validation lenses
- **task-coverage**: All surfaces name sorting by סיווג alphabetical (עולה = ascending) ✓
- **money-numeric**: No numeric sorting needed; סיווג is classification enum ✓
- **edge-crash**: enum fields sort by declaration order; סיווג has 4 values ("השלמת מסמכים", "דחייה לגופה", "זימון ועדה", "נגמר השעון") ✓
- **state-leakage**: Sort state is stateless — defined in spec, applied at render ✓
- **navigation**: Table particle in root entity (תיק) accessible from home screen ✓
- **text-parity**: Sort specification matches existing peruk patterns (using pipe + מיון: syntax) ✓

## VERDICT: GO
- Spec change: 1 line added to peruk17.txt (line 10)
- Generated artifacts: particle plan confirms sort parsing
- Machine check: sort ✅ px1
- No spec bugs; no broken surfaces; sorting is alphabetical by enum order
