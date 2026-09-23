// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__courier_dashboard_screen:_FlatCard (בנייה-חכמה main) · Stateless
// משרת-גם (זהה-מבנית): screens__store_dashboard_screen:_FlatCard
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';
import 'package:buildsmart/theme/config_theme.dart';

class FlatCard extends StatelessWidget {
  const FlatCard({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(BsTokens.space4),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        boxShadow: [
          BoxShadow(
            color: dsWear(context, DsAtomColors.autoFlatCard1, (l) => l.bg.withValues(alpha: 0.059)),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: child,
    );
  }
}
