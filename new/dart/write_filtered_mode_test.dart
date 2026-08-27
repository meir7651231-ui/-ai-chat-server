// בדיקת-אטום · writeFilteredMode — מייבא רק את האטום.
import 'write_filtered_mode.dart';

/// fake מגובה-מפה של חוזה-ה-KV.
class _FakeKv implements EdgeKvStore {
  final Map<String, String> m = {};
  @override
  String? read(String key) => m[key];
  @override
  void write(String key, String value) => m[key] = value;
  @override
  void remove(String key) => m.remove(key);
}

void main() {
  final kv = _FakeKv();

  // הדלקה ⇒ '1' תחת המפתח.
  writeFilteredMode(kv, on: true);
  assert(kv.m[kFilteredModeKey] == '1');

  // כיבוי ⇒ מחיקת-מפתח (לא '0').
  writeFilteredMode(kv, on: false);
  assert(!kv.m.containsKey(kFilteredModeKey));

  // כיבוי על ריק ⇒ no-op בטוח.
  writeFilteredMode(kv, on: false);
  assert(kv.m.isEmpty);

  // הדלקה חוזרת ⇒ שוב '1'.
  writeFilteredMode(kv, on: true);
  assert(kv.m[kFilteredModeKey] == '1');
  print('write_filtered_mode OK');
}
