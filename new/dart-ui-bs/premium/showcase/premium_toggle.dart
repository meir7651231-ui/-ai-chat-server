// ✨ PremiumToggle — מתג-פרימיום: value + onChanged + label?. מסילת-גרדיאנט זוהרת במצב-דלוק,
// כפתור-קפיץ שמחליק (spring), זוהר-מבטא, אייקון-מצב פנימי. a11y: Semantics(toggled) ·
// reduced-motion · touch≥48. חוט-טהור: material בלבד · פיגמנט · טקסט דרך פרמטר · RTL.
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class PremiumToggle extends StatelessWidget {
  PremiumToggle({required this.value, this.onChanged, this.label, super.key});

  final bool value;
  final ValueChanged<bool>? onChanged;
  final String? label;

  static const _trackOff0 = DsAtomColors.premiumShowcasePremiumToggle1;

  static Color _trackOff(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumToggle1, (l) => l.cardAlt);   // לובש עור · _trackOff0 = הערך-הכהה
  static const _knob0 = DsAtomColors.premiumShowcasePremiumToggle2;
  static Color _knob(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumToggle2, (l) => l.onAccent);   // לובש עור · _knob0 = הערך-הכהה
  static const _accentA0 = DsAtomColors.premiumShowcasePremiumToggle3;
  static Color _accentA(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumToggle3, (l) => l.accent);   // לובש עור · _accentA0 = הערך-הכהה
  static const _accentB0 = DsAtomColors.premiumShowcasePremiumToggle4;
  static Color _accentB(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumToggle4, (l) => l.accent);   // לובש עור · _accentB0 = הערך-הכהה
  static const _glow0 = DsAtomColors.premiumShowcasePremiumToggle5;
  static Color _glow(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumToggle5, (l) => l.accent);   // לובש עור · _glow0 = הערך-הכהה
  static const _ink0 = DsAtomColors.premiumShowcasePremiumToggle6;
  static Color _ink(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumToggle6, (l) => l.chipBg);   // לובש עור · _ink0 = הערך-הכהה
  static const _hair0 = DsAtomColors.premiumShowcasePremiumToggle7;
  static Color _hair(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumToggle7, (l) => l.onAccent.withValues(alpha: 0.122));   // לובש עור · _hair0 = הערך-הכהה

  bool get _enabled => onChanged != null;

  @override
  Widget build(BuildContext context) {
    final reduce = MediaQuery.of(context).disableAnimations;
    final d = Duration(milliseconds: reduce ? 0 : 240);

    final track = AnimatedContainer(
      duration: d,
      curve: Curves.easeOutCubic,
      width: 54,
      height: 32,
      padding: const EdgeInsets.all(3),
      decoration: BoxDecoration(
        gradient: value
            ? LinearGradient(colors: [_accentA(context), _accentB(context)])
            : null,
        color: value ? null : _trackOff(context),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: value ? dsWear(context, DsAtomColors.premiumShowcasePremiumToggle8, (l) => l.onAccent.withValues(alpha: 0.2)) : _hair(context)),
        boxShadow: value
            ? [BoxShadow(color: _glow(context).withValues(alpha: 0.42), blurRadius: 14, offset: const Offset(0, 4))]
            : null,
      ),
      child: Stack(
        children: [
          AnimatedAlign(
            duration: d,
            curve: Curves.easeOutBack,
            alignment: value ? Alignment.centerRight : Alignment.centerLeft,
            child: Container(
              width: 26,
              height: 26,
              decoration: BoxDecoration(
                color: _knob(context),
                shape: BoxShape.circle,
                boxShadow: [BoxShadow(color: dsWear(context, DsAtomColors.premiumShowcasePremiumToggle9, (l) => l.bg.withValues(alpha: 0.349)), blurRadius: 4, offset: Offset(0, 2))],
              ),
              child: AnimatedSwitcher(
                duration: d,
                child: Icon(
                  value ? Icons.check_rounded : Icons.close_rounded,
                  key: ValueKey(value),
                  size: 15,
                  color: value ? _accentB(context) : dsWear(context, DsAtomColors.premiumShowcasePremiumToggle10, (l) => l.muted),
                ),
              ),
            ),
          ),
        ],
      ),
    );

    final row = label == null
        ? track
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Flexible(
                child: Text(
                  label!,
                  style: TextStyle(color: _ink(context), fontSize: 15, fontWeight: FontWeight.w500),
                ),
              ),
              const SizedBox(width: 14),
              track,
            ],
          );

    return Semantics(
      toggled: value,
      enabled: _enabled,
      label: label,
      child: Opacity(
        opacity: _enabled ? 1 : 0.5,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: _enabled ? () => onChanged!(!value) : null,
          child: row,
        ),
      ),
    );
  }
}
