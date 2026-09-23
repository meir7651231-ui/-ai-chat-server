// ✨ KpiTile — אריח-KPI (glyph + value בגרדיאנט-טקסט + label) על כרטיס-זכוכית
import 'dart:ui';
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class KpiTile extends StatelessWidget {
  const KpiTile({
    super.key,
    required this.glyph,
    required this.value,
    required this.label,
  });

  final String glyph;
  final String value;
  final String label;

  static const _bg0 = DsAtomColors.premiumDatavizKpiTile1;

  static Color _bg(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizKpiTile1, (l) => l.cardAlt);   // לובש עור · _bg0 = הערך-הכהה
  static const _mute0 = DsAtomColors.premiumDatavizKpiTile2;
  static Color _mute(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizKpiTile2, (l) => l.muted);   // לובש עור · _mute0 = הערך-הכהה
  static const _cyan0 = DsAtomColors.premiumDatavizKpiTile3;
  static Color _cyan(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizKpiTile3, (l) => l.success);   // לובש עור · _cyan0 = הערך-הכהה
  static const _violet0 = DsAtomColors.premiumDatavizKpiTile4;
  static Color _violet(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizKpiTile4, (l) => l.accent);   // לובש עור · _violet0 = הערך-הכהה
  static const _magenta0 = DsAtomColors.premiumDatavizKpiTile5;
  static Color _magenta(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizKpiTile5, (l) => l.accentDark);   // לובש עור · _magenta0 = הערך-הכהה

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            begin: Alignment.topRight,
            end: Alignment.bottomLeft,
            colors: [Color(0xFF16173063), _bg(context)],
          ),
          color: _bg(context),
          border: Border.all(color: dsWear(context, DsAtomColors.premiumDatavizKpiTile6, (l) => l.onAccent).withValues(alpha: 0.07)),
          boxShadow: [
            BoxShadow(
              color: _violet(context).withValues(alpha: 0.14),
              blurRadius: 24,
              spreadRadius: -8,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 42,
              height: 42,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(13),
                gradient: LinearGradient(
                  colors: [_cyan(context).withValues(alpha: 0.22), _magenta(context).withValues(alpha: 0.22)],
                ),
                border: Border.all(color: dsWear(context, DsAtomColors.premiumDatavizKpiTile6, (l) => l.onAccent).withValues(alpha: 0.08)),
              ),
              child: Text(glyph, style: const TextStyle(fontSize: 20, height: 1)),
            ),
            const SizedBox(height: 16),
            ShaderMask(
              shaderCallback: (r) => LinearGradient(
                colors: [_cyan(context), _violet(context), _magenta(context)],
              ).createShader(r),
              child: Text(
                value,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: dsWear(context, DsAtomColors.premiumDatavizKpiTile6, (l) => l.onAccent),
                  fontSize: 30,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -1.6,
                  height: 1,
                  fontFeatures: [FontFeature.tabularFigures()],
                ),
              ),
            ),
            const SizedBox(height: 7),
            Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                color: _mute(context),
                fontSize: 12.5,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
