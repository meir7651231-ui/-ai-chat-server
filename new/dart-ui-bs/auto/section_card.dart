// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__docs_readiness_gate:_SectionCard (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class SectionCard extends StatelessWidget {
  const SectionCard({
    required this.title,
    required this.lines,
    required this.accent,
    this.emptyText,
  });

  final String title;
  final List<String> lines;
  final Color accent;
  final String? emptyText;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(BsTokens.space4),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(BsTokens.radiusCard),
        boxShadow: [
          BoxShadow(
            color: dsWear(context, DsAtomColors.autoSectionCard1, (l) => l.bg.withValues(alpha: 0.078)),
            blurRadius: 10,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
              fontWeight: FontWeight.w800,
              fontSize: 15,
            ),
          ),
          const SizedBox(height: BsTokens.space2),
          if (lines.isEmpty && emptyText != null)
            Text(
              emptyText!,
              style: TextStyle(
                color: dsWear(context, BsTokens.mutedLight, (l) => l.muted),
                fontSize: 13.5,
              ),
            )
          else
            for (final line in lines)
              Padding(
                padding: const EdgeInsets.only(bottom: BsTokens.space2),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      margin: const EdgeInsetsDirectional.only(top: 6),
                      decoration: BoxDecoration(
                        color: accent,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: BsTokens.space2),
                    Expanded(
                      child: Text(
                        line,
                        style: TextStyle(
                          color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
                          fontSize: 13.5,
                          height: 1.35,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
        ],
      ),
    );
  }
}
