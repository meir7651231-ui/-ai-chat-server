// 🧪 הוכחת-חוצה-שפות · public-site · ליבה-טהורה (Dart) — אותם קלטים/WANT כמו
// new/boxes/public-site.test.mjs. מגן-מקור-ה-JS (readFileSync + regex Date.now) הוא
// תלוי-JS ⇒ מדולג (חוק: מגני-מקור/מקרה תלוי-JS מדולגים בהערה). ירוק ⇒ מאור(JS)
// ובנייה-חכמה(Dart) יושבים על אותה קופסה-טהורה, ביט-אחר-ביט.
import 'dart:convert';
import 'public-site.dart' as PS;

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
  // 1) isRtl
  eq('isRtl en', PS.isRtl('en'), false);
  eq('isRtl he', PS.isRtl('he'), true);
  eq('isRtl yi', PS.isRtl('yi'), true);

  // 2) palette — נפילה ל-CORAL כשאין accent; שמירת-גוון עם accent
  eq('palette fallback=CORAL', PS.palette(), PS.CORAL);
  eq('palette ריק⇒CORAL', PS.palette('')['c1'], '#EC9C9C');
  eq('palette null⇒CORAL', PS.palette(null)['word'], '#E29392');
  {
    final p = PS.palette('#3366cc');
    ok('palette accent נגזר',
        RegExp(r'^#[0-9a-f]{6}$', caseSensitive: false).hasMatch(p['c2'] as String) &&
            p['c2'] != PS.CORAL['c2']);
  }

  // 3) vocab
  eq('vocab עמותתי-he navCta', PS.vocab(false, 'he')['navCta'], 'לתרומה ♡');
  eq('vocab עמותתי-en', PS.vocab(false, 'en')['heroCta'], 'Donate now');
  eq('vocab מסחרי-en', PS.vocab(true, 'en')['heroCta'], 'Get in touch');
  eq('vocab מסחרי-he give', PS.vocab(true, 'he')['give'], 'צרו קשר');

  // 4) localize — נפילות
  eq('localize en', PS.localize({'he': 'שלום', 'en': 'Hi'}, 'en'), 'Hi');
  eq('localize yi⇒he⇒ראשון', PS.localize({'en': 'Hi'}, 'yi'), 'Hi');
  eq('localize yi⇒he', PS.localize({'he': 'שלום'}, 'yi'), 'שלום');
  eq('localize מחרוזת', PS.localize('טקסט', 'he'), 'טקסט');
  eq('localize null', PS.localize(null, 'he'), '');
  eq('localize רק-רווחים⇒ריק', PS.localize({'he': '   '}, 'he'), '');

  // 5) langs — מסונן/ייחודי/ברירת-מחדל
  eq('langs מסונן+ייחודי', PS.langs({'langs': ['en', 'he', 'en', 'zz']}), ['en', 'he']);
  eq('langs חסר⇒[he]', PS.langs(null), ['he']);
  eq('langs ריק⇒[he]', PS.langs({'langs': []}), ['he']);

  // 6) ui — נפילה לעברית
  eq('ui he donate', PS.ui('he', 'donate'), 'לתרומה');
  eq('ui en goal', PS.ui('en', 'goal'), 'Goal');
  eq('ui שפה-לא-מוכרת⇒he', PS.ui('zz', 'donate'), 'לתרומה');
  eq('ui מפתח-חסר⇒ריק', PS.ui('en', 'nope'), '');

  // 7) campaign — עם nowMs מוזרק (מקביל ל-Date.parse('2026-09-01T00:00:00'))
  final now = DateTime(2026, 9, 1).millisecondsSinceEpoch;
  eq('campaign מלא', PS.campaign({'goal': 1000, 'raised': 250, 'end': '2026-09-11'}, now),
      {'goal': 1000, 'raised': 250, 'pct': 25, 'currency': '₪', 'daysLeft': 10, 'show': true});
  eq('campaign בלי goal⇒show=false', PS.campaign({'raised': 5}, now)['show'], false);
  eq('campaign חסימת-100', PS.campaign({'goal': 1000, 'raised': 1500}, now)['pct'], 100);

  // 8) hasSite
  eq('hasSite site קיים', PS.hasSite({'site': {}}), true);
  eq('hasSite כובה', PS.hasSite({'site': {'enabled': false}}), false);
  eq('hasSite אין site', PS.hasSite({}), false);

  // 9) donateUrl
  eq('donateUrl ישיר', PS.donateUrl({'site': {'donateUrl': 'https://a'}}), 'https://a');
  eq('donateUrl payUrl', PS.donateUrl({'integrations': {'payments': {'payUrl': 'https://p'}}}), 'https://p');
  eq('donateUrl null', PS.donateUrl({}), null);

  // קבועים חשופים
  eq('LANGS', PS.LANGS, ['he', 'en', 'yi']);
  eq('UI_LABELS', PS.UI_LABELS['he']['donate'], 'לתרומה');

  if (fails > 0) {
    print('— $fails נכשלו מתוך ${n + fails}');
    throw StateError('public-site-proof: $fails נכשלו');
  }
  print('✓ קופסת public-site (Dart): 9 חוטים + 3 קבועים · $n טענות ירוקות · זהה-ביט למאור(JS)');
}
