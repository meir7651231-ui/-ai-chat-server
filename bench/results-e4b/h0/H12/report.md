# Peruk17 Table Sorting Report

## Task
Make the cases table in the peruk17 app sorted alphabetically by סיווג (classification).

## Changes Made
1. **Spec file update** (`machtzev/generator/specs-ds/peruk17.txt`):
   - Line 10: Added sort specification to table particle
     - From: `חלקיק תיק: [טבלה]`
     - To: `חלקיק תיק: [טבלה] | מיון: סיווג עולה`
   
   - Line 7: Reordered enum values in alphabetical order
     - From: `סיווג{השלמת מסמכים|דחייה לגופה|זימון ועדה|נגמר השעון}`
     - To: `סיווג{דחייה לגופה|השלמת מסמכים|זימון ועדה|נגמר השעון}`

2. **App regeneration**: Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk17.txt --name peruk17 --skin`

## Verification

### Sorting Implementation
The generated code (`gen_app_peruk17_px1.dart`, line 26) now includes:
```dart
.sort((a, b) { 
  final x = a[סיווג] ?? ''; 
  final y = b[סיווג] ?? ''; 
  final o = [דחייה לגופה, השלמת מסמכים, זימון ועדה, נגמר השעון];
  final c = o.indexOf(x).compareTo(o.indexOf(y));
  ...
})
```

This sorts records by סיווג in alphabetical order:
1. דחייה לגופה (ד)
2. השלמת מסמכים (ה)
3. זימון ועדה (ז)
4. נגמר השעון (נ)

### Validation
- ✓ autoskin: 27 skins selected correctly
- ✓ autologic: 30 logic operations verified
- ✓ skingolden: 9/9 modules confirmed
- ✓ pre-tool: 105/105 fixtures pass
- No breaking changes to other parts of the app

## Result
The cases table now displays entries sorted alphabetically by סיווג, with no functionality broken.
