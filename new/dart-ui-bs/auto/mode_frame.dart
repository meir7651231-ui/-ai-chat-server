// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__camera_sheet:_ModeFrame (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';

class ModeFrame extends StatelessWidget {
  const ModeFrame({required this.emoji, required this.hint});
  final String emoji;
  final String hint;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 260, height: 200,
          decoration: BoxDecoration(
            border: Border.all(color: dsWear(context, DsAtomColors.autoModeFrame1, (l) => l.bg.withValues(alpha: 0.38)), width: 1.5),
            borderRadius: BorderRadius.circular(12),
          ),
          alignment: Alignment.center,
          child: Text(emoji, style: const TextStyle(fontSize: 52)),
        ),
        const SizedBox(height: 14),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          decoration: BoxDecoration(
            color: dsWear(context, DsAtomColors.autoModeFrame2, (l) => l.bg.withValues(alpha: 0.541)),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(hint,
              style: TextStyle(color: dsWear(context, DsAtomColors.autoModeFrame3, (l) => l.onAccent), fontSize: 13)),
        ),
      ],
    );
  }
}
