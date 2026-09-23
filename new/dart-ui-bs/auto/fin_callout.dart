// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__finance_hub_sheets:_FinCallout (בנייה-חכמה main) · צרור-2
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';
import 'package:buildsmart/theme/config_theme.dart';

class FinCallout extends StatelessWidget {
  const FinCallout({
    required this.label,
    required this.value,
    this.big = false,
    this.valueColor,
    this.note,
    this.secondLabel,
    this.secondValue,
  });
  final String label;
  final String value;
  final bool big;
  final Color? valueColor;
  final String? note;
  final String? secondLabel;
  final String? secondValue;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: BsTokens.space4),
      padding: const EdgeInsets.all(BsTokens.space4),
      decoration: BoxDecoration(
        color: dsWear(context, DsAtomColors.autoFinCallout1, (l) => l.chipBg),
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        border: Border.all(color: dsWear(context, DsAtomColors.autoFinCallout2, (l) => l.ink)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(color: _kBrandTeal(context), fontSize: 12.5),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              color: valueColor ?? dsWear(context, BsTokens.inkLight, (l) => l.ink),
              fontWeight: FontWeight.w800,
              fontSize: big ? 26 : 18,
            ),
          ),
          if (secondLabel != null) ...[
            const SizedBox(height: BsTokens.space2),
            Text(
              secondLabel!,
              style: TextStyle(color: _kBrandTeal(context), fontSize: 12.5),
            ),
            const SizedBox(height: 4),
            Text(
              secondValue ?? '',
              style: TextStyle(
                color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
                fontWeight: FontWeight.w800,
                fontSize: 26,
              ),
            ),
          ],
          if (note != null) ...[
            const SizedBox(height: 6),
            Text(
              note!,
              style: TextStyle(color: dsWear(context, BsTokens.mutedLight, (l) => l.muted), fontSize: 12),
            ),
          ],
        ],
      ),
    );
  }
}

const _kBrandTeal0 = BsTokens.brand;

Color _kBrandTeal(BuildContext context) => dsWear(context, BsTokens.brand, (l) => l.accent);   // לובש עור · _kBrandTeal0 = הערך-הכהה
