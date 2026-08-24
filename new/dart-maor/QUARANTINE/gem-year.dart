// חוט · gem-year — שנה עברית⇒גימטריה מקוצרת (mod 1000). חוזה: gem-year.contract.md
// המרה מ-JS (new/atoms/gem-year.mjs) — התנהגות זהה-לחלוטין למקור (חוק-4).
// השכן gem (חוט gematria) מוזרק כשקע (חוק-1 — אפס import פנימי). אפס-import (dart-core בלבד).
String gemYear(Object y, String Function(num) gem) {
  // JS: gem(+y % 1000) — unary-plus מקדים ל-%: ((+y) % 1000). מחרוזת-ספרתית מומרת למספר.
  final num n = (y is num ? y : num.parse(y.toString())) % 1000;
  return gem(n);
}
