// בדיקת-חוזה (רתמת-זהב) · lastCollectionIso — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/last-collection-iso.test.mjs
// (אותם קלטים→פלטים):
//   1) לא-ממוין      box('2026-01-15','2026-08-03','2026-03-20') ⇒ '2026-08-03'
//   2) ריק           box()                                        ⇒ ''
//   3) יחיד          box('2025-12-31')                            ⇒ '2025-12-31'
//   4) חציית-שנה     box('2025-12-31','2026-01-01')               ⇒ '2026-01-01'
//   5) כפול          box('2026-05-05','2026-05-05')               ⇒ '2026-05-05'
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/last-collection-iso_test.dart  ⇒ exit 0
import 'last-collection-iso.dart';

// box(...dates) => ({ collections: dates.map(date => ({ date })) })
Map<String, dynamic> box(List<String> dates) => {
      'collections': dates.map((date) => {'date': date}).toList(),
    };

void main() {
  // 1) לא-ממוין — המאוחר מנצח
  assert(lastCollectionIso(box(['2026-01-15', '2026-08-03', '2026-03-20'])) ==
      '2026-08-03');

  // 2) בלי ריקונים ⇒ ''
  assert(lastCollectionIso(box([])) == '');

  // 3) ריקון יחיד
  assert(lastCollectionIso(box(['2025-12-31'])) == '2025-12-31');

  // 4) חציית-שנה — לקסיקוגרפיה של ISO נכונה
  assert(lastCollectionIso(box(['2025-12-31', '2026-01-01'])) == '2026-01-01');

  // 5) תאריך כפול
  assert(lastCollectionIso(box(['2026-05-05', '2026-05-05'])) == '2026-05-05');

  print('✓ last-collection-iso (Dart): 5 דוגמאות-חוזה — ירוק');
}
