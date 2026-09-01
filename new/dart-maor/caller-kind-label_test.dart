import '../dart-data-maor/caller-kind-label-sockets.dart' as sk_caller_kind_label;
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
  assert(callerKindLabel(cfg, 'family', termOf, sk_caller_kind_label.callerKindLabel_T) == 'משפחה', '✗ 1-family');
  assert(callerKindLabel(cfg, 'member', termOf, sk_caller_kind_label.callerKindLabel_T) == 'בן/בת משפחה', '✗ 1-member');
  assert(callerKindLabel(cfg, 'supporter', termOf, sk_caller_kind_label.callerKindLabel_T) == 'תורם/ת', '✗ 1-supporter');
  assert(callerKindLabel(cfg, 'volunteer', termOf, sk_caller_kind_label.callerKindLabel_T) == 'מתנדב/ת', '✗ 1-volunteer');
  assert(callerKindLabel(cfg, 'coordinator', termOf, sk_caller_kind_label.callerKindLabel_T) == 'רכז/ת', '✗ 1-coordinator');
  // 2 · דריסת-מונח מנצחת (ורטיקל מסחרי)
  assert(
    callerKindLabel({'terms': {'entity.supporter': 'ליד'}}, 'supporter', termOf, sk_caller_kind_label.callerKindLabel_T) == 'ליד',
    '✗ 2',
  );
  // 3 · דריסה של רווחים = אין-דריסה
  assert(
    callerKindLabel({'terms': {'entity.family': '   '}}, 'family', termOf, sk_caller_kind_label.callerKindLabel_T) == 'משפחה',
    '✗ 3',
  );
  // 4 · סוג לא-מוכר ⇒ null (undefined במקור)
  assert(callerKindLabel(cfg, 'alien', termOf, sk_caller_kind_label.callerKindLabel_T) == null, '✗ 4');

  print('✓ caller-kind-label (Dart): 8 בדיקות מ-4 דוגמאות-חוזה — ירוק');
}
