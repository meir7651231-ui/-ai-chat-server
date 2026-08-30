// אטום-דוגמה · ExampleStat (KpiBox) — מדד: ערך גדול + תווית. אפס-דאטה.
import 'package:flutter/material.dart';
class ExampleStat extends StatelessWidget {
  const ExampleStat({required this.value, required this.label, required this.accentColor, required this.mutedColor, super.key});
  final String value, label;
  final Color accentColor, mutedColor;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        child: Row(children: [
          Text(value, style: TextStyle(color: accentColor, fontSize: 28, fontWeight: FontWeight.w900)),
          const SizedBox(width: 10),
          Text(label, style: TextStyle(color: mutedColor, fontSize: 14)),
        ]),
      );
}
