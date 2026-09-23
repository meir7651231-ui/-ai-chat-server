// ✨ PremiumChip — צ׳יפ-פרימיום: label + icon? + selected + onTap + count?. מילוי-גרדיאנט
// וזוהר-מבטא בנבחר · משטח+hairline בלא-נבחר · נקודת-מצב · מונה · מיקרו-לחיצה.
// a11y: Semantics(selected/button) · reduced-motion · אין-צבע-לבד (אייקון+נקודה). חוט-טהור.
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class PremiumChip extends StatefulWidget {
  PremiumChip({
    required this.label,
    this.icon,
    this.selected = false,
    this.onTap,
    this.count,
    super.key,
  });

  final String label;
  final IconData? icon;
  final bool selected;
  final VoidCallback? onTap;
  final int? count;

  static const _accentA0 = DsAtomColors.premiumShowcasePremiumChip1;

  static Color _accentA(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumChip1, (l) => l.accent);   // לובש עור · _accentA0 = הערך-הכהה
  static const _accentB0 = DsAtomColors.premiumShowcasePremiumChip2;
  static Color _accentB(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumChip2, (l) => l.accent);   // לובש עור · _accentB0 = הערך-הכהה
  static const _glow0 = DsAtomColors.premiumShowcasePremiumChip3;
  static Color _glow(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumChip3, (l) => l.accent);   // לובש עור · _glow0 = הערך-הכהה
  static const _surface0 = DsAtomColors.premiumShowcasePremiumChip4;
  static Color _surface(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumChip4, (l) => l.cardAlt);   // לובש עור · _surface0 = הערך-הכהה
  static const _hair0 = DsAtomColors.premiumShowcasePremiumChip5;
  static Color _hair(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumChip5, (l) => l.onAccent.withValues(alpha: 0.122));   // לובש עור · _hair0 = הערך-הכהה
  static const _ink0 = DsAtomColors.premiumShowcasePremiumChip6;
  static Color _ink(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumChip6, (l) => l.chipBg);   // לובש עור · _ink0 = הערך-הכהה
  static const _muted0 = DsAtomColors.premiumShowcasePremiumChip7;
  static Color _muted(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumChip7, (l) => l.muted);   // לובש עור · _muted0 = הערך-הכהה

  @override
  State<PremiumChip> createState() => _PremiumChipState();
}

class _PremiumChipState extends State<PremiumChip> {
  bool _pressed = false;
  bool get _enabled => widget.onTap != null;

  @override
  Widget build(BuildContext context) {
    final reduce = MediaQuery.of(context).disableAnimations;
    final sel = widget.selected;
    final fg = sel ? dsWear(context, DsAtomColors.premiumShowcasePremiumChip8, (l) => l.onAccent) : PremiumChip._muted(context);

    final chip = AnimatedContainer(
      duration: Duration(milliseconds: reduce ? 0 : 180),
      curve: Curves.easeOut,
      height: 38,
      padding: const EdgeInsetsDirectional.fromSTEB(14, 0, 14, 0),
      decoration: BoxDecoration(
        gradient: sel
            ? LinearGradient(colors: [PremiumChip._accentA(context), PremiumChip._accentB(context)])
            : null,
        color: sel ? null : PremiumChip._surface(context),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: sel ? dsWear(context, DsAtomColors.premiumShowcasePremiumChip9, (l) => l.onAccent.withValues(alpha: 0.18)) : PremiumChip._hair(context)),
        boxShadow: sel
            ? [BoxShadow(color: PremiumChip._glow(context).withValues(alpha: 0.4), blurRadius: 14, offset: const Offset(0, 5))]
            : null,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (widget.icon != null) ...[
            Icon(widget.icon, size: 16, color: fg),
            const SizedBox(width: 7),
          ] else if (sel) ...[
            Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(color: dsWear(context, DsAtomColors.premiumShowcasePremiumChip8, (l) => l.onAccent), shape: BoxShape.circle),
            ),
            const SizedBox(width: 7),
          ],
          Text(
            widget.label,
            style: TextStyle(
                color: sel ? PremiumChip._ink(context) : PremiumChip._muted(context),
                fontSize: 14,
                fontWeight: FontWeight.w600,
                letterSpacing: -0.1),
          ),
          if (widget.count != null) ...[
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsetsDirectional.fromSTEB(7, 2, 7, 2),
              decoration: BoxDecoration(
                color: sel ? dsWear(context, DsAtomColors.premiumShowcasePremiumChip10, (l) => l.onAccent.withValues(alpha: 0.2)) : dsWear(context, DsAtomColors.premiumShowcasePremiumChip11, (l) => l.onAccent.withValues(alpha: 0.078)),
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                '${widget.count}',
                style: TextStyle(
                    color: sel ? dsWear(context, DsAtomColors.premiumShowcasePremiumChip8, (l) => l.onAccent) : PremiumChip._muted(context),
                    fontSize: 11.5,
                    fontWeight: FontWeight.w700),
              ),
            ),
          ],
        ],
      ),
    );

    return Semantics(
      button: true,
      selected: sel,
      label: widget.label,
      child: Opacity(
        opacity: _enabled ? 1 : 0.5,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: widget.onTap,
          onTapDown: _enabled ? (_) => setState(() => _pressed = true) : null,
          onTapUp: _enabled ? (_) => setState(() => _pressed = false) : null,
          onTapCancel: _enabled ? () => setState(() => _pressed = false) : null,
          child: AnimatedScale(
            scale: _pressed && _enabled ? 0.95 : 1,
            duration: Duration(milliseconds: reduce ? 0 : 110),
            child: chip,
          ),
        ),
      ),
    );
  }
}
