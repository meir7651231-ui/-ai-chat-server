// 🧪 הוכחת-חוצה-שפות · sup-partition (Dart) — מריצה את sup-partition.dart על אותם
// קלטים/WANT כמו new/boxes/sup-partition.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart)
// על אותה קופסה: אותם קלטים ⇒ אותו פלט (jsonEncode).
import 'dart:convert';
import 'sup-partition.dart' as D;

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
  // ── SHARED_SUP_KEY + SUP_KEYED_COLS ──
  eq('SHARED_SUP_KEY', D.SHARED_SUP_KEY, '_shared_');
  eq('SUP_KEYED_COLS', D.SUP_KEYED_COLS, ['supporters', 'events']);

  // ── supKeyOf ──
  eq('supKeyOf ייעוד', D.supKeyOf({'forWho': 'רפואה'}), 'רפואה');
  eq('supKeyOf trim', D.supKeyOf({'forWho': '  חינוך  '}), 'חינוך');
  eq('supKeyOf רווחים', D.supKeyOf({'forWho': '   '}), '_shared_');
  eq('supKeyOf חסר', D.supKeyOf(<String, dynamic>{}), '_shared_');
  eq('supKeyOf null', D.supKeyOf({'forWho': null}), '_shared_');

  // ── docSkey ──
  eq('docSkey supporters', D.docSkey('supporters', {'forWho': 'חינוך'}, <String, String>{}), 'חינוך');
  eq('docSkey events מקושר', D.docSkey('events', {'spId': 's1'}, {'s1': 'רפואה'}), 'רפואה');
  eq('docSkey events spId-לא-במפה', D.docSkey('events', {'spId': 'sX'}, <String, String>{}), '_shared_');
  eq('docSkey events בלי-spId', D.docSkey('events', <String, dynamic>{}, <String, String>{}), '_shared_');
  eq('docSkey events spId-לא-מחרוזת', D.docSkey('events', {'spId': 123}, <String, String>{}), '_shared_');
  eq('docSkey לא-נאכף', D.docSkey('families', {'forWho': 'x'}, <String, String>{}), '');

  // ── supKeyMapOf ──
  // JS ‏[...m] ⇒ מערך-רשומות [[k,v],…] בסדר-הכנסה; ‏Dart: m.entries → [k,v].
  final m = D.supKeyMapOf([
    {'id': 's1', 'forWho': 'רפואה'},
    {'id': 's2', 'forWho': ''},
  ]) as Map;
  eq('supKeyMapOf', m.entries.map((e) => [e.key, e.value]).toList(), [
    ['s1', 'רפואה'],
    ['s2', '_shared_'],
  ]);

  // ── supAllowedKeys ──
  eq('supAllowedKeys dedup/trim/empty', D.supAllowedKeys(['רפואה', 'חינוך', 'רפואה', '  ']),
      ['רפואה', 'חינוך', '_shared_']);
  eq('supAllowedKeys ריק', D.supAllowedKeys(<String>[]), ['_shared_']);
  final big = D.supAllowedKeys([for (var i = 0; i < 40; i++) 'k$i']);
  ok('supAllowedKeys cap: אורך 30', big.length == 30);
  ok('supAllowedKeys: המשותף בזנב אחרי החיתוך', big[29] == '_shared_');

  // ── stripSupKey ──
  eq('stripSupKey מקלף', D.stripSupKey({'a': 1, 'skey': 'x'}), {'a': 1});
  final noKey = {'a': 1};
  ok('stripSupKey: בלי-skey מחזיר הפניה (לא עותק)', identical(D.stripSupKey(noKey), noKey));

  // ── stripAuditMeta ──
  eq('stripAuditMeta מקלף', D.stripAuditMeta({'m': 1, 'audit': [1, 2]}), {'m': 1});
  final noAudit = {'m': 1};
  ok('stripAuditMeta: בלי-audit מחזיר הפניה (לא עותק)', identical(D.stripAuditMeta(noAudit), noAudit));

  // 🛡 מגן-הכרעה (JS test §guard): קורא את מקור-הקופסה verbatim ומאמת מחרוזות-חיווט.
  // דלוג (חוק מקרה-תלוי-ריצה-JS): זהו מגן-טקסט-מקור על קובץ ה-.mjs, לא התנהגות חוצה-שפות.
  // בצד ה-Dart החיווט מוכח התנהגותית (docSkey/supKeyMapOf מזריקים את supKeyOf המחווט,
  // ו-supKeyOf מזריק SHARED — כפי שכל הטענות לעיל מדגימות).

  if (fails > 0) {
    print('❌ קופסת-sup-partition (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('sup-partition dart proof failed');
  }
  print('✓ קופסת-sup-partition (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
