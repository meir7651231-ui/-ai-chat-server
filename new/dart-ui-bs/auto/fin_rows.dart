// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__finance_hub_sheets:_FinRows (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';
import 'package:buildsmart/theme/config_theme.dart';

class FinRows extends StatelessWidget {
  const FinRows(this.children);
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: DsAtomColors.autoFinRows1,
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        border: Border.all(color: DsAtomColors.autoFinRows2),
      ),
      padding: const EdgeInsets.symmetric(horizontal: BsTokens.space4),
      child: Column(
        children: [
          for (var i = 0; i < children.length; i++) ...[
            if (i > 0) const Divider(height: 1, color: DsAtomColors.autoFinRows2),
            children[i],
          ],
        ],
      ),
    );
  }
}
