// בדיקת-חוזה · actionDescriptor — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/action_descriptor_test.dart
import 'action_descriptor.dart';

// קטלוג-בדיקה: רשומות verbatim מ-kActionCatalog של המקור (:131-181).
const List<ActionDescriptor> _cat = <ActionDescriptor>[
  ActionDescriptor(
    id: 'nav.screen',
    he: 'מעבר למסך',
    kind: ActionEffectKind.navScreen,
    groundedIn: 'manager_copilot_screen.dart:32 · static Route<void> route()',
  ),
  ActionDescriptor(
    id: 'sheet.scanPlan',
    he: 'סרוק תוכנית עבודה',
    kind: ActionEffectKind.openSheet,
    sheetId: 'scanPlan',
    groundedIn: 'contractor_tools_sheets.dart:26 · openScanPlanSheet',
  ),
  ActionDescriptor(
    id: 'cart.add',
    he: 'הוסף לסל',
    kind: ActionEffectKind.cartAdd,
    mutates: true,
    confirmGated: true,
    groundedIn:
        'ai_assistant_screen.dart:210 · _confirmAdd (G5 confirm-only cart write)',
  ),
  ActionDescriptor(
    id: 'share.text',
    he: 'העתק / שתף טקסט',
    kind: ActionEffectKind.shareText,
    groundedIn: 'reject_reason_screen.dart:110 · _copy → Clipboard.setData',
  ),
];

void _isNull(ActionDescriptor? got, String label) {
  if (got != null) {
    throw StateError('FAIL [$label]: expected null, got id=${got.id}');
  }
}

void _hasId(ActionDescriptor? got, String wantId, String label) {
  if (got == null) throw StateError('FAIL [$label]: got null, want $wantId');
  if (got.id != wantId) {
    throw StateError('FAIL [$label]: got id=${got.id} want $wantId');
  }
}

void main() {
  var n = 0;

  // — דוגמה 1: nav.screen (verbatim) —
  final d1 = actionDescriptor(_cat, 'nav.screen');
  _hasId(d1, 'nav.screen', '1 nav.screen id'); n++;
  if (d1!.he != 'מעבר למסך') throw StateError('FAIL 1 he=${d1.he}');
  n++;
  if (d1.kind != ActionEffectKind.navScreen) throw StateError('FAIL 1 kind');
  n++;
  if (d1.mutates != false) throw StateError('FAIL 1 mutates');
  n++;

  // — דוגמה 2: cart.add — המוטטור היחיד (mutates ⇒ confirmGated) —
  final d2 = actionDescriptor(_cat, 'cart.add');
  _hasId(d2, 'cart.add', '2 cart.add id'); n++;
  if (d2!.he != 'הוסף לסל') throw StateError('FAIL 2 he=${d2.he}');
  n++;
  if (d2.kind != ActionEffectKind.cartAdd) throw StateError('FAIL 2 kind');
  n++;
  if (d2.mutates != true) throw StateError('FAIL 2 mutates');
  n++;
  if (d2.confirmGated != true) throw StateError('FAIL 2 confirmGated');
  n++;

  // — דוגמה 3: sheet.scanPlan — sheetId נישא במתאר —
  final d3 = actionDescriptor(_cat, 'sheet.scanPlan');
  _hasId(d3, 'sheet.scanPlan', '3 sheet id'); n++;
  if (d3!.sheetId != 'scanPlan') throw StateError('FAIL 3 sheetId=${d3.sheetId}');
  n++;
  if (d3.kind != ActionEffectKind.openSheet) throw StateError('FAIL 3 kind');
  n++;

  // — דוגמה 4: share.text —
  final d4 = actionDescriptor(_cat, 'share.text');
  _hasId(d4, 'share.text', '4 share id'); n++;
  if (d4!.he != 'העתק / שתף טקסט') throw StateError('FAIL 4 he=${d4.he}');
  n++;

  // — דוגמה 5: מזהה לא-קיים ⇒ null (fail-closed) —
  _isNull(actionDescriptor(_cat, 'nonexistent.id'), '5 unknown'); n++;

  // — עדשה-עוינת (CURRICULUM #6) —
  // 6: id ריק ⇒ null (שום מתאר בעל id ריק)
  _isNull(actionDescriptor(_cat, ''), '6 empty id'); n++;
  // 7: case שונה ⇒ null (== case-sensitive)
  _isNull(actionDescriptor(_cat, 'NAV.SCREEN'), '7 wrong case'); n++;
  // 8: רווח-נוסף ⇒ null (התאמה-מדויקת)
  _isNull(actionDescriptor(_cat, 'nav.screen '), '8 trailing space'); n++;
  // 9: catalog ריק ⇒ null (הלולאה לא רצה)
  _isNull(actionDescriptor(const <ActionDescriptor>[], 'nav.screen'), '9 empty catalog'); n++;

  // — דוגמה 10: id כפול ⇒ first-match-wins —
  const dup = <ActionDescriptor>[
    ActionDescriptor(
      id: 'x',
      he: 'ראשון',
      kind: ActionEffectKind.navScreen,
      groundedIn: 'first',
    ),
    ActionDescriptor(
      id: 'x',
      he: 'שני',
      kind: ActionEffectKind.navScreen,
      groundedIn: 'second',
    ),
  ];
  final dd = actionDescriptor(dup, 'x');
  if (dd == null || dd.he != 'ראשון') {
    throw StateError('FAIL 10 first-match: he=${dd?.he}');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(actionDescriptor(_cat, 'nav.screen') != null, 'assert-live guard');
  assert(actionDescriptor(_cat, 'nope') == null, 'assert-live guard null');

  print('OK actionDescriptor: $n asserts passed');
}
