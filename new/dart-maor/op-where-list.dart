// ⚛️ חלקיק פעולת-יסוד · נחצב ע"י ast_carve --ops מתוך 108 אטומים (למשל dart-maor/annual-report-lines.dart#annualReportLines) · אפס-import · הביטוי-המקורי: rows.where((d) => (d as Map)['cur'] != '\$')
List<dynamic> whereList(List<dynamic> xs, bool Function(dynamic) f) => xs.where(f).toList();
