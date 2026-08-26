// 📦 קופסת-חיבורים · bs-config (בנייה-חכמה · סטודיו-הקופיילוט) — פעולות-קונפיג · תבניות · כללים.
// מקור-האמת: buildsmart/app_flutter/lib/logic/studio/* (config_op · config_store ·
//   config_node · component_palette · rules_model · registry_view).
// מחווטת 11 אטומי-בנייה-חכמה מ-../dart/. שלושה אשכולות שמתחברים לצינור אחד:
//   (א) פעולות-הקונפיג — סריאליזציה/פענוח-אצווה (round-trip) + שוויון-ערך ל-undo/diff.
//   (ב) תבניות-הרכיבים — איתור-תבנית לפי-סוג / לפי-שם-סוג מתוך פלטת-הרכיבים.
//   (ג) מנוע-הכללים — ערך-שדה מספרי · תווית-שדה עברית · האם-הפעולה-מוטטת · תקציר-כלל · ערכים-מותרים.
//
// ── הכרעות-קופסה (חוק-3/8/9 · ידע-קופסה) ─────────────────────────────────────────
// כל אטומי-האשכול גנריים-לחלוטין (T/K/D + שקעים); טיפוסי-המקור הקונקרטיים
// (‏ConfigOp · CfgStyle/CfgAction · ComponentTemplate/ComponentType · kRuleFields/
//  kRuleActions/kRuleOpLabelsHe) **אינם ניתנים לשחזור** — קובצי-ה-studio נעדרו
// מה-checkout. הקופסה מכריעה **אוצר-טיפוסים לכיד אחד** שמחבר את שלושת הצינורות
// (בדיוק כפי ש-bs-actions הכריע אוצר-טווחים אחד ל-classifyScope→scopeElementIds):
//   1) `ConfigOp` = משפחה-סגורה בת-6 וריאנטים (config_store.dart SetText…SetAction);
//      ה-`toJson` שלה = ההופכי-המדויק של configOpFromJson ⇒ round-trip מוכח מקצה-לקצה.
//   2) `CfgStyle`/`CfgAction` = payload-מקונן עם value-== (config_node.dart) ⇒ שוויון-הערך
//      של configOpEquals מאציל אליהם.
//   3) אוצר-שדות-הכללים אחד — קבועי-המפתח `kField*` הם בדיוק ה-id-ים של `kRuleFields`,
//      כך ש-fieldValue ו-fieldLabelHe קוראים את אותה שפה.
import '../dart/allowed_values.dart' as av;
import '../dart/config_op_equals.dart' as coe;
import '../dart/config_op_from_json.dart' as cofj;
import '../dart/config_ops_from_json.dart' as cosfj;
import '../dart/config_ops_to_json.dart' as costj;
import '../dart/field_label_he.dart' as flh;
import '../dart/field_value.dart' as fv;
import '../dart/rule_action_is_mutating.dart' as raim;
import '../dart/rule_summary_he.dart' as rsh;
import '../dart/template_for.dart' as tf;
import '../dart/template_for_name.dart' as tfn;

// ═══ אשכול א׳ · פעולות-הקונפיג — האוצר-הלכיד (הכרעת-קופסה 1/2) ═══════════════════

/// מזהה-הווריאנט הסגור של פעולת-קונפיג (config_store.dart:49-150).
enum ConfigOpKind { setText, setEmoji, setHidden, setOrder, setStyle, setAction }

/// payload-סגנון מקונן עם **שוויון-ערך** (config_node.dart CfgStyle) — מפה מנורמלת.
class CfgStyle {
  const CfgStyle(this.props);
  final Map<String, dynamic> props;
  factory CfgStyle.fromJson(Map<String, dynamic> j) =>
      CfgStyle(Map<String, dynamic>.from(j));
  Map<String, dynamic> toJson() => Map<String, dynamic>.from(props);
  @override
  bool operator ==(Object o) => o is CfgStyle && _mapValueEq(props, o.props);
  @override
  int get hashCode =>
      Object.hashAllUnordered(props.entries.map((e) => Object.hash(e.key, e.value)));
}

/// payload-פעולה מקונן עם **שוויון-ערך** (config_node.dart CfgAction) — מפה מנורמלת.
class CfgAction {
  const CfgAction(this.props);
  final Map<String, dynamic> props;
  factory CfgAction.fromJson(Map<String, dynamic> j) =>
      CfgAction(Map<String, dynamic>.from(j));
  Map<String, dynamic> toJson() => Map<String, dynamic>.from(props);
  @override
  bool operator ==(Object o) => o is CfgAction && _mapValueEq(props, o.props);
  @override
  int get hashCode =>
      Object.hashAllUnordered(props.entries.map((e) => Object.hash(e.key, e.value)));
}

bool _mapValueEq(Map<String, dynamic> a, Map<String, dynamic> b) {
  if (a.length != b.length) return false;
  for (final e in a.entries) {
    if (!b.containsKey(e.key) || b[e.key] != e.value) return false;
  }
  return true;
}

/// המשפחה-הסגורה של פעולת-קונפיג — `id` + מזהה-וריאנט + payload-נשווה + `toJson`
/// שהוא ההופכי-המדויק של [configOpFromJson] (⇒ round-trip). הכרעת-קופסה 1.
sealed class ConfigOp {
  const ConfigOp(this.id);
  final String id;
  ConfigOpKind get kind;
  Object? get payload;
  Map<String, dynamic> toJson();
}

final class SetText extends ConfigOp {
  const SetText(super.id, this.text);
  final String? text;
  @override
  ConfigOpKind get kind => ConfigOpKind.setText;
  @override
  Object? get payload => text;
  @override
  Map<String, dynamic> toJson() => {'op': 'setText', 'id': id, 'text': text};
}

final class SetEmoji extends ConfigOp {
  const SetEmoji(super.id, this.emoji);
  final String? emoji;
  @override
  ConfigOpKind get kind => ConfigOpKind.setEmoji;
  @override
  Object? get payload => emoji;
  @override
  Map<String, dynamic> toJson() => {'op': 'setEmoji', 'id': id, 'emoji': emoji};
}

final class SetHidden extends ConfigOp {
  const SetHidden(super.id, this.hidden);
  final bool? hidden;
  @override
  ConfigOpKind get kind => ConfigOpKind.setHidden;
  @override
  Object? get payload => hidden;
  @override
  Map<String, dynamic> toJson() => {'op': 'setHidden', 'id': id, 'hidden': hidden};
}

final class SetOrder extends ConfigOp {
  const SetOrder(super.id, this.order);
  final int? order;
  @override
  ConfigOpKind get kind => ConfigOpKind.setOrder;
  @override
  Object? get payload => order;
  @override
  Map<String, dynamic> toJson() => {'op': 'setOrder', 'id': id, 'order': order};
}

final class SetStyle extends ConfigOp {
  const SetStyle(super.id, this.style);
  final CfgStyle? style;
  @override
  ConfigOpKind get kind => ConfigOpKind.setStyle;
  @override
  Object? get payload => style;
  @override
  Map<String, dynamic> toJson() =>
      {'op': 'setStyle', 'id': id, 'style': style?.toJson()};
}

final class SetAction extends ConfigOp {
  const SetAction(super.id, this.action);
  final CfgAction? action;
  @override
  ConfigOpKind get kind => ConfigOpKind.setAction;
  @override
  Object? get payload => action;
  @override
  Map<String, dynamic> toJson() =>
      {'op': 'setAction', 'id': id, 'action': action?.toJson()};
}

/// שוויון-**ערך** של שתי פעולות-קונפיג (ל-undo/diff): אותו וריאנט ∧ אותו id ∧ אותו
/// payload. וריאנטים-שונים ⇒ false ללא-תלות בשדות. payload מקונן מאציל ל-CfgStyle/
/// CfgAction `==`. מחווט את kindOf/idOf/payloadOf של הווריאנטים לאטום.
bool configOpEquals(ConfigOp a, ConfigOp b) => coe.configOpEquals<ConfigOp>(
      a,
      b,
      kindOf: (op) => op.kind,
      idOf: (op) => op.id,
      payloadOf: (op) => op.payload,
    );

/// פענוח-סובלני של [raw] לפעולת-קונפיג, או null כשאינו op-מוכר (לעולם לא זורק).
/// מחווט את שֵש בנאי-הווריאנטים כשקעים; setStyle/setAction מרכיבים CfgStyle/CfgAction
/// מהמפה-המנורמלת שהאטום מוסר (הרכבת-הקופסה מעל שמירת-הבית `is Map` של האטום).
ConfigOp? configOpFromJson(Object? raw) => cofj.configOpFromJson<ConfigOp>(
      raw,
      setText: (id, text) => SetText(id, text),
      setEmoji: (id, emoji) => SetEmoji(id, emoji),
      setHidden: (id, hidden) => SetHidden(id, hidden),
      setOrder: (id, order) => SetOrder(id, order),
      setStyle: (id, style) =>
          SetStyle(id, style == null ? null : CfgStyle.fromJson(style)),
      setAction: (id, action) =>
          SetAction(id, action == null ? null : CfgAction.fromJson(action)),
    );

/// פענוח-אצווה: הופכי-הרשימה של [configOpsToJson]. מפיל כל איבר לא-מוכר, שומר סדר,
/// קלט-שאינו-List ⇒ רשימה-ריקה. מחווט configOpFromJson כשקע-פענוח-האיבר.
List<ConfigOp> configOpsFromJson(Object? raw) =>
    cosfj.configOpsFromJson<ConfigOp>(raw, fromJson: configOpFromJson);

/// סריאליזציה של אצווה: 1:1, סדר-נשמר. מחווט את `op.toJson()` כשקע-הפר-איבר.
/// ההופכי המדויק של [configOpsFromJson] — round-trip ביט-שקול.
List<Map<String, dynamic>> configOpsToJson(List<ConfigOp> ops) =>
    costj.configOpsToJson<ConfigOp>(ops, toJson: (op) => op.toJson());

// ═══ אשכול ב׳ · תבניות-הרכיבים (הכרעת-קופסה: פלטה-אחת לשתי הבדיקות) ═══════════════

/// סוג-רכיב סגור (component_palette.dart ComponentType — enum, מקור נעדר).
enum ComponentType { button, text, image, container, input }

/// תבנית-רכיב: סוג + תווית-עברית (component_palette.dart ComponentTemplate).
class ComponentTemplate {
  const ComponentTemplate({required this.type, required this.he});
  final ComponentType type;
  final String he;
}

/// פלטת-הרכיבים הקנונית (הכרעת-קופסה — kComponentPalette; המקור נעדר). אוצר-אחד
/// שמזין גם את templateFor וגם את templateForName.
const List<ComponentTemplate> kComponentPalette = [
  ComponentTemplate(type: ComponentType.button, he: 'כפתור'),
  ComponentTemplate(type: ComponentType.text, he: 'טקסט'),
  ComponentTemplate(type: ComponentType.image, he: 'תמונה'),
  ComponentTemplate(type: ComponentType.container, he: 'מיכל'),
  ComponentTemplate(type: ComponentType.input, he: 'שדה-קלט'),
];

/// התבנית הראשונה שסוגה [type], או null. מחווט typeOf=(t)=>t.type על הפלטה.
ComponentTemplate? templateFor(ComponentType type,
        {List<ComponentTemplate>? palette}) =>
    tf.templateFor<ComponentTemplate, ComponentType>(
      type,
      palette: palette ?? kComponentPalette,
      typeOf: (t) => t.type,
    );

/// התבנית הראשונה ששם-סוגה == name.trim() (ריק/חוסר ⇒ null; לעולם לא זורק).
/// מחווט typeName=(t)=>t.type.name על אותה פלטה ⇒ לכיד עם [templateFor].
ComponentTemplate? templateForName(String name,
        {List<ComponentTemplate>? palette}) =>
    tfn.templateForName<ComponentTemplate>(
      name,
      palette: palette ?? kComponentPalette,
      typeName: (t) => t.type.name,
    );

// ═══ אשכול ג׳ · מנוע-הכללים (הכרעת-קופסה: אוצר-שדות/פעולות/אופרטורים אחד) ══════════

// אוצר-שדות-הכללים הלכיד — קבועי-המפתח הם בדיוק ה-id-ים של kRuleFields (חוק-9:
// הערכים אבדו במקור ⇒ הכרעת-קופסה, לא ניחוש). fieldValue ו-fieldLabelHe קוראים אותם.
const String kFieldAgeDays = 'ageDays';
const String kFieldSum = 'sum';
const String kFieldItems = 'items';

/// קטלוג-שדות-הכללים הקנוני (id → תווית-עברית).
const List<({String id, String labelHe})> kRuleFields = [
  (id: kFieldAgeDays, labelHe: 'גיל בימים'),
  (id: kFieldSum, labelHe: 'סכום'),
  (id: kFieldItems, labelHe: 'מספר פריטים'),
];

/// קטלוג-פעולות-הכללים הקנוני (id → האם-מוטטת).
const List<({String id, bool mutating})> kRuleActions = [
  (id: 'notify', mutating: false),
  (id: 'setStatus', mutating: true),
  (id: 'addTag', mutating: true),
  (id: 'block', mutating: true),
];

/// מפת אופרטור→תווית-עברית לתקציר-כלל (kRuleOpLabelsHe).
const Map<String, String> kRuleOpLabelsHe = {
  'gte': '≥',
  'lte': '≤',
  'gt': '>',
  'lt': '<',
  'eq': '=',
  'neq': '≠',
};

/// ישות-הזמנה מינימלית שהכלל נמדד עליה (rules_model.dart Order — צומצם לשלושת
/// השדות שהמנוע נוגע בהם).
class RuleOrder {
  const RuleOrder({this.createdAt, this.sum = 0, this.items = 0});
  final DateTime? createdAt;
  final num sum;
  final num items;
}

/// ערך-מספרי של שדה-כלל על הזמנה: גיל-בימים / סכום / פריטים; שדה לא-מוכר ⇒ 0.
/// מחווט את שקעי-הריאדר ואת אוצר-מפתחות-הקופסה לאטום.
num fieldValue(String field, RuleOrder order, DateTime now) =>
    fv.fieldValue<RuleOrder>(
      field,
      order,
      now,
      createdAt: (o) => o.createdAt,
      sum: (o) => o.sum,
      items: (o) => o.items,
      ageDaysField: kFieldAgeDays,
      sumField: kFieldSum,
      itemsField: kFieldItems,
    );

/// תווית-עברית של מזהה-שדה-כלל, או ה-id הגולמי. ברירת-המחדל = [kRuleFields].
String fieldLabelHe(String id,
        {List<({String id, String labelHe})>? fields}) =>
    flh.fieldLabelHe(id, fields: fields ?? kRuleFields);

/// האם הפעולה [actionId] מסומנת מוטטת (first-match; לא-מוכר ⇒ false).
/// ברירת-המחדל = [kRuleActions].
bool ruleActionIsMutating(String actionId,
        {List<({String id, bool mutating})>? actions}) =>
    raim.ruleActionIsMutating(actionId, actions: actions ?? kRuleActions);

/// תקציר-כלל עברי חד-שורתי:
/// `'<trigger> · <field> <op> <value> · <action>'`.
/// חיווט-פנימי: תווית-השדה נפתרת דרך [fieldLabelHe] (fieldId→label); האופרטור
/// דרך [kRuleOpLabelsHe] (חסר ⇒ גולמי). trigger/action מסופקים כבר-מתורגמים.
String ruleSummaryHe({
  required String triggerLabel,
  required String fieldId,
  required String opRaw,
  required Object value,
  required String actionLabel,
  List<({String id, String labelHe})>? fields,
  Map<String, String>? opLabels,
}) =>
    rsh.ruleSummaryHe(
      triggerLabel: triggerLabel,
      fieldLabel: fieldLabelHe(fieldId, fields: fields),
      opRaw: opRaw,
      value: value,
      actionLabel: actionLabel,
      opLabels: opLabels ?? kRuleOpLabelsHe,
    );

/// רשומת-מתאר-שדה: מפת propKey→ערכים-מותרים (allowed_values.dart טיפוס-השכן).
typedef FieldDescriptor = ({Map<String, Iterable<String>> allowedValues});

/// קבוצת-הערכים-המותרים של [propKey] במתאר של [id]; לא-נמצא/חסר ⇒ קבוצה-ריקה.
/// מחווט findDescriptor = חיפוש-מפה על אוסף-המתארים.
Set<String> allowedValues(
  String id,
  String propKey, {
  required Map<String, FieldDescriptor> descriptors,
}) =>
    av.allowedValues<Map<String, FieldDescriptor>>(
      id,
      propKey,
      descriptors: descriptors,
      findDescriptor: (m, k) => m[k],
    );
