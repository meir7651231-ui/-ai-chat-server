/// חוט · size-label — תווית גודל-ארגון מ-id (לוח-הבקרה).
/// המרה נאמנה מ-new/atoms/size-label.mjs (חוק-4: המקור קדוש).
/// הקבוע-השכן ORG_SIZES (רשימת-הגדלים של אשף-ההרשמה) מוזרק כשקע-נתונים (חוק-1: אפס import פנימי).
///
/// המקור: sizes.find((s) => s.id === id)?.label ?? id ?? '—'
///   - נמצא + יש label ⇒ ה-label.
///   - נמצא בלי label / לא-נמצא ⇒ ?.label undefined ⇒ ?? id.
///   - id הוא null/undefined ⇒ ?? '—'.  (‏?? תופס רק null/undefined — מחרוזת-ריקה חוזרת כמו-שהיא.)
/// undefined של JS ⇒ null של Dart (id הוא String?).
String sizeLabel(String? id, List<Map<String, dynamic>> sizes) {
  for (final s in sizes) {
    if (s['id'] == id) {
      final label = s['label'];
      // ?.label: נמצא אך label null/undefined ⇒ נופל ל-?? id (break), לא ''.
      if (label != null) return label as String;
      break;
    }
  }
  // ?? id ?? '—' : id מחרוזת (כולל '') חוזר כמו-שהוא; null בלבד ⇒ '—'.
  return id ?? '—';
}
