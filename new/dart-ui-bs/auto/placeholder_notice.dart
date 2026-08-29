// 🧽 לוטש ע"י מנוע-הליטוש (data-lift) — הדאטה הורמה ל-props, אל תערוך ידנית.
// מוצא: screens__legal_screen:_PlaceholderNotice (בנייה-חכמה main) · 1 props: label
// התוכן: new/dart-data-bs/auto/screens__legal_screen_content.dart
import 'package:flutter/material.dart';
import 'bs_tokens.dart';

class PlaceholderNotice extends StatelessWidget {
  const PlaceholderNotice({required this.label});
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(BsTokens.space3),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF7E8),
        borderRadius: BorderRadius.circular(BsTokens.space3),
        border: Border.all(color: const Color(0xFFF3DFB6)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('ℹ️', style: TextStyle(fontSize: 16)),
          SizedBox(width: BsTokens.space2),
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                color: BsTokens.warnText,
                fontSize: BsTokens.typeMicro,
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
