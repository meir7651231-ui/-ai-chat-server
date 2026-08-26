// רתמת-זהב · hebParts — מקבילה ל-new/atoms/heb-parts.test.mjs (3 תאריכי-עוגן + מגן-שבור)
// + ratchet-הסגר: גבול-שנה-עברית בערב-ר"ה (12 הימים שגלשו ל-Tishri/day≤0 בגרסת-QUARANTINE).
// הרצה: dart run --enable-asserts heb-parts_test.dart
import 'heb-parts.dart';

int _f = 0;

void _eq(Map<String, Object> got, Map<String, Object> want, String label) {
  final ok = got['day'] == want['day'] &&
      got['month'] == want['month'] &&
      got['year'] == want['year'];
  if (!ok) {
    _f = 1;
    print('✗ $label: got=$got want=$want');
  }
}

DateTime _at(String isoDate) {
  final p = isoDate.split('-');
  return DateTime(int.parse(p[0]), int.parse(p[1]), int.parse(p[2]), 12);
}

void main() {
  // === 3 תאריכי-העוגן מהמקור (heb-parts.test.mjs) ===
  _eq(hebParts(_at('2026-08-24')),
      {'day': 11, 'month': 'Elul', 'year': 5786}, 'אלול');
  final p2 = hebParts(_at('2026-04-02'));
  if (!(p2['day'] == 15 && p2['month'] == 'Nisan')) {
    _f = 1;
    print('✗ פסח: $p2');
  }
  final p3 = hebParts(_at('2024-03-24'));
  if (p3['month'] != 'Adar II') {
    _f = 1;
    print('✗ אדר-ב מעוברת: $p3');
  }

  // === מגן-שבור: קלט null (≡ Invalid Date של המקור) ⇒ חלקים בטוחים ===
  final p4 = hebParts(null);
  if (p4['day'] != 0 || p4['month'] != '') {
    _f = 1;
    print('✗ מגן-שבור: $p4');
  }

  // === ratchet-הסגר · ערב-ר"ה: כל אלה נפלו בגרסת-QUARANTINE (Tishri/day≤0) ===
  // אומת מול Intl('en-u-ca-hebrew') ב-Node — אלה הערכים הנכונים.
  _eq(hebParts(_at('2005-10-02')),
      {'day': 28, 'month': 'Elul', 'year': 5765}, 'ערב-ר"ה 2005-10-02');
  _eq(hebParts(_at('2005-10-03')),
      {'day': 29, 'month': 'Elul', 'year': 5765}, 'ערב-ר"ה 2005-10-03');
  _eq(hebParts(_at('2016-10-02')),
      {'day': 29, 'month': 'Elul', 'year': 5776}, 'ערב-ר"ה 2016-10-02');
  _eq(hebParts(_at('2024-10-02')),
      {'day': 29, 'month': 'Elul', 'year': 5784}, 'ערב-ר"ה 2024-10-02');
  _eq(hebParts(_at('2062-10-02')),
      {'day': 27, 'month': 'Elul', 'year': 5822}, 'ערב-ר"ה 2062-10-02');
  _eq(hebParts(_at('2062-10-04')),
      {'day': 29, 'month': 'Elul', 'year': 5822}, 'ערב-ר"ה 2062-10-04');

  // === מעבר-שנה תקין (יום-אחרי ר"ה) — נשמר גם אחרי התיקון ===
  _eq(hebParts(_at('2026-09-12')),
      {'day': 1, 'month': 'Tishri', 'year': 5787}, 'ר"ה 5787');
  _eq(hebParts(_at('2025-09-23')),
      {'day': 1, 'month': 'Tishri', 'year': 5786}, 'ר"ה 5786');

  if (_f != 0) {
    print('heb-parts_test: נכשל');
    throw StateError('heb-parts_test failed');
  }
  print('✓ heb-parts: 3 עוגנים + מגן-שבור + 6 ratchet ערב-ר"ה + 2 מעבר-שנה — ירוק');
}
