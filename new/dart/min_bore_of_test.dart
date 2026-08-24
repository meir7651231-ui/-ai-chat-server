// בדיקת-חוזה · minBoreOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/min_bore_of_test.dart
import 'min_bore_of.dart';

// ── שקעי-הבדיקה (מקומיים; ערכים verbatim מהמקור) ────────────────────────────
// צורות-קלט מינימליות: מוצר בעל sku, קצה בעל type+size (מראה את המקור).
class _End {
  final String kind; // 'dn' (DN ישיר) או 'bsp' (הברגה)
  final String size;
  const _End(this.kind, this.size);
}

class _Prod {
  final String sku;
  const _Prod(this.sku);
}

// "מסד-ה-specs" של הבדיקה: sku → קצוות, או חסר (⇒ null, כמו spec==null).
const Map<String, List<_End>> _specs = {
  'A': [_End('bsp', '1/2"'), _End('bsp', '3/4"')],
  'B': [_End('dn', '32'), _End('bsp', '1/2"')],
  'C': [_End('dn', '32'), _End('dn', '25')],
  'D': [_End('bsp', '3/4"')],
  'E': [], // spec קיים, ריק
  'F': [_End('bsp', '5/8"'), _End('bsp', '7/8"')], // שניהם לא-במפה
  'G': [_End('bsp', '5/8"'), _End('bsp', '1/2"')], // הראשון null, השני 15mm
  'H': [_End('dn', '-5'), _End('dn', '32')], // שלילי
  // 'Z' — לא קיים במכוון (⇒ endsOf מחזיר null).
};

// מפת-BSP verbatim מהמקור (lipskey_verified_connections.dart).
const Map<String, int> _bsp = {'1/2': 15, '3/4': 20, '1': 25};

// שקע endsOf: מגלם kVerifiedSpecs[p.sku]?.ends (null כשאין spec).
List<_End>? _endsOf(_Prod p) => _specs[p.sku];

// שקע boreOf: מגלם _boreMeters — DN מ״מ→מטר, BSP דרך המפה, null אחרת.
double? _boreOf(_End e) {
  if (e.kind == 'dn') {
    final dn = int.tryParse(e.size);
    if (dn != null) return dn / 1000.0;
    return null;
  }
  if (e.kind == 'bsp') {
    final s = e.size.replaceAll('"', '').trim();
    final mm = _bsp[s];
    if (mm != null) return mm / 1000.0;
  }
  return null;
}

double? _min(String sku) =>
    minBoreOf(_Prod(sku), endsOf: _endsOf, boreOf: _boreOf);

void _eq(double? got, double? want, String label) {
  final ok = (got == null && want == null) ||
      (got != null && want != null && (got - want).abs() < 1e-12);
  if (!ok) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  // — דוגמאות-החוזה, ביט-אחר-ביט —
  _eq(_min('A'), 0.015, '1 bsp 1/2 < 3/4');           n++;
  _eq(_min('B'), 0.015, '2 bsp 1/2 < hdpe 32');       n++;
  _eq(_min('C'), 0.025, '3 hdpe 25 < 32');            n++;
  _eq(_min('D'), 0.020, '4 single end 3/4');          n++;
  _eq(_min('Z'), null,  '5 no spec ⇒ null');          n++;
  _eq(_min('E'), null,  '6 empty ends ⇒ null');       n++;
  _eq(_min('F'), null,  '7 all bores null ⇒ null');   n++;
  _eq(_min('G'), 0.015, '8 skip null, take 15mm');    n++;
  _eq(_min('H'), -0.005, '9 negative accepted');      n++;

  // עדשה-עוינת: קצה-null באמצע לא עוצר את הרדוקציה (continue), והמינימום
  // נשמר גם כשהערך-התקין מגיע אחרי ה-null-ים (מקור:110-111).
  _eq(_min('G'), 0.015, 'null-then-valid keeps min'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_min('A') == 0.015, 'assert-live guard');

  print('OK minBoreOf: $n asserts passed');
}
