// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__chats_screen:_DateChip (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
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
          color: DsAtomColors.autoDateChip1,
          borderRadius: BorderRadius.circular(14),
          boxShadow: const [
            BoxShadow(
              color: DsAtomColors.autoDateChip2,
              blurRadius: 2,
              offset: Offset(0, 1),
            ),
          ],
        ),
        child: Text(
          date,
          style: const TextStyle(
            color: DsAtomColors.autoDateChip3,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
}
