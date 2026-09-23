// ✨ SegmentedSwitch — בורר-מקטעים בקופסת-זכוכית כהה; המקטע הנבחר בגרדיאנט סגול→מגנטה עם זוהר. מקבל items · selected · onSelect.
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class SegmentedSwitch extends StatelessWidget {
  const SegmentedSwitch({
    super.key,
    required this.items,
    required this.selected,
    required this.onSelect,
  });

  final List<String> items;
  final int selected;
  final ValueChanged<int> onSelect;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: dsWear(context, DsAtomColors.premiumActionsSegmentedSwitch1, (l) => l.bg).withValues(alpha: 0.85),
        border: Border.all(
          color: dsWear(context, DsAtomColors.premiumActionsSegmentedSwitch2, (l) => l.onAccent).withValues(alpha: 0.08),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (int i = 0; i < items.length; i++)
            _Segment(
              label: items[i],
              active: i == selected,
              onTap: () => onSelect(i),
            ),
        ],
      ),
    );
  }
}

class _Segment extends StatelessWidget {
  const _Segment({
    required this.label,
    required this.active,
    required this.onTap,
  });

  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 220),
      curve: Curves.easeOut,
      margin: const EdgeInsetsDirectional.symmetric(horizontal: 2),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        gradient: active
            ? LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [dsWear(context, DsAtomColors.premiumActionsSegmentedSwitch3, (l) => l.accent), dsWear(context, DsAtomColors.premiumActionsSegmentedSwitch4, (l) => l.muted)],
              )
            : null,
        boxShadow: active
            ? [
                BoxShadow(
                  color: dsWear(context, DsAtomColors.premiumActionsSegmentedSwitch3, (l) => l.accent).withValues(alpha: 0.42),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ]
            : null,
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          splashColor: dsWear(context, DsAtomColors.premiumActionsSegmentedSwitch2, (l) => l.onAccent).withValues(alpha: 0.12),
          highlightColor: dsWear(context, DsAtomColors.premiumActionsSegmentedSwitch2, (l) => l.onAccent).withValues(alpha: 0.04),
          child: Padding(
            padding: const EdgeInsetsDirectional.symmetric(
              horizontal: 18,
              vertical: 10,
            ),
            child: Text(
              label,
              style: TextStyle(
                color: active
                    ? dsWear(context, DsAtomColors.premiumActionsSegmentedSwitch2, (l) => l.onAccent)
                    : dsWear(context, DsAtomColors.premiumActionsSegmentedSwitch5, (l) => l.chipBg).withValues(alpha: 0.55),
                fontSize: 14,
                fontWeight: active ? FontWeight.w700 : FontWeight.w500,
                letterSpacing: 0.2,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
