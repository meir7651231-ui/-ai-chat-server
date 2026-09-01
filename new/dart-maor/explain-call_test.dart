import '../dart-data-maor/explain-call-sockets.dart' as sk_explain_call;
// 🏅 רתמת-זהב · explainCall — void main + assert-ים שהם **בדיוק** דוגמאות-החוזה של
//    בדיקת-ה-JS (new/atoms/explain-call.test.mjs / explain-call.contract.md). אותם
//    קלטים→פלטים. עובר ⇒ Dart ≡ JS (חוק-4). הרצה: dart run --enable-asserts.
import 'explain-call.dart';

// שקע-הסימולציה המזויף (מקביל ל-engWith של בדיקת-ה-JS): מחזיר sim קבוע, אוגר קריאות.
class _Eng {
  final List<List<dynamic>> calls = [];
  final Map<String, dynamic> sim;
  final bool vmOn;
  _Eng(this.sim, {this.vmOn = true});
  Map<String, dynamic> simulateCall(
      dynamic t, Map<String, dynamic> c, Map<String, dynamic> o) {
    calls.add([t, c, o]);
    return sim;
  }
  bool featureOn(dynamic t, String key) => key == 'voicemail' ? vmOn : false;
}

bool _listEq(dynamic a, List<String> b) {
  if (a is! List || a.length != b.length) return false;
  for (var i = 0; i < b.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

void main() {
  // 1) office + פרוטוקול-השקע + זהות-sim
  final sim1 = <String, dynamic>{
    'path': ['open', 'office'],
    'outcome': 'office',
    'reason': 'שעות-פעילות'
  };
  final e1 = _Eng(sim1);
  final tenant1 = <String, dynamic>{
    'destinations': {
      'office': {
        'ext': ['101', '102']
      }
    }
  };
  final call1 = <String, dynamic>{};
  final opts1 = <String, dynamic>{};
  final out1 = explainCall(tenant1, call1, opts1, e1.simulateCall, e1.featureOn, sk_explain_call.explainCall_DOW_HE, sk_explain_call.explainCall_T);
  assert(_listEq(out1['lines'], ['✅ בשעות-פעילות → מצלצל במשרד (101, 102).']),
      '1 office lines');
  assert(out1['reason'] == 'שעות-פעילות', '1 reason');
  assert(out1['outcome'] == 'office', '1 outcome');
  assert(identical(out1['sim'], sim1), '1 sim identity');
  assert(e1.calls.length == 1, '1 socket called once');
  assert(identical(e1.calls[0][0], tenant1), '1 arg tenant');
  assert(identical(e1.calls[0][1], call1), '1 arg call');
  assert(identical(e1.calls[0][2], opts1), '1 arg opts');

  // 2+7) callerId + dow ⇒ שורת-מתקשר, summary = join(' ')
  final out2 = explainCall(tenant1, <String, dynamic>{'callerId': '0501234567', 'dow': 2, 'hhmm': '10:00'}, <String, dynamic>{}, e1.simulateCall, e1.featureOn, sk_explain_call.explainCall_DOW_HE, sk_explain_call.explainCall_T);
  assert(out2['lines'][0] == '📲 מתקשר 0501234567 · יום שלישי 10:00', '2 caller line');
  assert(
      out2['summary'] ==
          '📲 מתקשר 0501234567 · יום שלישי 10:00 ✅ בשעות-פעילות → מצלצל במשרד (101, 102).',
      '7 summary join');

  // 3) voicemail: סיבה ספציפית מוצגת, גנרית לא
  final tenant3 = <String, dynamic>{
    'destinations': {
      'manager': {'ext': '200'},
      'voicemail': {'box': '300'}
    }
  };
  final eh = _Eng(<String, dynamic>{
    'path': ['closed'],
    'outcome': 'voicemail',
    'reason': 'חג'
  });
  final a = explainCall(tenant3, <String, dynamic>{}, <String, dynamic>{}, eh.simulateCall, eh.featureOn, sk_explain_call.explainCall_DOW_HE, sk_explain_call.explainCall_T);
  assert(a['lines'][0] == '🌙 מחוץ-לשעות (חג) → מנהל (200) → תא-קולי (300).', '3א חג');
  final eg = _Eng(<String, dynamic>{
    'path': ['closed'],
    'outcome': 'voicemail',
    'reason': 'מחוץ-לשעות'
  });
  final b = explainCall(tenant3, <String, dynamic>{}, <String, dynamic>{}, eg.simulateCall, eg.featureOn, sk_explain_call.explainCall_DOW_HE, sk_explain_call.explainCall_T);
  assert(b['lines'][0] == '🌙 מחוץ-לשעות → מנהל (200) → תא-קולי (300).', '3ב גנרית');

  // 4) afterhours F11 — מודע-voicemail + יעדים חסרים ⇒ '—' + טריגר ivr-invalid
  final sim4 = <String, dynamic>{
    'path': ['open', 'office', 'manager'],
    'outcome': 'afterhours',
    'reason': ''
  };
  final e4off = _Eng(sim4, vmOn: false);
  final off = explainCall(<String, dynamic>{}, <String, dynamic>{}, <String, dynamic>{}, e4off.simulateCall, e4off.featureOn, sk_explain_call.explainCall_DOW_HE, sk_explain_call.explainCall_T);
  assert(off['lines'][0] == '🌙 אין-מענה במשרד → מנהל (—) → צליל-תפוס (אין תא-קולי).',
      '4א voicemail כבוי');
  final e4on = _Eng(sim4, vmOn: true);
  final on = explainCall(<String, dynamic>{}, <String, dynamic>{}, <String, dynamic>{}, e4on.simulateCall, e4on.featureOn, sk_explain_call.explainCall_DOW_HE, sk_explain_call.explainCall_T);
  assert(on['lines'][0] == '🌙 אין-מענה במשרד → מנהל (—) → תא-קולי.', '4ב voicemail דלוק');
  final einv = _Eng(<String, dynamic>{
    'path': ['open', 'ivr', 'ivr-invalid'],
    'outcome': 'afterhours',
    'reason': ''
  }, vmOn: true);
  final inv = explainCall(<String, dynamic>{}, <String, dynamic>{}, <String, dynamic>{}, einv.simulateCall, einv.featureOn, sk_explain_call.explainCall_DOW_HE, sk_explain_call.explainCall_T);
  assert(inv['lines'][0] == '🌙 בחירה לא-תקינה ב-IVR → מנהל (—) → תא-קולי.', '4ג ivr-invalid');

  // 5) חיוג-יוצא: via + כשר-חסום, reason='' תמיד
  final ev = _Eng(<String, dynamic>{
    'path': ['outbound'],
    'outcome': 'via:sim1'
  });
  final via = explainCall(<String, dynamic>{}, <String, dynamic>{'direction': 'outbound', 'did': '035551234'}, <String, dynamic>{}, ev.simulateCall, ev.featureOn, sk_explain_call.explainCall_DOW_HE, sk_explain_call.explainCall_T);
  assert(_listEq(via['lines'], ['📞 חיוג-יוצא: 035551234', '✅ יוצא דרך: sim1']),
      '5א via lines');
  assert(via['reason'] == '', '5א reason');
  assert(via['outcome'] == 'via:sim1', '5א outcome');
  final ek = _Eng(<String, dynamic>{
    'path': ['outbound'],
    'outcome': 'non-kosher-blocked'
  });
  final kosher = explainCall(<String, dynamic>{}, <String, dynamic>{'direction': 'outbound', 'did': '035551234'}, <String, dynamic>{}, ek.simulateCall, ek.featureOn, sk_explain_call.explainCall_DOW_HE, sk_explain_call.explainCall_T);
  assert(kosher['lines'][1] == '⛔ מצב-כשר: ניסיון-יציאה דרך SIM לא-כשר — נחסם.',
      '5ב כשר-חסום');

  // 6) default: ivr:* + outcome לא-מוכר
  final ei = _Eng(<String, dynamic>{
    'path': ['open', 'ivr', 'opt:1'],
    'outcome': 'ivr:office',
    'reason': 'שעות-פעילות'
  });
  final ivr = explainCall(<String, dynamic>{}, <String, dynamic>{}, <String, dynamic>{}, ei.simulateCall, ei.featureOn, sk_explain_call.explainCall_DOW_HE, sk_explain_call.explainCall_T);
  assert(ivr['lines'][0] == '✅ בחירת-IVR → office.', '6א בחירת-IVR');
  final eo = _Eng(<String, dynamic>{'path': [], 'outcome': 'zzz', 'reason': ''});
  final odd = explainCall(<String, dynamic>{}, <String, dynamic>{}, <String, dynamic>{}, eo.simulateCall, eo.featureOn, sk_explain_call.explainCall_DOW_HE, sk_explain_call.explainCall_T);
  assert(odd['lines'][0] == 'תוצאה: zzz', '6ב לא-מוכר');

  print('✓ explain-call (Dart): 7 דוגמאות-חוזה — ירוק (Dart ≡ JS)');
}
