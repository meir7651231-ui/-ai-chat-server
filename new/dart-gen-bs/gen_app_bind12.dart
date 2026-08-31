// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מחבר-ישות-למסך: רשומות-ישות ⇒ מסך-Composed מפורק (סורק-אוטומטי). אל תערוך ידנית.
import '../dart-screens-bs/trade_builder_attribute_schema_editor.g.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';

class GenAppBind12Screen extends StatelessWidget {
  const GenAppBind12Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => TradeBuilderAttributeSchemaEditorComposed(
          onTap: () {},
          enabled: false,
          matchChipItems: appStore.records('app_ent12').map((r) => MatchChipItem(text: r.entries.firstWhere((e) => !e.key.startsWith('__') && e.value.trim().isNotEmpty, orElse: () => MapEntry('', r['__id'] ?? '')).value.trim())).toList(),
          valueChipItems: const [],
          t: const TradeBuilderAttributeSchemaEditorTokens(),
        ),
      );
}
