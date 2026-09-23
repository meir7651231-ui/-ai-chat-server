// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__finance_hub_sheets:_ReportTable (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';

class ReportTable extends StatelessWidget {
  ReportTable({required this.rows});
  final List<(String, String, bool)> rows; // (label, value, big)
  @override
  Widget build(BuildContext context) {
    final border = BorderSide(color: dsWear(context, DsAtomColors.autoReportTable1, (l) => l.line));
    return Table(
      border: TableBorder(
        top: border,
        bottom: border,
        left: border,
        right: border,
        horizontalInside: border,
        verticalInside: border,
      ),
      columnWidths: const {0: FlexColumnWidth(2), 1: FlexColumnWidth()},
      children: [
        for (final r in rows)
          TableRow(
            children: [
              Padding(
                padding: const EdgeInsets.all(8),
                child: Text(
                  r.$1,
                  style: TextStyle(
                    color: dsWear(context, DsAtomColors.autoReportTable2, (l) => l.cardAlt),
                    fontSize: 13,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8),
                child: Text(
                  r.$2,
                  textAlign: TextAlign.left,
                  style: TextStyle(
                    color: dsWear(context, DsAtomColors.autoReportTable2, (l) => l.cardAlt),
                    fontSize: r.$3 ? 16 : 13,
                    fontWeight: r.$3 ? FontWeight.w800 : FontWeight.w400,
                  ),
                ),
              ),
            ],
          ),
      ],
    );
  }
}
