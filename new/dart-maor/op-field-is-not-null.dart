// ⚛️ חלקיק פעולת-יסוד · נחצב ע"י ast_carve --ops מתוך 7 אטומים (למשל dart-maor/apply-ayin-sheet.dart#applyAyinSheet) · אפס-import · הביטוי-המקורי: um['eyes'] != null
bool fieldIsNotNull(dynamic r, String key) => (r is Map ? r[key] : null) != null;
