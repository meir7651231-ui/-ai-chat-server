// בדיקת-התנהגות · לולאת טופס→שמירה→טבלה (בדיוק דפוס-המסך-המחולל) על אטומי-ה-DS האמיתיים.
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import '_gen/ds.dart';
import '_gen/ds_field.dart';
import '_gen/ds_store.dart';

// מסך-מיני זהה-בדפוס למחולל: שדה → _v → שמירה → appStore.add → טבלה חיה.
class _MiniEntity extends StatefulWidget {
  const _MiniEntity();
  @override
  State<_MiniEntity> createState() => _MiniEntityState();
}
class _MiniEntityState extends State<_MiniEntity> {
  final Map<int, String> _v = {};
  void _save() {
    if ((_v[0] ?? '').trim().isEmpty) return;
    appStore.add('ent', {'שם': _v[0] ?? ''});
    setState(() => _v.clear());
  }
  @override
  Widget build(BuildContext context) => MaterialApp(
        home: DsScaffold(
          title: 'ישות', subtitle: '', icon: '🗂️',
          bottomBar: DsPrimaryButton(label: 'שמירה', onTap: _save),
          children: [
            DsField(label: 'שם', hint: '', value: _v[0] ?? '', onChanged: (x) => setState(() => _v[0] = x)),
            AnimatedBuilder(
              animation: appStore,
              builder: (c, _) {
                final rs = appStore.records('ent');
                if (rs.isEmpty) return const DsEmpty(label: 'ריק');
                return Column(children: [for (final r in rs) DsRecordCard(labels: const ['שם'], values: [r['שם'] ?? ''])]);
              },
            ),
          ],
        ),
      );
}

void main() {
  testWidgets('הקלדה→שמירה→הרשומה מופיעה בטבלה', (tester) async {
    await tester.pumpWidget(const _MiniEntity());
    expect(find.text('ריק'), findsOneWidget);      // מתחיל ריק
    await tester.enterText(find.byType(TextField), 'משה כהן');
    await tester.tap(find.text('שמירה'));
    await tester.pumpAndSettle();
    expect(find.text('ריק'), findsNothing);         // כבר לא ריק
    expect(find.text('משה כהן'), findsWidgets);      // הרשומה בטבלה
    expect(appStore.count('ent'), greaterThan(0));
  });
}
