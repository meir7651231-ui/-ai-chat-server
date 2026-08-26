// 🧪 הוכחת-חוצה-שפות · קופסת-זיהוי-השיחה (Dart) — אותם קלטים/WANT כמו new/boxes/caller-id.test.mjs.
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה: מספר גולמי ⇒ אותו כרטיס-שיחה, זהה-ביט.
import 'dart:convert';
import 'caller-id.dart' as C;

int n = 0, fails = 0;
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    print('✗ $name: got $g want $w');
    fails++;
  } else {
    n++;
  }
}

void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

void main() {
  final db = <String, Object?>{
    'families': [
      {
        'id': 'F1',
        'name': 'כהן',
        'phone': '050-1234567',
        'members': [
          {'id': 'M1', 'name': 'רחל', 'phone': '0521111111'}
        ],
      }
    ],
    'supporters': [
      {'id': 'S1', 'name': 'לוי', 'phone': '+972-53-2222222'}
    ],
    'volunteers': [
      {'id': 'V1', 'name': 'מירי', 'phone': '054 3333333'}
    ],
    'tzCoordinators': [
      {'id': 'C1', 'name': 'דבורה', 'phone': '0554444444'} // שם-האוסף האמיתי במקור (L4)
    ],
    'deliveries': [
      {'familyId': 'F1', 'status': 'picked'},
      {'familyId': 'F1', 'status': 'delivered'},
    ],
    'shopAssignments': [
      {'famId': 'F1', 'status': 'active'}
    ],
  };
  final cfg = {'terms': {}};
  final cfgBiz = {
    'terms': {'entity.family': 'לקוח', 'entity.supporter': 'ליד'}
  };

  // 1+3) זיהוי בכל הצורות של אותו מספר
  for (final raw in ['0501234567', '+972-50-1234567', '00972501234567', '050 123 4567']) {
    final c = C.identifyCaller(db, raw);
    eq('identifyCaller($raw).kind', c?['kind'], 'family');
    eq('identifyCaller($raw).id', c?['id'], 'F1');
  }
  // 2) קצר ⇒ null
  ok('identifyCaller קצר⇒null', C.identifyCaller(db, '12345') == null);
  // סדר-קדימות: בן-משפחה לפני תורם
  eq('קדימות member', C.identifyCaller(db, '0521111111')?['kind'], 'member');
  eq('קדימות supporter', C.identifyCaller(db, '0532222222')?['kind'], 'supporter');
  eq('קדימות volunteer', C.identifyCaller(db, '0543333333')?['kind'], 'volunteer');
  eq('קדימות coordinator', C.identifyCaller(db, '0554444444')?['kind'], 'coordinator');

  // 4) white-label חי: בלי דריסות = היסטורי; עם = נדרס
  eq('kindLabel family היסטורי', C.kindLabel(cfg, 'family'), 'משפחה');
  eq('kindLabel family נדרס', C.kindLabel(cfgBiz, 'family'), 'לקוח');
  eq('kindLabel supporter נדרס', C.kindLabel(cfgBiz, 'supporter'), 'ליד');

  // 5) כרטיס-שיחה מלא: משפחה ⇒ הקשר (מסירה פתוחה אחת, שיבוץ פעיל אחד); תורם ⇒ בלי
  final pop = C.screenPop(db, cfg, '+972501234567');
  eq('screenPop.label', pop?['label'], 'משפחה');
  eq('screenPop.context', pop?['context'], {'openDeliveries': 1, 'activeAssignments': 1});
  ok('screenPop supporter.context==null', C.screenPop(db, cfg, '0532222222')?['context'] == null);
  ok('screenPop לא-נמצא⇒null', C.screenPop(db, cfg, '0000000000') == null);

  // שפיות-נירמול ישירה
  eq('phoneKey שקילות', C.phoneKey('+972-50-1234567'), C.phoneKey('0501234567'));

  if (fails > 0) {
    print('❌ קופסת-זיהוי-השיחה (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('caller-id dart proof failed');
  }
  print('✓ קופסת-זיהוי-השיחה (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
