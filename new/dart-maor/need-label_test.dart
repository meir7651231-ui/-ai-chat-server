// רתמת-זהב · need-label — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// שקע-ORG_NEEDS מקומי לבדיקה (קטלוג-המקור: maor/src/lib/signupWizard.ts).
import 'need-label.dart';

void main() {
  const orgNeeds = <Map<String, String>>[
    {'id': 'crm', 'emoji': '👥', 'label': 'ניהול לקוחות ואנשי קשר'},
    {'id': 'billing', 'emoji': '🧾', 'label': 'גבייה, תשלומים וקבלות'},
    {'id': 'schedule', 'emoji': '📅', 'label': 'יומן, שיבוצים ותורים'},
    {'id': 'inventory', 'emoji': '📦', 'label': 'מלאי, מוצרים ושירותים'},
    {'id': 'reports', 'emoji': '📊', 'label': 'דוחות ותובנות'},
    {'id': 'multi', 'emoji': '🏢', 'label': 'ריבוי סניפים / צוות גדול'},
    {'id': 'backup', 'emoji': '🔒', 'label': 'גיבוי ואבטחת מידע'},
  ];
  assert(needLabel('crm', orgNeeds) == 'ניהול לקוחות ואנשי קשר', 'crm');
  assert(needLabel('billing', orgNeeds) == 'גבייה, תשלומים וקבלות', 'billing');
  assert(needLabel('backup', orgNeeds) == 'גיבוי ואבטחת מידע', 'backup');
  assert(needLabel('nosuch', orgNeeds) == 'nosuch', 'מזהה-זר לא הוחזר כמו-שהוא');
  assert(needLabel('crm', <Map<String, String>>[]) == 'crm', 'קטלוג ריק לא נפל למזהה');
  print('✓ need-label (Dart): 5 דוגמאות-חוזה — ירוק');
}
