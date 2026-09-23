// ✨ SplitAction — כפתור-פיצול: פעולה ראשית (label) + אזור-חץ משני מופרד בקו-אור. גרדיאנט כהה-ניאון. מקבל label · onMain · onMore.
import 'package:flutter/material.dart';
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
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [DsAtomColors.premiumActionsSplitAction1, DsAtomColors.premiumActionsSplitAction2],
        ),
        border: Border.all(
          color: DsAtomColors.premiumActionsSplitAction3.withValues(alpha: 0.40),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: DsAtomColors.premiumActionsSplitAction3.withValues(alpha: 0.24),
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
                splashColor: DsAtomColors.premiumActionsSplitAction3.withValues(alpha: 0.22),
                highlightColor: DsAtomColors.premiumActionsSplitAction4.withValues(alpha: 0.08),
                child: Padding(
                  padding: const EdgeInsetsDirectional.symmetric(
                    horizontal: 20,
                    vertical: 13,
                  ),
                  child: Text(
                    label,
                    style: const TextStyle(
                      color: DsAtomColors.premiumActionsSplitAction5,
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
                    DsAtomColors.premiumActionsSplitAction4.withValues(alpha: 0.55),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: onMore,
                splashColor: DsAtomColors.premiumActionsSplitAction4.withValues(alpha: 0.22),
                highlightColor: DsAtomColors.premiumActionsSplitAction6.withValues(alpha: 0.08),
                child: const Padding(
                  padding: EdgeInsetsDirectional.symmetric(
                    horizontal: 12,
                    vertical: 13,
                  ),
                  child: Icon(
                    Icons.keyboard_arrow_down_rounded,
                    size: 22,
                    color: DsAtomColors.premiumActionsSplitAction4,
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
