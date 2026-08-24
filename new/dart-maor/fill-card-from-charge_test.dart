import 'fill-card-from-charge.dart';

/// רתמת-זהב: אותן 7 דוגמאות-חוזה בדיוק מ-new/atoms/fill-card-from-charge.test.mjs.
/// השקעים normPhone/normId = פורט נאמן-למקור של אלה שבבדיקת-ה-JS (dedup.ts).

String normPhone(String s) {
  var d = s.replaceAll(RegExp(r'\D'), '');
  if (RegExp(r'^(\d)\1+$').hasMatch(d)) return '';
  d = d.replaceFirst(RegExp(r'^00'), '');
  if (d.startsWith('972')) d = '0' + d.substring(3);
  return d.replaceFirst(RegExp(r'^0{2,}'), '0');
}

String normId(String s) {
  final d = s.replaceAll(RegExp(r'\D'), '');
  if (d.isEmpty || RegExp(r'^0+$').hasMatch(d)) return '';
  if (d.replaceFirst(RegExp(r'^0+'), '').length < 4) return '';
  return d.length >= 5 ? d : '';
}

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    print('✗ $msg');
    _f = 1;
  }
}

/// השוואת-מפות עמוקה (מפתחות זהים + ערכים זהים) — לא זהות-רפרנס.
bool mEq(Map<String, dynamic> a, Map<String, dynamic> b) {
  if (a.length != b.length) return false;
  for (final k in a.keys) {
    if (!b.containsKey(k) || b[k] != a[k]) return false;
  }
  return true;
}

void main() {
  final ch = <String, dynamic>{
    'phone': ' 052-1234567 ',
    'email': ' a@b.co.il ',
    'zeout': '0-1234567-8',
    'name': ' דוד לוי ',
  };

  // 1) כרטיס-ריק ⇒ ארבעת השדות מולאו (phone גלם-גזום, idNum מנורמל)
  ok(
    mEq(
      fillCardFromCharge(<String, dynamic>{}, ch, normPhone, normId),
      <String, dynamic>{
        'phone': '052-1234567',
        'email': 'a@b.co.il',
        'idNum': '012345678',
        'name': 'דוד לוי',
      },
    ),
    'מילוי כרטיס-ריק שגוי',
  );

  // 2) ערך-קיים לא נדרס
  final sp2 = <String, dynamic>{'phone': '03-1111111', 'name': 'לוי', 'email': ''};
  final r2 = fillCardFromCharge(sp2, ch, normPhone, normId);
  ok(r2['phone'] == '03-1111111' && r2['name'] == 'לוי', 'ערך-קיים נדרס');
  ok(r2['email'] == 'a@b.co.il' && r2['idNum'] == '012345678', 'שדה-ריק לא הושלם');

  // 3) מספר-דמה ⇒ לא ממלא גם שדה-ריק (C12)
  ok(
    !fillCardFromCharge(<String, dynamic>{}, {'phone': '0000000000'}, normPhone, normId)
        .containsKey('phone'),
    'מספר-דמה מילא טלפון',
  );

  // 4) טלפון-קצר (<7 ספרות) ⇒ לא מולא
  ok(
    !fillCardFromCharge(<String, dynamic>{}, {'phone': '123-45'}, normPhone, normId)
        .containsKey('phone'),
    'טלפון-קצר מילא',
  );

  // 5) zeout קצר ⇒ normId '' ⇒ idNum לא מולא
  ok(
    !fillCardFromCharge(<String, dynamic>{}, {'zeout': '123'}, normPhone, normId)
        .containsKey('idNum'),
    'ת"ז-פסולה מילאה',
  );

  // 6) אין-מה-למלא ⇒ אותה רפרנס (identical)
  final sp6 = <String, dynamic>{'phone': '03-1111111'};
  ok(
    identical(fillCardFromCharge(sp6, <String, dynamic>{}, normPhone, normId), sp6),
    'עסקה-ריקה לא החזירה אותה רפרנס',
  );

  // 7) רווחים-בלבד = ריק ⇒ מולא
  ok(
    fillCardFromCharge({'phone': '   '}, {'phone': '052-1234567'}, normPhone, normId)['phone'] ==
        '052-1234567',
    'שדה-רווחים לא נחשב ריק',
  );

  if (_f != 0) throw StateError('fill-card-from-charge: סטייה מהמקור');
  print('✓ fill-card-from-charge: 7 דוגמאות-חוזה — ירוק');
}
