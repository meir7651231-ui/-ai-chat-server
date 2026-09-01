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

  // התנהגות (§23-ד): שדה-מותנה 'ערך > סף ? חריגה : תקין' — הדפוס המדויק שהמחולל פולט —
  // מתעדכן חי עם הקלט. מוכיח 'עובד', לא רק 'מתקמפל'.
  testWidgets('שדה-מותנה: סטטוס-סף מתעדכן חי (ערך>סף⇒חריגה)', (tester) async {
    await tester.pumpWidget(const _MiniCond());
    expect(find.text('תקין'), findsOneWidget);        // 0 > 0 = false ⇒ תקין
    await tester.enterText(find.byKey(const Key('val')), '150');
    await tester.enterText(find.byKey(const Key('thr')), '100');
    await tester.pumpAndSettle();
    expect(find.text('חריגה'), findsOneWidget);        // 150 > 100 ⇒ חריגה (חי)
    expect(find.text('תקין'), findsNothing);
    await tester.enterText(find.byKey(const Key('val')), '50');
    await tester.pumpAndSettle();
    expect(find.text('תקין'), findsOneWidget);         // 50 > 100 = false ⇒ תקין (חי)
  });
}

// מסך-מיני זהה-לדפוס-המחולל לשדה-מותנה: שני שדות מספריים ⇒ סטטוס-נגזר-חי.
class _MiniCond extends StatefulWidget {
  const _MiniCond();
  @override
  State<_MiniCond> createState() => _MiniCondState();
}
class _MiniCondState extends State<_MiniCond> {
  final Map<int, String> _v = {};
  @override
  Widget build(BuildContext context) => MaterialApp(
        home: Scaffold(
          body: Column(children: [
            TextField(key: const Key('val'), onChanged: (x) => setState(() => _v[1] = x)),
            TextField(key: const Key('thr'), onChanged: (x) => setState(() => _v[2] = x)),
            // הביטוי המדויק שהמחולל פולט (num.tryParse … ? then : else):
            Text(((num.tryParse(_v[1] ?? '') ?? 0) > (num.tryParse(_v[2] ?? '') ?? 0)) ? 'חריגה' : 'תקין'),
          ]),
        ),
      );
}
