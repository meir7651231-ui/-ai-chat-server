// 🧼 אטום-משותף · StatTile — אריח-סטטיסטיקה בכרטיס (איחד _Stat/_PStat ×3).
// מוצא: courier_dashboard_screen.dart · verbatim, טוקנים מוזרקים.
import 'package:flutter/material.dart';
import 'ds/ds.dart';
import 'ds/ds_atoms.dart';

class StatTile extends StatelessWidget {
  const StatTile({
    required this.value, required this.label,
    required this.surfaceColor, required this.inkColor, required this.mutedColor,
    required this.radius, super.key,
  });
  final String value, label;
  final Color surfaceColor, inkColor, mutedColor;
  final double radius;

  @override
  Widget build(BuildContext context) => Expanded(
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 3),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: surfaceColor,
            borderRadius: BorderRadius.circular(radius),
            boxShadow: [BoxShadow(color: dsWear(context, DsAtomColors.statTile1, (l) => l.bg.withValues(alpha: 0.059)), blurRadius: 8, offset: Offset(0, 2))],
          ),
          child: Column(children: [
            Text(value, style: TextStyle(color: inkColor, fontWeight: FontWeight.w800, fontSize: 17)),
            const SizedBox(height: 2),
            Text(label, textAlign: TextAlign.center, style: TextStyle(color: mutedColor, fontSize: 12)),
          ]),
        ),
      );
}
