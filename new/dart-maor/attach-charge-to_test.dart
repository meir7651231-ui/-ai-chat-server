// בדיקת-חוזה (רתמת-זהב) · attachChargeTo — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/attach-charge-to.test.mjs:
//   1) כרטיס לא-קיים                    ⇒ added:false + אותה-רפרנס (identical)
//   2) מגן C10 — ביטול amount=0         ⇒ added:false
//   3) מגן C2 — מפתח יושב על כרטיס אחר   ⇒ added:false (דדופ חוצה-כרטיסים)
//   4) הצלחה                            ⇒ hist גדל 1⇒2, טוהר-הקלט, שני-השקעים הופעלו
//   5) בלי מפתח                         ⇒ מתווסף בכל-זאת (אין דדופ)
// שקעים-מיני כמתועד בחוזה (זהים לקולבקים של בדיקת-ה-JS). המרה: === ⇒ identical.
// הרצה: dart run --enable-asserts new/dart-maor/attach-charge-to_test.dart  ⇒ exit 0
import 'attach-charge-to.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// truthiness של הקולבקים במקור (c.txnId ? ... : '').
bool _t(Object? v) => v != null && v != '' && v != 0 && v != false;

String chargeDedupKey(Map c) => _t(c['txnId']) ? 'txn:${c['txnId']}' : '';
String histDedupKey(Map h) => _t(h['txn']) ? 'txn:${h['txn']}' : '';
Map chargeToHist(Map c) => {'d': c['d'], 'a': c['amount'], 'txn': c['txnId']};
Map fillCardFromCharge(Map sp, Map c) => {...sp, 'filled': true};
Map withNedarimHok(Map sp, Map c) => {...sp, 'hoked': true};

// עוטף הזרקת-השקעים (מקביל ל-`...IO` של ה-JS).
Map<String, Object?> _attach(List supporters, Object? supId, Map charge) =>
    attachChargeTo(supporters, supId, charge, chargeDedupKey, histDedupKey,
        chargeToHist, fillCardFromCharge, withNedarimHok);

List _mk() => [
      {
        'id': 's1',
        'hist': [
          {'d': '2026-01-01', 'a': 50, 'txn': 'T1'}
        ]
      },
      {'id': 's2', 'hist': []},
    ];

void main() {
  var n = 0;

  // 1) כרטיס לא-קיים ⇒ added:false ואותה-רפרנס בדיוק (=== במקור ⇒ identical).
  {
    final sup = _mk();
    final r = _attach(sup, 'אין', {'amount': 100, 'txnId': 'T9'});
    _ok(r['added'] == false && identical(r['supporters'], sup),
        'לא-קיים: אמור added:false ואותה-רפרנס');
    n++;
  }

  // 2) מגן C10 — ביטול amount=0 לא נרשם.
  _ok(_attach(_mk(), 's2', {'amount': 0, 'txnId': 'T9'})['added'] == false,
      'C10: ביטול נרשם בטעות');
  n++;

  // 3) מגן C2 — המפתח יושב על כרטיס *אחר* (s1), המיזוג אל s2 נחסם.
  _ok(_attach(_mk(), 's2', {'amount': 100, 'txnId': 'T1'})['added'] == false,
      'C2: כפילות-חוצת-כרטיסים נרשמה');
  n++;

  // 4) הצלחה — hist גדל, טוהר-הקלט, שני-השקעים הופעלו.
  {
    final sup = _mk();
    final r = _attach(sup, 's1', {'amount': 200, 'txnId': 'T2', 'd': '2026-02-02'});
    _ok(r['added'] == true, 'הצלחה: added ≠ true');
    n++;
    final card = (r['supporters'] as List)[0] as Map;
    _ok((card['hist'] as List).length == 2, 'hist לא גדל 1⇒2');
    n++;
    final last = (card['hist'] as List)[1] as Map;
    _ok(last['d'] == '2026-02-02' && last['a'] == 200 && last['txn'] == 'T2',
        'הרשומה-החדשה שגויה');
    n++;
    _ok(card['filled'] == true && card['hoked'] == true, 'fill/hok לא הופעלו');
    n++;
    // טוהר-הקלט — supporters המקורי לא-שונה.
    _ok((sup[0] as Map)['hist'].length == 1 && (sup[0] as Map)['filled'] == null,
        'הקלט שונה — הופר הטוהר');
    n++;
  }

  // 5) בלי מפתח — אין דדופ, מתווסף בכל-זאת.
  {
    final sup = [
      {
        'id': 's1',
        'hist': [
          {'d': '2026-01-01', 'a': 50}
        ]
      }
    ];
    final r = _attach(sup, 's1', {'amount': 50, 'd': '2026-01-01'});
    _ok(
        r['added'] == true &&
            ((r['supporters'] as List)[0] as Map)['hist'].length == 2,
        'אין-מפתח: אמור להתווסף בכל-זאת');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_attach(_mk(), 'אין', {'amount': 1})['added'] == false, 'assert-live guard');

  print('OK attachChargeTo: $n asserts passed (מגיני C2+C10)');
}
