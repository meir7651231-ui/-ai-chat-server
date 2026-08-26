import 'dart:convert';
import 'dart:io';
import 'sort-support-msgs.dart';

void main() {
  final txt = File('/tmp/claude-0/-home-user/65886fc0-dc27-5a35-9058-e6a50b9adaff/scratchpad/inputs.json').readAsStringSync();
  final List cases = jsonDecode(txt);
  final outputs = [];
  for (final c in cases) {
    final kind = c['kind'];
    final input = c['input'];
    final r = sortSupportMsgs(input);
    if (kind == 'str') {
      outputs.add(r);
    } else {
      outputs.add((r as List).map((o) {
        if (o is Map && o.containsKey('_i')) return o['_i'];
        return null;
      }).toList());
    }
  }
  print(jsonEncode(outputs));
}
