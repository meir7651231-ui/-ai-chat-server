# חוזה · lineComplianceChecklist

**מוצא:** `buildsmart/app_flutter/lib/logic/install_engine.dart:113-222` (verbatim, חוק-4).
אטום נפרד ומלא — **לא** `compliance.dart` הגנרי (עוזר-dedup).

## חתימה
```dart
enum CheckSeverity { critical, warning, info }
class LineCheck { const LineCheck(this.label, this.satisfied, this.why,
    {this.severity = CheckSeverity.warning}); final String label; final bool satisfied;
    final String why; final CheckSeverity severity; }
class ChainPart { final String sku; final String? productType; final String categoryHe;
    const ChainPart(this.sku, this.categoryHe, {this.productType}); }
List<LineCheck> lineComplianceChecklist(
  List<ChainPart> chain, int tempC, Set<String> accessories, {
  required String? Function(String sku) materialOf,
  required bool Function(String sku) isSupplySku,
});
```

## קלט
- `chain` — מוצרי-הקו (sku · productType? · categoryHe).
- `tempC` — טמפרטורת-הקו (int, °C; חם ≥ 60).
- `accessories` — קבוצת-SKU אביזרים שאושרו ידנית.
- `materialOf` — שקע: מגלם `productMaterial(p)` (מקור:116).
- `isSupplySku` — שקע: מגלם `lineIsSupply(chain)` פר-פריט (מקור:156).

## פלט
`List<LineCheck>` — פריטי-הצ׳קליסט הפעילים, בסדר-הבנייה של המקור (if-collection, :158-221).

## התנהגות (מקור:115-221)
טריגרים: אספקה⇒ברז-ניתוק · recirc(HW-PUMP-25/HW-TEE-RECIRC)⇒×3+אל-חזור+מאזן+מפוח+דגימה · חם(≥60)⇒PRV+כלי-התפשטות+בידוד · מחלק/מקלחת⇒TMTV · משאבה-מסחרית(HW-PUMP-40)⇒מסנן-Y+גמיש+(חם:לגיונלה) · מתכות-שונות(נחושת+מתכת)⇒רקורד-דיאלקטרי · PEX⇒מפצה · תמיד⇒חבק+איטום.

## דוגמאות (עוגן install_engine.dart:158-221)
| # | תרחיש | tempC | supply | פלט (אורך + פריטי-מפתח) |
|---|-------|-------|--------|--------------------------|
| 1 | [HW-BALL-1] קר | 20 | HW-BALL-1 | len=3; 'ברז ניתוק לתחזוקה' satisfied=true (critical); חבק/איטום info |
| 2 | [HW-BALL-1, HW-MANIFOLD-4(מחלק)] חם | 60 | HW-BALL-1 | len=7; PRV+Bladder+TMTV false (critical); 'בידוד תרמי' false (warning) |
| 3 | [3×BALL, HW-PUMP-25] recirc | 20 | yes | len=7; 'ברז ניתוק ×3…' satisfied=true (isolationCount≥3); אל-חזור/מפוח/דגימה |
| 4 | [DRAIN-1 סיפונים] ניקוז | 20 | (אין) | len=2; **אין** 'ברז ניתוק' (רק חבק+איטום) |
| 5 | ניקוז + acc={CLIP,SEALANT,INSUL} | 60 | (אין) | 'בידוד תרמי'/חבק/איטום satisfied=true |
| 6 | [CU נחושת, BR פליז] | 20 | (אין) | 'רקורד דיאלקטרי' present (critical, dissimilar) |
| 7 | [PX חומר=PEX] | 20 | (אין) | 'מפצה התפשטות PEX' present (warning) |
