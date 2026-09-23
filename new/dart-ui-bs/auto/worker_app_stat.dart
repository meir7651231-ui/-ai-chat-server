// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__worker_app_screen:_Stat (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';

class WorkerAppStat extends StatelessWidget {
  const WorkerAppStat({required this.value, required this.label});

  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Text(
            value,
            style: TextStyle(
              color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
              fontWeight: FontWeight.w800,
              fontSize: 18,
            ),
          ),
          Text(
            label,
            style: TextStyle(color: dsWear(context, BsTokens.mutedLight, (l) => l.muted), fontSize: 12),
          ),
        ],
      ),
    );
  }
}
