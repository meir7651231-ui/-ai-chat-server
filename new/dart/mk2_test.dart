import 'mk2.dart';

// מימוש-אמת לשקע mk — verbatim מהמקור (_mk).
Envelope? mk(double? axial, double? dia, [double? sec]) =>
    (axial == null || dia == null)
        ? null
        : Envelope(axialLength: axial, radialDiameter: dia, secondaryExtent: sec);

void main() {
  // axialUnit=null ⇒ null (מבלי לקרוא ל-mk).
  assert(mk2(null, 2, 10, null, mk: mk) == null);
  // 5*2=10, dia=20, sec=3 ⇒ Envelope(10,20,3).
  final e = mk2(5, 2, 20, 3, mk: mk);
  assert(e != null && e.axialLength == 10 && e.radialDiameter == 20 && e.secondaryExtent == 3);
  // dia=null ⇒ mk מחזיר null גם כשה-axial תקין.
  assert(mk2(5, 2, null, null, mk: mk) == null);
  print('mk2 OK');
}
