import 'expiring-intakes.dart';

/// רתמת-זהב: בדיוק דוגמאות-החוזה מ-new/atoms/expiring-intakes.test.mjs.
/// שקע נאמן למקור (calLib.isoOf — תאריך מקומי).
String _isoOf(DateTime d) {
  String p2(int n) => n.toString().padLeft(2, '0');
  return '${d.year}-${p2(d.month)}-${p2(d.day)}';
}

void main() {
  var f = 0;
  void ok(bool cond, String msg) {
    if (!cond) {
      print('✗ $msg');
      f = 1;
    }
  }

  final db = {
    'shopItems': [
      {'id': 'a', 'name': 'קמח'},
      {'id': 'b', 'name': 'שמן'},
    ],
    'shopIntakes': [
      {'id': 'i1', 'itemId': 'a', 'expiry': '2026-08-20', 'qty': 5},
      {'id': 'i2', 'itemId': 'b', 'expiry': '2026-08-30', 'qty': 2},
      {'id': 'i3', 'itemId': 'a', 'expiry': '2026-09-15'},
      {'id': 'i4', 'itemId': 'c'},
      {'id': 'i5', 'itemId': 'zz', 'expiry': '2026-08-25'},
    ],
  };

  final R = expiringIntakes(db, '2026-08-24', _isoOf);
  ok(R.length == 3, 'אורך ${R.length} ≠ 3 (i3 מעבר-לאופק, i4 בלי-expiry)');
  ok(R[0]['intake']['id'] == 'i1' && R[0]['itemName'] == 'קמח' && R[0]['expired'] == true, '[0]: ${R[0]}');
  ok(R[1]['intake']['id'] == 'i5' && R[1]['itemName'] == '—' && R[1]['expired'] == false, '[1] פריט-לא-נמצא: ${R[1]}');
  ok(R[2]['intake']['id'] == 'i2' && R[2]['itemName'] == 'שמן' && R[2]['expired'] == false, '[2]: ${R[2]}');

  // גבולות — expiry=האופק נכלל, expiry=היום לא-פג:
  final B = expiringIntakes(
    {
      'shopItems': [],
      'shopIntakes': [
        {'id': 'h', 'itemId': 'x', 'expiry': '2026-08-31'},
        {'id': 't', 'itemId': 'x', 'expiry': '2026-08-24'},
      ],
    },
    '2026-08-24',
    _isoOf,
  );
  ok(B.length == 2, 'גבול-אופק: ${B.length} ≠ 2');
  ok(B.every((x) => x['expired'] == false), 'expiry=היום/אופק אמור להיות לא-פג');

  // windowDays=0 ⇒ אופק=היום:
  final Z = expiringIntakes(
    {
      'shopItems': [],
      'shopIntakes': [
        {'id': 'z1', 'itemId': 'x', 'expiry': '2026-08-30'},
        {'id': 'z2', 'itemId': 'x', 'expiry': '2026-08-24'},
      ],
    },
    '2026-08-24',
    _isoOf,
    0,
  );
  ok(Z.length == 1 && Z[0]['intake']['id'] == 'z2', 'windowDays=0: ${Z.map((x) => x['intake']['id']).toList()}');

  if (f != 0) throw StateError('expiring-intakes: סטייה מהמקור');
  print('✓ expiring-intakes: כל דוגמאות-החוזה — ירוק');
}
