// בדיקת-חוזה (רתמת-זהב) · migrateSupportersToKeyed — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS
// new/atoms/migrate-supporters-to-keyed.test.mjs (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/migrate-supporters-to-keyed_test.dart ⇒ exit 0
import 'migrate-supporters-to-keyed.dart';

int _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    _f = 1;
    // ignore: avoid_print
    print('✗ $msg');
  }
}

const DB = <String, dynamic>{'__db': true};
const SHARED = '_shared_';

String _str(Object? v) => v == null ? '' : v.toString();

bool _falsy(Object? v) {
  if (v == null) return true;
  if (v is bool) return !v;
  if (v is num) return v == 0 || v.isNaN;
  if (v is String) return v.isEmpty;
  return false;
}

// צבר-מזויף רושם-קריאות (מקבילי-ביט ל-writeBatch של בדיקת-ה-JS).
class FakeBatch {
  final dynamic db;
  final List<Map<String, dynamic>> sets = [];
  int commits = 0;
  FakeBatch(this.db);
  void set(dynamic ref, dynamic data) => sets.add({'ref': ref, 'data': data});
  Future<void> commit() async {
    commits++;
  }
}

class Log {
  final List<FakeBatch> batches = [];
  int mapCalls = 0;
  final List<List<dynamic>> encCalls = [];
  final List<dynamic> docSkeyMaps = [];
  dynamic map;
}

/// io מזויף כמתועד בחוזה; encryptDoc עוטף במעטפה מסומנת.
MigrateIo mkIo(Log log) => MigrateIo(
      requireDb: () => DB,
      supKeyMapOf: (sups) {
        log.mapCalls++;
        final m = <dynamic, dynamic>{};
        for (final s in sups) {
          final k = _str(s['forWho']).trim();
          m[s['id']] = k.isEmpty ? SHARED : k;
        }
        log.map = m;
        return m;
      },
      supKeyOf: (sp) {
        final k = _str(sp['forWho']).trim();
        return k.isEmpty ? SHARED : k;
      },
      docSkey: (col, data, m) {
        log.docSkeyMaps.add(m);
        if (!_falsy(data['spId'])) return (m as Map)[data['spId']] ?? SHARED;
        return SHARED;
      },
      toPlain: (x) => {...(x as Map).cast<String, dynamic>(), '__plain': true},
      encryptDoc: (plain, dek) async {
        log.encCalls.add([plain, dek]);
        return {'env': 'enc', 'of': plain['id']};
      },
      scopedCol: (c) => 'orgs/test/' + c,
      doc: (db, col, id) => {'db': db, 'col': col, 'id': id},
      writeBatch: (db) {
        final b = FakeBatch(db);
        log.batches.add(b);
        return b;
      },
    );

Future<void> main() async {
  // 1+2) תומך+אירוע בלי dek — צבר אחד, שני set, skey נכון, encryptDoc לא נקרא, מוחזר 2
  {
    final log = Log();
    final io = mkIo(log);
    final sp = {'id': 's1', 'forWho': 'דנה', 'name': 'תומך'};
    final ev = {'id': 'e1', 'spId': 's1', 'title': 'שיחה'};
    final n = await migrateSupportersToKeyed([sp], [ev], null, io);
    final b = log.batches[0];
    _ok(
        n == 2 &&
            log.batches.length == 1 &&
            b.sets.length == 2 &&
            b.commits == 1,
        '1 צבר אחד, שני set, commit אחד, מוחזר 2');
    _ok(
        identical(b.sets[0]['ref']['db'], DB) &&
            b.sets[0]['ref']['col'] == 'orgs/test/supporters' &&
            b.sets[0]['ref']['id'] == 's1' &&
            b.sets[0]['data']['skey'] == 'דנה' &&
            b.sets[0]['data']['name'] == 'תומך' &&
            b.sets[0]['data']['__plain'] == true,
        '1 מסמך-תומך: נתיב + skey + תוכן-plain');
    _ok(
        b.sets[1]['ref']['col'] == 'orgs/test/events' &&
            b.sets[1]['ref']['id'] == 'e1' &&
            b.sets[1]['data']['skey'] == 'דנה' &&
            b.sets[1]['data']['title'] == 'שיחה',
        '1 מסמך-אירוע: נתיב + skey מהמפה');
    _ok(log.encCalls.isEmpty, '2 בלי dek — encryptDoc לא נקרא');
  }

  // 3) עם dek — encryptDoc פעם-לכל-מסמך על toPlain, והמסמך = skey + מעטפה בלבד
  {
    final log = Log();
    final io = mkIo(log);
    final DEK = <String, dynamic>{'__dek': true};
    final sp = {'id': 's1', 'forWho': '', 'name': 'תומך'};
    final ev = {'id': 'e1', 'spId': '', 'title': 'כללי'};
    await migrateSupportersToKeyed([sp], [ev], DEK, io);
    final b = log.batches[0];
    _ok(
        log.encCalls.length == 2 &&
            log.encCalls.every((c) =>
                c[0]['__plain'] == true && identical(c[1], DEK)),
        '3 encryptDoc נקרא פעמיים עם (plain, dek)');
    _ok(
        b.sets[0]['data']['skey'] == SHARED &&
            b.sets[0]['data']['env'] == 'enc' &&
            b.sets[0]['data']['name'] == null &&
            b.sets[1]['data']['skey'] == SHARED &&
            b.sets[1]['data']['of'] == 'e1' &&
            b.sets[1]['data']['title'] == null,
        '3 המסמך = skey + מעטפה, בלי שדות-plain');
  }

  // 4) המפה נבנית פעם אחת ומועברת ל-docSkey
  {
    final log = Log();
    final io = mkIo(log);
    final sups = [
      {'id': 's1', 'forWho': 'א'},
      {'id': 's2', 'forWho': 'ב'}
    ];
    final evs = [
      {'id': 'e1', 'spId': 's2'},
      {'id': 'e2', 'spId': 's1'},
      {'id': 'e3'}
    ];
    await migrateSupportersToKeyed(sups, evs, null, io);
    _ok(
        log.mapCalls == 1 &&
            log.docSkeyMaps.length == 3 &&
            log.docSkeyMaps.every((m) => identical(m, log.map)),
        '4 supKeyMapOf פעם אחת; אותה מפה בכל docSkey');
    final b = log.batches[0];
    _ok(
        b.sets[2]['data']['skey'] == 'ב' &&
            b.sets[3]['data']['skey'] == 'א' &&
            b.sets[4]['data']['skey'] == SHARED,
        '4 skey לאירועים: מקושר=מפתח-התומך, ללא-קישור=משותף');
  }

  // 5) צברי-400: 300 תומכים + 101 אירועים = 401 ⇒ שני צברים (400+1), מוחזר 401
  {
    final log = Log();
    final io = mkIo(log);
    final sups =
        List.generate(300, (i) => {'id': 's$i', 'forWho': ''});
    final evs = List.generate(101, (i) => {'id': 'e$i'});
    final n = await migrateSupportersToKeyed(sups, evs, null, io);
    _ok(
        n == 401 &&
            log.batches.length == 2 &&
            log.batches[0].sets.length == 400 &&
            log.batches[0].commits == 1 &&
            log.batches[1].sets.length == 1 &&
            log.batches[1].commits == 1,
        '5 שני צברים 400+1, commit לכל אחד, מוחזר 401');
  }

  // 6) ריק-ריק ⇒ אפס צברים, מוחזר 0
  {
    final log = Log();
    final io = mkIo(log);
    final n = await migrateSupportersToKeyed([], [], null, io);
    _ok(n == 0 && log.batches.isEmpty, '6 ריק: אפס writeBatch, מוחזר 0');
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  {
    final log = Log();
    final io = mkIo(log);
    final n = await migrateSupportersToKeyed([], [], null, io);
    assert(n == 0 && log.batches.isEmpty, 'assert-live guard');
  }

  if (_f != 0) {
    throw StateError('migrate-supporters-to-keyed golden: יש דוגמאות אדומות');
  }
  // ignore: avoid_print
  print('✓ migrate-supporters-to-keyed: 6 דוגמאות-חוזה (שקעי-io) — ירוק');
}
