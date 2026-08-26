// בדיקת-חוזה · decode — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/decode_test.dart
import 'decode.dart';

int _fromJson(Map<String, dynamic> m) => m['id'] as int; // שקע-בדיקה

void main() {
  var n = 0;
  final logs = <String>[];
  void log(String s) => logs.add(s);

  List<int> run(String? raw) => decode<int>(raw, fromJson: _fromJson, log: log);

  void _eqList(List<int> got, List<int> want, String label) {
    if (got.length != want.length ||
        !List.generate(got.length, (i) => got[i] == want[i]).every((x) => x)) {
      throw StateError('FAIL [$label]: got=$got want=$want');
    }
  }

  // 1 — null ⇒ ריק, בלי-לוג
  logs.clear();
  _eqList(run(null), const [], '1 null');
  if (logs.isNotEmpty) throw StateError('FAIL [1 no-log]');
  n++;

  // 2 — ריק ⇒ ריק, בלי-לוג
  logs.clear();
  _eqList(run(''), const [], '2 empty');
  if (logs.isNotEmpty) throw StateError('FAIL [2 no-log]');
  n++;

  // 3 — רשימה תקינה
  logs.clear();
  _eqList(run('[{"id":1},{"id":2}]'), const [1, 2], '3 valid');
  if (logs.isNotEmpty) throw StateError('FAIL [3 no-log]');
  n++;

  // 4 — פריט-פגום מדולג + לוג יחיד
  logs.clear();
  _eqList(run('[{"id":1}, 5]'), const [1], '4 skip-corrupt');
  if (logs.length != 1 || !logs.first.contains('skipped corrupt intent')) {
    throw StateError('FAIL [4 log]: $logs');
  }
  n++;

  // 5 — JSON לא-תקין ⇒ ריק + לוג-מטען
  logs.clear();
  _eqList(run('not json'), const [], '5 bad-json');
  if (logs.length != 1 || !logs.first.contains('corrupt queue payload')) {
    throw StateError('FAIL [5 log]: $logs');
  }
  n++;

  // 6 — Map במקום List ⇒ ריק + לוג-מטען
  logs.clear();
  _eqList(run('{"a":1}'), const [], '6 map-not-list');
  if (logs.length != 1 || !logs.first.contains('corrupt queue payload')) {
    throw StateError('FAIL [6 log]: $logs');
  }
  n++;

  // 7 — רשימה-ריקה ⇒ ריק בלי-לוג
  logs.clear();
  _eqList(run('[]'), const [], '7 empty-list');
  if (logs.isNotEmpty) throw StateError('FAIL [7 no-log]');
  n++;

  assert(decode<int>('[{"id":9}]', fromJson: _fromJson, log: (_) {}).first == 9,
      'assert-live guard');

  print('OK decode: $n asserts passed');
}
