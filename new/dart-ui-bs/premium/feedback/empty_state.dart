// ✨ EmptyState — מצב-ריק עם אייקון בעיגול-כהה זוהר; דאטה: String glyph + String message
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class EmptyState extends StatelessWidget {
  final String glyph;
  final String message;
  const EmptyState({super.key, required this.glyph, required this.message});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 84,
            height: 84,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [dsWear(context, DsAtomColors.premiumFeedbackEmptyState1, (l) => l.track), dsWear(context, DsAtomColors.premiumFeedbackEmptyState2, (l) => l.card)],
              ),
              border: Border.all(color: dsWear(context, DsAtomColors.premiumFeedbackEmptyState3, (l) => l.accent).withValues(alpha: 0.35), width: 1),
              boxShadow: [
                BoxShadow(color: dsWear(context, DsAtomColors.premiumFeedbackEmptyState3, (l) => l.accent).withValues(alpha: 0.30), blurRadius: 28, spreadRadius: 1),
              ],
            ),
            child: Text(glyph, style: const TextStyle(fontSize: 36)),
          ),
          const SizedBox(height: 16),
          Text(
            message,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: dsWear(context, DsAtomColors.premiumFeedbackEmptyState4, (l) => l.chipBg).withValues(alpha: 0.72),
              fontSize: 14,
              height: 1.4,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
