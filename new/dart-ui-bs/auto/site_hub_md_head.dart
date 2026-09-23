// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__site_hub_screen:_MdHead (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';

class SiteHubMdHead extends StatelessWidget {
  const SiteHubMdHead({required this.icon, required this.title, required this.sub});
  final String icon;
  final String title;
  final String sub;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(icon, style: const TextStyle(fontSize: 34)),
        const SizedBox(height: 6),
        Text(
          title,
          style: TextStyle(
            color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
            fontWeight: FontWeight.w900,
            fontSize: 19,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          sub,
          style: TextStyle(color: dsWear(context, BsTokens.mutedLight, (l) => l.muted), fontSize: 13),
        ),
      ],
    );
  }
}
