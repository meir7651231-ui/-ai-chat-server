import '../dart-data-maor/cockpit-work-list-text-sockets.dart' as sk_cockpit_work_list_text;
// רתמת-זהב · cockpit-work-list-text — אותם קלטים/WANT של בדיקת-ה-JS.
import 'cockpit-work-list-text.dart';

void main() {
  final q = {
    'tasks': [
      {'kind': 'call', 'name': 'אבי', 'phone': '050', 'reason': 'יעד'},
      {'kind': 'thanks', 'name': '', 'phone': '', 'reason': 'תרם ₪100 · היום'},
      {'kind': 'hok', 'name': 'דן', 'phone': '052', 'reason': 'הוק'},
    ],
    'total': 3,
  };
  const want =
      '📞 שיחה · אבי · 050 — יעד\n💛 תודה · ללא שם — תרם ₪100 · היום\n🔁 הו״ק · דן · 052 — הוק';
  final got = cockpitWorkListText(q, sk_cockpit_work_list_text.cockpitWorkListText_T);
  assert(got == want, '✗\n$got');
  print('✓ cockpit-work-list-text (Dart): 1 Golden — ירוק');
}
