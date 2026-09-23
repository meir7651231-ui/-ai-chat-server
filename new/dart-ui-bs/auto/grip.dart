// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__persona_picking_sheet:_Grip (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';

class Grip extends StatelessWidget {
  const Grip();
  @override
  Widget build(BuildContext context) => Center(
    child: Container(
      width: 38,
      height: 4,
      decoration: BoxDecoration(
        color: dsWear(context, DsAtomColors.autoGrip1, (l) => l.ink),
        borderRadius: BorderRadius.circular(2),
      ),
    ),
  );
}
