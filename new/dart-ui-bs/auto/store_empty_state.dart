// 🧽 לוטש ע"י מנוע-המטרות (data-lift v3) — דאטה/מודל/תבנית הורמו ל-props לפי מטרתם, אל תערוך ידנית.
// מוצא: screens__store_screen:_EmptyState (בנייה-חכמה main) · צרור-1 · props-שורש: label, label2
// התוכן: new/dart-data-bs/auto/screens__store_screen_content.dart
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';

class StoreEmptyState extends StatelessWidget {
  StoreEmptyState({required this.label, required this.label2, required this.query});
  final String label;
  final String label2;
  final String query;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder:
          (context, constraints) => SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: SizedBox(
              height: constraints.maxHeight,
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('🔍', style: TextStyle(fontSize: 48)),
                    const SizedBox(height: 12),
                    Text(
                      query.isEmpty
                          ? label
                          : '${label2}$query"',
                      style: TextStyle(
                        color: dsWear(context, DsAtomColors.autoStoreEmptyState1, (l) => l.muted),
                        fontSize: 15,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          ),
    );
  }
}
