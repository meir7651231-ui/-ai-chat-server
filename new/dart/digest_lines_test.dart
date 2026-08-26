import '../dart-data/digest_lines-terms.dart';
// בדיקת-חוזה · digestLines — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/digest_lines_test.dart
import 'digest_lines.dart';

typedef _Line = ({String key, bool urgent, String text, int navTab});

List<({bool crit, int navTab})> Function() _items(
        List<({bool crit, int navTab})> xs) =>
    () => xs;

void _eqLine(_Line g, String key, bool urgent, String text, int navTab, String label) {
  if (g.key != key || g.urgent != urgent || g.text != text || g.navTab != navTab) {
    throw StateError('FAIL [$label]: got=$g');
  }
}

void main() {
  var n = 0;

  // 1 — הכל ריק ⇒ quiet
  var r = digestLines(
      pendingApprovals: 0, pendingVacations: 0, attentionItems: _items(const []), term: (k)=>kTerms[k]!);
  if (r.length != 1) throw StateError('FAIL [1 len]: ${r.length}');
  _eqLine(r[0], 'quiet', false, 'הכל מעודכן — אין משימות דחופות הבוקר', 0, '1');
  n++;

  // 2 — קריטי יחיד
  r = digestLines(
      pendingApprovals: 0,
      pendingVacations: 0,
      attentionItems: _items(const [(crit: true, navTab: 5)]), term: (k)=>kTerms[k]!);
  if (r.length != 1) throw StateError('FAIL [2 len]');
  _eqLine(r[0], 'urgent', true, '⚠ פריט קריטי אחד דורש טיפול', 5, '2');
  n++;

  // 3 — קריטיים מרובים + אישורים + חופשות
  r = digestLines(
      pendingApprovals: 2,
      pendingVacations: 1,
      attentionItems: _items(
          const [(crit: true, navTab: 5), (crit: true, navTab: 2), (crit: false, navTab: 1)]), term: (k)=>kTerms[k]!);
  if (r.length != 3) throw StateError('FAIL [3 len]: ${r.length}');
  _eqLine(r[0], 'urgent', true, '⚠ 2 פריטים קריטיים דורשים טיפול', 5, '3-urgent');
  _eqLine(r[1], 'approvals', false, '2 משימות ממתינות לאישור', 3, '3-appr');
  _eqLine(r[2], 'vacations', false, '1 בקשות חופשה ממתינות', 3, '3-vac');
  n += 3;

  // 4 — רק אישורים
  r = digestLines(
      pendingApprovals: 5, pendingVacations: 0, attentionItems: _items(const []), term: (k)=>kTerms[k]!);
  if (r.length != 1) throw StateError('FAIL [4 len]');
  _eqLine(r[0], 'approvals', false, '5 משימות ממתינות לאישור', 3, '4');
  n++;

  // 5 — פריטים לא-קריטיים בלבד ⇒ quiet
  r = digestLines(
      pendingApprovals: 0,
      pendingVacations: 0,
      attentionItems: _items(const [(crit: false, navTab: 1), (crit: false, navTab: 2)]), term: (k)=>kTerms[k]!);
  if (r.length != 1 || r[0].key != 'quiet') throw StateError('FAIL [5]: $r');
  n++;

  assert(digestLines(
              pendingApprovals: 0,
              pendingVacations: 0,
              attentionItems: _items(const []), term: (k)=>kTerms[k]!)
          .first
          .key ==
      'quiet', 'assert-live guard');

  print('OK digestLines: $n asserts passed');
}
