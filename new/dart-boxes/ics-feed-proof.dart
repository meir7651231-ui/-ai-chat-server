// 🧪 הוכחת-חוצה-שפות · ics-feed (פיד-יומן) — אותם קלטים/WANT כמו new/boxes/ics-feed.test.mjs.
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה: token·URL·קריאה·פרסום·rotate·גבול-גודל זהי-ביט.
// הערה: 3 "מגני-ההכרעה" של בדיקת-ה-JS קוראים את מקור-ה-mjs עצמו (regex על טקסט-הקובץ,
//   שם-האוסף / נתיב-setDoc / חיווט-readToken) — אלה תלויי-מקור-JS ולא התנהגות
//   חוצה-שפות, ולכן מדולגים כאן (חוק המקרה-תלוי-ריצה-JS).
import 'dart:convert';
import 'ics-feed.dart' as F;

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

const String NOW = '2026-08-24T10:00:00.000Z';

// ── זיוף-ענן: רושם כל קריאת-Firestore לבדיקת-הצורה + הנתיב (מקביל ל-makeCloud שב-JS) ──
class Ref {
  final dynamic db;
  final String col;
  final String id;
  Ref(this.db, this.col, this.id);
}

class Calls {
  final List<List<Object?>> doc = [];
  int get = 0;
  final List<Map<String, dynamic>> set = [];
}

class Snap {
  final bool _present;
  final Map<String, dynamic>? _data;
  Snap(this._present, this._data);
  bool exists() => _present;
  Map<String, dynamic>? data() => _data;
}

class FakeCloud {
  final Calls calls = Calls();
  final bool _present;
  final Map<String, dynamic>? _snap;
  FakeCloud({required bool present, Map<String, dynamic>? snap})
      : _present = present,
        _snap = snap;

  F.Cloud get cloud => F.Cloud(
        db: 'DB',
        nowIso: () => NOW,
        doc: (db, col, id) {
          calls.doc.add([db, col, id]);
          return Ref(db, col, id);
        },
        getDoc: (ref) async {
          calls.get++;
          return Snap(_present, _snap);
        },
        setDoc: (ref, data) async {
          calls.set.add({'ref': ref, 'data': data});
        },
      );
}

// snapData !== undefined ⇔ present=true. חסר-מסמך: present=false.
FakeCloud makeCloud({Map<String, dynamic>? snap, bool present = true}) =>
    FakeCloud(present: present, snap: snap);

Future<void> main() async {
  final hex32 = RegExp(r'^[0-9a-f]{32}$');

  // 1) mintFeedToken ⇒ 32-hex
  {
    final t = F.mintFeedToken();
    ok(hex32.hasMatch(t), 'mintFeedToken אינו 32-hex: $t');
  }

  // 2) icsFeedUrl — encodeURIComponent על slug בלבד
  eq('icsFeedUrl', F.icsFeedUrl('proj-1', 'ke hila', 'abc'),
      'https://us-central1-proj-1.cloudfunctions.net/icsFeed?org=ke%20hila&key=abc');

  // 3) readIcsFeedToken — token קיים + עדות-נתיב
  {
    final c = makeCloud(snap: {'token': 'a1b2c3d4', 'ics': 'BEGIN:VCALENDAR'});
    final t = await F.readIcsFeedToken('kehila', c.cloud);
    eq('readIcsFeedToken token קיים', t, 'a1b2c3d4');
    eq('נתיב-הקריאה (db,icsFeeds,kehila)', c.calls.doc,
        [['DB', 'icsFeeds', 'kehila']]);
    eq('getDoc נקרא בדיוק פעם אחת', c.calls.get, 1);
  }

  // 4) readIcsFeedToken — מסמך חסר / token ריק / לא-מחרוזת ⇒ null
  eq('מסמך-חסר ⇒ null',
      await F.readIcsFeedToken('x', makeCloud(present: false).cloud), null);
  eq('token ריק ⇒ null',
      await F.readIcsFeedToken('x', makeCloud(snap: {'token': ''}).cloud), null);
  eq('token לא-מחרוזת ⇒ null',
      await F.readIcsFeedToken('x', makeCloud(snap: {'token': 42}).cloud), null);

  // 5) publishIcsFeed — token קיים נשמר, כתיבה בצורה המחייבת + נתיב setDoc
  {
    final c = makeCloud(snap: {'token': 'tok-old'});
    final t = await F.publishIcsFeed('org1', 'BEGIN:VCALENDAR', null, c.cloud);
    eq('token קיים נשמר', t, 'tok-old');
    eq('setDoc נקרא פעם אחת', c.calls.set.length, 1);
    final ref = c.calls.set[0]['ref'] as Ref;
    eq('נתיב-הכתיבה icsFeeds/org1', [ref.col, ref.id], ['icsFeeds', 'org1']);
    eq('מסמך-הפיד {token,ics,updatedAt=NOW}', c.calls.set[0]['data'],
        {'token': 'tok-old', 'ics': 'BEGIN:VCALENDAR', 'updatedAt': NOW});
  }

  // 6) אין token קיים ⇒ mint 32-hex חדש נכתב ומוחזר
  {
    final c = makeCloud(present: false); // מסמך לא-קיים ⇒ readToken=null
    final t = await F.publishIcsFeed('org1', 'X', null, c.cloud);
    ok(t is String && hex32.hasMatch(t), 'לא הונפק token 32-hex חדש: $t');
    eq('ה-token החדש נכתב', (c.calls.set[0]['data'] as Map)['token'], t);
  }

  // 7) rotate ⇒ getDoc (readToken) לא נקרא כלל, mint חדש גם כשקיים token
  {
    final c = makeCloud(snap: {'token': 'tok-old'});
    final t = await F.publishIcsFeed('org1', 'X', {'rotate': true}, c.cloud);
    ok(t is String && hex32.hasMatch(t) && t != 'tok-old',
        'rotate לא הנפיק token חדש: $t');
    eq('rotate לא קרא ל-getDoc', c.calls.get, 0);
  }

  // 8) חריגת-גודל ⇒ זריקה בעברית, אפס כתיבה · גבול 900,000 עובר
  {
    final c = makeCloud(snap: {'token': 'tok-old'});
    var threw = false;
    try {
      await F.publishIcsFeed('org1', 'a' * 900001, null, c.cloud);
    } catch (e) {
      threw = true;
      eq('הודעת-החריגה',
          e is StateError ? e.message : '$e',
          'לוח-השנה גדול מדי לפרסום כפיד — פנו לתמיכה');
    }
    ok(threw, 'חריגת-גודל לא נזרקה');
    eq('setDoc לא נקרא בחריגה', c.calls.set.length, 0);

    final edge = makeCloud(snap: {'token': 'tok-old'});
    final t = await F.publishIcsFeed('org1', 'a' * 900000, null, edge.cloud);
    ok(t == 'tok-old' && edge.calls.set.length == 1,
        'גבול 900,000 המדויק נחסם בטעות');
  }

  if (fails > 0) {
    print('❌ קופסת-ics-feed (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('ics-feed dart proof failed');
  }
  print('✓ קופסת-ics-feed (Dart): $n דוגמאות-חוזה (token·URL·קריאה·פרסום·rotate·גבול-גודל) — '
      'פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
