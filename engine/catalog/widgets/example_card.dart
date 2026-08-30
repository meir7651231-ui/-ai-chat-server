// אטום-דוגמה · ExampleCard — כרטיס כותרת+תת-כותרת. אפס-דאטה: הטקסט מוזרק.
import 'package:flutter/material.dart';
class ExampleCard extends StatelessWidget {
  const ExampleCard({required this.title, required this.sub, required this.fillColor, required this.inkColor, super.key});
  final String title, sub;
  final Color fillColor, inkColor;
  @override
  Widget build(BuildContext context) => Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(color: fillColor, borderRadius: BorderRadius.circular(14)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: TextStyle(color: inkColor, fontSize: 17, fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text(sub, style: TextStyle(color: inkColor.withValues(alpha: 0.7), fontSize: 13)),
        ]),
      );
}
