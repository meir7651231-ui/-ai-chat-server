# חוזה · `findTypeSiblings`

## תפקיד
מחזיר נציג-מוצר יחיד לכל **סוג-מורכב שונה** באותה קטגוריה כמו מוצר-העוגן `p` —
הרשימה שממנה כרטיס-המוצר מציע לגלגל את צ'יפ-הסוג (הרמה העליונה). `type` הוא
הממד העליון ⇒ אין הגבלת-frame. אם נמצא ≤1 סוג ⇒ `[p]`.

מוצא: `buildsmart/app_flutter/lib/screens/lipskey_products_screen.dart:1972-1992`
(`findTypeSiblings`; חוק-2 — verbatim, לא-משופר).

## חתימה
```dart
List<LipRow> findTypeSiblings(LipRow p, {required List<LipRow> catalog});
class LipRow { final String nameHe, brand, categoryHe; } // brand ברירת-מחדל 'ליפסקי'
```

## שקע (הזרקת-שכן)
`catalog` — הקטלוג הגלובלי `resolvedCatalogProducts` (:1984) הומר לפרמטר-שקע
required. כל השאר (‏AttrKind · isSizeToken · _attrKindFor · _getCompoundType ·
_leadingType · מילוני-האוצר · kPolyrollBrand) מוטבע verbatim — לוגיקת-הסיווג עצמה.

## התנהגות (מקריאת-הקוד)
- `compound = _getCompoundType(p)`; ריק ⇒ `[p]` (:1973-1974).
- `ppr = p.brand == kPolyrollBrand` (:1980). מפתח לכל מוצר: PPR ⇒ `_leadingType(q)`
  (מונע פיצול-מדומה של "מתאם … רקורד" לסוג-שקר), אחרת ⇒ `_getCompoundType(q)` (:1981).
- ממפה `keyOf → מוצר-ראשון` על מוצרי **אותה קטגוריה בלבד** (:1984-1989);
  מפתח-ריק מדולג; המוצר-הראשון לכל מפתח מנצח (הזרקת-p ראשונה ⇒ p הנציג-שלו).
- ‏≤1 מפתח ⇒ `[p]`; אחרת ‏`byCompound.values.toList()` בסדר-ההכנסה (:1990-1991).
- טוטאלי: לעולם לא זורק.

_getCompoundType (:1916-1940): סוג רב-מילים (substring, הארוך-קודם) קודם;
אחרת מילת-סוג יחידה + מוקדן-נגרר אופציונלי (המילה הבאה מסווגת/צבע-מוד/מתחילה ב-ל,ב
⇒ הסוג לבדו; אחרת "סוג מילה-הבאה"). _leadingType (:1963-1968): מילת-הסוג הראשונה
משמאל-לימין ב-`kLipskeyTypes`, אחרת נופל ל-_getCompoundType.

## דוגמאות-מחייבות (מקריאת-הקוד · עוגן-שורה)
נתון קטלוג-בדיקה (brand ברירת-מחדל 'ליפסקי' אלא-אם צוין):
```
A = nameHe:'מחסום רצפה' · cat:'ניקוז'   → _getCompoundType='מחסום'  (:1934 'רצפה'=subtype ⇒ הסוג לבדו)
B = nameHe:'סיפון כפול' · cat:'ניקוז'    → _getCompoundType='סיפון'
C = nameHe:'מחסום עגול' · cat:'ניקוז'    → _getCompoundType='מחסום'  (כפול-A)
D = nameHe:'ברז גן'     · cat:'ברזים'   → קטגוריה שונה
E = nameHe:'זמבורי אדום'· cat:'ניקוז'    → _getCompoundType=''       (אין מילת-סוג)
P1= nameHe:'מתאם רקורד 20' · brand:'פולירול' · cat:'PPR' → _leadingType='מתאם' (_getCompoundType='רקורד')
P2= nameHe:'מתאם מצרה 25'  · brand:'פולירול' · cat:'PPR' → _leadingType='מתאם'
P3= nameHe:'מצמד 20'       · brand:'פולירול' · cat:'PPR' → _leadingType='מצמד'
```

| # | קריאה | פלט (nameHe בסדר) | עוגן |
|---|---|---|---|
| 1 | `findTypeSiblings(A, [A,B,C,D])` | `[A, B]` — נציג לכל סוג באותה קטגוריה; C כפול-מדולג, D קטגוריה-אחרת | :1984-1991 |
| 2 | `findTypeSiblings(A, [A,C])` | `[A]` — סוג יחיד בקטגוריה (≤1 מפתח) | :1990 |
| 3 | `findTypeSiblings(E, [E,A])` | `[E]` — compound ריק | :1973-1974 |
| 4 | `findTypeSiblings(P1, [P1,P2,P3])` | `[P1, P3]` — PPR מפתח לפי _leadingType ⇒ P2 מתקפל ל-'מתאם' | :1980-1981 |
