// בדיקת-אטום · csvHeaderScore — מייבא רק את האטום.
import 'csv_header_score.dart';

void main() {
  final known = {'sku', 'name', 'price'};

  // רשומת-הערה + ריקה בראש ⇒ מדולגות; הכותרת = הרשומה השלישית.
  final records = <CsvRecord>[
    const CsvRecord(1, ['# legend', '', '']),
    const CsvRecord(2, ['   ', '  ']),
    const CsvRecord(3, ['﻿SKU', ' Name ', 'price', 'junk']),
    const CsvRecord(4, ['217861', 'ברז', '10']),
  ];
  // SKU(BOM+upper)→sku · Name(trim+lower)→name · price→price · junk לא ⇒ 3.
  assert(csvHeaderScore(records, known) == 3);

  // האינדקס עצמו מדלג את ההערה+הריקה.
  assert(csvHeaderIndex(records) == 2);

  // אין רשומה-ממשית ⇒ 0.
  final onlyComments = <CsvRecord>[
    const CsvRecord(1, ['#a']),
    const CsvRecord(2, ['  ']),
  ];
  assert(csvHeaderScore(onlyComments, known) == 0);
  assert(csvHeaderIndex(onlyComments) == -1);

  // נרמול-תא בודד.
  assert(normHeader('﻿  SKU ') == 'sku');
  print('csv_header_score OK');
}
