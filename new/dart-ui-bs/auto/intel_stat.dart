// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__intel__intel_tab:_IntelStat (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';

class IntelStat extends StatelessWidget {
  const IntelStat({
    required this.emoji,
    required this.value,
    required this.label,
  });

  final String emoji;
  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Semantics(
        label: '$emoji $label: $value',
        child: Container(
          padding: const EdgeInsetsDirectional.symmetric(
            horizontal: BsTokens.space3,
            vertical: BsTokens.space3,
          ),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(BsTokens.radiusCard),
            border: Border.all(color: dsWear(context, BsTokens.divider, (l) => l.line)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(emoji, style: const TextStyle(fontSize: 18)),
              const SizedBox(height: BsTokens.spaceHair),
              Text(
                value,
                style: TextStyle(
                  color: dsWear(context, BsTokens.brand, (l) => l.accent),
                  fontWeight: FontWeight.w800,
                  fontSize: 22,
                  height: 1.1,
                ),
              ),
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: dsWear(context, BsTokens.mutedLight, (l) => l.muted),
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
