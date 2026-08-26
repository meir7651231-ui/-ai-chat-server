// 🧪 הוכחת-חוצה-שפות · families (Dart) — מריצה את families.dart על אותם קלטים/WANT
// כמו new/boxes/families.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה.
// עדשה-עוינת נשמרת (ריק/null/עברית/פורמט-שבור). ⚠️ שישה מגני-מקור-JS (readFileSync על
// families.mjs + regex-ספירת-ייבוא) הם תלויי-מקור-JS ⇒ מדולגים כאן במכוון (הכרעת-הרצפט).
import 'dart:convert';
import 'families.dart' as F;

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
  // ── fmtDate ──
  eq('fmtDate תקין', F.fmtDate('2026-08-24'), '24/08/2026');
  eq('fmtDate חותך ל-10', F.fmtDate('2026-08-24T09:00:00'), '24/08/2026');
  eq('fmtDate ריק', F.fmtDate(''), '—'); // עוין
  eq('fmtDate פורמט-שבור', F.fmtDate('bad'), '—'); // עוין
  eq('fmtDate null', F.fmtDate(null), '—'); // עוין (JS undefined/falsy)

  // ── isoToday (now מוזרק — דטרמיניסטי) ──
  eq('isoToday מוזרק', F.isoToday(DateTime(2026, 8, 24, 12, 0, 0)), '2026-08-24');

  // ── ageOf ──
  final now = DateTime(2026, 8, 24, 12, 0, 0);
  eq('ageOf יום-הולדת עבר', F.ageOf('2000-01-15', now), 26);
  eq('ageOf יום-הולדת לא-עבר', F.ageOf('2000-12-15', now), 25);
  eq('ageOf יום-הולדת היום', F.ageOf('2000-08-24', now), 26);
  eq('ageOf ריק', F.ageOf('', now), null); // עוין
  eq('ageOf שבור', F.ageOf('not-a-date', now), null); // עוין

  // ── קבועים ──
  eq('STATUS_META active', F.STATUS_META['active']['label'], 'פעילה');
  eq('STATUS_META pending', F.STATUS_META['pending']['label'], 'ממתינה');
  eq('STATUS_META inactive', F.STATUS_META['inactive']['label'], 'לא פעילה');
  eq('סף-אדום', F.CRED_RED_THRESHOLD, 500);
  ok('CRED_HELP_TEXT verbatim', F.CRED_HELP_TEXT.startsWith('נוכחות +5 · דיוק +2'));

  // ── tierOf (סף מולחם) ──
  eq('tier titan', F.tierOf(970)['key'], 'titan');
  eq('tier lion', F.tierOf(850)['key'], 'lion');
  eq('tier pale', F.tierOf(600)['key'], 'pale');
  eq('tier סף כולל', F.tierOf(500)['key'], 'pale'); // גבול
  eq('tier red', F.tierOf(499)['key'], 'red');
  eq('tier red label', F.tierOf(400)['label'], 'סיכון נטישה');

  // ── משפחה-לדוגמה ──
  final fam = <String, dynamic>{
    'id': 'f1', 'city': 'ירושלים', 'community': 'גור', 'maritalStatus': 'נשואים',
    'status': 'active', 'language': 'עברית', 'fullSefach': true,
    'cred': <String, dynamic>{'score': 820, 'log': []},
    'members': [
      <String, dynamic>{'id': 'm1', 'isParent': true, 'first': 'שרה'},
      <String, dynamic>{'id': 'm2', 'isParent': false, 'first': 'דוד'},
    ],
    'docs': [], 'createdAt': '2025-01-01',
  };
  final db = <String, dynamic>{
    'families': [fam],
    'enrollments': [
      <String, dynamic>{'memberId': 'm2', 'courseId': 'c1', 'status': 'active', 'enrolledAt': '2025-03-01', 'group': '', 'payments': [], 'absences': []},
      <String, dynamic>{'memberId': 'm2', 'courseId': 'c2', 'status': 'ended', 'enrolledAt': '2024-01-01', 'group': '', 'payments': [], 'absences': []},
      <String, dynamic>{'memberId': 'm2', 'courseId': 'c3', 'status': 'wait', 'enrolledAt': '2025-06-01', 'group': '', 'payments': [], 'absences': []},
      <String, dynamic>{'memberId': 'zz', 'courseId': 'c1', 'status': 'active', 'enrolledAt': '2025-01-01', 'group': '', 'payments': [], 'absences': []},
    ],
    'courses': [
      <String, dynamic>{'id': 'c1', 'name': 'אנגלית'},
      <String, dynamic>{'id': 'c2', 'name': 'חשבון'},
      <String, dynamic>{'id': 'c3', 'name': 'ציור'},
    ],
    'events': [
      <String, dynamic>{'famId': 'f1', 'date': '2025-05-05', 'title': 'ביקור בית', 'time': '10:00', 'done': true},
    ],
  };

  // famEnrollments — כולל ended/wait, רק בני-המשפחה
  eq('famEnrollments כולל ended/wait, בלי זרים', F.famEnrollments(db, fam).length, 3);
  // famLiveEnrollments — בלי ended/wait
  eq('famLive רק active/frozen', F.famLiveEnrollments(db, fam).length, 1);

  // ── finderAxes ──
  final axes = F.finderAxes(<String, dynamic>{});
  eq('finderAxes 9 צירים', axes.length, 9);
  eq('finderAxes ציר-ראשון', axes[0], ['city', 'עיר']);
  eq('finderAxes cred fallback', axes[4], ['cred', 'אמינות']);
  eq('finderAxes termOf דורס',
      F.finderAxes(<String, dynamic>{'terms': {'entity.cred': 'מהימנות'}})[4], ['cred', 'מהימנות']);

  // ── finderAxisValue ──
  eq('axisValue city', F.finderAxisValue(db, fam, 'city'), 'ירושלים');
  eq('axisValue status', F.finderAxisValue(db, fam, 'status'), 'פעילה');
  eq('axisValue kids', F.finderAxisValue(db, fam, 'kids'), 'עם ילדים');
  eq('axisValue enrolled', F.finderAxisValue(db, fam, 'enrolled'), 'משתתפות בחוגים');
  eq('axisValue sefach', F.finderAxisValue(db, fam, 'sefach'), 'קיים');
  eq('axisValue cred (820⇒lion)', F.finderAxisValue(db, fam, 'cred'), 'לביאה');
  eq('axisValue marital חסר',
      F.finderAxisValue(db, <String, dynamic>{...fam, 'maritalStatus': ''}, 'marital'), 'לא ידוע'); // עוין
  eq('axisValue ציר לא-מוכר', F.finderAxisValue(db, fam, 'zzz'), ''); // עוין
  eq('axisValue cred ברירת-700',
      F.finderAxisValue(db, (Map<String, dynamic>.of(fam)..remove('cred')), 'cred'), 'טעון שיפור'); // עוין

  // ── finderMatches ──
  eq('finderMatches תואם', F.finderMatches(db, {'city': 'ירושלים'}).length, 1);
  eq('finderMatches לא-תואם', F.finderMatches(db, {'city': 'תל-אביב'}).length, 0);
  eq('finderMatches בלי-נעילות = הכל', F.finderMatches(db, {}).length, 1);

  // ── numMatch ──
  eq('numMatch ריק', F.numMatch('', 5), true);
  eq('numMatch מדויק', F.numMatch('3', 3), true);
  eq('numMatch מדויק-שלילי', F.numMatch('3', 4), false);
  eq('numMatch לפחות-גבול', F.numMatch('3+', 3), true);
  eq('numMatch לפחות-שלילי', F.numMatch('3+', 2), false);
  eq('numMatch טווח-גבול', F.numMatch('2-4', 4), true);
  eq('numMatch טווח-מחוץ', F.numMatch('2-4', 5), false);
  eq('numMatch לא-מספרי לא-מסנן', F.numMatch('abc', 9), true); // עוין
  eq('numMatch null', F.numMatch(null, 9), true); // עוין

  // ── famHistoryOf ──
  final hist = F.famHistoryOf(db, fam);
  // הצטרפות + אירוע + שיבוצים (3 בני-משפחה: active/ended/wait) = 5 רשומות
  eq('famHistory ספירת-רשומות', hist.length, 5);
  eq('famHistory ממוין מהחדש-לישן', hist[0]['date'], '2025-06-01'); // ציור wait = החדש
  ok('famHistory הצטרפות', hist.any((h) => h['tag'] == 'הצטרפות'));
  ok('famHistory wait מסומן',
      (hist.firstWhere((h) => (h['text'] as String).contains('ציור'))['text'] as String)
          .contains('ברשימת-המתנה'));
  // config מוזרק דורס מונח
  final histT = F.famHistoryOf(db, fam, <String, dynamic>{'terms': {'entity.family': 'חמולה'}});
  ok('famHistory termOf דורס',
      (histT.firstWhere((h) => h['tag'] == 'הצטרפות')['text'] as String).contains('החמולה'));
  // ריק — משפחה בלי היסטוריה
  eq('famHistory ריק',
      F.famHistoryOf(
        <String, dynamic>{'families': [], 'enrollments': [], 'courses': [], 'events': []},
        <String, dynamic>{'id': 'x', 'members': [], 'docs': [], 'createdAt': ''},
      ).length,
      0); // עוין

  // ── בוררים ──
  eq('MARITAL_OPTIONS', F.MARITAL_OPTIONS, ['נשואים', 'גרושים', 'אלמן/ה', 'פרודים']);
  eq('LANGUAGE_OPTIONS', F.LANGUAGE_OPTIONS, ['עברית', 'יידיש', 'רוסית', 'צרפתית', 'אנגלית']);
  eq('OTHER', F.OTHER, '__other');
  eq('OTHER_LABEL', F.OTHER_LABEL, 'אחר — הקלדה חופשית…');

  // ── chipStyle / maritalChipStyle ──
  eq('chipStyle bg', F.chipStyle('#fff', '#000')['background'], '#fff');
  eq('chipStyle קבוע', F.chipStyle('#fff', '#000')['borderRadius'], 999);
  eq('maritalChip נשואים', F.maritalChipStyle('נשואים')['background'], '#e6f4ea');
  eq('maritalChip אלמן', F.maritalChipStyle('אלמן/ה')['color'], '#4a5568');
  eq('maritalChip לא-מוכר ⇒ ניטרלי', F.maritalChipStyle('???')['background'], '#eef1f5'); // עוין

  if (fails > 0) {
    print('❌ קופסת-families (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('families dart proof failed');
  }
  print('✓ קופסת-families (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה '
      '(20 חוטים · עדשה-עוינת: ריק/null/עברית/שבור)');
}
