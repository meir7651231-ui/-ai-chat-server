// 🧪 הוכחת-חוצה-שפות · signup-wizard · ליבה-טהורה (Dart) — אותם קלטים/WANT כמו
// new/boxes/signup-wizard.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה.
// ⏭ מגן-המקור בסוף בדיקת-ה-JS (regex על תפרי-ה-.mjs) מדולג — תלוי-JS (מגן-מקור-JS).
import 'dart:convert';
import 'signup-wizard.dart' as B;

int n = 0, fails = 0;
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) { print('✗ $name: got $g want $w'); fails++; } else { n++; }
}
void ok(String name, bool c) { if (!c) { print('✗ $name'); fails++; } else { n++; } }

void main() {
  // ── קבועים ──
  eq('WIZARD_STEPS', B.wizardSteps, 5);
  eq('WIZARD_INDUSTRIES.length', B.wizardIndustries.length, 13);
  eq('WIZARD_INDUSTRIES[0]', B.wizardIndustries[0],
      {'id': 'chesed', 'emoji': '🕊️', 'label': 'עמותת חסד', 'sub': 'גמ"ח · קופת צדקה'});
  // בדיוק 4 מפתחות בכל תחום — theme/terms/modules לא דולפים מהחבילה
  ok('keys=[emoji,id,label,sub]', B.wizardIndustries.every((i) {
    final k = i.keys.toList()..sort();
    return k.join(',') == 'emoji,id,label,sub';
  }));
  eq('ORG_SIZES.ids', B.orgSizes.map((s) => s['id']).toList(), ['small', 'medium', 'large']);
  eq('ORG_NEEDS.ids', B.orgNeeds.map((o) => o['id']).toList(),
      ['crm', 'billing', 'schedule', 'inventory', 'reports', 'multi', 'backup']);
  eq('EMPTY_WIZARD', B.emptyWizard(), {
    'industry': '', 'size': '', 'needs': [], 'orgName': '', 'contactName': '',
    'phone': '', 'email': '', 'password': '', 'password2': '',
  });

  // ── ולידציית-שלב ──
  final full = <String, dynamic>{
    'industry': 'clinic', 'size': 'small', 'needs': ['crm'], 'orgName': 'אור', 'contactName': 'מאיר',
    'phone': '050-1234567', 'email': 'a@b.co', 'password': '123456', 'password2': '123456',
  };
  final empty = B.emptyWizard();
  eq('step0 ריק', B.wizardStepError(0, empty), 'בחרו את תחום העסק כדי להמשיך');
  eq('step0 מלא', B.wizardStepError(0, full), null);
  eq('step1 ריק', B.wizardStepError(1, empty), 'בחרו את גודל הארגון');
  eq('step1 מלא', B.wizardStepError(1, full), null);
  eq('step2 אופציונלי', B.wizardStepError(2, empty), null);
  eq('step3 orgName trim', B.wizardStepError(3, {...full, 'orgName': '   '}), 'שם הארגון חובה');
  eq('step3 contactName', B.wizardStepError(3, {...full, 'contactName': ''}), 'שם איש קשר חובה');
  eq('step3 phone', B.wizardStepError(3, {...full, 'phone': ' '}), 'טלפון חובה — נחזור אליכם לאישור');
  eq('step3 מלא', B.wizardStepError(3, full), null);
  // שלב 4 — דרך signUpError; '' מנורמל ל-null
  eq('step4 מלא', B.wizardStepError(4, full), null);
  eq('step4 טלפון-קצר', B.wizardStepError(4, {...full, 'phone': '12'}),
      'מספר טלפון תקין הוא שדה חובה — נחזור אליכם לאישור');
  eq('step4 אימייל', B.wizardStepError(4, {...full, 'email': 'x'}), 'כתובת האימייל אינה תקינה');
  eq('step4 סיסמה-קצרה', B.wizardStepError(4, {...full, 'password': '12345', 'password2': '12345'}),
      'הסיסמה חייבת להיות לפחות 6 תווים');
  eq('step4 אי-זהות', B.wizardStepError(4, {...full, 'password2': '654321'}), 'הסיסמאות אינן זהות');
  eq('step5 default', B.wizardStepError(5, empty), null);
  eq('step-1', B.wizardStepError(-1, empty), null);

  // ── תוויות ──
  eq('industryLabel clinic', B.industryLabel('clinic'), 'קליניקה');
  eq('industryLabel zzz', B.industryLabel('zzz'), 'zzz');
  eq('industryLabel null', B.industryLabel(null), '—');
  eq('sizeLabel medium', B.sizeLabel('medium'), 'בינוני');
  eq('sizeLabel null', B.sizeLabel(null), '—');
  eq('needLabel crm', B.needLabel('crm'), 'ניהול לקוחות ואנשי קשר');
  eq('needLabel nope', B.needLabel('nope'), 'nope'); // בלי '—' — כמו במקור

  if (fails > 0) {
    print('❌ קופסת אשף-ההרשמה (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('signup-wizard dart proof failed');
  }
  print('✓ קופסת אשף-ההרשמה (Dart): $n אימותי-חוזה — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
