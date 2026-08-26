// 🧪 הוכחת-חוצה-שפות · config · ליבה-טהורה (Dart) — אותם קלטים/WANT כמו הליבה-הטהורה
// של new/boxes/lib-config.test.mjs. ה-IO/DOM (loadOrgConfig/apply*/override) מדולג —
// מוזרק פר-פלטפורמה בלוח-האם. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה-טהורה.
import 'dart:convert';
import 'config.dart' as C;

int n = 0, fails = 0;
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) { print('✗ $name: got $g want $w'); fails++; } else { n++; }
}
void ok(String name, bool c) { if (!c) { print('✗ $name'); fails++; } else { n++; } }

void main() {
  // 1) moduleOn / featureOn (שרשור-אבות + מודול-ניווט)
  eq('moduleOn חסר⇒פעיל', C.moduleOn({'modules': {}}, 'shop'), true);
  eq('moduleOn false⇒כבוי', C.moduleOn({'modules': {'shop': false}}, 'shop'), false);
  eq('featureOn חסר⇒פעיל', C.featureOn({'modules': {}, 'features': {}}, 'a.b.c'), true);
  eq('featureOn אב-כבוי', C.featureOn({'modules': {}, 'features': {'a.b': false}}, 'a.b.c'), false);
  eq('featureOn מודול-ניווט-כבוי', C.featureOn({'modules': {'shop': false}, 'features': {}}, 'shop.x'), false);
  eq('featureOn home אינו-ניווט', C.featureOn({'modules': {'shop': false}, 'features': {}}, 'home.x'), true);

  // 3) safeHttpsUrl / termOf / isSafeAccent
  eq('safeHttpsUrl http⇒null', C.safeHttpsUrl('http://x'), null);
  eq('safeHttpsUrl https', C.safeHttpsUrl(' https://a.co '), 'https://a.co/');
  eq('safeHttpsUrl ריק', C.safeHttpsUrl(''), null);
  eq('termOf דריסה', C.termOf({'terms': {'x': '  שלום '}}, 'x', 'ד'), 'שלום');
  eq('termOf ריק⇒fallback', C.termOf({'terms': {'x': '   '}}, 'x', 'ד'), 'ד');
  eq('termOf אין-terms', C.termOf({}, 'x', 'ד'), 'ד');
  eq('isSafeAccent #fff', C.isSafeAccent('#fff'), true);
  ok('isSafeAccent זדוני', !C.isSafeAccent("url('http://e')"));

  // 4) תפקידים/הרשאות (מבנה verbatim מבדיקת-ה-JS)
  final cfgRoles = {'adminEmails': ['A@b.co'], 'roles': {'teachers': {'T@b.co': 't1'}}};
  eq('roleOf admin', C.roleOf(cfgRoles, 'a@B.CO'), 'admin');
  eq('roleOf teacher', C.roleOf(cfgRoles, 't@b.co'), 'teacher');
  eq('roleOf staff', C.roleOf(cfgRoles, 'x@y.z'), 'staff');
  eq('teacherIdOf', C.teacherIdOf(cfgRoles, 'T@B.CO'), 't1');
  eq('teacherIdOf null', C.teacherIdOf(cfgRoles, 'x@y.z'), null);

  // 5) isSuperAdmin — רשימה מוזרקת (זהות = שקע)
  eq('isSuperAdmin ברשימה', C.isSuperAdmin('boss@x.co', ['boss@x.co']), true);
  eq('isSuperAdmin case-insensitive', C.isSuperAdmin('BOSS@X.CO', ['boss@x.co']), true);
  eq('isSuperAdmin מחוץ', C.isSuperAdmin('x@y.z', ['boss@x.co']), false);

  // 6) signUpError
  eq('signUp orgName', C.signUpError('', 'a', '0501234567', 'a@b.co', '123456', '123456'), 'שם הארגון הוא שדה חובה');
  eq('signUp תקין', C.signUpError('ארג', 'איש', '0501234567', 'a@b.co', '123456', '123456'), '');

  // 8) normalizeConfig — הלב: זבל/accent/allowlist/ברירות
  eq('normalizeConfig null', C.normalizeConfig(null), null);
  eq('normalizeConfig בלי slug/orgName/theme', C.normalizeConfig({'random': 1}), null);
  {
    final c = C.normalizeConfig({'slug': 'demo'})!;
    eq('normalizeConfig ברירות', [c['orgName'], c['theme'], c['modules'], c['features'], c['terms']],
        ['', 'or-rishon', {}, {}, {}]);
  }
  eq('normalizeConfig accent-בטוח', C.normalizeConfig({'slug': 'd', 'accent': '#fff'})!['accent'], '#fff');
  ok('normalizeConfig accent-זדוני נזרק', !C.normalizeConfig({'slug': 'd', 'accent': "url('http://e')"})!.containsKey('accent'));

  // resolveOrgConfig — ענן גובר, slug נשאר של הכתובת
  {
    final r = C.resolveOrgConfig({'slug': 'url-slug', 'orgName': 'A', 'theme': 'or-rishon'},
        {'slug': 'cloud', 'orgName': 'B', 'theme': 'or-rishon'}) as Map;
    eq('resolveOrgConfig slug-מהכתובת', r['slug'], 'url-slug');
    eq('resolveOrgConfig ענן-גובר orgName', r['orgName'], 'B');
  }

  if (fails > 0) {
    print('❌ קופסת-config (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('config dart proof failed');
  }
  print('✓ קופסת-config ליבה-טהורה (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
