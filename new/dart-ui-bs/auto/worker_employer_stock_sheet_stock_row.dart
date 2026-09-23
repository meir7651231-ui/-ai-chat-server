// 🧽 לוטש ע"י מנוע-המטרות (data-lift v3) — דאטה/מודל/תבנית הורמו ל-props לפי מטרתם, אל תערוך ידנית.
// מוצא: screens__worker_employer_stock_sheet:_StockRow (בנייה-חכמה main) · צרור-1 · מודל-שוטח: 2 שדות · props-שורש: label, label2, location, name
// התוכן: new/dart-data-bs/auto/screens__worker_employer_stock_sheet_content.dart
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class WorkerEmployerStockSheetStockRow extends StatelessWidget {
  WorkerEmployerStockSheetStockRow({required this.label, required this.label2, required this.location, required this.name, });
  final String label;
  final String label2;
  final String location;
  final String name;

  @override
  Widget build(BuildContext context) {
    late final warehouse = location == 'warehouse';
    return Container(
      constraints: const BoxConstraints(minHeight: 48),
      margin: const EdgeInsets.only(bottom: BsTokens.space2),
      padding: const EdgeInsets.symmetric(
        horizontal: BsTokens.space3,
        vertical: BsTokens.space2),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(BsTokens.radiusCard),
        border: Border.all(color: dsWear(context, DsAtomColors.autoWorkerEmployerStockSheetStockRow1, (l) => l.ink)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              name,
              style: const TextStyle(
                color: BsTokens.inkLight,
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
            ),
          ),
          const SizedBox(width: BsTokens.space2),
          Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: warehouse
                  ? dsWear(context, DsAtomColors.autoWorkerEmployerStockSheetStockRow2, (l) => l.chipBg)
                  : dsWear(context, DsAtomColors.autoWorkerEmployerStockSheetStockRow3, (l) => l.ink),
              borderRadius: BorderRadius.circular(BsTokens.radiusPill),
            ),
            child: Text(
              warehouse ? label : label2,
              style: TextStyle(
                color: warehouse ? BsTokens.mutedLight : dsWear(context, BsTokens.brandDark, (l) => l.accentDark),
                fontSize: 12,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
