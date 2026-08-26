// בדיקת-חוזה ל-set-audit-context.dart — 5 דוגמאות-החוזה (פורט מ-set-audit-context.test.mjs)
// + רגרסיית-הסגר: מיפוי-צ'רוקי של toLowerCase (הבאג שהפיל את הפורט הישן).
// הרצה: dart run --enable-asserts set-audit-context_test.dart

import 'set-audit-context.dart';

void main() {
  // 1) נרמול-מייל: trim + אותיות-קטנות
  {
    final ctx = setAuditContext('u1', '  Meir@Gmail.Com ', true);
    assert(ctx['auditUid'] == 'u1', 'ה-uid חייב לעבור כמות-שהוא');
    assert(ctx['auditEmail'] == 'meir@gmail.com',
        'המייל חייב להתנרמל trim+lowercase (בפועל: ${ctx['auditEmail']})');
    assert(ctx['auditReadable'] == true, 'canRead=true חייב להישמר');
    assert((ctx as Map).length == 3,
        'האובייקט חייב להכיל בדיוק auditUid+auditEmail+auditReadable');
  }
  // 2) מייל כבר-מנורמל עובר כמות-שהוא
  {
    assert(setAuditContext('u2', 'a@b.com', true)['auditEmail'] == 'a@b.com',
        'מייל מנורמל השתנה בדרך');
  }
  // 3) canRead=false נשמר (עובד/ת)
  {
    assert(setAuditContext('u3', 'w@org.il', false)['auditReadable'] == false,
        'canRead=false לא נשמר');
  }
  // 4) uid ריק עובר '' כמות-שהוא
  {
    assert(setAuditContext('', 'x@y.z', false)['auditUid'] == '',
        "uid ריק חייב לעבור '' — לא להיות מומצא");
  }
  // 5) שתי קריאות זהות ⇒ הפניות שונות, תוכן שווה
  {
    final a = setAuditContext('u1', 'a@b.com', true);
    final b = setAuditContext('u1', 'a@b.com', true);
    assert(!identical(a, b), 'אותו אובייקט הוחזר פעמיים — מצב דולף בין קריאות');
    assert(
        a['auditUid'] == b['auditUid'] &&
            a['auditEmail'] == b['auditEmail'] &&
            a['auditReadable'] == b['auditReadable'],
        'תוכן שתי הקריאות חייב להיות זהה');
  }
  // 6) רגרסיית-ההסגר: מיפוי-צ'רוקי (JS toLowerCase) — ᏣᎳᎩ ⇒ קטנות U+13A0→+0x97D0
  {
    // "ᏣᎳᎩ@x.y" (U+13E3 U+13B3 U+13A9) → JS toLowerCase "ꮳꮃꭹ@x.y" (U+ABB3 U+AB83 U+AB79)
    final ctx = setAuditContext('u6', 'ᏣᎳᎩ@x.y', true);
    assert(ctx['auditEmail'] == '\u{ABB3}\u{AB83}\u{AB79}@x.y',
        'צ\'רוקי חייב להתקטן כמו JS (בפועל: ${ctx['auditEmail']})');
  }
  // 7) רגרסיה: תוספת-צ'רוקי U+13F0–U+13F5 ⇒ +0x08
  {
    final ctx = setAuditContext('u7', '\u{13F0}@x.y', true);
    assert(ctx['auditEmail'] == '\u{13F8}@x.y',
        'תוספת-צ\'רוקי ⇒ +0x08 (בפועל: ${ctx['auditEmail']})');
  }
  // 8) NEL U+0085 לא נגזם (JS trim) — מבחין מ-Dart.trim
  {
    final ctx = setAuditContext('u8', 'a@b.com\u{0085}', true);
    assert(ctx['auditEmail'] == 'a@b.com\u{0085}',
        'NEL אינו רווח-ES — אסור להיגזם (בפועל: ${ctx['auditEmail']})');
  }

  print('✓ set-audit-context.dart: 8 בדיקות — ירוק (5 חוזה + צ\'רוקי + NEL)');
}
