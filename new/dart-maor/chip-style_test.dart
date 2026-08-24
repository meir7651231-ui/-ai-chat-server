import 'dart:convert';
import 'chip-style.dart';

// רתמת-זהב: אותם קלטים→פלטים בדיוק כמו new/atoms/chip-style.test.mjs.
// כל [args, want] — args=[bg, c], want=JSON.stringify של הפלט במקור-ה-JS.
void main() {
  final cases = <List<dynamic>>[
    [["", ""], '{"display":"inline-block","padding":"3px 10px","borderRadius":999,"fontSize":12,"fontWeight":700,"background":"","color":"","whiteSpace":"nowrap"}'],
    [["", "אבג"], '{"display":"inline-block","padding":"3px 10px","borderRadius":999,"fontSize":12,"fontWeight":700,"background":"","color":"אבג","whiteSpace":"nowrap"}'],
    [["", "כהן לוי"], '{"display":"inline-block","padding":"3px 10px","borderRadius":999,"fontSize":12,"fontWeight":700,"background":"","color":"כהן לוי","whiteSpace":"nowrap"}'],
    [["", "abc"], '{"display":"inline-block","padding":"3px 10px","borderRadius":999,"fontSize":12,"fontWeight":700,"background":"","color":"abc","whiteSpace":"nowrap"}'],
    [["", "a@b.com"], '{"display":"inline-block","padding":"3px 10px","borderRadius":999,"fontSize":12,"fontWeight":700,"background":"","color":"a@b.com","whiteSpace":"nowrap"}'],
    [["", "2026-08-24"], '{"display":"inline-block","padding":"3px 10px","borderRadius":999,"fontSize":12,"fontWeight":700,"background":"","color":"2026-08-24","whiteSpace":"nowrap"}'],
    [["", "2026-08-24T12:00:00"], '{"display":"inline-block","padding":"3px 10px","borderRadius":999,"fontSize":12,"fontWeight":700,"background":"","color":"2026-08-24T12:00:00","whiteSpace":"nowrap"}'],
    [["", "0501234567"], '{"display":"inline-block","padding":"3px 10px","borderRadius":999,"fontSize":12,"fontWeight":700,"background":"","color":"0501234567","whiteSpace":"nowrap"}'],
    [["", "03-1234567"], '{"display":"inline-block","padding":"3px 10px","borderRadius":999,"fontSize":12,"fontWeight":700,"background":"","color":"03-1234567","whiteSpace":"nowrap"}'],
    [["", "https://x.co"], '{"display":"inline-block","padding":"3px 10px","borderRadius":999,"fontSize":12,"fontWeight":700,"background":"","color":"https://x.co","whiteSpace":"nowrap"}'],
    [["", "שלום עולם"], '{"display":"inline-block","padding":"3px 10px","borderRadius":999,"fontSize":12,"fontWeight":700,"background":"","color":"שלום עולם","whiteSpace":"nowrap"}'],
    [["", "12"], '{"display":"inline-block","padding":"3px 10px","borderRadius":999,"fontSize":12,"fontWeight":700,"background":"","color":"12","whiteSpace":"nowrap"}'],
  ];

  var f = 0;
  for (final cse in cases) {
    final args = cse[0] as List;
    final want = cse[1] as String;
    final got = jsonEncode(chipStyle(args[0] as String, args[1] as String));
    if (got != want) {
      print('✗ $args ⇒ $got ≠ $want');
      f = 1;
    }
  }
  if (f != 0) throw AssertionError('chip-style: הזהב אדום — Dart ≠ JS');
  print('✓ chip-style: ${cases.length} הקלטות-Golden — ירוק');
}
