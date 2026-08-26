// 🏅 רתמת-זהב · bs-actions-proof — מריצה את golden האטומים דרך ה-API של הקופסה.
// כל טענה נכשלת ⇒ StateError. הצינור מוכח מקצה-לקצה עם אוצר-הטווחים של הקופסה.
// הרצה: dart run --enable-asserts new/dart-boxes/bs-actions-proof.dart
import 'bs-actions.dart';

int _n = 0;
void _check(bool ok, String label) {
  if (!ok) throw StateError('FAIL [$label]');
  _n++;
}

void _eqS(String? got, String? want, String label) =>
    _check(got == want, '$label: got="$got" want="$want"');

bool _eqSet(Set<String> a, Set<String> b) =>
    a.length == b.length && a.containsAll(b);

// ── קטלוג-פעולות חי (action_descriptor_test / catalog_action_ids_for_test) ──
const _cat = <ActionDescriptor>[
  ActionDescriptor(id: 'nav.screen', he: 'מעבר למסך', kind: ActionEffectKind.navScreen, groundedIn: 'g'),
  ActionDescriptor(id: 'sheet.scanPlan', he: 'סרוק תוכנית עבודה', kind: ActionEffectKind.openSheet, sheetId: 'scanPlan', groundedIn: 'g'),
  ActionDescriptor(id: 'cart.add', he: 'הוסף לסל', kind: ActionEffectKind.cartAdd, mutates: true, confirmGated: true, groundedIn: 'g'),
  ActionDescriptor(id: 'share.text', he: 'העתק / שתף טקסט', kind: ActionEffectKind.shareText, groundedIn: 'g'),
];

const _live = <CatalogAction>[
  CatalogAction(id: 'nav.screen'),
  CatalogAction(id: 'sheet.scanPlan'),
  CatalogAction(id: 'cart.add', mutates: true),
  CatalogAction(id: 'cart.open'),
  CatalogAction(id: 'share.text'),
];

const _ruleActions = <({String id, String labelHe})>[
  (id: 'notify', labelHe: 'שלח התראה'),
  (id: 'block', labelHe: 'חסום'),
];

String _ns(String id) {
  final i = id.indexOf('/');
  return i < 0 ? id : id.substring(0, i);
}

void main() {
  // ═══ אשכול א׳ · קטלוג-הפעולות ═══

  // actionDescriptor — התאמה, שדות, fail-closed, first-match-wins.
  final d = actionDescriptor(_cat, 'cart.add');
  _check(d != null && d.he == 'הוסף לסל' && d.mutates && d.confirmGated, 'ad cart.add');
  _check(d!.kind == ActionEffectKind.cartAdd, 'ad kind');
  _check(actionDescriptor(_cat, 'sheet.scanPlan')?.sheetId == 'scanPlan', 'ad sheetId');
  _check(actionDescriptor(_cat, 'nonexistent.id') == null, 'ad unknown→null');
  _check(actionDescriptor(_cat, 'NAV.SCREEN') == null, 'ad case-sensitive');
  _check(actionDescriptor(const <ActionDescriptor>[], 'nav.screen') == null, 'ad empty catalog');

  // actionFromString — closed-set, case/trim מדויק.
  _check(actionFromString('addToCart') == AssistantAction.addToCart, 'afs addToCart');
  _check(actionFromString('answer') == AssistantAction.answer, 'afs answer');
  _check(actionFromString('Answer') == null, 'afs wrong-case→null');
  _check(actionFromString(' answer') == null, 'afs leading-space→null');
  _check(actionFromString('') == null, 'afs empty→null');

  // actionIdOf — String מקוצץ / Map.kind / fail-closed.
  _eqS(actionIdOf({'action': '  pad  '}), 'pad', 'aio trim');
  _eqS(actionIdOf({'action': {'kind': ' k '}}), 'k', 'aio map.kind');
  _eqS(actionIdOf({'action': ''}), null, 'aio empty→null');
  _eqS(actionIdOf({'action': {'kind': 5}}), null, 'aio kind non-string→null');
  _eqS(actionIdOf({}), null, 'aio no-action→null');

  // actionIdsFor — עותק / קבוצה-ריקה / dedup.
  final r1 = actionIdsFor('btn', (id) => id == 'btn' ? ['tap', 'longPress'] : null);
  _check(_eqSet(r1, {'tap', 'longPress'}), 'aif hit');
  _check(actionIdsFor('missing', (id) => null).isEmpty, 'aif null→empty');
  _check(actionIdsFor('x', (id) => ['a', 'a', 'b']).length == 2, 'aif dedup');

  // actionLabelHe — התאמה / fallback ל-id / case-sensitive.
  _eqS(actionLabelHe('block', _ruleActions), 'חסום', 'alh hit');
  _eqS(actionLabelHe('unknown', _ruleActions), 'unknown', 'alh miss→id');
  _eqS(actionLabelHe('BLOCK', _ruleActions), 'BLOCK', 'alh case-sensitive miss');

  // catalogActionIdsFor — כתיבה=7? (כאן 5) / קריאה מסננת מוטטור / fail-closed.
  final w = catalogActionIdsFor('card1', readOnly: false, catalog: _live);
  _check(w.contains('cart.add') && w.length == 5, 'caif write includes mutator');
  final ro = catalogActionIdsFor('card1', readOnly: true, catalog: _live);
  _check(!ro.contains('cart.add') && ro.length == 4, 'caif readOnly filters mutator');
  _check(catalogActionIdsFor('', readOnly: false, catalog: _live).isEmpty, 'caif empty-id fail-closed');
  _check(catalogActionIdsFor('   ', readOnly: true, catalog: _live).isEmpty, 'caif blank fail-closed');

  // ═══ אשכול ב׳ · טווח-העריכה (אוצר-הקופסה: scope:all / scope:screen: / scope:single:) ═══

  const scopeTokens = ['scope:all', 'scope:screen:home', 'scope:screen:cart'];
  const registryIds = ['btn_save', 'btn_cancel', 'lbl_title'];

  // classifyScope — ריק / token מדויק / token מוכל / single-אמת / single-רפאים / prose.
  _eqS(classifyScope('   ', scopeTokens: scopeTokens, registryIds: registryIds), null, 'cs blank→null');
  _eqS(classifyScope('scope:all', scopeTokens: scopeTokens, registryIds: registryIds), 'scope:all', 'cs exact token');
  _eqS(classifyScope('בבקשה scope:screen:home את המסך', scopeTokens: scopeTokens, registryIds: registryIds),
      'scope:screen:home', 'cs contained token');
  _eqS(classifyScope('scope:single:btn_save', scopeTokens: scopeTokens, registryIds: registryIds),
      'scope:single:btn_save', 'cs single real');
  _eqS(classifyScope('scope:single:ghost', scopeTokens: scopeTokens, registryIds: registryIds), null, 'cs single unknown→null');
  _eqS(classifyScope('install the sink please', scopeTokens: scopeTokens, registryIds: registryIds), null, 'cs prose→null');

  // scopeElementIds — all / לפי-מרחב / bounded-single / fail-closed. (namespace = split '/')
  final ids = <String>{'cart/btn', 'cart/txt', 'home/hdr'};
  _check(_eqSet(scopeElementIds('scope:all', ids: ids, namespaceOf: _ns), ids), 'sei all');
  _check(_eqSet(scopeElementIds('scope:screen:cart', ids: ids, namespaceOf: _ns), {'cart/btn', 'cart/txt'}), 'sei screen');
  _check(_eqSet(scopeElementIds('scope:single:cart/btn', ids: ids, namespaceOf: _ns), {'cart/btn'}), 'sei single hit');
  _check(scopeElementIds('scope:single:nope', ids: ids, namespaceOf: _ns).isEmpty, 'sei single miss');
  _check(scopeElementIds('garbage', ids: ids, namespaceOf: _ns).isEmpty, 'sei fail-closed');

  // צינור מקצה-לקצה: classifyScope ⇒ scopeElementIds (אותו אוצר!) —
  final scope = classifyScope('scope:single:btn_save', scopeTokens: scopeTokens, registryIds: registryIds);
  _check(scope == 'scope:single:btn_save', 'pipe scope produced');
  final resolved = scopeElementIds(scope!, ids: {'btn_save', 'btn_cancel'}, namespaceOf: _ns);
  _check(_eqSet(resolved, {'btn_save'}), 'pipe scope→ids coherent');

  // scopeHe — 5 ענפים + לא-מזוהה.
  _eqS(scopeHe('scope:all'), 'כל האלמנטים', 'sh all');
  _eqS(scopeHe('scope:actionable'), 'כל הכפתורים', 'sh actionable');
  _eqS(scopeHe('scope:every:button'), 'כל «button»', 'sh every');
  _eqS(scopeHe('scope:screen:cart'), 'מסך «cart»', 'sh screen');
  _eqS(scopeHe('scope:single:btn-pay'), 'האלמנט «btn-pay»', 'sh single');
  _eqS(scopeHe('wat'), '(טווח לא מזוהה)', 'sh unknown');

  // scopeLabel — שורת 'מתוך: …'.
  _eqS(scopeLabel('scope:all'), 'מתוך: כל האלמנטים', 'sl all');
  _eqS(scopeLabel('scope:screen:cart'), 'מתוך: מרחב «cart»', 'sl screen→מרחב');
  _eqS(scopeLabel('scope:single:btn-pay'), 'מתוך: האלמנט «btn-pay»', 'sl single');
  _eqS(scopeLabel('zzz'), 'מתוך: (טווח לא מזוהה)', 'sl unknown');

  // scopeTokenHe — all/מרחב מתורגמים; השאר fall-through verbatim.
  _eqS(scopeTokenHe('scope:all'), 'כל האלמנטים', 'sth all');
  _eqS(scopeTokenHe('scope:screen:cart'), 'מרחב «cart»', 'sth screen');
  _eqS(scopeTokenHe('scope:single:btn'), 'scope:single:btn', 'sth fall-through');
  _eqS(scopeTokenHe('random'), 'random', 'sth raw');

  print('OK bs-actions: $_n asserts passed (11 atoms wired, end-to-end pipe proven)');
}
