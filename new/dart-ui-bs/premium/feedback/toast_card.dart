// ✨ ToastCard — כרטיס-טוסט זכוכית/גרדיאנט עם glyph + tone; דאטה: String message, int tone, String? glyph
import 'package:flutter/material.dart';
import '../../ds/ds_atoms.dart';

class ToastCard extends StatelessWidget {
  final String message;
  final int tone;
  final String? glyph;
  const ToastCard({super.key, required this.message, this.tone = 0, this.glyph});

  static const List<Color> _tones = [
    DsAtomColors.premiumFeedbackToastCard1, // 0 accent
    DsAtomColors.premiumFeedbackToastCard2, // 1 success
    DsAtomColors.premiumFeedbackToastCard3, // 2 danger
    DsAtomColors.premiumFeedbackToastCard4, // 3 warning
  ];

  @override
  Widget build(BuildContext context) {
    final Color c = _tones[tone % _tones.length];
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topRight,
            end: Alignment.bottomLeft,
            colors: [
              DsAtomColors.premiumFeedbackToastCard5.withValues(alpha: 0.96),
              DsAtomColors.premiumFeedbackToastCard6.withValues(alpha: 0.96),
            ],
          ),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: c.withValues(alpha: 0.5), width: 1),
          boxShadow: [
            BoxShadow(color: c.withValues(alpha: 0.35), blurRadius: 22, offset: const Offset(0, 8)),
            BoxShadow(color: DsAtomColors.premiumFeedbackToastCard7.withValues(alpha: 0.45), blurRadius: 30, offset: const Offset(0, 12)),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 34,
              height: 34,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [c.withValues(alpha: 0.9), c.withValues(alpha: 0.5)],
                ),
                boxShadow: [BoxShadow(color: c.withValues(alpha: 0.6), blurRadius: 12)],
              ),
              child: Text(glyph ?? '•', style: const TextStyle(fontSize: 16, color: DsAtomColors.premiumFeedbackToastCard8)),
            ),
            const SizedBox(width: 12),
            Flexible(
              child: Text(
                message,
                style: const TextStyle(
                  color: DsAtomColors.premiumFeedbackToastCard9,
                  fontSize: 13.5,
                  height: 1.3,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
