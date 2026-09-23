// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: features__catalog_config__catalog_config_screen:_CountBadge (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class CatalogConfigCatalogConfigCountBadge extends StatelessWidget {
  const CatalogConfigCatalogConfigCountBadge({required this.count});

  final int count;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: BsTokens.space2,
        vertical: 2,
      ),
      decoration: BoxDecoration(
        color: dsWear(context, BsTokens.brand, (l) => l.accent),
        borderRadius: BorderRadius.all(Radius.circular(BsTokens.radiusPill)),
      ),
      child: Text(
        '$count',
        style: TextStyle(
          color: dsWear(context, DsAtomColors.autoCatalogConfigCatalogConfigCountBadge1, (l) => l.onAccent),
          fontSize: BsTokens.typeCaption,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
