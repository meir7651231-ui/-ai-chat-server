// 📦 קופסת-חיבורים · bs-actions (בנייה-חכמה · סטודיו-הקופיילוט) — קטלוג-פעולות + סיווג-טווח.
// מקור-האמת: buildsmart/app_flutter/lib/logic/studio/* (action_catalog · edit_prompt ·
//   edit_intent · rules_model · registry_view) + logic/assistant_intent.
// מחווטת 11 אטומי-בנייה-חכמה מ-../dart/. שני אשכולות שמתחברים:
//   (א) קטלוג-הפעולות של הקופיילוט — מתאר · שם-מודל→enum · חילוץ-id · id-ים-מותרים · תווית · תת-קבוצה.
//   (ב) סיווג-טווח-העריכה (Stage-A) — reply→scope, scope→ids, ותוויות-עברית.
//
// ── הכרעות-קופסה (חוק-3/8 · ידע-קופסה) ─────────────────────────────────────────
// 1) אוצר-הטווחים: ערכי-ה-const המקוריים (kScopeAll/kScopeScreenPrefix/…) **אינם ניתנים
//    לשחזור** (קובצי-המקור נעדרו מה-checkout; grep ריק). האטומים הרימו אותם לשקעים.
//    הקופסה מכריעה אוצר **אחד לכיד** שמחבר את הצינור: classifyScope פולט
//    '<singlePrefix><id>' ⇒ scopeElementIds/scopeLabel/scopeHe צורכים בדיוק אותו.
// 2) _matchClosed — מקרקע-הקבוצה-הסגורה (registry_view.dart:237-260, verbatim מתוך
//    matchActionId/matchCatalogActionId האחים) הוא שכן module-private, לא אטום ⇒
//    מחודש כאן כדבק-חיווט וניזרק לשקע matchId של classifyScope.
import '../dart/action_descriptor.dart' as ad;
import '../dart/action_from_string.dart' as afs;
import '../dart/action_id_of.dart' as aio;
import '../dart/action_ids_for.dart' as aif;
import '../dart/action_label_he.dart' as alh;
import '../dart/catalog_action_ids_for.dart' as caif;
import '../dart/classify_scope.dart' as cs;
import '../dart/scope_element_ids.dart' as sei;
import '../dart/scope_he.dart' as sh;
import '../dart/scope_label.dart' as sl;
import '../dart/scope_token_he.dart' as sth;

// ── טיפוסי-הנתונים שהאטומים פועלים עליהם — נחשפים דרך הקופסה (data-shapes) ──────
export '../dart/action_descriptor.dart' show ActionDescriptor, ActionEffectKind;
export '../dart/action_from_string.dart' show AssistantAction;
export '../dart/catalog_action_ids_for.dart' show CatalogAction;

// ── אוצר-הטווחים הלכיד (הכרעת-קופסה 1) — אחד לכל הצינור ────────────────────────
const String _scopeAll = 'scope:all';
const String _scopeActionable = 'scope:actionable';
const String _everyPrefix = 'scope:every:';
const String _screenPrefix = 'scope:screen:';
const String _singlePrefix = 'scope:single:';

// ── דבק-החיווט (הכרעת-קופסה 2) — מקרקע-קבוצה-סגורה (verbatim registry_view.dart:237-260).
// מדויק גובר, אחרת ה-key הארוך-ביותר המוכל ב-reply; ריק ⇒ null (fail-closed).
String? _matchClosed(Iterable<String> ids, String reply) {
  final r = reply.trim();
  if (r.isEmpty) return null;
  for (final k in ids) {
    if (r == k) return k;
  }
  String? best;
  for (final k in ids) {
    if (k.isNotEmpty && r.contains(k) && (best == null || k.length > best.length)) {
      best = k;
    }
  }
  return best;
}

// ═══ אשכול א׳ · קטלוג-הפעולות של הקופיילוט ═══════════════════════════════════════

/// המתאר שה-id שלו זהה בדיוק ל-[id], או null (fail-closed). first-match-wins.
ad.ActionDescriptor? actionDescriptor(List<ad.ActionDescriptor> catalog, String id) =>
    ad.actionDescriptor(catalog, id);

/// שם-פעולה מתשובת-המודל ⇒ חבר-enum מהימן, או null (השוואה מדויקת · closed-set guard).
afs.AssistantAction? actionFromString(String s) => afs.actionFromString(s);

/// חילוץ מזהה-פעולה ממפת-op מפוענחת (String / Map.kind), מקוצץ; אחרת null.
String? actionIdOf(Map<String, dynamic> m) => aio.actionIdOf(m);

/// עותק חדש של הפעולות-המותרות לרכיב [id]; אין descriptor ⇒ קבוצה-ריקה.
/// [allowedActionsOf] = שקע-הרישום (קריאה-לשכן ⇒ פרמטר).
Set<String> actionIdsFor(
  String id,
  Iterable<String>? Function(String id) allowedActionsOf,
) =>
    aif.actionIdsFor(id, allowedActionsOf: allowedActionsOf);

/// תווית עברית של action-id-של-כלל; אין התאמה ⇒ ה-id הגולמי. [actions] = קטלוג-הכללים.
String actionLabelHe(String id, List<({String id, String labelHe})> actions) =>
    alh.actionLabelHe(id, actions: actions);

/// תת-קבוצת-הקטלוג החוקית להקשר-העריכה של אלמנט. [readOnly]=true ⇒ בלי מוטטורים;
/// [elementId] ריק ⇒ fail-closed (Set ריק). [catalog] = הקטלוג-הסגור (id · mutates).
Set<String> catalogActionIdsFor(
  String elementId, {
  required bool readOnly,
  required Iterable<caif.CatalogAction> catalog,
}) =>
    caif.catalogActionIdsFor(elementId, readOnly: readOnly, catalog: catalog);

// ═══ אשכול ב׳ · סיווג טווח-העריכה (Stage-A) ═════════════════════════════════════

/// מסווג reply של מודל ל-scope: token-רחב מוקדם, אחרת '<singlePrefix><id>' על id-אמת,
/// אחרת null (fail-closed → הבהרה). הקופסה מזריקה את אוצר-הטווחים ואת מקרקע-הקבוצה.
/// [scopeTokens] = טוקני-הטווח החיים · [registryIds] = מזהי-הרישום החיים.
String? classifyScope(
  String reply, {
  required List<String> scopeTokens,
  required List<String> registryIds,
}) =>
    cs.classifyScope(
      reply,
      scopeTokens: scopeTokens,
      registryIds: registryIds,
      scopeSinglePrefix: _singlePrefix,
      matchId: _matchClosed,
    );

/// קבוצת-המזהים בטווח [scope]: all ⇒ הכול · '<screenPrefix><ns>' ⇒ לפי-מרחב ·
/// '<singlePrefix><id>' ⇒ {id} אם קיים · אחרת ריק (fail-closed).
/// [ids] = מזהי-הרישום · [namespaceOf] = חילוץ-מרחב-שם ממזהה.
Set<String> scopeElementIds(
  String scope, {
  required Set<String> ids,
  required String Function(String id) namespaceOf,
}) =>
    sei.scopeElementIds(
      scope,
      ids: ids,
      namespaceOf: namespaceOf,
      all: _scopeAll,
      screenPrefix: _screenPrefix,
      singlePrefix: _singlePrefix,
    );

/// תווית-עברית מלאה של טוקן-טווח (all/actionable/every/screen/single), אחרת '(טווח לא מזוהה)'.
String scopeHe(String token) => sh.scopeHe(
      token,
      all: _scopeAll,
      actionable: _scopeActionable,
      everyPrefix: _everyPrefix,
      screenPrefix: _screenPrefix,
      singlePrefix: _singlePrefix,
    );

/// שורת-התצוגה 'מתוך: …' שלפני הדיף (all / מרחב / אלמנט-בודד / לא-מזוהה).
String scopeLabel(String scope) => sl.scopeLabel(
      scope,
      all: _scopeAll,
      screenPrefix: _screenPrefix,
      singlePrefix: _singlePrefix,
    );

/// תיאור-עברי קומפקטי לטוקן-טווח (all + מרחב מתורגמים; השאר fall-through verbatim).
String scopeTokenHe(String token) => sth.scopeTokenHe(
      token,
      all: _scopeAll,
      screenPrefix: _screenPrefix,
    );
