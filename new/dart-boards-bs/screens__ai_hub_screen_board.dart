// 🔌 חולל ע"י מחולל-הלוחות (board-gen) — הלוח = המקום-היחיד שנוגע-בחיווט (חוק-3).
// מקור-החיווט: screens__ai_hub_screen.dart (בנייה-חכמה main) · מחווט: 10 · TODO: 3.
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:buildsmart/logic/ai_hub_logic.dart';
import 'package:buildsmart/screens/barcode_scanner.dart';
import 'package:buildsmart/screens/contractor_tools_sheets.dart';
import 'package:buildsmart/services/voice.dart';
import 'package:buildsmart/services/weather.dart';
import 'package:buildsmart/state/under_construction.dart';
import 'package:buildsmart/theme/tokens.dart';
import 'package:buildsmart/widgets/studio/cfg_text.dart';
import 'package:buildsmart/widgets/toast.dart';
import '../dart-screens-bs/ai_hub_screen.g.dart';

class AiHubScreenBoard extends ConsumerWidget {
  const AiHubScreenBoard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AiHubScreenComposed(
      onTap: () {} /* TODO-לוח */,
      bad: false,
      child: AiCardSub(
              'אין עדיין היסטוריית צריכה — בצע הזמנות כדי לקבל חיזוי מלאי',
            ),
      danger: p.urgent,
      ic: t.ic,
      label: '' /* TODO-לוח: String */,
      overdue: false,
      pct: g.pct.clamp(0, 100),
      pill: '' /* TODO-לוח: String */,
      sub: t.s,
      text: '🧮 מחושב מתוך היסטוריית ההזמנות והעגלה החיה — קצב צריכה ומלאי נוכחי',
      title: t.t,
      value: fMoney(d.order),
      t: AiHubScreenTokens(),
    );
  }
}
