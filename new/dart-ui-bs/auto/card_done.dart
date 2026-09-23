// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__site_hub_screen:_CardDone (בנייה-חכמה main) · צרור-2
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';

class CardDone extends StatelessWidget {
  const CardDone(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(top: 9),
        child: Text(
          text,
          textAlign: TextAlign.center,
          style: TextStyle(
            color: _kOk(context),
            fontWeight: FontWeight.w800,
            fontSize: 11,
          ),
        ),
      );
}


Color _kOk(BuildContext context) => dsWear(context, DsAtomColors.autoCardDone1, (l) => l.faint);   // לובש עור · _kOk0 = הערך-הכהה
