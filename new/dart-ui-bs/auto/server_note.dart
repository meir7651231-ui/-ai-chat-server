// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__rewards_hub_screen:_ServerNote (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';
import 'package:buildsmart/theme/config_theme.dart';

class ServerNote extends StatelessWidget {
  const ServerNote(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(BsTokens.space3),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(cfgRadius(context)),
      ),
      child: Text(text,
          style: TextStyle(color: dsWear(context, BsTokens.mutedLight, (l) => l.muted), fontSize: 12)),
    );
  }
}
