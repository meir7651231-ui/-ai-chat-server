// בדיקת-חוזה (רתמת-זהב) · setAuditContext — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת את כל 5 דוגמאות-החוזה ואת בדיקת-ה-JS new/atoms/set-audit-context.test.mjs
// ביט-אחר-ביט, ומוסיפה נעילות-קצה שאומתו מול Node (הרצה-דיפרנציאלית):
// ‏U+0130 (כלל-13) · ‏Final_Sigma · ‏NEL-לא-מקורצף · קרצוף-Zs/LS.
// השוואת-אוסף = אורך + איבר-איבר (כלל-8). כשל ⇒ StateError.
// הרצה: dart run --enable-asserts new/dart-maor/set-audit-context_test.dart ⇒ OK
import 'set-audit-context.dart';

void _ok(bool cond, String label) {
  if (!cond) throw StateError('FAIL [$label]');
}

void _eq(Object? got, Object? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

// כלל-8: השוואת-רשימה = אורך + איבר-איבר (לא join).
void _eqList(List<Object?> got, List<Object?> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: length ${got.length} != ${want.length}');
  }
  for (var i = 0; i < got.length; i++) {
    if (got[i] != want[i]) {
      throw StateError('FAIL [$label][$i]: got=${got[i]} want=${want[i]}');
    }
  }
}

void main() {
  var n = 0;

  // 1) נרמול-מייל: trim + אותיות-קטנות (דוגמת-חוזה 1)
  {
    final ctx = setAuditContext('u1', '  Meir@Gmail.Com ', true);
    _eq(ctx['auditUid'], 'u1', "1 ה-uid חייב לעבור כמות-שהוא"); n++;
    _eq(ctx['auditEmail'], 'meir@gmail.com', '1 המייל חייב להתנרמל trim+lowercase'); n++;
    _eq(ctx['auditReadable'], true, '1 canRead=true חייב להישמר'); n++;
    // "בדיוק 3 מפתחות" — אורך + איבר-איבר (כלל-8; סדר-הכנסה נשמר ב-JS וב-Dart)
    _eqList((ctx as Map).keys.toList(), ['auditUid', 'auditEmail', 'auditReadable'],
        '1 האובייקט חייב להכיל בדיוק auditUid+auditEmail+auditReadable'); n++;
  }
  // 2) מייל כבר-מנורמל עובר כמות-שהוא (דוגמת-חוזה 2)
  {
    _eq(setAuditContext('u2', 'a@b.com', true)['auditEmail'], 'a@b.com',
        '2 מייל מנורמל השתנה בדרך'); n++;
  }
  // 3) canRead=false נשמר (עובד/ת — דוגמת-חוזה 3)
  {
    _eq(setAuditContext('u3', 'w@org.il', false)['auditReadable'], false,
        '3 canRead=false לא נשמר'); n++;
  }
  // 4) uid ריק עובר '' כמות-שהוא (דוגמת-חוזה 4)
  {
    _eq(setAuditContext('', 'x@y.z', false)['auditUid'], '',
        "4 uid ריק חייב לעבור '' — לא להיות מומצא"); n++;
  }
  // 5) שתי קריאות זהות ⇒ הפניות שונות, תוכן שווה (דוגמת-חוזה 5)
  {
    final a = setAuditContext('u1', 'a@b.com', true);
    final b = setAuditContext('u1', 'a@b.com', true);
    _ok(!identical(a, b), '5 אותו אובייקט הוחזר פעמיים — מצב דולף בין קריאות'); n++;
    _ok(
        a['auditUid'] == b['auditUid'] &&
            a['auditEmail'] == b['auditEmail'] &&
            a['auditReadable'] == b['auditReadable'],
        '5 תוכן שתי הקריאות חייב להיות זהה'); n++;
  }

  // — נעילות-קצה (אומתו מול Node v-current, הרצה-דיפרנציאלית) —
  // ‏U+0130 "İ" ⇒ מיפוי-מלא של JS: "i" + ‏U+0307 (כלל-13; Dart-חשוף היה בולע את הנקודה)
  {
    _eq(setAuditContext('u', 'İMeir@X.Com', true)['auditEmail'], 'i̇meir@x.com',
        'קצה İ: מיפוי-מלא i+U+0307 כמו JS'); n++;
  }
  // ‏Final_Sigma: ‏Σ בסוף-מילה ⇒ ς; ‏Σ בודדת ⇒ σ; דילוג על סימן-משלב
  {
    _eq(setAuditContext('u', 'ΑΣ@Β.Γ', true)['auditEmail'], 'ας@β.γ',
        'קצה Σ: סיגמא-סופית לפני @ כמו JS'); n++;
    _eq(setAuditContext('u', 'Σ', true)['auditEmail'], 'σ',
        'קצה Σ: בודדת ללא-קדם ⇒ σ'); n++;
    _eq(setAuditContext('u', 'ΆΣ', true)['auditEmail'], 'άς',
        'קצה Σ: דילוג-על-סימן-משלב לפני ⇒ ς'); n++;
    _eq(setAuditContext('u', 'ΑΣ́Β', true)['auditEmail'], 'ασ́β',
        'קצה Σ: אות-בעלת-רישיות אחרי (בדילוג) ⇒ σ'); n++;
  }
  // ‏U+0085 (NEL): ‏JS לא מקרצף — חייב להישאר בשני הקצוות (Dart trim() היה בולע)
  {
    _eq(setAuditContext('u', 'A@B.c', true)['auditEmail'],
        'a@b.c', 'קצה NEL: לא-מקורצף כמו JS'); n++;
  }
  // קבוצת-הקרצוף של ES כן פועלת: ‏NBSP · רווח-אידאוגרפי · LS
  {
    _eq(setAuditContext('u', ' 　A@B.c ', true)['auditEmail'],
        'a@b.c', 'קצה קרצוף: NBSP/U+3000/LS מקורצפים כמו JS'); n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(setAuditContext('u1', ' A@b.C ', true)['auditEmail'] == 'a@b.c',
      'assert-live guard');

  print('OK setAuditContext: $n asserts passed');
}
