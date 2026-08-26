// רתמת-זהב · with-nedarim-hok — מוכיחה את 7 דוגמאות-החוזה + בדיקת-ה-JS
// (זהות-ביט למקור). מייבאת רק את האטום-שלה; כישלון ⇒ StateError.
// שקעים מזויפים לפי החוזה: curOf=currency==='$'?'$':'₪' · hokDayFromDate=יום-מה-ISO.
import 'with-nedarim-hok.dart';

void chk(String name, bool cond) {
  if (!cond) throw StateError('✗ $name');
}

/// השוואת-מפות עמוקה: אותם מפתחות + ערך-ערך (מערכים=אורך+איבר-איבר).
bool eq(Object? a, Object? b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !eq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!eq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

String curOf(Map<String, Object?> ch) => ch['currency'] == r'$' ? r'$' : '₪';

num hokDayFromDate(String iso) {
  final s = iso.length >= 10 ? iso.substring(8, 10) : '';
  final n = num.tryParse(s);
  return (n == null || n == 0) ? 1 : n;
}

void main() {
  // 1) amount≤0 ⇒ אותה הפניה (זיכוי/ביטול)
  final Map<String, Object?> sp0 = {'id': 's0'};
  chk(
      '1 זיכוי/ביטול ⇒ sp כלשונו',
      identical(
              withNedarimHok(sp0, {'amount': 0, 'kevaId': 'K1'}, curOf,
                  hokDayFromDate),
              sp0) &&
          identical(
              withNedarimHok(sp0, {'amount': -50, 'kevaId': 'K1'}, curOf,
                  hokDayFromDate),
              sp0));

  // 2) בלי kevaId (גם רווחים) ⇒ אותה הפניה
  chk(
      '2 בלי kevaId ⇒ sp כלשונו',
      identical(withNedarimHok(sp0, {'amount': 180}, curOf, hokDayFromDate),
              sp0) &&
          identical(
              withNedarimHok(
                  sp0, {'amount': 180, 'kevaId': '  '}, curOf, hokDayFromDate),
              sp0));

  // 3) הו"ק ידני (בלי kevaId) — לא נדרס
  final Map<String, Object?> spManual = {
    'id': 's1',
    'hok': {'amount': 100, 'active': true}
  };
  chk(
      '3 הו"ק ידני לא נדרס',
      identical(
          withNedarimHok(spManual,
              {'amount': 180, 'kevaId': 'K7', 'd': '2026-08-15'},
              curOf, hokDayFromDate),
          spManual));

  // 4) מילוי מלא + טוהר (sp המקורי לא השתנה)
  final Map<String, Object?> sp1 = {'id': 's1', 'name': 'לוי'};
  final out4 = withNedarimHok(
      sp1, {'amount': 180, 'kevaId': 'K7', 'd': '2026-08-15'},
      curOf, hokDayFromDate);
  chk(
      '4 מילוי מלא',
      out4['id'] == 's1' &&
          out4['name'] == 'לוי' &&
          eq(out4['hok'], {
            'amount': 180,
            'cur': '₪',
            'day': 15,
            'method': 'card',
            'note': 'הו״ק נדרים · K7',
            'active': true,
            'startedAt': '2026-08-15',
            'kevaId': 'K7',
          }) &&
          !sp1.containsKey('hok'));

  // 5) startedAt מוקדם נשמר; הסכום מתעדכן
  final Map<String, Object?> sp5 = {
    'id': 's5',
    'hok': {'kevaId': 'K7', 'amount': 100, 'startedAt': '2026-05-01'}
  };
  final out5 = withNedarimHok(
      sp5, {'amount': 220, 'kevaId': 'K7', 'd': '2026-08-15'},
      curOf, hokDayFromDate);
  final hok5 = out5['hok'] as Map;
  chk('5 שימור-התחלה מוקדמת',
      hok5['startedAt'] == '2026-05-01' && hok5['amount'] == 220);

  // 6) prevStart מאוחר מהעסקה ⇒ תאריך-העסקה מנצח
  final Map<String, Object?> sp6 = {
    'id': 's6',
    'hok': {'kevaId': 'K7', 'amount': 100, 'startedAt': '2026-09-01'}
  };
  final out6 = withNedarimHok(
      sp6, {'amount': 220, 'kevaId': 'K7', 'd': '2026-08-15'},
      curOf, hokDayFromDate);
  chk('6 העסקה המוקדמת מנצחת',
      (out6['hok'] as Map)['startedAt'] == '2026-08-15');

  // 7) בלי d — נופל ל-at (10 תווים ראשונים)
  final out7 = withNedarimHok(
      {'id': 's7'},
      {'amount': 50, 'kevaId': 'K9', 'at': '2026-08-20T10:30:00'},
      curOf,
      hokDayFromDate);
  final hok7 = out7['hok'] as Map;
  chk('7 נפילה ל-at', hok7['startedAt'] == '2026-08-20' && hok7['day'] == 20);

  print(
      'OK — with-nedarim-hok: 7 דוגמאות-חוזה (שערי-אי-נגיעה+מילוי+שימור-התחלה) — ירוק');
}
