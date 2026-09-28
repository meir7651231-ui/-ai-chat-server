#!/bin/sh
# Downloads Google's Hebrew fonts into gfonts/ (needed for make3.py). The list of fonts that were used is in gfonts.txt.
mkdir -p gfonts && cd gfonts
for fam in Heebo Assistant Rubik Alef "Frank Ruhl Libre" "David Libre" "Miriam Libre" "Secular One" "Suez One" "Varela Round" "Noto Sans Hebrew" "Noto Serif Hebrew" Bellefair "Amatic SC" Karantina Tinos Arimo Cousine "IBM Plex Sans Hebrew" "Open Sans" Fredoka "Playpen Sans Hebrew" "Bona Nova SC" "Bona Nova" "M PLUS 1p" "Gveret Levin" "Rubik Mono One"; do
  q=$(echo "$fam" | sed 's/ /+/g')
  curl -sS -A "Mozilla/4.0" "https://fonts.googleapis.com/css?family=$q:400,700&subset=hebrew" | grep -o 'https://[^)]*\.ttf' | while read u; do curl -sS -o "$(echo "$fam" | tr -d ' ')-$(basename "$u")" "$u"; done
done
