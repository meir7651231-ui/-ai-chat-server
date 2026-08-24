// רתמת-זהב · caller-kind-label — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// שקע-termOf מקומי בסמנטיקת-המקור (lib/config.ts): דריסה ריקה/רווחים = אין-דריסה.
import 'caller-kind-label.dart';

String termOf(dynamic cfg, String key, String fb) {
  final terms = (cfg is Map) ? cfg['terms'] : null;
  final v = (terms is Map) ? terms[key] : null;
  if (v is String) {
    final t = v.trim();
    if (t.isNotEmpty) return t;
  }
  return fb;
}

void main() {
  // 1 · חמש התוויות ההיסטוריות (בלי דריסות — ביט-זהה ללקוח-החי)
  final cfg = <String, dynamic>{};
  assert(callerKindLabel(cfg, 'family', termOf) == 'משפחה', '✗ 1-family');
  assert(callerKindLabel(cfg, 'member', termOf) == 'בן/בת משפחה', '✗ 1-member');
  assert(callerKindLabel(cfg, 'supporter', termOf) == 'תורם/ת', '✗ 1-supporter');
  assert(callerKindLabel(cfg, 'volunteer', termOf) == 'מתנדב/ת', '✗ 1-volunteer');
  assert(callerKindLabel(cfg, 'coordinator', termOf) == 'רכז/ת', '✗ 1-coordinator');
  // 2 · דריסת-מונח מנצחת (ורטיקל מסחרי)
  assert(
    callerKindLabel({'terms': {'entity.supporter': 'ליד'}}, 'supporter', termOf) == 'ליד',
    '✗ 2',
  );
  // 3 · דריסה של רווחים = אין-דריסה
  assert(
    callerKindLabel({'terms': {'entity.family': '   '}}, 'family', termOf) == 'משפחה',
    '✗ 3',
  );
  // 4 · סוג לא-מוכר ⇒ null (undefined במקור)
  assert(callerKindLabel(cfg, 'alien', termOf) == null, '✗ 4');

  print('✓ caller-kind-label (Dart): 8 בדיקות מ-4 דוגמאות-חוזה — ירוק');
}
