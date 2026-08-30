import '../dart-data-maor/range-label-sockets.dart' as sk_range_label;
// רתמת-זהב · range-label — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (אותם קלטים→פלטים).
// שקע-fmtDate מקומי (התנהגות-המקור: ISO ⇒ dd/mm/yyyy) + תיעוד-קריאות (עדות-שקע).
import 'range-label.dart';

class _Fmt {
  final List<String> calls = [];
  String call(String iso) {
    calls.add(iso);
    final p = iso.substring(0, 10).split('-'); // [y, m, d]
    return '${p[2]}/${p[1]}/${p[0]}';
  }
}

void main() {
  // 1) שני הגבולות ריקים — fmtDate לא נקרא
  {
    final f = _Fmt();
    assert(rangeLabel({'from': '', 'to': ''}, f.call, sk_range_label.rangeLabel_T) == 'כל התאריכים', 'דוגמה 1: התווית שגויה');
    assert(f.calls.isEmpty, 'דוגמה 1: fmtDate נקרא למרות טווח ריק');
  }

  // 2) שני גבולות + 5) עדות-שקע: שתי קריאות כסדרן
  {
    final f = _Fmt();
    final out = rangeLabel({'from': '2026-01-05', 'to': '2026-03-10'}, f.call, sk_range_label.rangeLabel_T);
    assert(out == '05/01/2026 – 10/03/2026', 'דוגמה 2: "$out" ≠ "05/01/2026 – 10/03/2026"');
    assert(f.calls.length == 2 && f.calls[0] == '2026-01-05' && f.calls[1] == '2026-03-10',
        'דוגמה 5: סדר/מספר קריאות-fmtDate שגוי');
  }

  // 3) רק from
  {
    final f = _Fmt();
    final out = rangeLabel({'from': '2026-01-05', 'to': ''}, f.call, sk_range_label.rangeLabel_T);
    assert(out == 'מ-05/01/2026', 'דוגמה 3: "$out" ≠ "מ-05/01/2026"');
  }

  // 4) רק to
  {
    final f = _Fmt();
    final out = rangeLabel({'from': '', 'to': '2026-03-10'}, f.call, sk_range_label.rangeLabel_T);
    assert(out == 'עד 10/03/2026', 'דוגמה 4: "$out" ≠ "עד 10/03/2026"');
  }

  print('✓ range-label (Dart): 4 דוגמאות-חוזה + עדות-שקע — ירוק');
}
