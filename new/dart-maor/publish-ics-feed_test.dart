import '../dart-data-maor/publish-ics-feed-sockets.dart' as sk_publish_ics_feed;
// בדיקת-חוזה (רתמת-זהב) · publishIcsFeed — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/publish-ics-feed.test.mjs.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/publish-ics-feed_test.dart  ⇒ exit 0
import 'publish-ics-feed.dart';

const NOW = '2026-08-24T10:00:00.000Z';

String _msgOf(Object e) => (e as dynamic).message.toString();

var _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ $msg');
    _f = 1;
  }
}

// זיוף-ענן: רושם כל קריאה לבדיקת-הצורה (מקבילי-ביט ל-fake של ה-JS-test)
class Fake {
  final read = <dynamic>[];
  int mint = 0;
  final write = <Map<String, dynamic>>[];
  final dynamic existing;
  Fake(this.existing);

  Future<dynamic> readToken(dynamic slug) async {
    read.add(slug);
    return existing;
  }

  String mintToken() {
    mint++;
    return 'tok-new';
  }

  Future<void> writeFeed(dynamic slug, dynamic data) async {
    write.add({'slug': slug, 'data': data});
  }

  String nowIso() => NOW;
}

Future<dynamic> _publish(Fake fk, dynamic slug, dynamic ics, dynamic opts) {
  return publishIcsFeed(slug, ics, opts, readToken: fk.readToken, mintToken: fk.mintToken, writeFeed: fk.writeFeed, nowIso: fk.nowIso, T: sk_publish_ics_feed.publishIcsFeed_T);
}

Future<void> main() async {
  // 1) token קיים נשמר — mint לא נקרא, הכתיבה בצורה המחייבת
  {
    final fk = Fake('tok-old');
    final t = await _publish(fk, 'org1', 'BEGIN:VCALENDAR', null);
    _ok(t == 'tok-old', '1 token קיים לא נשמר');
    _ok(fk.mint == 0, '1 mintToken נקרא למרות token קיים');
    _ok(fk.read.length == 1 && fk.read[0] == 'org1', '1 readToken לא נקרא עם ה-slug');
    _ok(fk.write.length == 1 && fk.write[0]['slug'] == 'org1',
        '1 writeFeed לא נקרא עם ה-slug');
    final d = fk.write[0]['data'];
    _ok(
        d['token'] == 'tok-old' &&
            d['ics'] == 'BEGIN:VCALENDAR' &&
            d['updatedAt'] == NOW,
        '1 מסמך-הפיד שנכתב אינו {token,ics,updatedAt} כמחויב');
  }
  // 2) אין token קיים ⇒ mint פעם אחת
  {
    final fk = Fake(null);
    final t = await _publish(fk, 'org1', 'X', null);
    _ok(t == 'tok-new' && fk.mint == 1, '2 ללא token קיים לא הונפק חדש');
    _ok(fk.write[0]['data']['token'] == 'tok-new', '2 ה-token החדש לא נכתב');
  }
  // 3) rotate ⇒ readToken לא נקרא כלל, mint גם כשקיים token
  {
    final fk = Fake('tok-old');
    final t = await _publish(fk, 'org1', 'X', {'rotate': true});
    _ok(t == 'tok-new', '3 rotate לא הנפיק token חדש');
    _ok(fk.read.length == 0, '3 rotate קרא ל-readToken (הישן היה שורד)');
    _ok(fk.mint == 1, '3 rotate לא קרא ל-mintToken');
  }
  // 4) חריגת-גודל: 900,001 בתי-ascii ⇒ זריקה בעברית, אפס כתיבה
  {
    final fk = Fake('tok-old');
    var threw = '';
    try {
      await _publish(fk, 'org1', 'a' * 900001, null);
      _ok(false, '4 חריגת-גודל לא נזרקה');
    } catch (e) {
      threw = _msgOf(e);
    }
    _ok(threw == 'לוח-השנה גדול מדי לפרסום כפיד — פנו לתמיכה',
        '4 הודעת-חריגת-הגודל שגויה: $threw');
    _ok(fk.write.length == 0, '4 writeFeed נקרא למרות חריגת-גודל');
  }
  // 5) גבול מדויק: 900,000 בתים בדיוק ⇒ עובר
  {
    final fk = Fake('tok-old');
    final t = await _publish(fk, 'org1', 'a' * 900000, null);
    _ok(t == 'tok-old' && fk.write.length == 1, '5 גודל-הגבול המדויק נחסם בטעות');
  }
  // 6) המדידה בבתים (UTF-8): 450,001 אלפי"ן = 900,002 בתים ⇒ זריקה
  {
    final fk = Fake('tok-old');
    var threw = '';
    try {
      await _publish(fk, 'org1', 'א' * 450001, null);
      _ok(false, '6 מדידת-בתים: עברית לא נחסמה (נמדדו תווים במקום בתים)');
    } catch (e) {
      threw = _msgOf(e);
    }
    _ok(threw == 'לוח-השנה גדול מדי לפרסום כפיד — פנו לתמיכה',
        '6 הודעת-החריגה (UTF-8) שגויה');
    _ok(fk.write.length == 0, '6 writeFeed נקרא למרות חריגת-בתים');
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  var guardThrew = false;
  try {
    await _publish(Fake('t'), 'org1', 'a' * 900001, null);
  } catch (_) {
    guardThrew = true;
  }
  assert(guardThrew, 'assert-live guard');

  if (_f != 0) {
    throw StateError('publish-ics-feed golden: יש דוגמאות אדומות');
  }
  // ignore: avoid_print
  print('✓ publish-ics-feed: 6 דוגמאות-חוזה (שקעי readToken/mintToken/writeFeed/nowIso) — ירוק (Dart≡JS)');
}
