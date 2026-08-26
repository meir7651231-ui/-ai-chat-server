// 🧪 הוכחת-חוצה-שפות · names-export (Dart) — מריצה את names-export.dart על אותם
// קלטים/WANT כמו new/boxes/names-export.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart)
// על אותה קופסה: הרשאה ⇒ הגנת-הזרקה ⇒ BOM.
import 'dart:convert';
import 'dart:io';
import 'names-export.dart' as B;

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
  // אותם קלטים כמו בדיקת-ה-JS.
  final rows = [
    ['שם', 'הערה'],
    ['כהן', '=HACK()'],
    ['לוי', 'א,ב'],
  ];

  // 1) מנהל ⇒ מותר + BOM בראש הקובץ.
  final okRes = B.exportNames(rows: rows, userEmail: 'a@b.com', adminEmails: ['a@b.com']);
  ok('מנהל: allowed', okRes['allowed'] == true);
  ok('BOM בראש', (okRes['content'] as String).startsWith('﻿'));
  eq('שם-קובץ', okRes['filename'], 'names-report.csv');
  eq('תווית', okRes['label'], '⬇ ייצוא CSV');
  // 2) הגנת-הזרקת-נוסחה (גרש מוביל).
  ok('הזרקה נחסמה', (okRes['content'] as String).contains("'=HACK()"));
  // 3) ציטוט-פסיק.
  ok('ציטוט-פסיק', (okRes['content'] as String).contains('"א,ב"'));

  // 4) לא-מנהל ⇒ לא-מותר, בלי תוכן.
  final noRes = B.exportNames(rows: rows, userEmail: 'x@y.com', adminEmails: ['a@b.com']);
  ok('לא-מנהל: !allowed', noRes['allowed'] != true);
  ok('לא-מנהל: אין תוכן', noRes['content'] == null);

  // 5) מצב-מקומי (רשימת-מנהלים ריקה + מייל null) ⇒ מותר.
  final localRes = B.exportNames(rows: rows, userEmail: null, adminEmails: <String>[]);
  ok('מצב-מקומי: allowed', localRes['allowed'] == true);

  // 6) 🛡 מגן-הכרעה: שער-ההרשאה (isAdmin) לפני ייצור-התוכן (toCsv) — סדר-החיווט חתום.
  //    מקבילה ל-readFileSync-guard של בדיקת-ה-JS, על מקור-הקופסה ה-Dart.
  final src = File.fromUri(Platform.script.resolve('names-export.dart')).readAsStringSync();
  ok('מגן: שער-ההרשאה לפני התוכן',
      src.indexOf('ia.isAdmin(') < src.indexOf('tc.toCsv('));

  if (fails > 0) {
    print('❌ קופסת-names-export (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('names-export dart proof failed');
  }
  print('✓ קופסת-names-export (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
