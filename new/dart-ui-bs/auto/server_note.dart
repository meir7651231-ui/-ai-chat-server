// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__rewards_hub_screen:_ServerNote (בנייה-חכמה main)
import 'package:flutter/material.dart';

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
          style: const TextStyle(color: BsTokens.mutedLight, fontSize: 12)),
    );
  }
}
