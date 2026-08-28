// 🧪 בדיקת-חוזה · aiAlternatives — מוכיחה את דוגמאות-החוזה עצמן (חוק-4).
// מקור-ההתנהגות: buildsmart/app_flutter/lib/logic/ai_hub_logic.dart:202-238 (origin/main).
// מייבאת אך ורק את האטום-שלה (דיבר-4).
// DoD: dart run --enable-asserts new/dart/ai_alternatives_test.dart ⇒ exit 0.

import 'ai_alternatives.dart';

/// מותג מקומי-לבדיקה (בקופסה: SmartBrand — name/price/rec בלבד נקראים).
class TBrand {
  const TBrand(this.name, this.price, {this.rec = false});
  final String name;
  final int? price;
  final bool rec;
}

/// מוצר-מתומחר מקומי (בקופסה: SmartProduct שנבנה ב-_pricedSmartProduct).
class TProd {
  const TProd(this.key, this.brands);
  final String key;
  final List<TBrand> brands;
}

/// שורת-סריקה-חוצת-קטלוג מקומית (בקופסה: CheaperAlt — כל השדות non-null).
class TCross {
  const TCross(this.product, this.recName, this.recPrice, this.altName,
      this.altPrice);
  final String product;
  final String recName;
  final int recPrice;
  final String altName;
  final int altPrice;
}

/// שחזור-נאמן של השכן related_info.dart:1630-1646 (cheaperAlternativeBrand)
/// כרתמת-שקע: הזול-ביותר מתחת-למחיר-הנבחר; null כשאין/כשמחיר-הנבחר null.
({String name, int price})? cheaperOf(TProd sp, int selectedIndex) {
  if (selectedIndex < 0 || selectedIndex >= sp.brands.length) return null;
  final selPrice = sp.brands[selectedIndex].price;
  if (selPrice == null) return null;
  ({String name, int price})? best;
  for (var i = 0; i < sp.brands.length; i++) {
    if (i == selectedIndex) continue;
    final p = sp.brands[i].price;
    if (p == null || p >= selPrice) continue;
    if (best == null || p < best.price) {
      best = (name: sp.brands[i].name, price: p);
    }
  }
  return best;
}

List<AiAlt> run(List<TProd> products, List<TCross> cross) =>
    aiAlternatives<TProd, TBrand, TCross>(
      pricedProducts: products,
      productKey: (p) => p.key,
      brands: (p) => p.brands,
      isRec: (b) => b.rec,
      brandName: (b) => b.name,
      brandPrice: (b) => b.price,
      cheaperAlternativeBrand: cheaperOf,
      crossCatalog: cross,
      crossProduct: (a) => a.product,
      crossRecName: (a) => a.recName,
      crossRecPrice: (a) => a.recPrice,
      crossAltName: (a) => a.altName,
      crossAltPrice: (a) => a.altPrice,
    );

void main() {
  var n = 0;
  void ok(bool cond, String msg) {
    assert(cond, msg);
    n++;
  }

  // ── דוגמה A · הקטלוג-האמיתי (contractor_seeds.dart:526-542 verbatim) ──
  const faucet = TProd('ברז לכיור', [
    TBrand('מותג סטנדרט', 189, rec: true),
    TBrand('מותג כלכלי', 139),
    TBrand('מותג פרימיום', 329),
  ]);
  const toilet = TProd('אסלה תלויה', [
    TBrand('מותג סטנדרט', 740, rec: true),
    TBrand('מותג כלכלי', 560),
    TBrand('מותג פרימיום — Soft Close', 1240),
  ]);
  const shower = TProd('סוללת מקלחת', [
    TBrand('מותג סטנדרט', 520, rec: true),
    TBrand('מותג כלכלי', 380),
    TBrand('מותג פרימיום — תרמוסטטי', 890),
  ]);
  // תוצאת cheaperAlternativesAcrossCatalog() על אותו דאטה (ממוינת חיסכון-יורד).
  const realCross = [
    TCross('אסלה תלויה', 'מותג סטנדרט', 740, 'מותג כלכלי', 560),
    TCross('סוללת מקלחת', 'מותג סטנדרט', 520, 'מותג כלכלי', 380),
    TCross('ברז לכיור', 'מותג סטנדרט', 189, 'מותג כלכלי', 139),
  ];
  final a = run(const [faucet, toilet, shower], realCross);
  ok(a.length == 3, 'A: 3 שורות (הדדופ בלע את ה-cross כולו), קיבלנו ${a.length}');
  ok(a[0].cat == 'אסלה תלויה' && a[0].save == 180,
      'A: שורה-1 = אסלה·180, קיבלנו ${a[0].cat}·${a[0].save}');
  ok(a[1].cat == 'סוללת מקלחת' && a[1].save == 140,
      'A: שורה-2 = סוללת·140, קיבלנו ${a[1].cat}·${a[1].save}');
  ok(a[2].cat == 'ברז לכיור' && a[2].save == 50,
      'A: שורה-3 = ברז·50, קיבלנו ${a[2].cat}·${a[2].save}');
  ok(a[0].fromName == 'מותג סטנדרט' && a[0].fromPrice == 740,
      'A: from = המומלץ (740)');
  ok(a[0].toName == 'מותג כלכלי' && a[0].toPrice == 560, 'A: to = הזול (560)');
  ok(a[2].save == a[2].fromPrice - a[2].toPrice,
      'A: AiAlt.save = from-to (189-139=50)');

  // ── B1 · rec.price=null ⇒ דילוג-שלב-1, כיסוי-משלב-2 (:212,:225-234) ──
  const noPrice = TProd('צנרת', [
    TBrand('לפי ספק', null, rec: true),
    TBrand('כלכלי', 80),
  ]);
  final b1 = run(const [noPrice], const [
    TCross('צנרת', 'ספק-בית', 120, 'ספק-שדה', 90),
  ]);
  ok(b1.length == 1 && b1[0].fromName == 'ספק-בית' && b1[0].save == 30,
      'B1: null-price דולג בשלב-1 והגיע משלב-2 (ספק-בית·30)');

  // ── B2 · אין דגל-rec ⇒ נפילה לאינדקס-0 (:210-211) ──
  const noRec = TProd('דבק', [
    TBrand('ראשון', 100),
    TBrand('שני', 60),
  ]);
  final b2 = run(const [noRec], const []);
  ok(b2.length == 1 && b2[0].fromName == 'ראשון' && b2[0].toName == 'שני',
      'B2: בלי-rec ⇒ idx-0 הוא המומלץ');
  ok(b2[0].save == 40, 'B2: save=100-60=40, קיבלנו ${b2[0].save}');

  // ── B3 · alt=null (אין-זול-יותר) ⇒ דילוג (:212) ──
  const cheapestRec = TProd('מלט', [
    TBrand('כלכלי', 30, rec: true),
    TBrand('פרימיום', 55),
  ]);
  final b3 = run(const [cheapestRec], const []);
  ok(b3.isEmpty, 'B3: המומלץ-הכי-זול ⇒ אין-שורה, קיבלנו ${b3.length}');

  // ── B4 · דדופ: cross למוצר שכבר-כוסה-בשלב-1 לא-נוסף (:213,:226) ──
  final b4 = run(const [faucet], const [
    TCross('ברז לכיור', 'אחר', 999, 'זר', 1), // היה נותן save=998 לו-נכנס
  ]);
  ok(b4.length == 1 && b4[0].fromPrice == 189 && b4[0].save == 50,
      'B4: שלב-1 מנצח בדדופ (189→139), קיבלנו ${b4[0].fromPrice}·${b4[0].save}');

  // ── B5 · top-5: ‏7 מועמדים ⇒ 5, חיסכון-יורד (:236-237) ──
  final seven = [
    for (var i = 1; i <= 7; i++)
      TProd('מוצר$i', [
        TBrand('יקר$i', 100 * i, rec: true),
        TBrand('זול$i', 100 * i - 10 * i), // save = 10*i
      ]),
  ];
  final b5 = run(seven, const []);
  ok(b5.length == 5, 'B5: תקרת-5, קיבלנו ${b5.length}');
  ok(b5[0].save == 70 && b5[4].save == 30,
      'B5: ממוין 70..30, קיבלנו ${b5[0].save}..${b5[4].save}');

  // ── B6 · הכול-ריק ⇒ [] ──
  ok(run(const [], const []).isEmpty, 'B6: קלט-ריק ⇒ פלט-ריק');

  // ── B7 · שלב-2 בלבד (אין מוצרים-מתומחרים) ⇒ ה-cross עובר כמו-שהוא ──
  final b7 = run(const [], realCross);
  ok(b7.length == 3 && b7[0].save == 180 && b7[2].save == 50,
      'B7: cross-בלבד ⇒ 3 שורות 180..50');

  // אימות-שקט ש-asserts דולקים (dart run --enable-asserts).
  var armed = false;
  assert(armed = true);
  if (!armed) {
    throw StateError('asserts כבויים — הרץ עם --enable-asserts');
  }

  // ignore: avoid_print
  print('OK aiAlternatives: $n asserts passed');
}
