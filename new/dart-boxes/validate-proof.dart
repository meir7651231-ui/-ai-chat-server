import 'dart:convert';
String normSearch(dynamic t) {
  const finals = {'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ'};
  return (t ?? '').toString()
      .toLowerCase()
      .replaceAll(RegExp(r'[֑-ׇ]'), '')
      .replaceAllMapped(RegExp(r'[ךםןףץ]'), (m) => finals[m[0]]!)
      .replaceAll(RegExp('[\'"׳״\\-–._]'), '')
      .trim();
}
String normName(dynamic t, String Function(dynamic) normSearch) =>
    normSearch(t).replaceAll(RegExp(r'\s'), '');
String nameSortKey(dynamic t, String Function(dynamic) normSearch, Set<String> nameTitles) {
  final tokens = normSearch(t)
      .split(RegExp(r'\s+'))
      .where((w) => w.isNotEmpty && !nameTitles.contains(w))
      .toList();
  tokens.sort();
  return tokens.join(' ');
}
bool validIsraeliId(dynamic id) {
  final s = id.toString().trim();
  if (!RegExp(r'^\d{5,9}$').hasMatch(s)) return false;
  if (!RegExp(r'[1-9]').hasMatch(s)) return false; // אפסים-בלבד לא-תקין
  final p = s.padLeft(9, '0');
  var sum = 0;
  for (var i = 0; i < 9; i++) {
    var d = int.parse(p[i]) * (i % 2 == 0 ? 1 : 2);
    if (d > 9) d -= 9;
    sum += d;
  }
  return sum % 10 == 0;
}
String formatIsraeliPhone(dynamic raw) {
  final s = (raw ?? '').toString().trim();
  var d = s.replaceAll(RegExp(r'\D'), '');
  if (d.startsWith('00972')) d = '0' + d.substring(5);
  else if (d.startsWith('972')) d = '0' + d.substring(3);
  if (d.isEmpty) return s;
  if (d[0] == '0') {
    if (d.length == 10) return d.substring(0, 3) + '-' + d.substring(3);
    if (d.length == 9) return d.substring(0, 2) + '-' + d.substring(2);
    return d;
  }
  if (d.length == 9) return '0' + d.substring(0, 2) + '-' + d.substring(2);
  if (d.length == 8) return '0' + d[0] + '-' + d.substring(1);
  return s;
}
const _titles = {'הרב', 'מר', 'משפחת', 'גב׳'};
void main() {
  final out = {
    'id': ['123456782','000000000','12345','abc','1','123456789'].map((x)=>validIsraeliId(x)).toList(),
    'phone': ['0501234567','+972501234567','00972501234567','03-1234567','','1234'].map((x)=>formatIsraeliPhone(x)).toList(),
    'sort': ['הרב משה כהן','רחל בן צבי','שלום עולם'].map((x)=>nameSortKey(x, normSearch, _titles)).toList(),
    'norm': ['שָׁלוֹם','ןףץ','a-b_c','  x  '].map((x)=>normSearch(x)).toList(),
  };
  print(jsonEncode(out));
}
