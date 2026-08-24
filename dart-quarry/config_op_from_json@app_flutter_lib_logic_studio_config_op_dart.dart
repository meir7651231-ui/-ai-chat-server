// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · configOpFromJson — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/config_op.dart:77-109 (33 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toString, toInt, fromJson
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
ConfigOp? configOpFromJson(Object? raw) {
  if (raw is! Map) return null;
  final j = raw.map((k, v) => MapEntry(k.toString(), v));

  final rawId = j['id'];
  if (rawId is! String || rawId.isEmpty) return null; // fail-closed on identity
  final id = rawId;

  switch (j['op']) {
    case 'setText':
      final t = j['text'];
      return SetText(id, t is String ? t : null);
    case 'setEmoji':
      final e = j['emoji'];
      return SetEmoji(id, e is String ? e : null);
    case 'setHidden':
      final h = j['hidden'];
      return SetHidden(id, h is bool ? h : null);
    case 'setOrder':
      final o = j['order'];
      return SetOrder(id, o is num ? o.toInt() : null);
    case 'setStyle':
      final s = j['style'];
      return SetStyle(id, s is Map ? CfgStyle.fromJson(_strMap(s)) : null);
    case 'setAction':
      final a = j['action'];
      return SetAction(id, a is Map ? CfgAction.fromJson(_strMap(a)) : null);
    default:
      return null; // unknown / missing tag → drop (degrade, never throw)
  }
}

/// Serialise a batch (a draft's op-list) — 1:1, order preserved.
