// חוט · hok-method-label — תווית שיטת הו"ק (בנק/אשראי/מזומן/אחר). חוזה: hok-method-label.contract.md
// המרה מ-JS (new/atoms/hok-method-label.mjs) — התנהגות זהה-לחלוטין למקור (חוק-4). אפס-import (dart-core בלבד).
String hokMethodLabel(String m) {
  if (m == 'bank') return 'הו"ק בנקאית';
  if (m == 'card') return 'אשראי בסליקה';
  if (m == 'cash') return 'מזומן חודשי';
  // JS `m || 'אחר'`: מחרוזת ריקה = falsy ⇒ 'אחר'; אחרת m עצמו (כלל-7: truthiness מפורש).
  return m.isEmpty ? 'אחר' : m;
}
