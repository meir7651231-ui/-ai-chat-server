// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__worker_reports_tab:_ThumbPlaceholder (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class ThumbPlaceholder extends StatelessWidget {
  const ThumbPlaceholder({required this.glyph});

  final String glyph;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 48,
      height: 48,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: dsWear(context, DsAtomColors.autoThumbPlaceholder1, (l) => l.chipBg),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(
        glyph,
        style: TextStyle(fontSize: 18, color: dsWear(context, BsTokens.mutedLight, (l) => l.muted)),
      ),
    );
  }
}
