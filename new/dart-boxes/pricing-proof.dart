// 🧪 הוכחת-חוצה-שפות · תמחור (Dart) — אותם קלטים/WANT כמו new/boxes/pricing.test.mjs.
// (מגני-מקור-ה-JS — readFileSync/regex על pricing.mjs — דולגו כתלויי-טקסט-JS.)
import 'dart:convert';
import 'pricing.dart' as P;

int f = 0, n = 0;
void ok(String name, bool c) { if (!c) { print('✗ $name'); f = 1; } else { n++; } }
// canon: מיון-מפתחות רקורסיבי (משמר סדר-רשימות) — מחקה את deepStrictEqual של JS
// (חסר-תלות בסדר-מפתחות באובייקטים), שבו משתמשת בדיקת-ה-JS.
dynamic canon(dynamic v) {
  if (v is Map) {
    final keys = v.keys.map((k) => k.toString()).toList()..sort();
    return {for (final k in keys) k: canon(v[k])};
  }
  if (v is List) return v.map(canon).toList();
  return v;
}
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(canon(got)), w = jsonEncode(canon(want));
  if (g != w) { print('✗ $name: $g ≠ $w'); f = 1; } else { n++; }
}

void main() {
  final DP = P.DEFAULT_PRICES;
  // DEFAULT_PRICES
  ok('base+setup', DP['base'] == 290 && DP['setup'] == 1500);
  eq('modules', DP['modules'], {
    'families': 0, 'calendar': 0, 'courses': 120, 'diary': 70, 'supporters': 180,
    'reports': 60, 'tzedaka': 90, 'shop': 90, 'shop7': 80,
  });
  eq('sizeMult', DP['sizeMult'], {'small': 1, 'medium': 1.6, 'large': 2.4});
  eq('enterprise', DP['enterprise'], {'oneTime': 55000, 'annualMaintenance': 9000});
  ok('integrations', (DP['integrations'] as Map)['ai'] == 120 && (DP['integrations'] as Map)['receipts'] == 60 && (DP['integrations'] as Map).length == 12);

  // sizeLabels
  eq('sizeLabels', P.sizeLabels, {'small': 'קטן', 'medium': 'בינוני', 'large': 'גדול'});

  // shekel
  ok('shekel 470', P.shekel(470) == '₪470');
  ok('shekel 1024', P.shekel(1024) == '₪1,024');
  ok('shekel 0', P.shekel(0) == '₪0');
  ok('shekel NaN', P.shekel('אבג') == '₪NaN');

  // normalize
  eq('normalize(null)=defaults', P.normalize(null), DP);
  ok('normalize base neg/valid', P.normalize({'base': -5})['base'] == 290 && P.normalize({'base': 350})['base'] == 350);
  ok('normalize zero valid', (P.normalize({'modules': {'courses': 0}})['modules'] as Map)['courses'] == 0);
  ok('normalize string rejected', P.normalize({'base': '100'})['base'] == 290);
  {
    final m = P.normalize({'modules': {'shop': 999, 'junk': 5}})['modules'] as Map;
    ok('normalize foreign module', m['shop'] == 999 && !m.containsKey('junk'));
  }
  {
    final g = P.normalize({'integrations': {'whatsapp': 70, 'junk': 5}})['integrations'] as Map;
    ok('normalize integrations', g['whatsapp'] == 70 && g['ai'] == 120 && !g.containsKey('junk'));
  }

  // quote (nameOf = m⇒m)
  String id(String m) => m;
  {
    final q = P.quote({'modules': {'courses': false}}, 'small', DP, id);
    final lines = q['lines'] as List, incl = q['included'] as List;
    ok('quote courses off', !lines.any((l) => l['key'] == 'courses'));
    ok('quote families incl', incl.any((l) => l['key'] == 'families'));
    ok('quote calendar incl', incl.any((l) => l['key'] == 'calendar'));
    ok('quote modulesSubtotal', q['modulesSubtotal'] == 570);
    ok('quote base/sizeMult', q['base'] == 290 && q['sizeMult'] == 1);
    ok('quote monthly', q['monthly'] == 860);
    ok('quote firstPayment', q['firstPayment'] == 2360);
    ok('quote yearly', q['yearly'] == 10320);
    ok('quote yearlyDiscounted', q['yearlyDiscounted'] == 8600);
  }
  {
    final q = P.quote({}, 'medium', DP, id, [{'key': 'whatsapp', 'label': 'וואטסאפ'}]);
    final waList = (q['lines'] as List).where((l) => l['key'] == 'whatsapp').toList();
    final wa = waList.isEmpty ? null : waList.first;
    ok('quote whatsapp addon', wa != null && wa['kind'] == 'integration' && wa['price'] == 50);
    ok('quote medium sizeMult', q['sizeMult'] == 1.6);
    ok('quote medium monthly', q['monthly'] == ((290 + 740) * 1.6 + 0.5).floor());
  }
  ok('quote unknown size', P.quote({}, 'huge', DP, id)['sizeMult'] == 1);
  ok('quote priceless addon dropped', !(P.quote({}, 'small', DP, id, [{'key': 'zzz', 'label': 'לא-קיים'}])['lines'] as List).any((l) => l['key'] == 'zzz'));
  {
    final q = P.quote({}, 'small', DP, id, const [], 'enterprise');
    ok('quote enterprise', q['mode'] == 'enterprise' && q['enterpriseOneTime'] == 55000 && q['enterpriseAnnual'] == 9000);
  }

  // readPrices / writePrices
  eq('readPrices empty=default', P.readPrices((_) => null), DP);
  {
    final t = P.readPrices((_) => jsonEncode({'base': 350}));
    ok('readPrices stored', t['base'] == 350 && t['setup'] == 1500);
  }
  eq('readPrices bad JSON=default', P.readPrices((_) => 'לא-JSON-תקין'), DP);
  {
    String? seenKey; String? seenVal;
    P.writePrices((k, v) { seenKey = k; seenVal = v; }, {'base': 500});
    ok('writePrices setItem', seenKey == 'maor_prices' && jsonEncode(jsonDecode(seenVal!)) == jsonEncode({'base': 500}));
  }
  {
    var threw = false;
    try { P.writePrices((k, v) => throw StateError('חסום'), {'base': 1}); } catch (_) { threw = true; }
    ok('writePrices swallows throw', !threw);
  }
  {
    final store = <String, String>{};
    final p = {'base': 400, 'modules': {'courses': 200}};
    P.writePrices((k, v) => store[k] = v, p);
    final back = P.readPrices((k) => store[k]);
    eq('round-trip write→read', back, P.normalize(p));
  }

  if (f != 0) { print('❌ קופסת-תמחור (Dart): אי-התאמות'); throw StateError('pricing dart proof failed'); }
  print('✓ קופסת-תמחור (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
