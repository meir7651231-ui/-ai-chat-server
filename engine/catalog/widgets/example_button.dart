// אטום-דוגמה · ExampleButton — כפתור. אפס-דאטה: תווית+פעולה מוזרקים.
import 'package:flutter/material.dart';
class ExampleButton extends StatelessWidget {
  const ExampleButton({required this.label, required this.onPressed, required this.accentColor, super.key});
  final String label;
  final VoidCallback onPressed;
  final Color accentColor;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        child: FilledButton(
          style: FilledButton.styleFrom(backgroundColor: accentColor, minimumSize: const Size.fromHeight(48)),
          onPressed: onPressed,
          child: Text(label),
        ),
      );
}
