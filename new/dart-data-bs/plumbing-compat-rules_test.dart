// 🧪 בדיקת-צורה · plumbing-compat-rules — מוכיחה שהקטלוג ביט-זהה לפלט-המקור.
// המקור (plumbing_trade_seed.dart:328-348) *גוזר* את החוקות מטבלת-pairs מחוברת:
// כאן משוחזרת הגזירה verbatim (id-scheme + _connTypeId + sort) ומושווית לליטרלים.
// הרצה: dart run --enable-asserts plumbing-compat-rules_test.dart ⇒ exit 0.
import 'plumbing-compat-rules.dart';

void main() {
  // ── שחזור-הגזירה מטבלת-המקור (plumbing_trade_seed.dart:329-347, verbatim) ──
  const kPlumbingTradeId = 'plumbing'; // :30
  String connTypeId(String endTypeName) =>
      '$kPlumbingTradeId.conn.$endTypeName'; // _connTypeId :40
  // טבלת-ה-pairs המחוברת — סדר-המקור (לפני sort), תוויות ביט-זהות :329-335.
  const pairs = <(String, String, String)>[
    ('bspMale', 'bspFemale', 'תבריג + PTFE'),
    ('pexPress', 'pexPress', 'Press / טבעת כיווץ'),
    ('copperPress', 'copperPress', 'Press / O-ring'),
    ('drainOpening', 'drainOpening', 'כיסוי ניקוז'),
    ('hdpeCompression', 'hdpeCompression', 'אום הידוק (compression)'),
  ];
  final derived = [
    for (final (a, b, label) in pairs)
      (
        id: '$kPlumbingTradeId.rule.${a}__$b', // :339
        tradeId: kPlumbingTradeId,
        aTypeId: connTypeId(a),
        bTypeId: connTypeId(b),
        sizeMatch: 'exactSame', // SizeMatch.exactSame :343
        methodLabelHe: label,
        onMismatch: 'critical', // RuleSeverity.critical :345
      ),
  ]..sort((x, y) => x.id.compareTo(y.id)); // :347

  // 1) ביט-זהות מלאה: הליטרלים ≡ הגזירה-מהמקור, שדה-שדה ובסדר.
  assert(kPlumbingCompatRules.length == derived.length);
  for (var i = 0; i < derived.length; i++) {
    assert(kPlumbingCompatRules[i] == derived[i],
        'שורה $i סוטה מהמקור: ${kPlumbingCompatRules[i]} != ${derived[i]}');
  }

  // 2) צורה: בדיוק 5 חוקות, ממוינות-לפי-id עולה ממש (סדר-הזרקה דטרמיניסטי).
  assert(kPlumbingCompatRules.length == 5);
  for (var i = 1; i < kPlumbingCompatRules.length; i++) {
    assert(
        kPlumbingCompatRules[i - 1].id.compareTo(kPlumbingCompatRules[i].id) <
            0);
  }

  // 3) אינווריאנטים של המקור: כל חוקה — exactSame + critical + סכמת-ids.
  final ruleIds = <String>{};
  for (final r in kPlumbingCompatRules) {
    assert(r.tradeId == 'plumbing');
    assert(r.sizeMatch == 'exactSame');
    assert(r.onMismatch == 'critical');
    assert(r.id.startsWith('plumbing.rule.'));
    assert(r.aTypeId.startsWith('plumbing.conn.'));
    assert(r.bTypeId.startsWith('plumbing.conn.'));
    // ה-id מקודד את שני קצוות-הטיפוס: rule.<a>__<b> תואם aTypeId/bTypeId.
    final tail = r.id.substring('plumbing.rule.'.length).split('__');
    assert(tail.length == 2);
    assert(r.aTypeId == connTypeId(tail[0]) && r.bTypeId == connTypeId(tail[1]));
    ruleIds.add(r.id);
  }
  assert(ruleIds.length == 5, 'ids חייבים להיות ייחודיים');

  // 4) קצה: הזוג ההטרוגני היחיד הוא תבריג זכר↔נקבה; השאר same-type.
  var hetero = 0;
  for (final r in kPlumbingCompatRules) {
    if (r.aTypeId != r.bTypeId) {
      hetero++;
      assert(r.aTypeId == 'plumbing.conn.bspMale' &&
          r.bTypeId == 'plumbing.conn.bspFemale');
      assert(r.methodLabelHe == 'תבריג + PTFE');
    }
  }
  assert(hetero == 1);

  // ── חוקת-ההשלמה הגלוונית (plumbing_trade_seed.dart:354-367, verbatim) ──
  assert(kPlumbingCompletionRules.length == 1);
  final g = kPlumbingCompletionRules[0];
  assert(g.id == 'plumbing.completion.galvanic'); // :356
  assert(g.tradeId == 'plumbing');
  // '' במכוון — טריגר לפי-חומר, לא לפי-טיפוס-מחבר (:350-353).
  assert(g.whenInLineHasTypeId == '' && g.requireTypeId == '');
  assert(g.whyHe ==
      'מתכות לא-דומות (נחושת/פליז ↔ פלדה/נירוסטה) באותו קו דורשות מתאם דיאלקטרי למניעת קורוזיה גלוונית');
  assert(g.incompatibleMaterialGroups.length == 2);
  assert(g.incompatibleMaterialGroups[0] == 'copper-group' &&
      g.incompatibleMaterialGroups[1] == 'iron-group'); // :362
  assert(g.requiredInterposerWhyHe ==
      'מתאם דיאלקטרי (ניתוק גלווני בין קבוצות-מתכת לא-דומות)');
  assert(g.severity == 'critical');

  print('OK plumbing-compat-rules: 5 חוקות-זוג ≡ גזירת-המקור · השלמה גלוונית ≡ מקור');
}
