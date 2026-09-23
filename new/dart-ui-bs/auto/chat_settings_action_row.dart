// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__chat_settings_screen:_ActionRow (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class ChatSettingsActionRow extends StatelessWidget {
  const ChatSettingsActionRow({
    required this.label,
    required this.buttonLabel,
    required this.onTap,
    this.destructive = false,
  });

  final String label;
  final String buttonLabel;
  final VoidCallback onTap;
  final bool destructive;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
      title: Text(label, style: const TextStyle(color: BsTokens.inkLight)),
      trailing: TextButton(
        onPressed: onTap,
        style: TextButton.styleFrom(
          foregroundColor: destructive ? dsWear(context, DsAtomColors.autoChatSettingsActionRow1, (l) => l.danger) : dsWear(context, BsTokens.brand, (l) => l.accent),
        ),
        child: Text(buttonLabel),
      ),
    );
  }
}
