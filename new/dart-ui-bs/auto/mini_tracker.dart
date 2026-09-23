// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__manager_dashboard_screen:_MiniTracker (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';
import 'package:buildsmart/logic/manager_dashboard.dart';

class MiniTracker extends StatelessWidget {
  const MiniTracker({required this.stageIdx});

  final int stageIdx;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        for (var i = 0; i < kManagerOrderFlow.length; i++) ...[
          Expanded(
            child: Container(
              height: 5,
              decoration: BoxDecoration(
                color: i <= stageIdx ? dsWear(context, BsTokens.brand, (l) => l.accent) : dsWear(context, DsAtomColors.autoMiniTracker1, (l) => l.ink),
                borderRadius: BorderRadius.circular(BsTokens.radiusPill),
              ),
            ),
          ),
          if (i < kManagerOrderFlow.length - 1) const SizedBox(width: 4),
        ],
      ],
    );
  }
}
