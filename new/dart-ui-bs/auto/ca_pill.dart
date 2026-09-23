// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__site_hub_screen:_CaPill (בנייה-חכמה main) · צרור-2
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class CaPill extends StatelessWidget {
  const CaPill(this.label, {this.done = false});
  final String label;
  final bool done;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
      decoration: BoxDecoration(
        color: done
            ? dsWear(context, DsAtomColors.autoCaPill1, (l) => l.faint.withValues(alpha: 0.141))
            : dsWear(context, DsAtomColors.autoCaPill2, (l) => l.faint.withValues(alpha: 0.141)),
        borderRadius: BorderRadius.circular(BsTokens.radiusPill),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: done ? dsWear(context, BsTokens.mutedLight, (l) => l.muted) : _kBrandDark(context),
          fontWeight: FontWeight.w800,
          fontSize: 10,
        ),
      ),
    );
  }
}

const _kBrandDark0 = BsTokens.brandDark;

Color _kBrandDark(BuildContext context) => dsWear(context, BsTokens.brandDark, (l) => l.accentDark);   // לובש עור · _kBrandDark0 = הערך-הכהה
