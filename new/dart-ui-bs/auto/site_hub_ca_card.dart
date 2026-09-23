// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__site_hub_screen:_CaCard (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class SiteHubCaCard extends StatelessWidget {
  const SiteHubCaCard({required this.child, this.overdue = false});
  final Widget child;
  final bool overdue;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: BsTokens.space2),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        border: Border.all(
          color: overdue ? DsAtomColors.autoSiteHubCaCard1 : DsAtomColors.autoSiteHubCaCard2,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: child,
    );
  }
}
