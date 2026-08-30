// בדיקת-חוזה · heb-cal-box — שקילות-פלט מלאה מול האטום החי heb-month-he על 1900–2100
// (דילוגי 13 ימים) + סריקה צפופה סביב ערבי-ר"ה (ספט'-אוק' 2018–2032) כולל קצה 2024-10-02.
// הרצה: dart run --enable-asserts new/dart-maor/heb-cal-box_test.dart ⇒ exit 0
import 'heb-cal-box.dart';
import 'heb-month-he.dart';

void main() {
  int n = 0;
  void eq(DateTime d) {
    final a = hebMonthHeWired(d), b = hebMonthHe(d);
    if (a != b) throw StateError('$d: wired=$a atom=$b');
    n++;
  }
  for (DateTime d = DateTime.utc(1900, 1, 1); !d.isAfter(DateTime.utc(2100, 12, 31)); d = d.add(const Duration(days: 13))) eq(d);
  for (int y = 2018; y <= 2032; y++) {
    for (DateTime d = DateTime.utc(y, 9, 1); !d.isAfter(DateTime.utc(y, 10, 31)); d = d.add(const Duration(days: 1))) eq(d);
  }
  eq(DateTime.utc(2024, 10, 2));
  assert(hebMonthHeWired(null) == '');
  print('OK heb-cal-box · $n ימים זהים לאטום-החי');
}
