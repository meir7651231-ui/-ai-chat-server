// 🧽 לוטש ע"י מנוע-הליטוש (data-lift) — הדאטה הורמה ל-props, אל תערוך ידנית.
// מוצא: screens__studio__panes__theme_pane:_Swatch (בנייה-חכמה main) · 1 props: label
// התוכן: new/dart-data-bs/auto/screens__studio__panes__theme_pane_content.dart
import 'package:flutter/material.dart';
import 'bs_tokens.dart';

class Swatch extends StatelessWidget {
  const Swatch({required this.label, 
    required this.color,
    required this.selected,
    required this.onTap,
    super.key,
  });
  final String label;

  final Color color;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Semantics(
        button: true,
        selected: selected,
        label: label,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(24),
          child: Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
              border: Border.all(
                color: selected ? BsTokens.inkLight : Colors.black12,
                width: selected ? 3 : 1,
              ),
            ),
            child: selected
                ? const Icon(Icons.check, color: Colors.white, size: 22)
                : null,
          ),
        ),
      );
}
