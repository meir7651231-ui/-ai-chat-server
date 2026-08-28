// בדיקת-חוזה · couplingFor — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/coupling_for_test.dart
import 'coupling_for.dart';

class _Prod {
  final String sku;
  final bool pipe;
  const _Prod(this.sku, {this.pipe = false});
}

const _drainage = {'PVC', 'PP', 'רב-שכבתי', 'ceramic'}; // ערך-המקור (:991)

const _hd50 = ConnEnd(EndType.hdpeCompression, '50');
const _bsp50 = ConnEnd(EndType.bspMale, '50');

final Map<String, ConnSpec> _specs = {
  'PIPE50': const ConnSpec('PVC', [_hd50, _hd50]),
  'ELBOW1': const ConnSpec('PVC', [_hd50]),
  'STRAIGHT': const ConnSpec('PVC', [_hd50, _hd50]),
  // 'NOSPEC' — חסר במפה ⇒ specOf מחזיר null.
  'PPFIT': const ConnSpec('PP', [_hd50, _hd50]),
  'PEXFIT': const ConnSpec('PEX', [_hd50, _hd50]),
  'BSP50': const ConnSpec('PVC', [_bsp50, _bsp50]),
  'ELBOW2': const ConnSpec('PVC', [_hd50]),
};

const _full = [
  _Prod('PIPE50', pipe: true),
  _Prod('ELBOW1'),
  _Prod('STRAIGHT'),
  _Prod('NOSPEC'),
  _Prod('PPFIT'),
  _Prod('PEXFIT'),
  _Prod('BSP50'),
  _Prod('ELBOW2'),
];

String? _run(String dn, Set<String> mats, List<_Prod> catalog) =>
    couplingFor<_Prod>(dn, mats,
        catalog: catalog,
        isPipe: (p) => p.pipe,
        specOf: (p) => _specs[p.sku],
        drainageFamily: _drainage)?.sku;

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  // 1 · מצמד-ישר עוקף fallback שנתפס קודם (:1060 גובר על :1061).
  _eq(_run('50', {'PVC'}, _full), 'STRAIGHT', '1 straight wins');            n++;
  // 2 · בלי מצמד-ישר תואם ⇒ ה-fallback ה-ראשון (??= — לא ELBOW2, :1061-1062).
  _eq(
      _run('50', {'PVC'},
          const [_Prod('ELBOW1'), _Prod('BSP50'), _Prod('ELBOW2')]),
      'ELBOW1',
      '2 first fallback kept');                                              n++;
  // 3 · צינור מדולג גם כשקצוותיו מושלמים (:1050).
  _eq(_run('50', {'PVC'}, const [_Prod('PIPE50', pipe: true)]), null,
      '3 pipe skipped');                                                     n++;
  // 4 · חציית-משפחת-ניקוז: spec=PP, mats={רב-שכבתי} ⇒ תואם (:1054-1055).
  _eq(_run('50', {'רב-שכבתי'}, const [_Prod('PPFIT')]), 'PPFIT',
      '4 drainage-family cross');                                            n++;
  // 5 · דו-צדדיות-הניקוז: spec=PP בניקוז אבל mats={PEX} לא ⇒ נדחה.
  _eq(_run('50', {'PEX'}, const [_Prod('PPFIT')]), null,
      '5 one-sided drainage rejected');                                      n++;
  // 6 · קצה-תבריג (bspMale) בגודל-נכון אינו נספר (:1057-1059).
  _eq(_run('50', {'PVC'}, const [_Prod('BSP50')]), null,
      '6 thread end not counted');                                           n++;
  // 7 · אין קצה בגודל המבוקש ⇒ null (:1058).
  _eq(_run('40', {'PVC'}, _full), null, '7 no DN match');                    n++;
  // 8 · אין spec ⇒ דילוג ⇒ null (:1052).
  _eq(_run('50', {'PVC'}, const [_Prod('NOSPEC')]), null, '8 no spec');      n++;
  // 9 · חומר תואם-ישיר שאינו במשפחת-הניקוז (PEX↔PEX) עובר בשער-הראשון (:1054).
  _eq(_run('50', {'PEX'}, const [_Prod('PEXFIT')]), 'PEXFIT',
      '9 direct material match');                                            n++;
  // 10 · קטלוג ריק ⇒ null (:1062).
  _eq(_run('50', {'PVC'}, const []), null, '10 empty catalog');              n++;

  assert(_run('50', {'PVC'}, _full) == 'STRAIGHT', 'assert-live guard');
  print('OK couplingFor: $n asserts passed');
}
