# חוזה · connectionMethodLabel

**מוצא:** `buildsmart/app_flutter/lib/logic/install_engine.dart:90-109` (verbatim, חוק-4).

## חתימה
```dart
enum EndType { hdpeCompression, pexPress, copperPress, bspMale, bspFemale, drainOpening }
class ConnEnd { final EndType type; final String size; const ConnEnd(this.type, this.size); }
String connectionMethodLabel<P>(P a, P b, {
  required List<ConnEnd>? Function(P) endsOf,
});
```

## קלט
- `a`, `b` — שני המוצרים המחוברים.
- `endsOf` — שקע: `p → List<ConnEnd>?` — מגלם `kVerifiedSpecs[p.sku]?.ends`; `null` כשאין spec.

## פלט
`String` — שם-שיטת-החיבור, או `''` כשלא-ניתן-לגזור.

## התנהגות (מקור:91-108)
צד ללא-spec ⇒ `''`. הזוג-הראשון המתאים-ישירות (`_directMates`, lvc.dart:38-48) ⇒ תווית לפי `eA.type`. אחרת שיתוף-צינור (`_pipeShared`, lvc.dart:50-53) ⇒ `'אום הידוק (compression)'`. אחרת `''`.

## דוגמאות (עוגן install_engine.dart:96-105)
| # | a.end | b.end | פלט |
|---|-------|-------|-----|
| 1 | bspMale 1/2" | bspFemale 1/2" | תבריג + PTFE |
| 2 | pexPress 20 | pexPress 20 | Press / טבעת כיווץ |
| 3 | copperPress 22 | copperPress 22 | Press / O-ring |
| 4 | drainOpening 110 | drainOpening 110 | כיסוי ניקוז |
| 5 | hdpeCompression 32 | hdpeCompression 32 | אום הידוק (compression) |
| 6 | bspMale 1/2" | (אין spec) | '' |
| 7 | bspMale 1/2" | bspMale 1/2" | '' (זכר↔זכר) |
