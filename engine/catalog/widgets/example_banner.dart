// אטום-דוגמה · ExampleBanner — פס-הודעה. אפס-דאטה: הטקסט מוזרק.
import 'package:flutter/material.dart';
class ExampleBanner extends StatelessWidget {
  const ExampleBanner({required this.label, required this.fillColor, required this.inkColor, super.key});
  final String label;
  final Color fillColor, inkColor;
  @override
  Widget build(BuildContext context) => Container(
        margin: const EdgeInsets.all(16),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(color: fillColor, borderRadius: BorderRadius.circular(12)),
        child: Text(label, style: TextStyle(color: inkColor, fontSize: 13)),
      );
}
