// ✨ FabAction — כפתור-פעולה צף עגול, גרדיאנט סגול→מגנטה עם זוהר ניאון כפול. מקבל icon · onTap.
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class FabAction extends StatelessWidget {
  const FabAction({
    super.key,
    required this.icon,
    this.onTap,
  });

  final IconData icon;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [dsWear(context, DsAtomColors.premiumActionsFabAction1, (l) => l.accent), dsWear(context, DsAtomColors.premiumActionsFabAction2, (l) => l.muted)],
        ),
        boxShadow: [
          BoxShadow(
            color: dsWear(context, DsAtomColors.premiumActionsFabAction1, (l) => l.accent).withValues(alpha: 0.50),
            blurRadius: 22,
            offset: const Offset(0, 8),
          ),
          BoxShadow(
            color: dsWear(context, DsAtomColors.premiumActionsFabAction2, (l) => l.muted).withValues(alpha: 0.36),
            blurRadius: 34,
            spreadRadius: -4,
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        shape: const CircleBorder(),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          splashColor: dsWear(context, DsAtomColors.premiumActionsFabAction3, (l) => l.onAccent).withValues(alpha: 0.22),
          highlightColor: dsWear(context, DsAtomColors.premiumActionsFabAction3, (l) => l.onAccent).withValues(alpha: 0.08),
          child: Container(
            width: 58,
            height: 58,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: dsWear(context, DsAtomColors.premiumActionsFabAction3, (l) => l.onAccent).withValues(alpha: 0.24),
                width: 1,
              ),
            ),
            child: Icon(icon, size: 25, color: dsWear(context, DsAtomColors.premiumActionsFabAction3, (l) => l.onAccent)),
          ),
        ),
      ),
    );
  }
}
