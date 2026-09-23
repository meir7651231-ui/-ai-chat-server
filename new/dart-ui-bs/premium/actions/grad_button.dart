// ✨ GradButton — כפתור-פעולה גרדיאנט סגול→מגנטה עם זוהר ניאון ומסגרת-לבנה-שקופה. מקבל label · onTap · icon אופציונלי.
import 'package:flutter/material.dart';
import '../../ds/ds_atoms.dart';

class GradButton extends StatelessWidget {
  const GradButton({
    super.key,
    required this.label,
    this.onTap,
    this.icon,
  });

  final String label;
  final VoidCallback? onTap;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [DsAtomColors.premiumActionsGradButton1, DsAtomColors.premiumActionsGradButton2],
        ),
        boxShadow: [
          BoxShadow(
            color: DsAtomColors.premiumActionsGradButton1.withValues(alpha: 0.45),
            blurRadius: 24,
            offset: const Offset(0, 10),
          ),
          BoxShadow(
            color: DsAtomColors.premiumActionsGradButton2.withValues(alpha: 0.30),
            blurRadius: 40,
            spreadRadius: -6,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          splashColor: DsAtomColors.premiumActionsGradButton3.withValues(alpha: 0.16),
          highlightColor: DsAtomColors.premiumActionsGradButton3.withValues(alpha: 0.06),
          child: Ink(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: DsAtomColors.premiumActionsGradButton3.withValues(alpha: 0.22),
                width: 1,
              ),
            ),
            child: Padding(
              padding: const EdgeInsetsDirectional.symmetric(
                horizontal: 22,
                vertical: 14,
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: 19, color: DsAtomColors.premiumActionsGradButton3),
                    const SizedBox(width: 10),
                  ],
                  Text(
                    label,
                    style: const TextStyle(
                      color: DsAtomColors.premiumActionsGradButton4,
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.3,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
