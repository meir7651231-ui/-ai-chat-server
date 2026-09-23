// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__store_dashboard_screen:_Chip (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';
import 'package:buildsmart/theme/app_theme.dart';

class StoreDashboardChip extends StatelessWidget {
  const StoreDashboardChip({required this.label, required this.on, required this.onTap});
  final String label;
  final bool on;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: on ? dsWear(context, BsTokens.brand, (l) => l.accent) : Theme.of(context).colorScheme.surface,
      borderRadius: BorderRadius.circular(BsTokens.radiusPill),
      child: InkWell(
        borderRadius: BorderRadius.circular(BsTokens.radiusPill),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          child: Text(
            label,
            style: TextStyle(
              color: on ? bsOnAccent(context) : dsWear(context, BsTokens.inkLight, (l) => l.ink),
              fontWeight: FontWeight.w700,
              fontSize: 13,
            ),
          ),
        ),
      ),
    );
  }
}
