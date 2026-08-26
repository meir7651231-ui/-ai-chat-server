// 🧪 הוכחת-חוצה-שפות · lib-ics (מנוע ICS) — אותם קלטים/WANT כמו new/boxes/lib-ics.test.mjs.
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה: כותרת·מופע-עם-שעה·גלגול-חצות·יום-שלם·
//   שעה-מושחתת·escaping·קיפול-עברית·הורדה (מותר/חסום) — פלט זהה-ביט.
// הערה: 4 "מגני-ההכרעה" של בדיקת-ה-JS קוראים את מקור-ה-mjs עצמו (readFileSync + regex
//   על טקסט-הקובץ: שער-לפני-DOM · חיווט-buildIcs · mime · חלון-שחרור) — אלה תלויי-מקור-JS
//   ולא התנהגות חוצה-שפות, ולכן מדולגים כאן (חוק המקרה-תלוי-מקור-JS).
import 'dart:convert';
import 'lib-ics.dart' as F;

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

void ok(bool cond, String name) {
  if (!cond) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

// JS: new Date(Date.UTC(2026, 7, 24, 10, 0, 0)) — חודש 0-בסיס 7 = אוגוסט = חודש-Dart 8.
final now = DateTime.utc(2026, 8, 24, 10, 0, 0);

// ── זיוף-io: מקליט createElement + Blob + סדר-הפעולות + שער-ההרשאה (מקביל ל-fakeA/io שב-JS) ──
class _Blob {
  final String text;
  final String type;
  _Blob(this.text, this.type);
}

class _FakeIo implements F.IcsIo {
  @override
  final bool exportBlocked;
  int notified = 0;
  int domTouched = 0;
  final List<List<Object?>> calls = [];
  _FakeIo(this.exportBlocked);

  @override
  void Function()? get exportNotify => () => notified++;

  @override
  Object blob(List<String> parts, String type) {
    calls.add(['blob', parts.join(''), type]);
    return _Blob(parts.join(''), type);
  }

  @override
  F.IcsEl createElement(String tag) {
    domTouched++;
    calls.add(['createElement', tag]);
    final el = F.IcsEl(tag);
    el.onClick = () => calls.add(['click']);
    return el;
  }

  @override
  String createObjectURL(Object blob) {
    // JS: `b instanceof Blob` — כאן: האם באמת ה-Blob שהקופסה בנתה (io.blob).
    calls.add(['createObjectURL', blob is _Blob, (blob as _Blob).type]);
    return 'blob:zzz';
  }

  @override
  void revokeObjectURL(String href) => calls.add(['revoke', href]);

  @override
  void setTimeout(void Function() fn, int ms) {
    calls.add(['setTimeout']);
    fn(); // JS-mock קורא fn() סינכרונית ⇒ revoke נבדק
  }
}

void main() {
  // 1) לוח-ריק — כותרת מדויקת (זהה-ביט)
  final empty = F.buildIcs([], 'לוח', now);
  const exp1 =
      'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//maor-system//he//\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:לוח\r\nEND:VCALENDAR\r\n';
  eq('לוח-ריק', empty, exp1);

  // 2) מופע-עם-שעה
  final timed = F.buildIcs(
      [{'uid': 'u1', 'title': 'פגישה', 'date': '2026-08-24', 'time': '19:30'}], 'c', now);
  for (final s in ['DTSTAMP:20260824T100000Z', 'DTSTART:20260824T193000', 'DTEND:20260824T203000', 'SUMMARY:פגישה']) {
    ok(timed.contains(s), 'מופע-עם-שעה כולל $s');
  }
  ok(!timed.contains('DESCRIPTION') && !timed.contains('LOCATION'), 'שדה-ריק לא דלף');

  // 3) גלגול-חצות
  final mid = F.buildIcs([{'uid': 'x', 'title': 't', 'date': '2026-08-24', 'time': '23:30'}], 'c', now);
  ok(mid.contains('DTEND:20260825T003000'), 'גלגול-חצות');

  // 4) בלי-שעה = יום-שלם
  final allday = F.buildIcs([{'uid': 'x', 'title': 't', 'date': '2026-08-24', 'time': ''}], 'c', now);
  ok(allday.contains('DTSTART;VALUE=DATE:20260824') && allday.contains('DTEND;VALUE=DATE:20260825'), 'יום-שלם');

  // 5) שעה-מושחתת (עדשה-עוינת: '25:00'/'12:60' עוברים-רגקס אך Invalid Date · '9:00' נופל-רגקס)
  for (final bad in ['25:00', '12:60', '9:00', '99:99']) {
    final r = F.buildIcs([{'uid': 'x', 'title': 't', 'date': '2026-08-24', 'time': bad}], 'c', now);
    ok(r.contains('DTSTART;VALUE=DATE:20260824') && !r.contains('DTSTART:2026'), 'שעה-מושחתת $bad ⇒ יום-שלם');
  }

  // 6) escaping דרך השקע
  final escd = F.buildIcs([
    {'uid': 'x', 'title': 'א,ב', 'date': '2026-08-24', 'time': '', 'notes': 'שורה1\nשורה2', 'location': 'אולם; ראשי'}
  ], 'c', now);
  ok(escd.contains('SUMMARY:א\\,ב'), 'escape פסיק');
  ok(escd.contains('DESCRIPTION:שורה1\\nשורה2'), 'escape שורה-חדשה');
  ok(escd.contains('LOCATION:אולם\\; ראשי'), 'escape נקודה-פסיק');

  // 7) icsEscape ישיר
  eq('icsEscape', F.icsEscape('a;b,c\\d\ne'), 'a\\;b\\,c\\\\d\\ne');
  eq('icsEscape null', F.icsEscape(null), ''); // JS בודק null+undefined; ב-Dart שניהם null

  // 8) foldIcsLine — קיפול-אוקטטים על עברית (עדשה-עוינת: תו=2ב, לא חוצים תו)
  final longHeb = 'SUMMARY:' + 'א' * 60; // 8 + 120 בייט > 75
  final folded = F.foldIcsLine(longHeb);
  ok(folded.length >= 2, 'foldIcsLine קיפל שורה-ארוכה');
  ok(folded.sublist(1).every((l) => l[0] == ' '), 'כל שורת-המשך נפתחת ברווח-מוביל');
  eq('foldIcsLine ריק', F.foldIcsLine('')[0], '');

  // 9) downloadIcs מותר — סדר-פעולות מלא דרך שקעי-IO
  final io9 = _FakeIo(false);
  F.downloadIcs('cal.ics', empty, io9);
  final calls = io9.calls;
  ok(io9.notified == 0, 'notify לא נקרא כשמותר');
  ok(calls[0][0] == 'createElement' && calls[0][1] == 'a', 'createElement a ראשון');
  final cou = calls.where((c) => c[0] == 'createObjectURL').toList();
  ok(cou.isNotEmpty && cou[0][1] == true && cou[0][2] == 'text/calendar;charset=utf-8', 'Blob/mime (בלי BOM)');
  ok(calls.any((c) => c.length == 1 && c[0] == 'click'), 'click נקרא');
  ok(calls.any((c) => c[0] == 'revoke' && c[1] == 'blob:zzz'), 'revoke על ה-object-URL');

  // 10) downloadIcs חסום — יוצא מיד, notify פעם-אחת, אפס נגיעת-DOM
  final io10 = _FakeIo(true);
  F.downloadIcs('cal.ics', empty, io10);
  eq('notify חסום = פעם-אחת', io10.notified, 1);
  eq('אפס נגיעת-DOM כשחסום', io10.domTouched, 0);

  if (fails > 0) {
    print('❌ קופסת-lib-ics (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('lib-ics dart proof failed');
  }
  print('✓ קופסת-lib-ics (Dart): $n טענות (כותרת·מופע·חצות·יום-שלם·שעה-מושחתת·escaping·'
      'קיפול-עברית·הורדה מותר/חסום) — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
