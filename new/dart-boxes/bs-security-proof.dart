// 🧪 הוכחה · bs-security (בנייה-חכמה) — ולידציה · הרשאות · ביקורת דרך הקופסה.
// הרצה: <dart> run --enable-asserts new/dart-boxes/bs-security-proof.dart
import 'bs-security.dart' as B;

int n = 0, fails = 0;
void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

void main() {
  // ── (1) ולידציית-קלט ───────────────────────────────────────────────────────
  ok('validEmail תקין x@y.z', B.validEmail('user.name@sub.example.com'));
  ok('validEmail פסול (בלי נקודה)', !B.validEmail('a@bc'));
  ok('validEmail רווח-פנימי ⇒ false', !B.validEmail('a b@c.d'));

  ok('validIsraeliMobile 10-ספרות-05', B.validIsraeliMobile('050-123 4567'));
  ok('validIsraeliMobile 04 ⇒ false', !B.validIsraeliMobile('0401234567'));

  ok('validBusinessId ספרת-ביקורת תקינה', B.validBusinessId('123456782'));
  ok('validBusinessId ביקורת שגויה ⇒ false', !B.validBusinessId('123456789'));

  ok('validBoardCode 4-ספרות', B.validBoardCode('12-34'));
  ok('validBoardCode 3-ספרות ⇒ false', !B.validBoardCode('123'));

  ok('validPositiveAmount 500 ⇒ true', B.validPositiveAmount(500));
  ok('validPositiveAmount 0 ⇒ false', !B.validPositiveAmount(0));
  ok('validPositiveAmount null ⇒ false', !B.validPositiveAmount(null));
  ok('validPositiveAmount NaN ⇒ false', !B.validPositiveAmount(double.nan));

  // validateCondition — מדיניות-הקופסה (allowlist + מפעל-SecCondition)
  final good = B.validateCondition({'field': 'age', 'op': 'gt', 'value': 5});
  ok('validateCondition תקין ⇒ SecCondition',
      good != null && good.field == 'age' && good.op == 'gt' && good.value == 5);
  final parsed = B.validateCondition({'field': 'total', 'op': 'lte', 'value': '7'});
  ok('validateCondition ערך-מחרוזת מתפרסר', parsed != null && parsed.value == 7);
  ok('validateCondition שדה-לא-מוכר ⇒ null',
      B.validateCondition({'field': 'zzz', 'op': 'gt', 'value': 5}) == null);
  ok('validateCondition אופרטור-לא-מוכר ⇒ null',
      B.validateCondition({'field': 'age', 'op': 'xx', 'value': 5}) == null);
  ok('validateCondition ערך-לא-מספרי ⇒ null',
      B.validateCondition({'field': 'age', 'op': 'gt', 'value': 'abc'}) == null);
  ok('validateCondition לא-Map ⇒ null', B.validateCondition('x') == null);

  // ── (2) הרשאות-הרכבה ───────────────────────────────────────────────────────
  ok('canConnect name-inference חפיפת-גדלים ⇒ true',
      B.canConnect(
          const B.ConnPart(sku: 'A', connectionSizes: ['20']),
          const B.ConnPart(sku: 'B', connectionSizes: ['20'])));
  ok('canConnect sku זהה ⇒ false',
      !B.canConnect(
          const B.ConnPart(sku: 'X', connectionSizes: ['20']),
          const B.ConnPart(sku: 'X', connectionSizes: ['20'])));
  ok('canConnect שני-מינים male ⇒ false',
      !B.canConnect(
          const B.ConnPart(sku: 'A', connectionSizes: ['20'], connectionGender: 'male'),
          const B.ConnPart(sku: 'B', connectionSizes: ['20'], connectionGender: 'male')));
  ok('canConnect verifiedSpecs תואם ⇒ true (בלי גדלים)',
      B.canConnect(const B.ConnPart(sku: 'A'), const B.ConnPart(sku: 'B'),
          verifiedSpecs: {
            'A': {'B'},
            'B': {'A'},
          }));
  ok('canConnect verifiedSpecs לא-תואם ⇒ false (גם עם חפיפת-גדלים)',
      !B.canConnect(
          const B.ConnPart(sku: 'A', connectionSizes: ['20']),
          const B.ConnPart(sku: 'B', connectionSizes: ['20']),
          verifiedSpecs: {
            'A': <String>{},
            'B': <String>{},
          }));

  ok('canPlace button→container ⇒ true', B.canPlace('button', 'container'));
  ok('canPlace button→list ⇒ true', B.canPlace('button', 'list'));
  ok('canPlace button→action ⇒ false', !B.canPlace('button', 'action'));
  ok('canPlace סוג-לא-מוכר ⇒ false (fail-closed)', !B.canPlace('missing', 'container'));

  // ── (3) עקבת-ביקורת ────────────────────────────────────────────────────────
  const e1 = B.BlockedEntry(opTag: 'setText', opId: 'nav.home', reasonHe: 'נעול לתפקיד');
  const e2 = B.BlockedEntry(opTag: 'setHidden', opId: 'btn.confirmOrder', reasonHe: 'רצפת-תפקיד');
  ok('auditLine פורמט ⛔', B.auditLine(e1) == '⛔ setText · nav.home · נעול לתפקיד');
  ok('auditTrail שורה-לכל-רשומה + סדר', () {
    final t = B.auditTrail([e1, e2]);
    return t.length == 2 &&
        t[0] == '⛔ setText · nav.home · נעול לתפקיד' &&
        t[1] == '⛔ setHidden · btn.confirmOrder · רצפת-תפקיד';
  }());
  ok('auditTrail ריק ⇒ []', B.auditTrail(const []).isEmpty);
  ok('renderAuditTrail join(\\n)',
      B.renderAuditTrail([e1, e2]) ==
          '⛔ setText · nav.home · נעול לתפקיד\n⛔ setHidden · btn.confirmOrder · רצפת-תפקיד');
  ok('renderAuditTrail ריק ⇒ ""', B.renderAuditTrail(const []) == '');

  // auditRows — שם-כפול (נרמול-רווחים) + מק"ט-כמעט-זהה (מקף/רישיות)
  final rep = B.auditRows(const [
    B.QualityRow(line: 1, name: 'ישראל כהן', key: 'AB-100'),
    B.QualityRow(line: 2, name: 'ישראל  כהן', key: 'ab 100'),
  ]);
  ok('auditRows scanned=2', rep.scanned == 2);
  ok('auditRows dup-name + near-key', () {
    final kinds = rep.warnings.map((w) => w.kind).toSet();
    return rep.warnings.length == 2 &&
        kinds.contains('dup-name') &&
        kinds.contains('near-key');
  }());
  ok('auditRows קטלוג-נקי ⇒ 0 אזהרות',
      B.auditRows(const [
        B.QualityRow(line: 1, name: 'מוצר א', key: 'A1'),
        B.QualityRow(line: 2, name: 'מוצר ב', key: 'B2'),
      ]).warnings.isEmpty);

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(B.validEmail('x@y.z') && !B.canPlace('missing', 'container'),
      'assert-live guard');

  if (fails > 0) {
    print('❌ bs-security: $fails אי-התאמות');
    throw StateError('bs-security proof failed');
  }
  print('✓ קופסת-bs-security (בנייה-חכמה): $n טענות — ולידציה · הרשאות · ביקורת (11 אטומים)');
}
