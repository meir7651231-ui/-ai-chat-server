# pashut-lab — the work of 28.9.2026

A separate folder. It doesn't touch anything else in the repo.

## What's here
- `pashut/` — **the language "פשוט"**: Hebrew → C (a fast program) or → JavaScript (a website).
  The compiler `pashut.py`, the runtimes `runtime.h` / `runtime.js`, tests in `tests/`, a guide in `pashut/קרא_אותי.md`.
- `pashut/examples/` — programs written in the language, including:
  - `לומד.פשוט` — a network that learns by itself to write tiny programs (+1 ×2 −1). 12% ⇒ 100% in 1.5 seconds.
  - `אותיות.פשוט` / `עיניים.פשוט` / `קורא_אותיות.פשוט` — networks that learn to read Hebrew letters from a picture.
    The best one (`קורא_אותיות`, 49 fonts): **99%** on fonts it never saw (clean images), 91% with noise.
- `pashut/letters/` — makes the letter images: `make3.py` (24×24, 49 fonts). The fonts: `get_fonts.sh`.
  The image files themselves (.txt, ~27MB) were not saved — they are regenerated.
- `nn/proto.py` — the Python prototype of "לומד".
- `site/` — the pages that were published (shopping list, sudoku, spreadsheet).
- `lab-rings-lab13/` — **connecting the network to the engine from `claude/lab-rings`** (copy these into `lab-rings/lab13` there to run):
  - `guided.mjs` + `experiment.mjs` — a network that tells the search which action to try.
    Result: "end of list" — **2 seconds instead of 139** (16 steps instead of 31). "list length" / "search list" — not solved.
  - `pieces.mjs` + `pexp.mjs` + `pnet.mjs` — search over whole pieces (858 variants of the memory's pieces), and a network that chooses pieces.
    `handcheck.mjs`: a 5-piece solution to "list length" exists — the search just doesn't reach it.
  - `school.mjs` — a "school": lessons from easy to hard, the network learns from every solution. Saves progress to `school-*.json`.
  - `*.log` — results of every run.

## Running
```
cd pashut && python3 pashut.py examples/שלום.פשוט --הרץ
cd pashut && python3 letters/make3.py && python3 pashut.py examples/קורא_אותיות.פשוט --הרץ   # (after get_fonts.sh)
```
