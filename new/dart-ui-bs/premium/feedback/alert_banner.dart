// ✨ AlertBanner — באנר-התראה זכוכית עם glyph + פס-tone; דאטה: String message, int tone, String? glyph
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class AlertBanner extends StatelessWidget {
  final String message;
  final int tone;
  final String? glyph;
  AlertBanner({super.key, required this.message, this.tone = 0, this.glyph});

  static List<Color> _tones = [
    DsAtomColors.premiumFeedbackAlertBanner1, // 0 accent
    DsAtomColors.premiumFeedbackAlertBanner2, // 1 success
    DsAtomColors.premiumFeedbackAlertBanner3, // 2 danger
    DsAtomColors.premiumFeedbackAlertBanner4, // 3 warning
  ];

  @override
  Widget build(BuildContext context) {
    final Color c = _tones[tone % _tones.length];
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.centerRight,
            end: Alignment.centerLeft,
            colors: [c.withValues(alpha: 0.22), c.withValues(alpha: 0.06)],
          ),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: c.withValues(alpha: 0.45), width: 1),
          boxShadow: [
            BoxShadow(color: c.withValues(alpha: 0.22), blurRadius: 18, offset: const Offset(0, 6)),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 4,
              height: 34,
              margin: const EdgeInsets.only(left: 12),
              decoration: BoxDecoration(
                color: c,
                borderRadius: BorderRadius.circular(4),
                boxShadow: [BoxShadow(color: c.withValues(alpha: 0.8), blurRadius: 8)],
              ),
            ),
            if (glyph != null) ...[
              Text(glyph!, style: const TextStyle(fontSize: 18)),
              const SizedBox(width: 10),
            ],
            Expanded(
              child: Text(
                message,
                style: TextStyle(
                  color: dsWear(context, DsAtomColors.premiumFeedbackAlertBanner5, (l) => l.chipBg),
                  fontSize: 13.5,
                  height: 1.35,
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
