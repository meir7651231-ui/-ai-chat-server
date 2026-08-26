// בדיקת-חוזה · wizardIndustries — תרגום new/atoms/wizard-industries.test.mjs אחד-לאחד.
// השוואה מבנית איבר-איבר (כלל-8) + jsonEncode לסדר-מפתחות.
// הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'wizard-industries.dart';

void main() {
  final studio = <String, dynamic>{
    'id': 'studio', 'emoji': '🏢', 'label': 'סטודיו דיגיטל + בנייה',
    'sub': 'פרויקטים · לקוחות · ספקים — משולב', 'theme': 'kehila', 'accent': '#0ea5e9',
  };
  final orRishon = <String, dynamic>{
    'id': 'or-rishon', 'emoji': '🕯️', 'label': 'עמותת חסד',
    'sub': 'משפחות · תרומות · קבלות', 'modules': {'shop': false},
  };

  // 1) קילוף לארבעה שדות בדיוק, בסדר id·emoji·label·sub
  final one = wizardIndustries([studio]);
  final want =
      '[{"id":"studio","emoji":"🏢","label":"סטודיו דיגיטל + בנייה","sub":"פרויקטים · לקוחות · ספקים — משולב"}]';
  if (jsonEncode(one) != want) throw StateError('1 קילוף ⇒ ${jsonEncode(one)}');
  if (one[0].keys.length != 4) throw StateError('1 חייבים בדיוק 4 מפתחות');

  // 2) סדר נשמר
  final two = wizardIndustries([orRishon, studio]);
  if (two.length != 2 || two[0]['id'] != 'or-rishon' || two[1]['id'] != 'studio') {
    throw StateError('2 סדר-החבילות');
  }

  // 3) ריק ⇒ ריק
  if (wizardIndustries(<dynamic>[]).isNotEmpty) throw StateError('3 ריק');

  // 4) טוהר: הקלט לא משתנה, הפלט אובייקטים חדשים
  final out = wizardIndustries([studio]);
  out[0]['label'] = 'שונה';
  if (studio['theme'] != 'kehila' ||
      studio['label'] != 'סטודיו דיגיטל + בנייה' ||
      identical(out[0], studio)) {
    throw StateError('4 טוהר');
  }

  print('OK wizardIndustries: 4 asserts passed');
}
