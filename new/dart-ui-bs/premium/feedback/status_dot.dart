// ✨ StatusDot — נקודת-סטטוס זוהרת עם הילה כפולה; דאטה: int tone (0..3) + size
import 'package:flutter/material.dart';
import '../../ds/ds_atoms.dart';

class StatusDot extends StatelessWidget {
  final int tone;
  final double size;
  const StatusDot({super.key, this.tone = 0, this.size = 12});

  static const List<Color> _tones = [
    DsAtomColors.premiumFeedbackStatusDot1, // 0 accent (ציאן)
    DsAtomColors.premiumFeedbackStatusDot2, // 1 success
    DsAtomColors.premiumFeedbackStatusDot3, // 2 danger
    DsAtomColors.premiumFeedbackStatusDot4, // 3 warning
  ];

  @override
  Widget build(BuildContext context) {
    final Color c = _tones[tone % _tones.length];
    return SizedBox(
      width: size * 2,
      height: size * 2,
      child: Center(
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(
              colors: [DsAtomColors.premiumFeedbackStatusDot5.withValues(alpha: 0.9), c],
              stops: const [0.0, 0.85],
            ),
            border: Border.all(color: c.withValues(alpha: 0.6), width: 1),
            boxShadow: [
              BoxShadow(color: c.withValues(alpha: 0.85), blurRadius: 8, spreadRadius: 0.5),
              BoxShadow(color: c.withValues(alpha: 0.45), blurRadius: 16, spreadRadius: 2),
            ],
          ),
        ),
      ),
    );
  }
}
