// ⚛️ חלקיק פעולת-יסוד · נחצב ע"י ast_carve (carve) מתוך dart-maor/task-overdue.dart#_falsy · פרטי⇒ציבורי · אפס-import
bool falsy(dynamic v) =>
    v == null || v == false || v == '' || (v is num && (v == 0 || v.isNaN));
