// ✨ GlassButton — כפתור-זכוכית (BackdropFilter+blur) עם גבול-אור עדין ורקע שקוף. מקבל label · onTap · icon אופציונלי.
import 'dart:ui';
import 'package:flutter/material.dart';
import '../../ds/ds_atoms.dart';

class GlassButton extends StatelessWidget {
  const GlassButton({
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
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
        child: DecoratedBox(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                DsAtomColors.premiumActionsGlassButton1.withValues(alpha: 0.14),
                DsAtomColors.premiumActionsGlassButton1.withValues(alpha: 0.04),
              ],
            ),
            border: Border.all(
              color: DsAtomColors.premiumActionsGlassButton1.withValues(alpha: 0.20),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: DsAtomColors.premiumActionsGlassButton2.withValues(alpha: 0.40),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Material(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(16),
            child: InkWell(
              onTap: onTap,
              borderRadius: BorderRadius.circular(16),
              splashColor: DsAtomColors.premiumActionsGlassButton1.withValues(alpha: 0.14),
              highlightColor: DsAtomColors.premiumActionsGlassButton1.withValues(alpha: 0.05),
              child: Padding(
                padding: const EdgeInsetsDirectional.symmetric(
                  horizontal: 22,
                  vertical: 14,
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (icon != null) ...[
                      Icon(
                        icon,
                        size: 19,
                        color: DsAtomColors.premiumActionsGlassButton3,
                      ),
                      const SizedBox(width: 10),
                    ],
                    Text(
                      label,
                      style: const TextStyle(
                        color: DsAtomColors.premiumActionsGlassButton3,
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.3,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
