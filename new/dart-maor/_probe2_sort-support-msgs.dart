import 'dart:convert';
import 'dart:io';
import 'sort-support-msgs.dart';
void main(){
  final List cases = jsonDecode(File('/tmp/claude-0/-home-user/65886fc0-dc27-5a35-9058-e6a50b9adaff/scratchpad/inputs2.json').readAsStringSync());
  final out=[];
  for(final c in cases){
    final r = sortSupportMsgs(c['input']);
    out.add((r as List).map((o)=> (o is Map && o.containsKey('_i'))? o['_i']:null).toList());
  }
  print(jsonEncode(out));
}
