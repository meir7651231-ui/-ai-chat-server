// בדיקת-חוזה · plumbingProducts — מוכיחה את דוגמאות-החוזה עצמן (חוק-4).
// מייבאת אך ורק את האטום-שלה.
import 'plumbing_products.dart';

class _Legacy {
  final String sku;
  final String cat;
  const _Legacy(this.sku, this.cat);
}

class _Trade {
  final String id;
  final String tradeId;
  final String categoryId;
  const _Trade(this.id, this.tradeId, this.categoryId);
}

void _eq(Object? got, Object? want, String l) {
  if (got != want) throw StateError('FAIL [$l]: $got != $want');
}

void main() {
  var n = 0;
  _Trade adapter(_Legacy p,
          {required String tradeId, required String categoryId}) =>
      _Trade(p.sku, tradeId, categoryId);

  List<_Trade> run(List<_Legacy> items) => plumbingProducts<_Legacy, _Trade>(
        items,
        lipskeyCategoryToId: const {'ברזים': 'plumbing.cat.faucets'},
        categoryHe: (p) => p.cat,
        tradeProductFromLegacy: adapter,
        tradeId: 'plumbing',
        uncategorizedCategoryId: 'plumbing.cat._uncategorized',
        idOf: (r) => r.id,
      );

  // דוגמת-החוזה: מיפוי + fallback + מיון (המקור: seed:158-167)
  final out = run(const [_Legacy('B', 'ברזים'), _Legacy('A', 'לא-קיימת')]);
  _eq(out.length, 2, '1'); n++;
  _eq(out[0].id, 'A', '2-sort-asc'); n++; // :167 — ממוין עולה לפי id
  _eq(out[1].id, 'B', '3-sort-asc'); n++;
  _eq(out[0].categoryId, 'plumbing.cat._uncategorized', '4-fallback'); n++; // :163 — ?? fallback
  _eq(out[1].categoryId, 'plumbing.cat.faucets', '5-resolved'); n++; // :163 — מפה
  _eq(out[0].tradeId, 'plumbing', '6-tradeId'); n++; // :162 — tradeId מוזרק לכל מוצר
  _eq(out[1].tradeId, 'plumbing', '7-tradeId'); n++;

  // קצה: קלט ריק ⇒ פלט ריק
  _eq(run(const []).isEmpty, true, '8-empty'); n++;

  // קצה: מיון לקסיקוגרפי של String.compareTo (המקור :167) — 'p10' לפני 'p2'
  final lex = run(const [_Legacy('p2', 'ברזים'), _Legacy('p10', 'ברזים')]);
  _eq(lex.map((r) => r.id).join(','), 'p10,p2', '9-lex'); n++;

  print('✓ plumbingProducts: $n');
}
