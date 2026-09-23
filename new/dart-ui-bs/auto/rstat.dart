// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__courier_reports_tab:_RStat (בנייה-חכמה main) · Stateless
// משרת-גם (זהה-מבנית): screens__manager_profile_screen:_PStat
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class RStat extends StatelessWidget {
  const RStat({required this.value, required this.label});
  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 3),
        padding: const EdgeInsets.symmetric(vertical: BsTokens.space3),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(BsTokens.radiusCard),
          boxShadow: [
            BoxShadow(
              color: dsWear(context, DsAtomColors.autoRstat1, (l) => l.bg.withValues(alpha: 0.059)),
              blurRadius: 8,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Text(
              value,
              style: TextStyle(
                color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
                fontWeight: FontWeight.w800,
                fontSize: 17,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(color: dsWear(context, BsTokens.mutedLight, (l) => l.muted), fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}
