// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__lipskey_products_screen:_LensGroupHeader (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class LensGroupHeader extends StatelessWidget {
  const LensGroupHeader({
    required this.title,
    required this.count,
    this.smartTree = false,
  });

  final String title;
  final int count;
  final bool smartTree;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: smartTree ? dsWear(context, DsAtomColors.autoLensGroupHeader1, (l) => l.chipBg) : dsWear(context, DsAtomColors.autoLensGroupHeader2, (l) => l.chipBg),
      padding: const EdgeInsets.fromLTRB(14, 9, 14, 9),
      child: Row(
        children: [
          if (smartTree) ...[
            const Text('🌳', style: TextStyle(fontSize: 14)),
            const SizedBox(width: 6),
          ],
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
                fontSize: 14,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          Text(
            '$count',
            style: TextStyle(
              color: dsWear(context, DsAtomColors.autoLensGroupHeader3, (l) => l.muted),
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
