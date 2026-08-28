// בדיקת-חוזה · realPipeOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/real_pipe_of_test.dart
import 'real_pipe_of.dart';

class _Prod {
  final String sku;
  final bool pipe; // מגלם את פסק _isPipeProductE — מוזרק דרך שקע isPipe
  const _Prod(this.sku, {this.pipe = true});
  @override
  String toString() => sku;
}

// _kDrainageFamily של-המקור (install_engine.dart:991) — מוזרק, לא-צרוב.
const _fam = {'PVC', 'PP', 'רב-שכבתי', 'ceramic'};

const _hd = EndType.hdpeCompression;

_Prod? _run(
  List<_Prod> catalog,
  Map<String, PipeSpecView> specs,
  String dn,
  Set<String> mats,
) =>
    realPipeOf<_Prod>(
      dn,
      mats,
      catalog: catalog,
      isPipe: (p) => p.pipe,
      specOf: (p) => specs[p.sku],
      drainageFamily: _fam,
    );

void _eq(Object? got, Object? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  final pvc110 = const _Prod('PVC-110');
  final specs = <String, PipeSpecView>{
    'PVC-110': const PipeSpecView('PVC', [ConnEnd(_hd, '110')]),
  };

  // 1 — התאמה-ישירה: חומר ∈ mats + קצה hdpe בגודל dn ⇒ המוצר.
  _eq(_run([pvc110], specs, '110', {'PVC'}), pvc110, '1 direct material+DN'); n++;

  // 2 — לא-צינור מדולג (isPipe=false) ⇒ null.
  final notPipe = const _Prod('PVC-110', pipe: false);
  _eq(_run([notPipe], specs, '110', {'PVC'}), null, '2 non-pipe skipped'); n++;

  // 3 — חסר-spec מדולג ⇒ null.
  _eq(_run([const _Prod('NO-SPEC')], specs, '110', {'PVC'}), null, '3 no spec'); n++;

  // 4 — צלב-משפחת-ניקוז: spec=PVC, mats={PP} — שניהם בניקוז ⇒ תואם.
  _eq(_run([pvc110], specs, '110', {'PP'}), pvc110, '4 drainage cross-family'); n++;

  // 4ב — גם 'רב-שכבתי' חבר-משפחה ⇒ תואם.
  _eq(_run([pvc110], specs, '110', {'רב-שכבתי'}), pvc110, '4b multilayer member'); n++;

  // 5 — spec=PVC, mats={HDPE} — אין חבר-ניקוז ב-mats ⇒ null.
  _eq(_run([pvc110], specs, '110', {'HDPE'}), null, '5 no drainage member in mats'); n++;

  // 6 — התאמה-ישירה לחומר-לא-ניקוזי (HDPE∈mats) ⇒ המוצר.
  final hd32 = const _Prod('HD-32');
  final specs2 = <String, PipeSpecView>{
    'HD-32': const PipeSpecView('HDPE', [ConnEnd(_hd, '32')]),
  };
  _eq(_run([hd32], specs2, '32', {'HDPE'}), hd32, '6 direct non-drainage'); n++;

  // 7 — גודל-לא-תואם ⇒ null.
  _eq(_run([pvc110], specs, '50', {'PVC'}), null, '7 DN mismatch'); n++;

  // 8 — סוג-קצה-לא-hdpe (bspMale באותו-גודל) ⇒ null.
  final thr = const _Prod('THR-110');
  final specs3 = <String, PipeSpecView>{
    'THR-110': const PipeSpecView('PVC', [ConnEnd(EndType.bspMale, '110')]),
  };
  _eq(_run([thr], specs3, '110', {'PVC'}), null, '8 non-hdpe end type'); n++;

  // 9 — שני-תואמים ⇒ הראשון-בסדר-הסריקה.
  final pvc110b = const _Prod('PVC-110-B');
  final specs4 = <String, PipeSpecView>{
    'PVC-110': const PipeSpecView('PVC', [ConnEnd(_hd, '110')]),
    'PVC-110-B': const PipeSpecView('PVC', [ConnEnd(_hd, '110')]),
  };
  _eq(_run([pvc110, pvc110b], specs4, '110', {'PVC'}), pvc110, '9 first wins'); n++;
  _eq(_run([pvc110b, pvc110], specs4, '110', {'PVC'}), pvc110b, '9b scan order'); n++;

  // 10 — קטלוג-ריק ⇒ null.
  _eq(_run([], specs, '110', {'PVC'}), null, '10 empty catalog'); n++;

  // 11 — הלא-תואם מדולג וממשיכים לתואם-הבא (סריקה, לא-עצירה).
  _eq(_run([notPipe, const _Prod('NO-SPEC'), pvc110], specs, '110', {'PVC'}),
      pvc110, '11 skips then finds'); n++;

  // 12 — mats ריק ⇒ אין-תאימות ⇒ null (mats.contains=false, mats.any=false).
  _eq(_run([pvc110], specs, '110', <String>{}), null, '12 empty mats'); n++;

  assert(_run([pvc110], specs, '110', {'PVC'}) == pvc110, 'assert-live guard');
  print('OK realPipeOf: $n asserts passed');
}
