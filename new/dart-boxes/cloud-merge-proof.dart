// 🧪 הוכחת-חוצה-שפות · cloud-merge (Dart) — מריצה את cloud-merge.dart על אותם
// קלטים/WANT כמו new/boxes/cloud-merge.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart)
// על אותה קופסה: אותם 4 חוטים · sanitize+merge+entity(מחווט)+meta · פלט זהה-ביט.
//
// דילוגים מתועדים (חוקי-המשימה):
//  • שני "מגני-המקור" בסוף cloud-merge.test.mjs (readFileSync + regex על מחרוזת-קוד
//    ה-.mjs: חיווט-שלושת-השקעים · חסימת-import-קופסה) — מגני-מקור-JS על טקסט-JS,
//    לא ניתנים-להעברה ל-Dart ולא נוגעים בהתנהגות ⇒ מדולגים.
//  • אין מקרה תלוי-ריצת-JS. הבחנת null↔undefined (p4) מגושרת בקונבנציית-Dart:
//    JS-undefined ⇒ מפתח-חסר במפה (ראה amp.applyMetaPartial docs).
import 'dart:convert';
import 'cloud-merge.dart' as C;

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
  // ── sanitizeIncoming ──
  {
    final g = <String, dynamic>{'a': 1};
    ok('s1 אוסף-לא-מוכר אותה-רפרנס', identical(C.sanitizeIncoming('ghosts', g), g));
    eq('s2 שדה-רשימה חסר', C.sanitizeIncoming('supporters', {'id': 'x'}),
        {'id': 'x', 'donations': <dynamic>[]});
    eq('s3 members לא-מערך',
        C.sanitizeIncoming('families', {'members': 5, 'docs': ['d']}),
        {'members': <dynamic>[], 'docs': ['d']});
  }

  // ── mergeDonationsPreserving ──
  {
    final inc = <String, dynamic>{'donations': [{'rid': 'B'}]};
    ok('m1 לא-תומך אותה-רפרנס',
        identical(C.mergeDonationsPreserving('families', <String, dynamic>{}, inc), inc));
    final r2 = C.mergeDonationsPreserving(
        'supporters', {'donations': [{'rid': 'A'}]}, {'donations': [{'rid': 'B'}]});
    eq('m2 תרומה מקומית-בלבד נשמרת', r2['donations'], [{'rid': 'B'}, {'rid': 'A'}]);
    final r3 =
        C.mergeDonationsPreserving('supporters', {'count': 5}, {'donations': <dynamic>[], 'count': 3});
    ok('m3 מונה max', r3['count'] == 5);
    final inc4 = <String, dynamic>{'donations': [{'rid': 'A'}], 'count': 5};
    ok(
        'm4 local⊆incoming אותה-רפרנס',
        identical(
            C.mergeDonationsPreserving(
                'supporters', {'donations': [{'rid': 'A'}], 'count': 5}, inc4),
            inc4));
  }

  // ── applyEntityPartial (מחווט 3-ארגומנטים) ──
  {
    final db1 = <String, dynamic>{'families': [{'id': 'a', 'n': 1}]};
    ok(
        'e1 אוסף-לא-ישות no-op',
        identical(
            C.applyEntityPartial(db1, 'ghosts', [
              {'id': 'z', 'data': <String, dynamic>{}, 'deleted': false}
            ]),
            db1));
    final db2 = C.applyEntityPartial(
        {'rooms': [{'id': 'a', 'n': 1}]}, 'rooms', [
      {'id': 'b', 'data': {'n': 2}, 'deleted': false}
    ]);
    eq('e2 חדש-לראש', db2['rooms'], [{'n': 2, 'id': 'b'}, {'id': 'a', 'n': 1}]);
    final db3 = C.applyEntityPartial(
        {'rooms': [{'id': 'a', 'n': 1}, {'id': 'b', 'n': 2}]}, 'rooms', [
      {'id': 'a', 'data': <String, dynamic>{}, 'deleted': true}
    ]);
    eq('e3 מחוק-יצא', db3['rooms'], [{'id': 'b', 'n': 2}]);
    // e4 — החיווט האמיתי: sanitizeIncoming + mergeDonationsPreserving פעילים דרך הקופסה
    final db4 = C.applyEntityPartial(
        {'supporters': [{'id': 's', 'donations': [{'rid': 'A'}], 'count': 5}]},
        'supporters', [
      {'id': 's', 'data': {'donations': [{'rid': 'B'}], 'count': 3}, 'deleted': false}
    ]);
    eq('e4 מיזוג-תרומות דרך הקופסה',
        (db4['supporters'] as List)[0]['donations'], [{'rid': 'B'}, {'rid': 'A'}]);
    ok('e4 מונה max דרך הקופסה', (db4['supporters'] as List)[0]['count'] == 5);
    final db5 = <String, dynamic>{'rooms': [{'id': 'a', 'n': 1}]};
    ok(
        'e5 ביט-זהה אותה-רפרנס',
        identical(
            C.applyEntityPartial(db5, 'rooms', [
              {'id': 'a', 'data': {'id': 'a', 'n': 1}, 'deleted': false}
            ]),
            db5));
    // e6 — סניטציה חיה: families מקבל members/docs מהשקע המחווט (חיזוק אמיתי בקופסה)
    final db6 = C.applyEntityPartial({'families': <dynamic>[]}, 'families', [
      {'id': 'g', 'data': {'name': 'כהן'}, 'deleted': false}
    ]);
    eq('e6 חיזוק-שדות-רשימה דרך הקופסה', db6['families'],
        [{'name': 'כהן', 'id': 'g', 'members': <dynamic>[], 'docs': <dynamic>[]}]);
  }

  // ── applyMetaPartial ──
  {
    final dbP = <String, Object?>{'seq': 5};
    ok('p1 מונה-קטן no-op', identical(C.applyMetaPartial(dbP, {'seq': 3}), dbP));
    ok('p2 מונה-עולה', C.applyMetaPartial({'seq': 5}, {'seq': 9})['seq'] == 9);
    ok('p3 הענן-מנצח', C.applyMetaPartial({'orgName': 'א'}, {'orgName': 'ב'})['orgName'] == 'ב');
    // p4 — JS `{ orgName: undefined }` ⇒ מפתח-חסר בקונבנציית-Dart ⇒ מדולג ⇒ אותה-רפרנס
    final dbP4 = <String, Object?>{'orgName': 'א'};
    ok('p4 undefined מדולג', identical(C.applyMetaPartial(dbP4, <String, Object?>{}), dbP4));
  }

  if (fails > 0) {
    print('❌ קופסת-cloud-merge (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('cloud-merge dart proof failed');
  }
  print('✓ קופסת-cloud-merge (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
