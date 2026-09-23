// 🧼 אטום · StatusDot — עיגול-סטטוס קטן. מוצא: _Dot (manager_dashboard_screen).
// verbatim; הצבע מוזרק (במקור ברירת-מחדל 0xFF22A75A — נשמרה).
import 'package:flutter/material.dart';
import '../ds/ds_atoms.dart';

class StatusDot extends StatelessWidget {
  const StatusDot({this.color = DsAtomColors.screensManagerDashboardScreenStatusDot1, this.size = 8, super.key});

  final Color color;
  final double size;

  @override
  Widget build(BuildContext context) => Container(
        width: size,
        height: size,
        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
      );
}
