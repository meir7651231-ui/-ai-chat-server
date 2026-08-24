// בדיקת-חוזה (רתמת-זהב) · attachChargesBulk — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/attach-charges-bulk.test.mjs
// (אותם קלטים→פלטים; אותם שקעים-מיני). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/attach-charges-bulk_test.dart  ⇒ exit 0
import 'attach-charges-bulk.dart';

// שקעים-מיני — מקבילים ביט למקור-ה-JS:
//   histDedupKey  = (h) => (h.txn   ? 'txn:'+h.txn   : '')
//   chargeDedupKey= (c) => (c.txnId ? 'txn:'+c.txnId : '')
//   chargeToHist  = (c) => ({ d: c.d, a: c.amount, txn: c.txnId })
//   fillCardFromCharge = (sp) => ({ ...sp, filled: true })
//   withNedarimHok     = (sp) => ({ ...sp, hoked: true })
String _histDedupKey(Map<String, dynamic> h) =>
    ((h['txn'] as String?)?.isNotEmpty ?? false) ? 'txn:${h['txn']}' : '';
String _chargeDedupKey(Map<String, dynamic> c) =>
    ((c['txnId'] as String?)?.isNotEmpty ?? false) ? 'txn:${c['txnId']}' : '';
Map<String, dynamic> _chargeToHist(Map<String, dynamic> c) =>
    {'d': c['d'], 'a': c['amount'], 'txn': c['txnId']};
Map<String, dynamic> _fillCardFromCharge(Map<String, dynamic> sp, Map<String, dynamic> c) =>
    {...sp, 'filled': true};
Map<String, dynamic> _withNedarimHok(Map<String, dynamic> sp, Map<String, dynamic> c) =>
    {...sp, 'hoked': true};

Map<String, dynamic> _run(
  List<Map<String, dynamic>> supporters,
  List<Map<String, dynamic>> items,
) =>
    attachChargesBulk(supporters, items, _histDedupKey, _chargeDedupKey,
        _chargeToHist, _fillCardFromCharge, _withNedarimHok);

// מקבילת mk() של המקור — בונה כרטיסים טריים בכל קריאה.
List<Map<String, dynamic>> _mk() => [
      {
        'id': 's1',
        'hist': [
          {'d': '2026-01-01', 'a': 50, 'txn': 'T1'}
        ],
      },
      {'id': 's2', 'hist': <Map<String, dynamic>>[]},
    ];

List _hist(Map<String, dynamic> sp) => (sp['hist'] as List?) ?? const [];

void main() {
  var n = 0;

  // 1) אותו txn פעמיים באצווה — רק הראשון נרשם (הדדופ מתעדכן תוך-כדי).
  {
    final r = _run(_mk(), [
      {'supId': 's1', 'charge': {'amount': 100, 'txnId': 'T7', 'd': '2026-03-01'}},
      {'supId': 's2', 'charge': {'amount': 100, 'txnId': 'T7', 'd': '2026-03-01'}},
    ]);
    final sups = r['supporters'] as List;
    assert(r['added'] == 1, 'דדופ-תוך-אצווה: added ≠ 1');
    assert(_hist(sups[0]).length == 2 && _hist(sups[1]).isEmpty, 'הכפול נרשם בכרטיס השני');
    n++;
  }

  // 2) מפתח שכבר ב-hist קיים (T1 על s1) — מדולג גם לכרטיס אחר.
  {
    final r = _run(_mk(), [
      {'supId': 's2', 'charge': {'amount': 60, 'txnId': 'T1'}},
    ]);
    final sups = r['supporters'] as List;
    assert(r['added'] == 0 && _hist(sups[1]).isEmpty, 'C2: מפתח-קיים נרשם שוב');
    n++;
  }

  // 3) amount=0 ו-supId לא-ממופה — מדולגים בלי לעצור.
  {
    final r = _run(_mk(), [
      {'supId': 's2', 'charge': {'amount': 0, 'txnId': 'T8'}},
      {'supId': 'אין', 'charge': {'amount': 90, 'txnId': 'T9'}},
      {'supId': 's2', 'charge': {'amount': 30, 'txnId': 'TA', 'd': '2026-04-04'}},
    ]);
    final sups = r['supporters'] as List;
    assert(
      r['added'] == 1 && _hist(sups[1]).length == 1 && _hist(sups[1])[0]['txn'] == 'TA',
      'דילוגי C10/לא-ממופה שגויים',
    );
    n++;
  }

  // 4) שתי תקינות לשני כרטיסים — added=2, fill/hok, וטוהר-הקלט.
  {
    final sup = _mk();
    final r = _run(sup, [
      {'supId': 's1', 'charge': {'amount': 10, 'txnId': 'TB', 'd': '2026-05-01'}},
      {'supId': 's2', 'charge': {'amount': 20, 'txnId': 'TC', 'd': '2026-05-02'}},
    ]);
    final sups = r['supporters'] as List;
    assert(r['added'] == 2, 'added ≠ 2');
    assert(_hist(sups[0]).length == 2 && _hist(sups[0])[1]['txn'] == 'TB', 'כרטיס s1 שגוי');
    assert(_hist(sups[1]).length == 1 && _hist(sups[1])[0]['txn'] == 'TC', 'כרטיס s2 שגוי');
    assert(sups[0]['filled'] == true && sups[0]['hoked'] == true, 'fill/hok לא הופעלו');
    // טוהר: מערך-הקלט לא שונה.
    assert(
      _hist(sup[0]).length == 1 && _hist(sup[1]).isEmpty && sup[0]['filled'] == null,
      'הקלט שונה — הופר הטוהר',
    );
    n++;
  }

  // 5) אצווה ריקה ⇒ added=0 והמערך המוחזר שקול-תוכן לקלט.
  {
    final sup = _mk();
    final r = _run(sup, []);
    final sups = r['supporters'] as List;
    assert(r['added'] == 0, 'אצווה-ריקה: added ≠ 0');
    // slice = עותק-רדוד ⇒ אותם איברים, אורך זהה (מקבילת JSON.stringify שקול).
    assert(sups.length == sup.length, 'אצווה-ריקה: אורך שונה');
    for (var i = 0; i < sup.length; i++) {
      assert(identical(sups[i], sup[i]), 'אצווה-ריקה: פלט לא-שקול');
    }
    n++;
  }

  print('OK attachChargesBulk: $n asserts passed — דדופ-גלובלי מתעדכן (Dart≡JS)');
}
