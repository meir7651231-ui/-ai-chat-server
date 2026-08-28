// 🧪 בדיקת-חוזה · plumbingAccessories — מוכיחה את דוגמאות-החוזה עצמן (חוק-4).
// מייבאת אך ורק את האטום-שלה. הרצה:
//   dart run --enable-asserts new/dart/plumbing_accessories_test.dart ⇒ exit 0
import 'plumbing_accessories.dart';

void main() {
  const trade = 'plumbing';
  const uncat = 'plumbing.cat._uncategorized';

  // ── דוגמה 1 (חוזה): מיפוי-שדות verbatim + פתירת-קטגוריה ──
  const boiler = SmartProduct(key: 'boiler', acc: [
    SmartAcc(
        name: 'שסתום',
        emoji: '🔩',
        why: 'חובה-תקן',
        must: true,
        price: 45,
        sku: 'LP-1'),
  ]);
  final r1 = plumbingAccessories(
    catalog: const [boiler],
    smartKeyToId: const {'boiler': 'plumbing.cat.b1'},
    kPlumbingTradeId: trade,
    kUncategorizedCategoryId: uncat,
  );
  assert(r1.length == 1);
  assert(r1[0] ==
      const AccessoryRule(
        id: 'plumbing.acc.boiler.0',
        tradeId: 'plumbing',
        appliesToCategoryId: 'plumbing.cat.b1',
        nameHe: 'שסתום',
        emoji: '🔩',
        whyHe: 'חובה-תקן',
        mustHave: true,
        price: 45,
        linkSku: 'LP-1',
      ));

  // ── דוגמה 2 (חוזה): key לא-בפותר ⇒ נפילה ל-uncategorized (שורות 184-185) ──
  final r2 = plumbingAccessories(
    catalog: const [boiler],
    smartKeyToId: const {},
    kPlumbingTradeId: trade,
    kUncategorizedCategoryId: uncat,
  );
  assert(r2[0].appliesToCategoryId == uncat);

  // ── null-ים נשמרים (price/sku אופציונליים, smart_tree.dart:104-105) ──
  const noPrice = SmartProduct(key: 'tap', acc: [
    SmartAcc(name: 'אטם', emoji: '⭕', why: 'איטום', must: false),
  ]);
  final r3 = plumbingAccessories(
    catalog: const [noPrice],
    smartKeyToId: const {'tap': 'plumbing.cat.t1'},
    kPlumbingTradeId: trade,
    kUncategorizedCategoryId: uncat,
  );
  assert(r3[0].price == null && r3[0].linkSku == null);
  assert(r3[0].mustHave == false);

  // ── דוגמה 3 (חוזה): קטלוג ריק ⇒ רשימה ריקה ──
  assert(plumbingAccessories(
    catalog: const [],
    smartKeyToId: const {},
    kPlumbingTradeId: trade,
    kUncategorizedCategoryId: uncat,
  ).isEmpty);

  // ── מיון בין-מוצרים לפי id: קלט לא-ממוין ('zeta' לפני 'alpha') ⇒ פלט ממוין ──
  const zeta = SmartProduct(key: 'zeta', acc: [
    SmartAcc(name: 'ז', emoji: 'ז', why: 'ז', must: false),
  ]);
  const alpha = SmartProduct(key: 'alpha', acc: [
    SmartAcc(name: 'א', emoji: 'א', why: 'א', must: false),
  ]);
  final r4 = plumbingAccessories(
    catalog: const [zeta, alpha],
    smartKeyToId: const {},
    kPlumbingTradeId: trade,
    kUncategorizedCategoryId: uncat,
  );
  assert(r4.map((r) => r.id).join('|') ==
      'plumbing.acc.alpha.0|plumbing.acc.zeta.0');

  // ── דוגמה 4 (חוזה, קצה): 11 אביזרים ⇒ מיון-מחרוזת — אינדקס 10 לפני 2 ──
  final many = SmartProduct(key: 'x', acc: [
    for (var i = 0; i < 11; i++)
      SmartAcc(name: 'a$i', emoji: 'e', why: 'w', must: false),
  ]);
  final r5 = plumbingAccessories(
    catalog: [many],
    smartKeyToId: const {},
    kPlumbingTradeId: trade,
    kUncategorizedCategoryId: uncat,
  );
  assert(r5.length == 11);
  final i10 = r5.indexWhere((r) => r.id == 'plumbing.acc.x.10');
  final i2 = r5.indexWhere((r) => r.id == 'plumbing.acc.x.2');
  assert(i10 != -1 && i2 != -1 && i10 < i2,
      'מיון-מחרוזת של המקור: .10 חייב להקדים את .2');
  // האינדקס בתוך ה-id משקף את מקום-האביזר במוצר (nameHe של .10 הוא a10)
  assert(r5[i10].nameHe == 'a10' && r5[i2].nameHe == 'a2');

  print('OK plumbing_accessories');
}
