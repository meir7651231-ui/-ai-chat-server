import 'deliver-receipt.dart';

/// רתמת-זהב: אותן דוגמאות-חוזה בדיוק מ-new/atoms/deliver-receipt.test.mjs.
/// זהות-אובייקט (=== במקור) ⇒ identical() ב-Dart.
void main() {
  final o = {'rid': 'R-7', 'ils': 180};

  ({List prints, List downloads}) run(dynamic fmt) {
    final prints = [];
    final downloads = [];
    deliverReceipt(o, fmt, (x) => prints.add(x), (x) => downloads.add(x));
    return (prints: prints, downloads: downloads);
  }

  var f = 0;
  void chk(String name, bool cond) {
    if (!cond) {
      print('✗ $name');
      f = 1;
    }
  }

  // 1) pdf ⇒ הדפסה בלבד, עם בדיוק o
  {
    final r = run('pdf');
    chk('1 pdf ⇒ הדפסה',
        r.prints.length == 1 && identical(r.prints[0], o) && r.downloads.isEmpty);
  }
  // 2) txt ⇒ הורדה בלבד
  {
    final r = run('txt');
    chk('2 txt ⇒ הורדה',
        r.downloads.length == 1 && identical(r.downloads[0], o) && r.prints.isEmpty);
  }
  // 3) חסר (null) ⇒ הורדה (ברירת-המחדל ההיסטורית)
  {
    final r = run(null);
    chk('3 חסר ⇒ הורדה',
        r.downloads.length == 1 && identical(r.downloads[0], o) && r.prints.isEmpty);
  }
  // 4) השוואה קפדנית — 'PDF' ברישיות שונה איננו pdf
  {
    final r = run('PDF');
    chk("4 'PDF' ⇒ הורדה", r.downloads.length == 1 && r.prints.isEmpty);
  }

  if (f != 0) throw StateError('deliver-receipt: סטייה מהמקור');
  print('✓ deliver-receipt: 4 דוגמאות-חוזה (שקעי הדפסה/הורדה) — ירוק');
}
