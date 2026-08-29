// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__worker_report_drilldowns:_GroupHeader (בנייה-חכמה main)
// משרת-גם (זהה-מבנית): screens__worker_task_detail_sheet:_SecH
import 'package:flutter/material.dart';

class GroupHeader extends StatelessWidget {
  const GroupHeader(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: BsTokens.space1),
      child: Text(
        text,
        style: const TextStyle(
          color: BsTokens.inkLight,
          fontWeight: FontWeight.w800,
          fontSize: 13.5,
        ),
      ),
    );
  }
}
