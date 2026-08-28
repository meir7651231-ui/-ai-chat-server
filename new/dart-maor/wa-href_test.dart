// רתמת-זהב · wa-href — בדיוק 4 דוגמאות-החוזה של new/atoms/wa-href.test.mjs.
// עובר ⇒ Dart ≡ JS. הבדיקה מייבאת אך ורק את האטום שלה (חוק-4).
import 'wa-href.dart';

// שקע waDigits — מימוש-inline כחוזה wa-digits (בדיקת-אטום לא מייבאת אטום — חוק-חיווט):
String? waDigits(dynamic phone) {
  var d = ((phone ?? '') as String).replaceAll(RegExp(r'\D'), '');
  if (d.isEmpty) return null;
  if (d.startsWith('00972')) {
    d = '972${d.substring(5)}';
  } else if (d.startsWith('00')) {
    d = d.substring(2);
  }
  if (d.startsWith('9720')) d = '972${d.substring(4)}';
  if (!d.startsWith('972') &&
      !d.startsWith('0') &&
      (d.length == 8 || d.length == 9)) {
    d = '0$d';
  }
  if (d.startsWith('0')) {
    if (d.length == 9 || d.length == 10) {
      d = '972${d.substring(1)}';
    } else {
      return null;
    }
  }
  if (d.length < 8 || d.length > 15) return null;
  return d;
}

// שקעים כחוזי wa-app-link / wa-link (inline):
dynamic appAtom(dynamic p, dynamic t, String? Function(dynamic) wd) {
  final d = wd(p);
  if (d == null) return null;
  final tt = (t as String).trim();
  return 'whatsapp://send?phone=$d${tt.isNotEmpty ? '&text=${Uri.encodeComponent(tt)}' : ''}';
}

dynamic linkAtom(dynamic p, dynamic t, String? Function(dynamic) wd) {
  final d = wd(p);
  if (d == null) return null;
  final tt = (t as String).trim();
  return 'https://wa.me/$d${tt.isNotEmpty ? '?text=${Uri.encodeComponent(tt)}' : ''}';
}

void main() {
  dynamic appL(dynamic p, dynamic t) => appAtom(p, t, waDigits);
  dynamic linkL(dynamic p, dynamic t) => linkAtom(p, t, waDigits);

  // ✗1 — מצב-אפליקציה: appScheme=true ⇒ whatsapp:// + app:true
  final a = waHref('050-123-4567', 'הי', true, appL, linkL);
  assert(a != null &&
      (a['href'] as String).startsWith('whatsapp://send?phone=972501234567') &&
      a['app'] == true, '✗ 1 מצב-אפליקציה');

  // ✗2 — מצב-wa.me: appScheme=false ⇒ https://wa.me + app:false
  final w = waHref('050-123-4567', 'הי', false, appL, linkL);
  assert(w != null &&
      (w['href'] as String).startsWith('https://wa.me/972501234567') &&
      w['app'] == false, '✗ 2 מצב-wa.me');

  // ✗3 — מספר לא-תקין ⇒ null (אפליקציה)
  assert(waHref('12', 'הי', true, appL, linkL) == null,
      '✗ 3 לא-תקין ⇒ null (אפליקציה)');

  // ✗4 — מספר לא-תקין ⇒ null (wa.me)
  assert(waHref('12', 'הי', false, appL, linkL) == null,
      '✗ 4 לא-תקין ⇒ null (wa.me)');

  print('✓ wa-href (Dart): 4 דוגמאות-חוזה — ירוק');
}
