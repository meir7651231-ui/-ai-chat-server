// רתמת-זהב · ev-label — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// שקע-evMeta מקומי לבדיקה (טבלת-EV_META של maor — הבדיקה מייבאת רק את האטום שלה).
import 'ev-label.dart';

void main() {
  final evMeta = <String, dynamic>{
    'reminder': {'label': 'תזכורת', 'bg': '#efe7f3', 'c': '#7c3aed'},
    'call': {'label': 'טלפון', 'bg': '#dff0ec', 'c': '#0f766e'},
    'bday': {'label': 'יום הולדת', 'bg': '#fbeef3', 'c': '#be185d'},
    'custom': {'label': 'אירוע', 'bg': '#e7edf5', 'c': '#3a5a86'},
  };
  final cases = <List<dynamic>>[
    [<String, dynamic>{'type': 'call'}, 'טלפון'],
    [<String, dynamic>{'type': 'bday'}, 'יום הולדת'],
    [<String, dynamic>{'type': 'custom', 'customType': 'ברית'}, 'ברית'],
    [<String, dynamic>{'type': 'custom', 'customType': ''}, 'אירוע'],
    [<String, dynamic>{'type': 'custom'}, 'אירוע'],
    [<String, dynamic>{'type': 'reminder', 'customType': 'יתעלם'}, 'תזכורת'],
  ];
  for (final c in cases) {
    final ev = c[0] as Map<String, dynamic>;
    final want = c[1] as String;
    final got = evLabel(ev, evMeta);
    assert(got == want, '✗ $ev ⇒ $got ≠ $want');
  }
  print('✓ ev-label (Dart): 6 דוגמאות-חוזה — ירוק');
}
