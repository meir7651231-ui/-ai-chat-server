// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__rewards_hub_screen:_FinTile (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';
import 'package:buildsmart/theme/config_theme.dart';

class FinTile extends StatelessWidget {
  const FinTile({
    required this.ic,
    required this.title,
    required this.sub,
    required this.onTap,
  });

  final String ic;
  final String title;
  final String sub;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Theme.of(context).colorScheme.surface,
      borderRadius: BorderRadius.circular(cfgRadius(context)),
      child: InkWell(
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(BsTokens.space3),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(cfgRadius(context)),
            border: Border.all(color: dsWear(context, DsAtomColors.autoFinTile1, (l) => l.ink)),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(ic, style: const TextStyle(fontSize: 26)),
              const SizedBox(height: 6),
              Text(
                title,
                style: TextStyle(
                  color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
                  fontWeight: FontWeight.w800,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 2),
              Text(sub,
                  style: TextStyle(color: dsWear(context, BsTokens.mutedLight, (l) => l.muted), fontSize: 12)),
            ],
          ),
        ),
      ),
    );
  }
}
