// 📦 קופסת-חיבורים · bs-matching (בנייה-חכמה) — התאמה-מטושטשת (Damerau-Levenshtein).
// חוזה: bs-matching.contract.md. מקור-האמת: buildsmart/app_flutter/lib/logic (fuzzy_*).
// זו הקופסה הראשונה של דומיין-בנייה-חכמה שנכנסת ללוח-האם המאוחד (board.dart).
// מחווטת אטומי-בנייה-חכמה מ-../dart/. שקע-המדיניות fuzzyTolerance = הכרעת-קופסה (חוק-5).
import '../dart/fuzzy_match.dart' as fm;
import '../dart/fuzzy_name_match.dart' as fnm;
import '../dart/fuzzy_score.dart' as fs;
import '../dart/norm_search.dart' as ns;
import '../dart/damerau_levenshtein.dart' as dl;

// ── הכרעת-קופסה: מדיניות-הסבילות (verbatim מ-buildsmart) — אורך≥4 ⇒ טעות-אחת מותרת ──
int _fuzzyTolerance(int len) => len >= 4 ? 1 : 0;

// ── החיווט ──
bool fuzzyMatch(String query, String candidate) => fm.fuzzyMatch(
      query, candidate,
      normSearch: ns.normSearch, damerauLevenshtein: dl.damerauLevenshtein, fuzzyTolerance: _fuzzyTolerance,
    );

bool fuzzyNameMatch(String query, String candidate) =>
    fnm.fuzzyNameMatch(query, candidate, fuzzyMatch: fuzzyMatch);

int fuzzyScore(String query, String candidate) => fs.fuzzyScore(
      query, candidate,
      normSearch: ns.normSearch, damerauLevenshtein: dl.damerauLevenshtein, fuzzyTolerance: _fuzzyTolerance,
    );
