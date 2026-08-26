// 🧪 הוכחת-חוצה-שפות · קופסת-הניווט (Dart) — מריצה את navhist.dart על אותם קלטים
// בדיוק כמו new/boxes/navhist.test.mjs, ומוודאת פלט זהה-ביט (jsonEncode).
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה עם חישוב זהה.
// (מגן-המקור שבסוף בדיקת-ה-JS — קריאת navhist.mjs + regex על verbatim — הוא מגן-מקור-JS
//  ואינו נבדק כאן; ה-parity על ההתנהגות, לא על טקסט-המקור.)
import 'dart:convert';
import 'navhist.dart' as B;

int fails = 0;
int asserts = 0;
void chk(String name, Object? got, Object? want) {
  asserts++;
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    print('✗ $name: got $g want $w');
    fails++;
  }
}

void chkTrue(String name, bool cond) {
  asserts++;
  if (!cond) {
    print('✗ $name');
    fails++;
  }
}

Map<String, dynamic> loc(String view, [String? fam, String? crs]) =>
    {'view': view, 'selFamilyId': fam, 'selCourseId': crs};

void main() {
  // ── 25 מעברי-מסך שונים ⇒ תקרה 20, הישן נזרק (הראשון שנשאר = הצעד ה-6, view='v5') ──
  var view = 'v0';
  String? selFamilyId, selCourseId;
  var hist = <Map<String, dynamic>>[];
  for (var i = 1; i <= 25; i++) {
    final r = B.goTo(hist: hist, prev: loc(view, selFamilyId, selCourseId), view: 'v$i');
    view = r['view'] as String;
    hist = r['hist'] as List<Map<String, dynamic>>;
  }
  chk('תקרה=20', hist.length, B.NAV_HIST_MAX);
  chk('הישן-ביותר נזרק ⇒ hist[0].view', hist[0]['view'], 'v5');

  // ── מעבר לאותו מיקום ⇒ hist ללא-שינוי (אותו מערך — לא נרשם צעד) ──
  final same = B.goTo(hist: hist, prev: loc('v25'), view: 'v25');
  chkTrue('אותו-מיקום: אותו מערך (identical)',
      identical(same['hist'], hist));

  // ── openFamily: 7 מזהים ⇒ recent אורך 6, האחרון ראשון; בלי 'a' ──
  var r6 = <String>[];
  var h = <Map<String, dynamic>>[];
  var prev = loc('home');
  for (final id in ['a', 'b', 'c', 'd', 'e', 'f', 'g']) {
    final r = B.openFamily(hist: h, recentIds: r6, prev: prev, id: id);
    r6 = r['recentIds'] as List<String>;
    h = r['hist'] as List<Map<String, dynamic>>;
    prev = loc('families', id);
  }
  chk('recent אורך', r6.length, B.RECENT_MAX);
  chk('recent[0]=האחרון-שנפתח', r6[0], 'g');
  chkTrue("recent בלי 'a' (נזרק)", !r6.contains('a'));

  // קידום-קיים בלי כפילות
  final dup = B.openFamily(hist: h, recentIds: r6, prev: prev, id: 'd');
  final dupIds = dup['recentIds'] as List<String>;
  chk('קידום-קיים ⇒ dup[0]', dupIds[0], 'd');
  chk('קידום-קיים ⇒ אורך', dupIds.length, B.RECENT_MAX);
  chk('קידום-קיים ⇒ ייחודי', dupIds.toSet().length, B.RECENT_MAX);

  // id:null ⇒ recentIds ללא-שינוי (אותה הפניה)
  final clear = B.openFamily(hist: h, recentIds: r6, prev: loc('families', 'g'), id: null);
  chkTrue('ניקוי-בחירה: recent ללא-שינוי (identical)',
      identical(clear['recentIds'], r6));

  // ── openCourse: מחליף view+בחירה, שומר משפחה ב-next, אין recent בכלל ──
  final oc = B.openCourse(hist: <Map<String, dynamic>>[], prev: loc('home', 'fam1'), id: 'c1');
  chk('openCourse.view', oc['view'], 'courses');
  chk('openCourse.selCourseId', oc['selCourseId'], 'c1');
  chk('openCourse.hist.length', (oc['hist'] as List).length, 1);
  chk('openCourse.hist[0].view', (oc['hist'] as List)[0]['view'], 'home');
  chkTrue('openCourse לא נגע ב-recent', !oc.containsKey('recentIds'));

  // ── goBack: [A] ⇒ {loc:A, hist:[]}; [] ⇒ null; החזרה אינה נרשמת (hist רק קטן) ──
  final a = loc('families', 'f1');
  final back = B.goBack([a]);
  chkTrue('goBack לא-null', back != null);
  chkTrue('goBack.loc === A (identical)', identical(back!['loc'], a));
  chk('goBack.hist.length', (back['hist'] as List).length, 0);
  chkTrue('goBack על ריק ⇒ null', B.goBack(<Map<String, dynamic>>[]) == null);

  // ── canGoBack — הכפתור רק כשיש היסטוריה ──
  chk('canGoBack([])', B.canGoBack(<Map<String, dynamic>>[]), false);
  chk('canGoBack([A])', B.canGoBack([a]), true);

  // ── מילון-הקופסה ──
  chk('BACK_LABEL', B.BACK_LABEL, '↩ חזרה');
  chk('BACK_TITLE', B.BACK_TITLE, 'חזרה למסך הקודם');

  if (fails > 0) {
    print('❌ קופסת-הניווט (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('navhist dart proof failed');
  }
  print('✓ קופסת-הניווט (Dart): $asserts טענות — תקרה-20 · אותו-מיקום-לא-נרשם · '
      'recent-6-ייחודי · חזרה-לא-צעד · canGoBack — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
