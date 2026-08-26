// בדיקת-אטום · connectionFailReason — מוכיחה בדיוק את דוגמאות connection_fail_reason.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/connection_fail_reason_test.dart ⇒ exit 0 + "connectionFailReason OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import 'connection_fail_reason.dart';

/// בונה שקע-אימות ממפה sku→VerifiedView.
VerifiedView? Function(String) _verified(Map<String, VerifiedView> m) =>
    (sku) => m[sku];

/// ברירת-מחדל לשקע-האימות בבדיקה (⇔ _noVerified הפרטי של האטום).
VerifiedView? _none(String sku) => null;

// התוויות המקוריות (verbatim · connection-fail-labels.dart) — מוזרקות כדי לאמת זהות-ביט.
const _labels = {
  'sizeDiffDn': 'גודל שונה: DN{0} ↔ DN{1}',
  'pexDiff': 'גודל PEX שונה: {0} ↔ {1}',
  'copperDiff': 'גודל נחושת שונה: DN{0} ↔ DN{1}',
  'bothMaleVerified': 'שני קצוות זכר {0}" — אין חיבור',
  'bothFemaleVerified': 'שני קצוות נקבה {0}" — אין חיבור',
  'threadSizeDiff': 'גודל תבריג שונה: {0}" ↔ {1}"',
  'materialAdapter': 'נדרש מתאם מעבר: {0} ↔ {1}',
  'noCommon': 'אין נקודת חיבור משותפת',
  'sizeUnknown': 'גודל חיבור לא ידוע',
  'sizeDiff': 'גודל שונה: {0} ↔ {1}',
  'genderUnknown': 'מין חיבור לא ידוע',
  'bothEnds': 'שני קצוות {0} — אין חיבור',
  'methodDiff': 'שיטה שונה: {0} ↔ {1}',
  'genderMale': 'זכר',
  'genderFemale': 'נקבה',
  'methodThread': 'תבריג',
  'methodGlue': 'הדבקה',
  'methodElse': 'אלקטרו',
};

/// עוטף את האטום עם התוויות המוזרקות (ברירת-מחדל = התוויות-המקוריות).
String _cfr(InferPart a, InferPart b,
        {VerifiedView? Function(String) verifiedOf = _none,
        Map<String, String> labels = _labels}) =>
    connectionFailReason(a, b, verifiedOf: verifiedOf, labels: labels);

void main() {
  // ─── ענף-מאומת ───────────────────────────────────────────────────────────

  // #1 — hdpeCompression, גדלים זרים ⇒ 'גודל שונה: DN..' (:539).
  assert(_cfr(
        const InferPart(sku: 'A'),
        const InferPart(sku: 'B'),
        verifiedOf: _verified({
          'A': const VerifiedView(ends: [VerifiedEnd('hdpeCompression', '16')], material: 'hdpe'),
          'B': const VerifiedView(ends: [VerifiedEnd('hdpeCompression', '20')], material: 'hdpe'),
        }),
      ) ==
      'גודל שונה: DN16 ↔ DN20');

  // #2 — pexPress, גדלים זרים ⇒ 'גודל PEX שונה' (:542).
  assert(_cfr(
        const InferPart(sku: 'A'),
        const InferPart(sku: 'B'),
        verifiedOf: _verified({
          'A': const VerifiedView(ends: [VerifiedEnd('pexPress', '16')], material: 'pex'),
          'B': const VerifiedView(ends: [VerifiedEnd('pexPress', '20')], material: 'pex'),
        }),
      ) ==
      'גודל PEX שונה: 16 ↔ 20');

  // #3 — copperPress, גדלים זרים ⇒ 'גודל נחושת שונה: DN..' (:545).
  assert(_cfr(
        const InferPart(sku: 'A'),
        const InferPart(sku: 'B'),
        verifiedOf: _verified({
          'A': const VerifiedView(ends: [VerifiedEnd('copperPress', '15')], material: 'copper'),
          'B': const VerifiedView(ends: [VerifiedEnd('copperPress', '22')], material: 'copper'),
        }),
      ) ==
      'גודל נחושת שונה: DN15 ↔ DN22');

  // #4 — זכר∩זכר לא-ריק ⇒ 'שני קצוות זכר X" — אין חיבור' (:550).
  assert(_cfr(
        const InferPart(sku: 'A'),
        const InferPart(sku: 'B'),
        verifiedOf: _verified({
          'A': const VerifiedView(ends: [VerifiedEnd('bspMale', '1/2')], material: 'brass'),
          'B': const VerifiedView(ends: [VerifiedEnd('bspMale', '1/2')], material: 'brass'),
        }),
      ) ==
      'שני קצוות זכר 1/2" — אין חיבור');

  // #5 — נקבה∩נקבה לא-ריק ⇒ 'שני קצוות נקבה X" — אין חיבור' (:553).
  assert(_cfr(
        const InferPart(sku: 'A'),
        const InferPart(sku: 'B'),
        verifiedOf: _verified({
          'A': const VerifiedView(ends: [VerifiedEnd('bspFemale', '3/4')], material: 'brass'),
          'B': const VerifiedView(ends: [VerifiedEnd('bspFemale', '3/4')], material: 'brass'),
        }),
      ) ==
      'שני קצוות נקבה 3/4" — אין חיבור');

  // #6 — זכר(A)↔נקבה(B) בגדלים זרים ⇒ 'גודל תבריג שונה' (:558).
  assert(_cfr(
        const InferPart(sku: 'A'),
        const InferPart(sku: 'B'),
        verifiedOf: _verified({
          'A': const VerifiedView(ends: [VerifiedEnd('bspMale', '1/2')], material: 'brass'),
          'B': const VerifiedView(ends: [VerifiedEnd('bspFemale', '3/4')], material: 'brass'),
        }),
      ) ==
      'גודל תבריג שונה: 1/2" ↔ 3/4"');

  // #7 — נקבה(A)↔זכר(B) בגדלים זרים ⇒ 'גודל תבריג שונה' (:561).
  assert(_cfr(
        const InferPart(sku: 'A'),
        const InferPart(sku: 'B'),
        verifiedOf: _verified({
          'A': const VerifiedView(ends: [VerifiedEnd('bspFemale', '1/2')], material: 'brass'),
          'B': const VerifiedView(ends: [VerifiedEnd('bspMale', '3/4')], material: 'brass'),
        }),
      ) ==
      'גודל תבריג שונה: 1/2" ↔ 3/4"');

  // #8 — כל שערי-הגודל חופפים, החומר מפיל ⇒ 'נדרש מתאם מעבר' (:566).
  assert(_cfr(
        const InferPart(sku: 'A'),
        const InferPart(sku: 'B'),
        verifiedOf: _verified({
          'A': const VerifiedView(ends: [VerifiedEnd('hdpeCompression', '16')], material: 'hdpe'),
          'B': const VerifiedView(ends: [VerifiedEnd('hdpeCompression', '16')], material: 'pex'),
        }),
      ) ==
      'נדרש מתאם מעבר: hdpe ↔ pex');

  // #9 — הכול חופף, אותו חומר ⇒ 'אין נקודת חיבור משותפת' (:568).
  assert(_cfr(
        const InferPart(sku: 'A'),
        const InferPart(sku: 'B'),
        verifiedOf: _verified({
          'A': const VerifiedView(ends: [VerifiedEnd('hdpeCompression', '16')], material: 'hdpe'),
          'B': const VerifiedView(ends: [VerifiedEnd('hdpeCompression', '16')], material: 'hdpe'),
        }),
      ) ==
      'אין נקודת חיבור משותפת');

  // ─── ענף name-inference ───────────────────────────────────────────────────

  // #10 — גדלים ריקים בצד ⇒ 'גודל חיבור לא ידוע' (:574).
  assert(_cfr(
        const InferPart(sku: 'A', connectionSizes: []),
        const InferPart(sku: 'B', connectionSizes: ['20']),
      ) ==
      'גודל חיבור לא ידוע');

  // #11 — גדלים זרים ⇒ 'גודל שונה' (:575).
  assert(_cfr(
        const InferPart(sku: 'A', connectionSizes: ['20']),
        const InferPart(sku: 'B', connectionSizes: ['25']),
      ) ==
      'גודל שונה: 20 ↔ 25');

  // #12 — חפיפת-גודל, מין חסר ⇒ 'מין חיבור לא ידוע' (:578).
  assert(_cfr(
        const InferPart(sku: 'A', connectionSizes: ['20']),
        const InferPart(sku: 'B', connectionSizes: ['20']),
      ) ==
      'מין חיבור לא ידוע');

  // #13 — שני זכרים ⇒ 'שני קצוות זכר — אין חיבור' (:581).
  assert(_cfr(
        const InferPart(sku: 'A', connectionSizes: ['20'], connectionGender: 'male'),
        const InferPart(sku: 'B', connectionSizes: ['20'], connectionGender: 'male'),
      ) ==
      'שני קצוות זכר — אין חיבור');

  // #14 — שתי נקבות ⇒ 'שני קצוות נקבה — אין חיבור' (:581).
  assert(_cfr(
        const InferPart(sku: 'A', connectionSizes: ['20'], connectionGender: 'female'),
        const InferPart(sku: 'B', connectionSizes: ['20'], connectionGender: 'female'),
      ) ==
      'שני קצוות נקבה — אין חיבור');

  // #15 — מינים שונים, שיטות thread↔glue ⇒ 'שיטה שונה' (:588).
  assert(_cfr(
        const InferPart(sku: 'A', connectionSizes: ['20'], connectionGender: 'male', connectionMethod: 'thread'),
        const InferPart(sku: 'B', connectionSizes: ['20'], connectionGender: 'female', connectionMethod: 'glue'),
      ) ==
      'שיטה שונה: תבריג ↔ הדבקה');

  // #16 — שיטת electrofusion↔thread ⇒ תווית 'אלקטרו' (else-branch) (:588).
  assert(_cfr(
        const InferPart(sku: 'A', connectionSizes: ['20'], connectionGender: 'male', connectionMethod: 'electrofusion'),
        const InferPart(sku: 'B', connectionSizes: ['20'], connectionGender: 'female', connectionMethod: 'thread'),
      ) ==
      'שיטה שונה: אלקטרו ↔ תבריג');

  // #17 — מינים שונים, אותה שיטה ⇒ 'אין נקודת חיבור משותפת' (:591).
  assert(_cfr(
        const InferPart(sku: 'A', connectionSizes: ['20'], connectionGender: 'male', connectionMethod: 'thread'),
        const InferPart(sku: 'B', connectionSizes: ['20'], connectionGender: 'female', connectionMethod: 'thread'),
      ) ==
      'אין נקודת חיבור משותפת');

  // ─── עדשה-עוינת ───────────────────────────────────────────────────────────

  // #18 — צד-אחד בלבד מאומת ⇒ נופלים ל-name-inference (install_engine.dart:527).
  //        רק 'A' במפה ⇒ vB==null ⇒ ענף-מאומת מדולג, נשפט לפי connectionSizes.
  assert(_cfr(
        const InferPart(sku: 'A', connectionSizes: ['20']),
        const InferPart(sku: 'B', connectionSizes: ['25']),
        verifiedOf: _verified({
          'A': const VerifiedView(ends: [VerifiedEnd('hdpeCompression', '16')], material: 'hdpe'),
        }),
      ) ==
      'גודל שונה: 20 ↔ 25');

  // #19 — הדאטה מוחלפת ⇒ הפלט משתנה: תבנית 'sizeDiff' אחרת ⇒ הודעה אחרת (מוכיח הזרקה).
  assert(_cfr(
        const InferPart(sku: 'A', connectionSizes: ['20']),
        const InferPart(sku: 'B', connectionSizes: ['25']),
        labels: {..._labels, 'sizeDiff': 'DIFF {0}/{1}'},
      ) ==
      'DIFF 20/25');

  print('connectionFailReason OK — 19/19 (17 חוזה + עדשה-עוינת + הזרקת-תוויות)');
}
