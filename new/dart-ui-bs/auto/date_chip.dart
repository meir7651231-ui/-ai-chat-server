// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__chats_screen:_DateChip (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';

class DateChip extends StatelessWidget {
  const DateChip({required this.date});
  final String date;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 10),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
        decoration: BoxDecoration(
          color: dsWear(context, DsAtomColors.autoDateChip1, (l) => l.ink),
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: dsWear(context, DsAtomColors.autoDateChip2, (l) => l.bg.withValues(alpha: 0.078)),
              blurRadius: 2,
              offset: Offset(0, 1),
            ),
          ],
        ),
        child: Text(
          date,
          style: TextStyle(
            color: dsWear(context, DsAtomColors.autoDateChip3, (l) => l.faint),
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
}
