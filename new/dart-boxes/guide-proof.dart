// 🧪 הוכחת-חוצה-שפות · קופסת-המדריך 📖 (Dart) — מריצה את guide.dart על אותם
// קלטים/WANT בדיוק כמו new/boxes/guide.test.mjs (9 שורות · סינון-מודולים ·
// מילון-בוחן 7 מונחים · מתכונים ממותגים · עדשה-עוינת).
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה עם פלט זהה-ביט.
import 'dart:convert';
import 'guide.dart' as B;

int n = 0, fails = 0;
void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  ok('$name (got $g want $w)', g == w);
}

List<String> titles(List<Map<String, dynamic>> rows) =>
    [for (final s in rows) s['title'] as String];

void main() {
  // ── קבועים: נוסח-הלגאסי מילה-במילה (עוגנים: guide.ts:25-88) ──
  ok('GUIDE_INTRO_LABEL', B.GUIDE_INTRO_LABEL == 'לפני הכל:');
  ok('GUIDE_INTRO קצוות',
      B.GUIDE_INTRO.startsWith('אי אפשר לקלקל') && B.GUIDE_INTRO.endsWith('▶ הדמיה מראה את המערכת לבד.'));
  ok('GUIDE_RECIPES_LABEL', B.GUIDE_RECIPES_LABEL == 'המתכונים המהירים:');
  ok('GUIDE_FOOT', B.GUIDE_FOOT == 'המדריך המלא והמפורט נמצא בקובץ "מדריך למשתמש" — מסך-מסך וכפתור-כפתור.');
  ok('9 שורות-מסך', B.GUIDE_SECTIONS.length == 9);

  final base = B.GUIDE_SECTIONS;

  // ── בלי config: זהות-הפניה פר-שורה (guide.ts:112) + מילה-במילה ──
  final all = B.guideSections((_) => true);
  ok('בלי config ⇒ 9', all.length == 9);
  for (var i = 0; i < all.length; i++) {
    ok('שורה $i שלא-השתנתה = אותו אובייקט', identical(all[i], base[i]));
  }
  ok('בלי config ⇒ מתכונים מילה-במילה', B.guideRecipes() == B.GUIDE_RECIPES);

  // ── config ריק {} (אין terms) ⇒ ביט-זהה לבלי-config ──
  final empty = B.guideSections((_) => true, <String, dynamic>{});
  for (var i = 0; i < empty.length; i++) {
    ok('config-ריק שורה $i = אותו אובייקט', identical(empty[i], base[i]));
  }
  ok('config-ריק ⇒ מתכונים מילה-במילה', B.guideRecipes(<String, dynamic>{}) == B.GUIDE_RECIPES);

  // ── סינון-מודולים ──
  eq('families כבוי ⇒ 7', titles(B.guideSections((m) => m != 'families')),
      ['בית', 'קורסים', 'תומכות', 'לוח שנה', 'קופות צדקה', 'חנות', 'הגדרות']);
  eq('הכול כבוי ⇒ בית+הגדרות', titles(B.guideSections((_) => false)), ['בית', 'הגדרות']);

  // ── מילון-הבוחן מהחוזה — הפלט חושב מהמקור החי (טרנספילציית guide.ts), לא ביד ──
  final terms = <String, dynamic>{
    'entity.family': 'לקוח', 'entity.teacher': 'מדריכה', 'entity.course': 'קורס',
    'entity.donation': 'עסקה', 'entity.room': 'סטודיו', 'entity.rooms': 'סטודיואים',
    'entity.enrollment': 'רישום',
  };
  final loc = B.guideSections((_) => true, {'terms': terms});
  ok('loc[0].text', loc[0]['text'] == 'תקציר הבוקר, "דורש טיפול" (המשימות שלך), סטודיואים חיים וגרפים.');
  ok('loc[2].title', loc[2]['title'] == 'כרטיס לקוח');
  ok('loc[3].text', loc[3]['text'] == 'לחיצה על סטודיו = היומן שלו; בתוך קורס: קבוצות, שיבוץ, ⬇ תדפיס למדריכה.');
  ok('loc[4].text', loc[4]['text'] == 'דרגות זהב/כסף/ארד, ＋ עסקה עם קבלה, 🎯 יעד קשר.');
  ok('loc[7].text מכיל', (loc[7]['text'] as String).contains('שיוך ללקוח ו-🎁 מימוש'));
  ok('loc[1] בלי מונחי-ישות = אותו אובייקט', identical(loc[1], base[1]));
  ok(
    'guideRecipes(terms) — מיתוג מלא',
    B.guideRecipes({'terms': terms}) ==
        'תשלום + קבלה ← ⚙ ליד הרישום ← 💳 ← ＋ קבלת תשלום · ניקוב ← כפתור "ניקוב" בכרטיס · '
            'לקוח חדשה תוך כדי רישום ← "לא נמצא/ה במערכת?" · קורס מתאים לילד ← ✦ מצא קורס · '
            'עסקה ← תומכות ← לחיצה על השם ← ＋ עסקה · רשימה למדריכה ← הקורס ← ⬇ תדפיס למדריכה · '
            'גיבוי ← הגדרות ← גיבוי מלא.',
  );

  // ── עדשה-עוינת: דריסה ריקה/רווחים = אין דריסה; terms=null לא מפיל ──
  ok('דריסת-רווחים = אין דריסה',
      B.guideRecipes({'terms': {'entity.course': '  '}}) == B.GUIDE_RECIPES);
  ok('terms=null (מתכונים) לא מפיל', B.guideRecipes({'terms': null}) == B.GUIDE_RECIPES);
  eq('terms=null (סעיפים) ⇒ מילה-במילה',
      B.guideSections((_) => true, {'terms': null}), base);

  if (fails > 0) {
    print('❌ קופסת-המדריך (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('guide dart proof failed');
  }
  print('✓ קופסת-המדריך (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
