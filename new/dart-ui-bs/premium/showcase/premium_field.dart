// ✨ PremiumField — שדה-קלט פרימיום: label + value? + hint? + icon? + onChanged? + obscure.
// תווית-צפה שעולה בפוקוס · טבעת-פוקוס זוהרת · קו-אורורה תחתון שנדלק · אייקון מוביל.
// a11y: TextField נגיש (label/hint) · reduced-motion · ניגוד. חוט-טהור: material בלבד · RTL.
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class PremiumField extends StatefulWidget {
  PremiumField({
    required this.label,
    this.value,
    this.hint,
    this.icon,
    this.onChanged,
    this.obscure = false,
    super.key,
  });

  final String label;
  final String? value;
  final String? hint;
  final IconData? icon;
  final ValueChanged<String>? onChanged;
  final bool obscure;

  static const _surface0 = DsAtomColors.premiumShowcasePremiumField1;

  static Color _surface(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumField1, (l) => l.card);   // לובש עור · _surface0 = הערך-הכהה
  static const _hair0 = DsAtomColors.premiumShowcasePremiumField2;
  static Color _hair(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumField2, (l) => l.onAccent.withValues(alpha: 0.122));   // לובש עור · _hair0 = הערך-הכהה
  static const _accent0 = DsAtomColors.premiumShowcasePremiumField3;
  static Color _accent(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumField3, (l) => l.accent);   // לובש עור · _accent0 = הערך-הכהה
  static const _glow0 = DsAtomColors.premiumShowcasePremiumField4;
  static Color _glow(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumField4, (l) => l.accent);   // לובש עור · _glow0 = הערך-הכהה
  static const _ink0 = DsAtomColors.premiumShowcasePremiumField5;
  static Color _ink(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumField5, (l) => l.chipBg);   // לובש עור · _ink0 = הערך-הכהה
  static const _muted0 = DsAtomColors.premiumShowcasePremiumField6;
  static Color _muted(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumField6, (l) => l.muted);   // לובש עור · _muted0 = הערך-הכהה

  @override
  State<PremiumField> createState() => _PremiumFieldState();
}

class _PremiumFieldState extends State<PremiumField> {
  late final TextEditingController _tc = TextEditingController(text: widget.value);
  final FocusNode _fn = FocusNode();
  bool _focused = false;

  @override
  void initState() {
    super.initState();
    _fn.addListener(() => setState(() => _focused = _fn.hasFocus));
  }

  @override
  void dispose() {
    _tc.dispose();
    _fn.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reduce = MediaQuery.of(context).disableAnimations;
    final d = Duration(milliseconds: reduce ? 0 : 180);
    final active = _focused || _tc.text.isNotEmpty;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        AnimatedDefaultTextStyle(
          duration: d,
          style: TextStyle(
            color: _focused ? PremiumField._accent(context) : PremiumField._muted(context),
            fontSize: active ? 12.5 : 14,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.2,
          ),
          child: Text(widget.label),
        ),
        const SizedBox(height: 7),
        AnimatedContainer(
          duration: d,
          curve: Curves.easeOut,
          decoration: BoxDecoration(
            color: PremiumField._surface(context),
            borderRadius: BorderRadius.circular(13),
            border: Border.all(
              color: _focused ? PremiumField._accent(context) : PremiumField._hair(context),
              width: _focused ? 1.5 : 1,
            ),
            boxShadow: _focused
                ? [BoxShadow(color: PremiumField._glow(context).withValues(alpha: 0.28), blurRadius: 16, offset: const Offset(0, 4))]
                : null,
          ),
          child: Row(
            children: [
              if (widget.icon != null) ...[
                const SizedBox(width: 14),
                Icon(widget.icon,
                    size: 18, color: _focused ? PremiumField._accent(context) : PremiumField._muted(context)),
              ],
              Expanded(
                child: TextField(
                  controller: _tc,
                  focusNode: _fn,
                  obscureText: widget.obscure,
                  onChanged: (v) {
                    widget.onChanged?.call(v);
                    setState(() {});
                  },
                  cursorColor: PremiumField._accent(context),
                  style: TextStyle(
                      color: PremiumField._ink(context), fontSize: 15, fontWeight: FontWeight.w500),
                  decoration: InputDecoration(
                    isDense: true,
                    contentPadding: const EdgeInsetsDirectional.fromSTEB(14, 14, 14, 14),
                    border: InputBorder.none,
                    hintText: widget.hint,
                    hintStyle: TextStyle(
                        color: dsWear(context, DsAtomColors.premiumShowcasePremiumField7, (l) => l.faint), fontSize: 15, fontWeight: FontWeight.w400),
                  ),
                ),
              ),
            ],
          ),
        ),
        // קו-אורורה תחתון שנדלק בפוקוס
        AnimatedContainer(
          duration: d,
          curve: Curves.easeOut,
          margin: const EdgeInsetsDirectional.fromSTEB(6, 5, 6, 0),
          height: 2,
          width: _focused ? 240 : 0,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(2),
            gradient: LinearGradient(
              colors: [dsWear(context, DsAtomColors.premiumShowcasePremiumField8, (l) => l.success), dsWear(context, DsAtomColors.premiumShowcasePremiumField3, (l) => l.accent), dsWear(context, DsAtomColors.premiumShowcasePremiumField9, (l) => l.accentDark)],
            ),
          ),
        ),
      ],
    );
  }
}
