import '../dart-data-maor/sup-dup-fields-sockets.dart' as skb_sdf;
import '../dart-data-maor/dup-fields-sockets.dart' as skb_df;
import '../dart-data-maor/merge-families-terms.dart';
// 📦 קופסת-חיבורים · dedup (Dart) — מחווטת 17 אטומי-Dart. מקבילה ל-new/boxes/dedup.mjs.
// חוזה משותף: new/boxes/dedup.contract.md. מקור-האמת: maor/src/lib/dedup.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// דבקי-החיווט (phonesOf/nameCityKey/dedupById) + מילון NAME_TITLES = ידע-קופסה (חוק-5),
// לא אטומים. פער-הייצוג רשומה↔Map של שדות-המיזוג — מגושר כאן (הקופסה מיישרת).
import '../dart-maor/norm-phone.dart' as np;
import '../dart-maor/norm-id.dart' as ni;
import '../dart-maor/find-duplicate-groups.dart' as fdg;
import '../dart-maor/merge-families.dart' as mf;
import '../dart-maor/dup-field-value.dart' as dfv;
import '../dart-maor/dup-fields.dart' as df;
import '../dart-maor/merge-families-by-fields.dart' as mfbf;
import '../dart-maor/find-supporter-dup-groups.dart' as fsdg;
import '../dart-maor/merge-supporter-into.dart' as msi;
import '../dart-maor/merge-supporters-group.dart' as msg;
import '../dart-maor/sup-dup-fields.dart' as sdf;
import '../dart-maor/sup-dup-field-value.dart' as sdfv;
import '../dart-maor/merge-supporters-by-fields.dart' as msbf;
import '../dart-maor/merge-hist.dart' as mh;
import '../dart-maor/photo-max.dart' as pm;
import '../dart-maor/name-sort-key.dart' as nsk;
import '../dart-maor/norm-search.dart' as ns;

// ── מילון-החיווט (verbatim מהמקור; ידע-קופסה — חוק-5) ────────────────────────
const Set<String> _nameTitles = {
  'ר', 'רבי', 'הרב', 'הרבנית', 'הרהג', 'הרהח', 'הגר', 'מוהרר', 'אדמור', 'מרת', 'מר', 'גב', 'הגב',
  'דר', 'פרופ', 'הבחור', 'הבהח', 'הת', 'משפ', 'משפחת',
  'שליטא', 'זצל', 'זצוקל', 'זקל', 'זל', 'עה', 'היד', 'נרו', 'ניו', 'ני', 'היו',
};

// ── דבקי-הצמדה (glue) — שכנים module-private במקור, לא אטומים ──────────────────
List<String> _phonesOf(dynamic f) =>
    [np.normPhone(f['phone'] as String?), np.normPhone(f['phone2'] as String?)]
        .where((p) => p.length >= 7)
        .toList();
String _nameCityKey(dynamic f) {
  final n = ((f['name'] ?? '') as String).trim().replaceAll(RegExp(r'\s+'), ' ').toLowerCase();
  final c = ((f['city'] ?? '') as String).trim().toLowerCase();
  return n.isNotEmpty && c.isNotEmpty ? '$n|$c' : '';
}

String _supNameCityKey(Map<String, dynamic> sp) {
  final n = ((sp['name'] ?? '') as String).trim().replaceAll(RegExp(r'\s+'), ' ').toLowerCase();
  final c = ((sp['city'] ?? '') as String).trim().toLowerCase();
  return n.isNotEmpty && c.isNotEmpty ? '$n|$c' : '';
}
List<dynamic> _dedupById(List<dynamic> items) {
  final seen = <dynamic>{};
  final out = <dynamic>[];
  for (final it in items) {
    if (seen.contains(it['id'])) continue;
    seen.add(it['id']);
    out.add(it);
  }
  return out;
}
String _nameSortKey(dynamic t) => nsk.nameSortKey(t, ns.normSearch, _nameTitles);

// ── מתאמי-טיפוס לשקעים (Dart קשיח-טיפוס) ─────────────────────────────────────
String _npDyn(dynamic s) => np.normPhone(s as String?);
String _niDyn(dynamic s) => ni.normId(s as String?);
List<dynamic> _mh(dynamic a, dynamic b) => mh.mergeHist(a, b);

// ── גישור פער-הייצוג: רשומות-שדה → Maps (מה שהאטומים-הצרכנים מצפים) ────────────
final List<Map<String, dynamic>> _dupFieldMaps = [
  for (final fld in DUP_FIELDS)
    <String, dynamic>{'key': fld.key, 'label': fld.label, 'get': (dynamic x) => fld.get(x as Map<String, dynamic>)},
];
final List<Map<String, dynamic>> _supDupFieldMaps = [
  for (final fld in SUP_DUP_FIELDS)
    <String, dynamic>{'key': fld.key, 'label': fld.label, 'get': (dynamic x) => fld.get(x as Map<String, dynamic>)},
];

// ── ה-API הפומבי (ביט-זהה לחתימות dedup.ts) ──────────────────────────────────
String normPhone(String? s) => np.normPhone(s);
String normId(String? s) => ni.normId(s);
final List<df.DupField> DUP_FIELDS = df.makeDupFields(skb_df.dupFields_T); // ignore: constant_identifier_names, non_constant_identifier_names
final List<sdf.SupDupField> SUP_DUP_FIELDS = sdf.makeSupDupFields(skb_sdf.supDupFields_T); // ignore: non_constant_identifier_names
dynamic dupFieldValue(List fams, Map def, Map pick, Map edit) => dfv.dupFieldValue(fams, def, pick, edit);
dynamic supDupFieldValue(dynamic sups, dynamic def, dynamic pick, dynamic edit) =>
    sdfv.supDupFieldValue(sups, def, pick, edit);

List<List<String>> findDuplicateGroups(List families) =>
    fdg.findDuplicateGroups(families, _phonesOf, _nameCityKey);

Map<String, dynamic> mergeFamilies(Map<String, dynamic> keeper, List<Map<String, dynamic>> losers) =>
    mf.mergeFamilies(keeper, losers, np.normPhone, _dedupById, term: (k)=>kTerms[k]!);

Map<String, dynamic> mergeFamiliesByFields(List fams, Map pick, Map edit) => mfbf.mergeFamiliesByFields(
      fams, pick, edit, {
        'mergeFamilies': (dynamic k, dynamic l) =>
            mergeFamilies(k as Map<String, dynamic>, (l as List).cast<Map<String, dynamic>>()),
        'dupFieldValue': (dynamic a, dynamic b, dynamic c, dynamic d) =>
            dupFieldValue(a as List, b as Map, c as Map, d as Map),
        'dupFields': _dupFieldMaps,
      });

List<List<dynamic>> findSupporterDupGroups(List<Map<String, dynamic>> supporters) =>
    fsdg.findSupporterDupGroups(supporters,
        normPhone: _npDyn, normId: _niDyn, supNameCityKey: _supNameCityKey, nameSortKey: _nameSortKey);

Map<String, dynamic> mergeSupporterInto(Map<String, dynamic> keep, Map<String, dynamic> drop) =>
    msi.mergeSupporterInto(keep, drop, _mh, pm.photoMax);

dynamic mergeSupportersGroup(dynamic keeper, List losers) => msg.mergeSupportersGroup(
      keeper, losers, (dynamic a, dynamic b) => mergeSupporterInto(a as Map<String, dynamic>, b as Map<String, dynamic>));

Map<String, dynamic> mergeSupportersByFields(List sups, Map pick, Map edit) => msbf.mergeSupportersByFields(
      sups, pick, edit,
      (dynamic k, dynamic l) => mergeSupportersGroup(k, l as List),
      (dynamic a, dynamic b, dynamic c, dynamic d) => supDupFieldValue(a, b, c, d),
      _supDupFieldMaps,
    );
