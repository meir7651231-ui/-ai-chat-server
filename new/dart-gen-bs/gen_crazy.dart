// 🧬 חולל ע"י המחולל (genesis-gen, הכרעות 17+18) — בקשה ⇒ בחירת-אטומים ⇒ חיווט ⇒ מסך. אל תערוך ידנית.
// 🧬 שם: עיצוב חי - המחולל מצייר
// 🧬 בקשה: עיצוב חי - המחולל מצייר: · הירו 🎆 עיצוב חי | המחולל מרכיב גרפיקה מונפשת מהמדף · כותרת שדה האורות - אטום מוֹשֶׁן טהור · גל 220 60 2 שדה אורות נושם · נתון 🎨 60 פסי גל מונפשים · באנר כל פיקסל כאן חושב מהמחצב - צבעים וגובה מוזרקים בחיווט
// 🧬 אטומים שנבחרו: HeroCard · CaSubTitle · AuroraField · RStat · CoinBanner
import '../dart-data-bs/auto/gen_crazy_content.dart';
import '../dart-ui-bs/aurora_field.dart';
import '../dart-ui-bs/auto/bs_tokens.dart';
import '../dart-ui-bs/auto/ca_sub_title.dart';
import '../dart-ui-bs/auto/coin_banner.dart';
import '../dart-ui-bs/auto/rstat.dart';
import '../dart-ui-bs/hero_card.dart';
import 'package:flutter/material.dart';

class GenCrazyScreen extends StatefulWidget {
  const GenCrazyScreen({super.key});

  @override
  State<GenCrazyScreen> createState() => _GenCrazyScreenState();
}

class _GenCrazyScreenState extends State<GenCrazyScreen> {
  

  void _toast(String msg) => ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(msg), duration: const Duration(seconds: 2)),
      );

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: BsTokens.bgLight,
        appBar: AppBar(title: Text(gen_crazy_app_bar_title)),
        body: ListView(
          padding: const EdgeInsets.symmetric(vertical: 12),
          children: [
          HeroCard(glyph: gen_crazy_card_glyph, title: gen_crazy_card_title, sub: gen_crazy_card_sub, onTap: () => _toast(gen_crazy_card_toast), cardColor: BsTokens.cardLight, inkColor: BsTokens.inkLight, mutedColor: BsTokens.mutedLight, borderColor: BsTokens.divider, radius: 12),
          CaSubTitle(gen_crazy_header_text),
          AuroraField(height: 220, bands: 60, speed: 2, radius: 12, accentColor: BsTokens.brand, baseColor: BsTokens.inkLight, fillColor: BsTokens.cardLight),
          Padding(padding: const EdgeInsets.symmetric(horizontal: 12), child: Row(children: [RStat(value: gen_crazy_stat_value, label: gen_crazy_stat_label)])),
          CoinBanner(coins: 0, sub: gen_crazy_banner_sub),
          ],
        ),
      ),
    );
  }
}
