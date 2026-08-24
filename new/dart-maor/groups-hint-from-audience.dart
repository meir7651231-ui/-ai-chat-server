/// חוט · groups-hint-from-audience — הצעת מספר-קבוצות מטקסט קהל-היעד.
/// המרה נאמנה מ-new/atoms/groups-hint-from-audience.mjs (חוק-4: המקור קדוש).
/// regex 'קבוצות|פעמים' מהלגאסי; הצעה בלבד, מחוץ ל-2–12 ⇒ null. אפס import.
int? groupsHintFromAudience(String? audience) {
  final m = RegExp(r'(\d+)\s*(?:קבוצות|פעמים)').firstMatch(audience ?? '');
  if (m == null) return null;
  final n = int.parse(m.group(1)!);
  return n >= 2 && n <= 12 ? n : null;
}
