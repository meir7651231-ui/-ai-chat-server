// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__lipskey_product_sheet:_Divider (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';

class LipskeyProductSheetDivider extends StatelessWidget {
  const LipskeyProductSheetDivider();

  @override
  Widget build(BuildContext context) => Divider(
      height: 1, color: dsWear(context, DsAtomColors.autoLipskeyProductSheetDivider1, (l) => l.ink), indent: 20, endIndent: 20);
}
