// ⚛️ חלקיק פעולת-יסוד · נחצב ע"י ast_carve --ops מתוך 8 אטומים (למשל dart-maor/apply-ayin-sheet.dart#applyAyinSheet) · אפס-import · הביטוי-המקורי: spm['ayin'] == null
bool fieldIsNull(dynamic r, String key) => (r is Map ? r[key] : null) == null;
