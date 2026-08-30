// אטום-דוגמה · ExampleHeader — כותרת-סקציה. אפס-דאטה: הטקסט מוזרק.
import 'package:flutter/material.dart';
class ExampleHeader extends StatelessWidget {
  const ExampleHeader({required this.label, required this.color, super.key});
  final String label;
  final Color color;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.fromLTRB(16, 18, 16, 8),
        child: Text(label,
            style: TextStyle(color: color, fontSize: 20, fontWeight: FontWeight.w800)),
      );
}
