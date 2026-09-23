// ✨ SplitAction — כפתור-פיצול: פעולה ראשית (label) + אזור-חץ משני מופרד בקו-אור. גרדיאנט כהה-ניאון. מקבל label · onMain · onMore.
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class SplitAction extends StatelessWidget {
  const SplitAction({
    super.key,
    required this.label,
    this.onMain,
    this.onMore,
  });

  final String label;
  final VoidCallback? onMain;
  final VoidCallback? onMore;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [dsWear(context, DsAtomColors.premiumActionsSplitAction1, (l) => l.cardAlt), dsWear(context, DsAtomColors.premiumActionsSplitAction2, (l) => l.bg)],
        ),
        border: Border.all(
          color: dsWear(context, DsAtomColors.premiumActionsSplitAction3, (l) => l.accent).withValues(alpha: 0.40),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: dsWear(context, DsAtomColors.premiumActionsSplitAction3, (l) => l.accent).withValues(alpha: 0.24),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: onMain,
                splashColor: dsWear(context, DsAtomColors.premiumActionsSplitAction3, (l) => l.accent).withValues(alpha: 0.22),
                highlightColor: dsWear(context, DsAtomColors.premiumActionsSplitAction4, (l) => l.muted).withValues(alpha: 0.08),
                child: Padding(
                  padding: const EdgeInsetsDirectional.symmetric(
                    horizontal: 20,
                    vertical: 13,
                  ),
                  child: Text(
                    label,
                    style: TextStyle(
                      color: dsWear(context, DsAtomColors.premiumActionsSplitAction5, (l) => l.chipBg),
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.3,
                    ),
                  ),
                ),
              ),
            ),
            Container(
              width: 1,
              height: 30,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    dsWear(context, DsAtomColors.premiumActionsSplitAction4, (l) => l.muted).withValues(alpha: 0.55),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: onMore,
                splashColor: dsWear(context, DsAtomColors.premiumActionsSplitAction4, (l) => l.muted).withValues(alpha: 0.22),
                highlightColor: dsWear(context, DsAtomColors.premiumActionsSplitAction6, (l) => l.success).withValues(alpha: 0.08),
                child: Padding(
                  padding: EdgeInsetsDirectional.symmetric(
                    horizontal: 12,
                    vertical: 13,
                  ),
                  child: Icon(
                    Icons.keyboard_arrow_down_rounded,
                    size: 22,
                    color: dsWear(context, DsAtomColors.premiumActionsSplitAction4, (l) => l.muted),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
