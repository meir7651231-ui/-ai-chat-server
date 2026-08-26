// 🧪 הוכחת-חוצה-שפות · platform (Dart) — מריצה את platform.dart על אותם קלטים/WANT
// כמו new/boxes/platform.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה.
// הערה: מגן-ההכרעה של ה-JS (regex על מקור-ה-mjs — theme=or-rishon / אפס import-קופסה /
//       תפר-הדלקה) הוא מגן-מקור תלוי-JS ⇒ מדולג כאן (הכללים: מגני-מקור-JS דולגים בהערה).
import 'dart:convert';
import 'platform.dart' as P;

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
  // ── סלאג ותעתיק ──
  ok('slugify עברית', P.slugify('מאור החסד', []) == 'mavr-hchsd');
  ok('slugify ריק ⇒ org', P.slugify('', []) == 'org');
  ok('slugify ייחודי', P.slugify('Test', ['test']) == 'test-2');
  ok('isValidSlug', P.isValidSlug('ab') == true && P.isValidSlug('A') == false);

  // ── מרשמים ──
  ok('ALL_MODULES', P.ALL_MODULES.length == 9 && P.ALL_MODULES[0] == 'families');
  ok('MODULE_LABELS', P.MODULE_LABELS['shop7'] == 'חלוקה');

  // ── קונפיג-לידה + קישורים ──
  final born = P.allOffConfig('x', 'ארגון');
  ok('allOffConfig all-off', born['modules']['families'] == false && born['modules']['shop7'] == false);
  ok('allOffConfig ברירת-מחדל', born['theme'] == 'or-rishon' && jsonEncode(born['features']) == '{}');
  ok('orgLink', P.orgLink('https://a.co', '/', 'x') == 'https://a.co/?org=x');

  // ── מייל וקודים ──
  ok('normEmail', P.normEmail(' A@B.CO ') == 'a@b.co');
  ok('genJoinCode דטרמיניסטי', P.genJoinCode('x').length == 8 && P.genJoinCode('x') == P.genJoinCode('x'));
  ok('orgJoinLink', P.orgJoinLink('https://a.co', '/', 'x', 'c') == 'https://a.co/?org=x&join=c');
  ok('orgJoinFullCode', P.orgJoinFullCode('x', 'abcd') == 'x.abcd');
  eq('parseJoinFullCode תקין', P.parseJoinFullCode('org.abcd'), {'slug': 'org', 'code': 'abcd'});
  ok('parseJoinFullCode דחייה (slug<2)', P.parseJoinFullCode('nodot') == null && P.parseJoinFullCode('x.c') == null);

  // ── היררכיית-הרשאות ──
  ok('isOrgManager חיובי', P.isOrgManager('m@o.co', {'manager': 'm@o.co'}) == true);
  ok('isOrgManager ריק', P.isOrgManager('x@o.co', {'manager': ''}) == false);
  ok('orgEnabledModules — shop כבוי', P.orgEnabledModules({'modules': {'shop': false}}).length == 8);
  final feats = [
    {'key': 'supporters.hok', 'module': 'supporters'}, // רגיל, מודול דלוק
    {'key': 'shop.x', 'module': 'shop'}, // מודול-אב כבוי
    {'key': 'supporters.cockpit', 'module': 'supporters', 'optIn': true}, // opt-in לא-מודלק
  ];
  final enF = P.orgEnabledFeatures({'modules': {'shop': false}, 'features': {}}, feats);
  ok('orgEnabledFeatures תקרה+opt-in', enF.length == 1 && enF[0]['key'] == 'supporters.hok');
  ok('isMember', P.isMember('e@o.co', {'members': ['e@o.co']}) == true);
  eq('overrideOf ריק', P.overrideOf('nope@o.co', {}), {});
  ok('GRANTABLE סט',
      P.GRANTABLE_STAFF_FEATURES.contains('supporters.delete') && P.GRANTABLE_STAFF_FEATURES.length == 10);
  ok('isGrantableFeature', P.isGrantableFeature('shop.delete') == true && P.isGrantableFeature('shop.x') == false);

  // ── effectiveConfigFor: מנהל=מלא · הגבלה-בלבד · הדלקת-grantable ──
  final org = {
    'manager': 'm@o.co',
    'members': ['e@o.co'],
    'memberConfigs': {
      'e@o.co': {
        'modules': {'shop': false},
        'features': {'supporters.delete': true, 'supporters.hok': true},
      },
    },
  };
  final cfg = {
    'modules': {'shop': true, 'families': true},
    'features': {},
  };
  ok('effectiveConfigFor מנהל=זהות', identical(P.effectiveConfigFor('m@o.co', org, cfg), cfg));
  final eff = P.effectiveConfigFor('e@o.co', org, cfg);
  ok('effectiveConfigFor הגבלת-מודול', eff['modules']['shop'] == false);
  ok('effectiveConfigFor הדלקת-grantable', eff['features']['supporters.delete'] == true);
  ok('effectiveConfigFor true לא-grantable ⇒ מתעלמים', eff['features']['supporters.hok'] == null);

  // ── allowedDesignationsFor · canIssueReceipt ──
  ok('allowedDesignationsFor מנהל=null', P.allowedDesignationsFor('m@o.co', org) == null);
  ok('allowedDesignationsFor בלי-רשימה=null', P.allowedDesignationsFor('e@o.co', org) == null);
  ok('canIssueReceipt מקומי',
      P.canIssueReceipt({'superAdmin': false, 'isManager': false, 'cloudRoot': false, 'cloudConnected': false}) == true);
  ok('canIssueReceipt חסום',
      P.canIssueReceipt({'superAdmin': false, 'isManager': false, 'cloudRoot': false, 'cloudConnected': true}) == false);

  // ── מוטציות-חברות ──
  eq('approveMember', P.approveMember({'members': ['a@o.co']}, ' E@O.CO '), {'members': ['a@o.co', 'e@o.co']});
  eq('setEmployeeOverride', P.setEmployeeOverride({}, 'e@o.co', {'modules': {'shop': false}}),
      {'memberConfigs': {'e@o.co': {'modules': {'shop': false}}}});
  eq('removeMember', P.removeMember({'members': ['e@o.co', 'a@o.co'], 'memberConfigs': {'e@o.co': {}}}, 'e@o.co'),
      {'members': ['a@o.co'], 'memberConfigs': {}});

  if (fails > 0) {
    print('❌ קופסת-platform (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('platform dart proof failed');
  }
  print('✓ קופסת-platform (Dart): $n טענות — תעתיק/הרשאות/תקרה/הדלקת-grantable/מוטציות · פלט זהה-ביט ל-JS');
}
