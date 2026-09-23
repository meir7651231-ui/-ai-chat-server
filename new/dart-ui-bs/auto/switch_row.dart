// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__catalog_settings_screen:_SwitchRow (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';

class SwitchRow extends StatelessWidget {
  const SwitchRow({
    required this.label,
    required this.value,
    required this.onChanged,
  });

  final String label;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return SwitchListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
      title: Text(label, style: TextStyle(color: dsWear(context, BsTokens.inkLight, (l) => l.ink))),
      value: value,
      activeColor: dsWear(context, BsTokens.brand, (l) => l.accent),
      onChanged: onChanged,
    );
  }
}
