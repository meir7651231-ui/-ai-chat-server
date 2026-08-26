// 🧪 הוכחת-חוצה-שפות · vertical-packs (Dart) — אותם קלטים/WANT כמו new/boxes/vertical-packs.test.mjs.
// ‏13 החבילות על קונפיג-אמת, שני חוקי-הבעלים נאכפים (chesed ביט-זהה · צבע-ידני שורד).
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה — פלט זהה-ביט.
//
// מדולג (תלוי-JS): מגן-המקור (regex על boxSrc: `applyVerticalPack(config, packId, VERTICAL_PACKS)`
//   + הבטחת ייבוא-מ-`../atoms/`) — הגנת-מקור לשונית של ה-JS; ב-Dart הכרעות-החיווט
//   מקובעות במבנה-הקוד (השקע PACKS=verticalPacks + ייבוא-אטומים-בלבד).
import 'dart:convert';
import 'vertical-packs.dart' as B;

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
  final base = <String, dynamic>{
    'slug': 'root', 'name': 'מאור', 'firebase': {'apiKey': 'K'}, 'adminEmails': ['a@b.co'],
    'terms': {'member': 'ותיק'}, 'modules': {'shop': false}, 'features': {'x.y': false},
    'theme': 'tsohar', 'accent': '#123456', 'accentCustom': true, 'emoji': '🕎', 'motion': 'bold',
  };

  // 1) chesed = הלקוח-החי (בלי צבע-ידני — נקי לגמרי)
  final clean = <String, dynamic>{...base};
  clean.remove('accentCustom');
  clean.remove('accent');
  final ch = B.applyPack(clean, 'chesed');
  eq('chesed terms ריק', ch['terms'], <String, dynamic>{});
  eq('chesed modules ריק', ch['modules'], <String, dynamic>{});
  eq('chesed features ריק', ch['features'], <String, dynamic>{});
  eq('chesed theme', ch['theme'], 'or-rishon');
  for (final k in ['emoji', 'motion', 'accent', 'accentCustom']) {
    ok('chesed הוסר $k', !ch.containsKey(k));
  }

  // 2) צבע-ידני שורד כל חבילה; 5) שדות-קודש לא נדרסים
  for (final p in B.PACKS) {
    final id = p['id'] as String;
    final out = B.applyPack(base, id);
    eq('$id: הצבע-הידני שרד', out['accent'], '#123456');
    eq('$id: accentCustom שרד', out['accentCustom'], true);
    eq('$id: slug שרד', out['slug'], 'root');
    ok('$id: firebase אותה-הפניה', identical(out['firebase'], base['firebase']));
    eq('$id: adminEmails שרד', out['adminEmails'], ['a@b.co']);
    eq('$id: terms=חבילה', out['terms'], p['terms']);
  }

  // 3) מסחרית ⇒ כיבוי-מסחרי מלא
  final dg = B.applyPack(clean, 'digital');
  for (final k in B.commercialOff.keys) {
    eq('digital כבוי $k', (dg['features'] as Map)[k], false);
  }
  eq('digital theme', dg['theme'], 'heichal');

  // 4) מזהה-זר ⇒ אותה-רפרנס · packOf
  ok('no-such אותה-הפניה', identical(B.applyPack(base, 'no-such'), base));
  ok('packOf no-such=null', B.packOf('no-such') == null);
  eq('packOf studio theme', B.packOf('studio')!['theme'], 'kehila');

  if (fails > 0) {
    print('❌ קופסת-הוורטיקלים (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('vertical-packs dart proof failed');
  }
  print('✓ קופסת-הוורטיקלים (Dart): $n טענות — 13 חבילות · chesed ביט-זהה · צבע-ידני שורד · פלט זהה-ביט ל-JS');
}
