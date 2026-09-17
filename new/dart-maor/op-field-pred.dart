// ⚛️ חלקיק פעולת-יסוד · נחצב ע"י ast_carve --ops מתוך 118 אטומים (למשל dart-maor/all-sup-phones.dart#allSupPhones) · אפס-import · הביטוי-המקורי: _truthy(m['wa'])
bool fieldPred(dynamic r, String key, bool Function(dynamic) f) => f(r is Map ? r[key] : null);
