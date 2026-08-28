// בדיקת-חוזה · validateOp — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/validate_op_test.dart
import 'validate_op.dart';

void _fail(String label, Object? got, Object? want) =>
    throw StateError('FAIL [$label]: got=$got want=$want');

void main() {
  var n = 0;

  // ── רתמת-שקעים סטנדרטית: רג'יסטרי-סינתטי + מוני-קריאה ──
  // 'hero' נפתר ל-'home.hero' (מדמה longest-contained); 'ghost' לא-קיים.
  var shapeCalls = 0,
      elemCalls = 0,
      propCalls = 0,
      freeCalls = 0,
      actElemCalls = 0;
  String? lastFreeProp;
  void resetCounters() {
    shapeCalls = elemCalls = propCalls = freeCalls = actElemCalls = 0;
    lastFreeProp = null;
  }

  // opFromJson סטאב — מפרש-צורה מינימלי בסגנון step-69 (תג-סגור, id לא-ריק).
  ConfigOp? shape(Map<String, dynamic> m) {
    shapeCalls++;
    final id = m['id'];
    if (id is! String || id.isEmpty) return null;
    switch (m['op']) {
      case 'setText':
        return SetText(id, m['text'] as String?);
      case 'setEmoji':
        return SetEmoji(id, m['emoji'] as String?);
      case 'setHidden':
        return SetHidden(id, m['hidden'] as bool?);
      case 'setOrder':
        return SetOrder(id, (m['order'] as num?)?.toInt());
      case 'setStyle':
        return SetStyle(id, m['style']);
      case 'setAction':
        return SetAction(id, null); // הדקדוק: action=מחרוזת ⇒ CfgAction null.
      default:
        return null;
    }
  }

  String? elem(String id) {
    elemCalls++;
    return id == 'hero' || id == 'home.hero' ? 'home.hero' : null;
  }

  // הצירים העריכים של home.hero: text/emoji/hidden/order/style/action פרט ל-veto.
  var vetoAxis = '';
  String? prop(String target, String axis) {
    propCalls++;
    return axis == vetoAxis ? null : axis;
  }

  String axis(ConfigOp op) => switch (op) {
        SetText() => 'text',
        SetEmoji() => 'emoji',
        SetHidden() => 'hidden',
        SetOrder() => 'order',
        SetStyle() => 'style',
        SetAction() => 'action',
      };

  var freeOk = true;
  bool free(String target, String p, String? value) {
    freeCalls++;
    lastFreeProp = p;
    return freeOk;
  }

  var styleOk = true;
  final resolvedStyle = Object();
  ({bool ok, Object? style}) style(String target, Object? s) {
    return styleOk ? (ok: true, style: resolvedStyle) : (ok: false, style: null);
  }

  String? actId(Map<String, dynamic> m) {
    final a = m['action'];
    return a is String && a.trim().isNotEmpty ? a.trim() : null;
  }

  var actOnElement = true, actInCatalog = true;
  String? actElem(String target, String id) {
    actElemCalls++;
    return actOnElement ? 'checkout.$id' : null; // ה-RESOLVED-על-האלמנט מובחן מה-id.
  }

  String? actCat(String id) {
    return actInCatalog ? id : null;
  }

  ConfigOp? run(Object? entry) => validateOp(
        entry,
        opFromJson: shape,
        matchElementId: elem,
        matchPropKey: prop,
        axisOf: axis,
        freeValueOk: free,
        resolveStyle: style,
        actionIdOf: actId,
        matchActionId: actElem,
        matchCatalogActionId: actCat,
      );

  // 1 — לא-מפה ⇒ null, אף שקע לא נקרא (edit_intent.dart:172).
  resetCounters();
  if (run('x') != null) _fail('1 non-map', run('x'), null);
  if (run(42) != null || run(null) != null || run(['a']) != null) {
    _fail('1 non-map variants', 'non-null', null);
  }
  if (shapeCalls != 0) _fail('1 shape not called', shapeCalls, 0);
  n++;

  // 2 — תג-לא-מוכר ⇒ opFromJson⇒null ⇒ null; matchElementId לא נקרא (:177-178).
  resetCounters();
  if (run({'op': 'zap', 'id': 'hero'}) != null) _fail('2 unknown tag', 'op', null);
  if (shapeCalls != 1 || elemCalls != 0) _fail('2 short-circuit', elemCalls, 0);
  n++;

  // 3 — id לא-ברג'יסטרי ⇒ null; matchPropKey לא נקרא (:182-183).
  resetCounters();
  if (run({'op': 'setText', 'id': 'ghost', 'text': 'a'}) != null) {
    _fail('3 ghost id', 'op', null);
  }
  if (propCalls != 0) _fail('3 prop not called', propCalls, 0);
  n++;

  // 4 — SetText תקין ⇒ id RESOLVED ('hero'⇒'home.hero') + הטקסט נשמר (:190-191).
  resetCounters();
  freeOk = true;
  final t4 = run({'op': 'setText', 'id': 'hero', 'text': 'שלום'});
  if (t4 is! SetText || t4.id != 'home.hero' || t4.text != 'שלום') {
    _fail('4 setText resolved', t4, "SetText('home.hero','שלום')");
  }
  if (lastFreeProp != 'text') _fail('4 free prop', lastFreeProp, 'text');
  n++;

  // 5 — freeValueOk שקר ⇒ null (:191).
  freeOk = false;
  if (run({'op': 'setText', 'id': 'hero', 'text': 'x'}) != null) {
    _fail('5 free veto', 'op', null);
  }
  freeOk = true;
  n++;

  // 6 — SetEmoji: הציר 'emoji' נמסר ל-freeValueOk; ‏RESOLVED (:193-194).
  resetCounters();
  final t6 = run({'op': 'setEmoji', 'id': 'hero', 'emoji': '🔥'});
  if (t6 is! SetEmoji || t6.id != 'home.hero' || t6.emoji != '🔥') {
    _fail('6 setEmoji', t6, "SetEmoji('home.hero','🔥')");
  }
  if (lastFreeProp != 'emoji') _fail('6 free prop', lastFreeProp, 'emoji');
  n++;

  // 7 — SetHidden/SetOrder עוברים ישירות; freeValueOk לא נקרא (:196-199).
  resetCounters();
  final t7 = run({'op': 'setHidden', 'id': 'hero', 'hidden': true});
  if (t7 is! SetHidden || t7.id != 'home.hero' || t7.hidden != true) {
    _fail('7 setHidden', t7, "SetHidden('home.hero',true)");
  }
  final t7b = run({'op': 'setOrder', 'id': 'hero', 'order': 3});
  if (t7b is! SetOrder || t7b.id != 'home.hero' || t7b.order != 3) {
    _fail('7 setOrder', t7b, "SetOrder('home.hero',3)");
  }
  if (freeCalls != 0) _fail('7 free not called', freeCalls, 0);
  n++;

  // 8 — ציר לא-עריך ⇒ null (:186): וטו על 'order'.
  vetoAxis = 'order';
  if (run({'op': 'setOrder', 'id': 'hero', 'order': 1}) != null) {
    _fail('8 axis veto', 'op', null);
  }
  vetoAxis = '';
  n++;

  // 9 — SetStyle: ‏ok:true ⇒ ה-style **מהשקע** (לא המקורי) + id RESOLVED (:200-203).
  resetCounters();
  styleOk = true;
  final orig = {'colorToken': 'brand'};
  final t9 = run({'op': 'setStyle', 'id': 'hero', 'style': orig});
  if (t9 is! SetStyle || t9.id != 'home.hero' ||
      !identical(t9.style, resolvedStyle)) {
    _fail('9 style resolved-through-socket', t9?.toString(), 'resolvedStyle');
  }
  n++;

  // 10 — resolveStyle ok:false ⇒ null (:202).
  styleOk = false;
  if (run({'op': 'setStyle', 'id': 'hero', 'style': orig}) != null) {
    _fail('10 style veto', 'op', null);
  }
  styleOk = true;
  n++;

  // 11 — SetAction תקין: kind = פתרון-על-האלמנט (onElement), לא ה-id הגולמי (:204-212).
  resetCounters();
  actOnElement = true;
  actInCatalog = true;
  final t11 = run({'op': 'setAction', 'id': 'hero', 'action': 'buy'});
  if (t11 is! SetAction || t11.id != 'home.hero' ||
      t11.action?.kind != 'checkout.buy') {
    _fail('11 setAction onElement kind', t11, "CfgAction(kind:'checkout.buy')");
  }
  n++;

  // 12 — action חסר/ריק ⇒ null; matchActionId לא נקרא (:207-208).
  resetCounters();
  if (run({'op': 'setAction', 'id': 'hero'}) != null) _fail('12 no id', 'op', null);
  if (run({'op': 'setAction', 'id': 'hero', 'action': '  '}) != null) {
    _fail('12 blank id', 'op', null);
  }
  if (actElemCalls != 0) _fail('12 short-circuit', actElemCalls, 0);
  n++;

  // 13 — לא-חוקי-על-האלמנט או לא-בקטלוג ⇒ null (:211): שני השערים חייבים שניהם.
  actOnElement = false;
  actInCatalog = true;
  if (run({'op': 'setAction', 'id': 'hero', 'action': 'buy'}) != null) {
    _fail('13 not-on-element', 'op', null);
  }
  actOnElement = true;
  actInCatalog = false;
  if (run({'op': 'setAction', 'id': 'hero', 'action': 'buy'}) != null) {
    _fail('13 not-in-catalog', 'op', null);
  }
  actOnElement = true;
  actInCatalog = true;
  n++;

  // 14 — נרמול-מפתחות (:173): מפתח לא-String מגיע ל-opFromJson כמחרוזת.
  Map<String, dynamic>? seen;
  final t14 = validateOp(
    <Object, Object?>{'op': 'setHidden', 'id': 'hero', 1: 'x', 'hidden': false},
    opFromJson: (m) {
      seen = m;
      return shape(m);
    },
    matchElementId: elem,
    matchPropKey: prop,
    axisOf: axis,
    freeValueOk: free,
    resolveStyle: style,
    actionIdOf: actId,
    matchActionId: actElem,
    matchCatalogActionId: actCat,
  );
  if (seen == null || !seen!.containsKey('1')) {
    _fail('14 key normalization', seen?.keys, "contains '1'");
  }
  if (t14 is! SetHidden || t14.hidden != false) {
    _fail('14 result', t14, "SetHidden('home.hero',false)");
  }
  n++;

  // 15 — ערכי-null עוברים (ניקוי-ציר): setText בלי text ⇒ SetText(target, null).
  freeOk = true;
  final t15 = run({'op': 'setText', 'id': 'hero'});
  if (t15 is! SetText || t15.text != null) _fail('15 null clear', t15, 'text=null');
  n++;

  assert(run('not-a-map') == null, 'assert-live guard');

  print('OK validateOp: $n asserts passed');
}
