// ⚛️ אטום-Dart (דרגת-חוזה) · chargeToHist — רשומת-hist מעסקה (שדות לא-ריקים; d/a/c/clearer תמיד).
// מוצא: maor-system/src/lib/nedarimSync.ts:112 (chargeToHist) + curOf:106 (inline) · המקור: new/atoms/nedarim-charge-to-hist.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). חוק-4 — זהה-ביט למקור-JS.
//        curOf inline (חוק-4 verbatim).
//
// הערות-המרה (JS→Dart):
//  • curOf: `/usd|\$|דולר/i` ⇒ RegExp(r'usd|\$|דולר', caseSensitive:false) — התו העברי נשמר.
//    currency '1'/'2' ⇒ '₪'/'$'; `String(c.currency || '')` ⇒ falsy⇒'' ואחרת toString.
//  • `charge.d || (charge.at||'').slice(0,10) || ''` — שרשרת-truthy של מחרוזות.
//  • `(charge.X||'').trim()` ⇒ _s(v).trim(); הוספה רק אם לא-ריק.
//  • `charge.amount` מועבר verbatim (int נשאר int). הפלט Map בסדר d,a,c,clearer,ref,txn,receipt,last4,kevaId.

String _s(dynamic v) => v is String ? v : '';

String _curOf(Map charge) {
  final cv = charge['currency'];
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

/// Build a hist entry from a Nedarim charge. Verbatim port of nedarim-charge-to-hist.mjs.
Map<String, dynamic> chargeToHist(Map<String, dynamic> charge) {
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
