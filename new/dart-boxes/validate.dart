// 📦 קופסת-חיבורים · validate (Dart) — מחווטת 5 אטומי-Dart. מקבילה ל-new/boxes/validate.mjs.
part 'atoms.dart';
const _titles = {'הרב', 'מר', 'משפחת', 'גב׳'};
String vNormSearch(dynamic t) => normSearch(t);
String vNormName(dynamic t) => normName(t, normSearch);
String vNameSortKey(dynamic t) => nameSortKey(t, normSearch, _titles);
bool vValidId(dynamic id) => validIsraeliId(id);
String vFormatPhone(dynamic raw) => formatIsraeliPhone(raw);
