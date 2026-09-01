// 🖼️ מסך-תורמים בשפת-Pure המלאה — PureSurface + PureTableRow + סריף(FrankRuhlLibre) + mono(JetBrains)
// עטוף ב-PureScope(indigo). זה "העיצוב החדש" האמיתי: כרטיס-משטח, שורות-Pure, טיפוגרפיה-עורכת, זוהר-אקצנט.
import 'package:flutter/material.dart';
import '../dart-ui-bs/ds/ds_pure.dart';
import '../dart-ui-bs/ds/ds_seam.dart';
import '../dart-ui-bs/pure_surface.dart';
import '../dart-ui-bs/pure_table_row.dart';

void main() => runApp(const _App());

class _App extends StatelessWidget {
  const _App();
  @override
  Widget build(BuildContext context) => MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData(useMaterial3: true, scaffoldBackgroundColor: DsPure.canvas, brightness: Brightness.dark),
        builder: (c, ch) => Directionality(textDirection: TextDirection.rtl, child: ch ?? const SizedBox.shrink()),
        home: PureScope(
          theme: DsPure.indigo,
          child: Scaffold(
            backgroundColor: DsPure.canvas,
            body: Stack(children: [
              // זוהר-אקצנט עליון (כמו הרפרנס)
              Positioned(top: -120, right: -60, child: Container(width: 380, height: 380, decoration: BoxDecoration(shape: BoxShape.circle, gradient: RadialGradient(colors: [DsPure.indigo.gl, const Color(0x00000000)])))),
              SafeArea(child: _Donors()),
            ]),
          ),
        ),
      );
}

class _Donors extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final skin = DsSeam.skinOf(context);
    const donors = [
      ('משפחת כהן · ירושלים', '₪ 1,250', 'הו״ק · חודשי', PureRowStatus.ok),
      ('משפחת לוי · בני ברק', '₪ 500', 'חד-פעמי', PureRowStatus.ok),
      ('עמותת חסד · צפת', '₪ 3,600', 'שנתי · §46', PureRowStatus.warn),
      ('משפחת פרץ · אשדוד', '₪ 180', 'ממתין לקבלה', PureRowStatus.err),
      ('קרן שמש · חיפה', '₪ 2,000', 'הו״ק · חודשי', PureRowStatus.ok),
    ];
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 28, 20, 20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Text('DONORS LEDGER · תרומות',
            style: TextStyle(fontFamily: 'JetBrains Mono', fontSize: 12, letterSpacing: 2, color: skin.mut)),
        const SizedBox(height: 10),
        Text('תורמים · תרומות',
            style: TextStyle(fontFamily: 'FrankRuhlLibre', fontSize: 42, fontWeight: FontWeight.w700, color: skin.ink, height: 1.05)),
        const SizedBox(height: 8),
        Text('שכבת-התצוגה של פנקס-התורמים — כל תורם, לבוש פעם-אחת',
            style: TextStyle(fontFamily: 'FrankRuhlLibre', fontStyle: FontStyle.italic, fontSize: 17, color: DsPure.indigo.aHi, height: 1.3)),
        const SizedBox(height: 26),
        PureSurface(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
          child: Column(children: [
            for (final d in donors)
              PureTableRow(label: d.$1, value: d.$2, meta: d.$3, status: d.$4, zebra: true),
          ]),
        ),
      ]),
    );
  }
}
