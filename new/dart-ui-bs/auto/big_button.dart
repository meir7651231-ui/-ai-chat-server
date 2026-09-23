// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__store_dashboard_screen:_BigButton (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';
import 'package:buildsmart/theme/config_theme.dart';

class BigButton extends StatelessWidget {
  const BigButton({required this.label, required this.onTap});
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: dsWear(context, DsAtomColors.autoBigButton1, (l) => l.ink),
      borderRadius: BorderRadius.circular(cfgRadius(context)),
      child: InkWell(
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: BsTokens.space4),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: dsWear(context, BsTokens.brandDark, (l) => l.accentDark),
              fontWeight: FontWeight.w800,
              fontSize: 15,
            ),
          ),
        ),
      ),
    );
  }
}
