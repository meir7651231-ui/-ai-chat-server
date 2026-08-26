// רתמת-זהב · nedarim-attach-charges-bulk — קלט+WANT זהים ל-new/atoms/*.test.mjs.
// שקעים = doubles מקומיים (chargeDedupKey/chargeToHist אחים · withNedarimHok גוף מ-with-nedarim-hok.dart).
// אם עובר ⇒ Dart≡JS. הרצה: dart run --enable-asserts nedarim-attach-charges-bulk_test.dart ⇒ exit 0.
import 'nedarim-attach-charges-bulk.dart';

String _s(dynamic v) => v is String ? v : '';
bool _falsy(Object? v) =>
    v == null || v == false || v == '' || (v is num && (v == 0 || v.isNaN));

String _curOf(Map c) {
  final cv = c['currency'];
  final raw = ((cv == null || cv == '' || cv == false || (cv is num && cv == 0))
          ? ''
          : cv.toString())
      .trim();
  return raw == r'$' ||
          raw == '2' ||
          RegExp(r'usd|\$|דולר', caseSensitive: false).hasMatch(raw)
      ? r'$'
      : '₪';
}

num _hokDayFromDate(String? iso) {
  final s = iso ?? '';
  final part = s.length >= 10
      ? s.substring(8, 10)
      : (s.length > 8 ? s.substring(8) : '');
  final d = part.isEmpty ? 0.0 : (double.tryParse(part) ?? double.nan);
  if (d.isFinite && d >= 1) {
    final f = d.floor();
    return f < 28 ? f : 28;
  }
  return 1;
}

Map<String, dynamic> _chargeToHistD(Map<String, dynamic> charge) {
  final at = _s(charge['at']);
  final atSlice = at.length > 10 ? at.substring(0, 10) : at;
  final dCand = _s(charge['d']).isNotEmpty
      ? _s(charge['d'])
      : (atSlice.isNotEmpty ? atSlice : '');
  final h = <String, dynamic>{
    'd': dCand.trim(),
    'a': charge['amount'],
    'c': _curOf(charge),
    'clearer': 'נדרים',
  };
  final ref = _s(charge['reference']).trim();
  final txn = _s(charge['txnId']).trim();
  final rec = _s(charge['receipt']).trim();
  final l4 = _s(charge['last4']).trim();
  final keva = _s(charge['kevaId']).trim();
  if (ref.isNotEmpty) h['ref'] = ref;
  if (txn.isNotEmpty) h['txn'] = txn;
  if (rec.isNotEmpty) h['receipt'] = rec;
  if (l4.isNotEmpty) h['last4'] = l4;
  if (keva.isNotEmpty) h['kevaId'] = keva;
  return h;
}

String _chargeDedupKeyD(Map<String, dynamic> charge) {
  final txn = _s(charge['txnId']).trim();
  if (txn.isNotEmpty) return 'txn:$txn';
  final ref = _s(charge['reference']).trim();
  return ref.isNotEmpty ? 'ref:$ref' : '';
}

Map<String, dynamic> _withNedarimHokD(
    Map<String, dynamic> sp, Map<String, dynamic> charge) {
  final amt = charge['amount'];
  if (!(amt is num && amt > 0)) return sp;
  final keva = _s(charge['kevaId']).trim();
  if (keva.isEmpty) return sp;
  final hok = sp['hok'];
  if (hok is Map && _falsy(hok['kevaId'])) return sp;
  var cd = _s(charge['d']).isNotEmpty ? _s(charge['d']) : _s(charge['at']);
  cd = cd.length > 10 ? cd.substring(0, 10) : cd;
  final prevStart = hok is Map ? _s(hok['startedAt']) : '';
  final out = Map<String, dynamic>.of(sp);
  out['hok'] = <String, dynamic>{
    'amount': amt,
    'cur': _curOf(charge),
    'day': _hokDayFromDate(cd),
    'method': 'card',
    'note': 'הו״ק נדרים · $keva',
    'active': true,
    'startedAt': prevStart.isNotEmpty && prevStart.compareTo(cd) < 0
        ? prevStart
        : (cd.isNotEmpty ? cd : prevStart),
    'kevaId': keva,
  };
  return out;
}

void main() {
  final s = <Map<String, dynamic>>[
    {'id': 'a', 'name': 'אבי כהן', 'extId': 'T100', 'idNum': '', 'phone': '0501234567', 'email': 'avi@x.com', 'city': 'ירושלים', 'hist': []},
    {'id': 'b', 'name': 'דנה לוי', 'extId': '', 'idNum': '123456782', 'phone': '0529876543', 'email': '', 'city': '', 'hist': []},
    {'id': 'c', 'name': 'משה', 'extId': '', 'idNum': '', 'phone': '', 'email': '', 'city': '', 'hist': []},
  ];
  final ch1 = {'toremId': 'T100', 'amount': 100, 'txnId': 'TX1', 'd': '2026-08-10', 'currency': '₪'};
  final ch2 = {'phone': '0529876543', 'amount': 200, 'txnId': 'TX2', 'd': '2026-08-11'};

  final r = attachChargesBulk(
    s,
    [
      {'supId': 'a', 'charge': ch1},
      {'supId': 'b', 'charge': ch2},
      {'supId': 'a', 'charge': ch1},
    ],
    chargeDedupKey: _chargeDedupKeyD,
    chargeToHist: _chargeToHistD,
    withNedarimHok: _withNedarimHokD,
  );
  final added = r['added'];
  final sup = r['supporters'] as List;
  final aHist = (sup[0] as Map)['hist'].length;
  final bHist = (sup[1] as Map)['hist'].length;
  assert(added == 2 && aHist == 1 && bHist == 1,
      '✗ nedarim-attach-charges-bulk\nadded=$added aHist=$aHist bHist=$bHist ≠ 2/1/1');
  print('✓ nedarim-attach-charges-bulk (Dart): Golden — ירוק');
}
