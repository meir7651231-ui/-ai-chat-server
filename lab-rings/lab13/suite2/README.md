# suite2: a fresh 100-task generalization benchmark

This is a second benchmark, kept separate from `../suite` (100 tasks). The machine
was developed against suite 1 and has never seen these tasks. Same domain as suite 1:
4-bit values. `num` takes 1 to 3 inputs from cells [0,1,3]. List tasks take distinct
values 8..15, length 0..8.

## Files (100 tasks)

| file | tasks | content |
|---|---|---|
| bits.json | 12 | num: bit tricks (inverse Gray, lowest set bit, leading zeros, bit set/toggle/merge), modular and saturating arithmetic |
| nums.json | 12 | num: app arithmetic (loyalty card, buy-k-get-1, bulk price, 12h clock, shift window, bill split, rock-paper-scissors) |
| stats.json | 12 | list2num: order statistics and positions (bronze, 2/3 position, upper quartile, inversions, spread, winner margin) |
| agg2.json | 12 | list2num: aggregates (ascents, peaks, consecutive-value chain, XOR/AND, above-mean count, half difference, crates of 10) |
| reorder2.json | 12 | list2list: permutations (pair swaps, half reversals, interleave, key sorts, in-place sort of evens, first half) |
| decide2.json | 12 | list2list: data-dependent filters (trim heavy side, above median, greedy knapsack 40, peak-to-trough slice, opening trend) |
| app2.json | 12 | mixed app features (calendar free slot, leaderboard place, meeting overlap, reorder, queue misplacement, podium, cart trim) |
| critic.json | 16 | gap filler: easy app tasks, a triangle classifier, stock max-profit, a knockout round, and the first pair summing to 23 |

## Counts

| kind | easy | medium | hard | total |
|---|---|---|---|---|
| num | 11 | 13 | 10 | 34 |
| list2num | 11 | 13 | 9 | 33 |
| list2list | 8 | 14 | 11 | 33 |
| **total** | **30** | **40** | **30** | **100** |

`num` input cells: [0] x5, [1] x1, [3] x1, [0,1] x10, [0,3] x2, [1,3] x2, [0,1,3] x13.

## What is new compared with suite 1

- **Different structures.** Suite 1 relies heavily on fixed-set filters, fixed-threshold
  filters and prefix scans. Suite2 adds:
  - order statistics at new ranks (3rd largest, the 2/3 position, upper quartile, winner margin)
  - pairwise or global relations (inversions, max profit over i<j, first pair summing to 23, misplaced count)
  - neighbor structure (ascents, peaks, biggest jump, consecutive-value chain)
  - half or pair layouts (swap pairs, reverse each half, interleave halves, knockout round, heavier half)
  - stable or key-based sorts (mod 3, XOR 5, distance to 12, in-place sort of evens)
- **Internal values above 15.** Some tasks compare or divide sums and products that need
  more than 4 bits before the result is reduced: knapsack 40, cart trimmed to 40, the
  order that crosses 20, crates of 10, the mean-based tasks, the half difference, bill
  split, the triangle inequality, order approval (q*p>20), the checksum (sum mod 16),
  the pair summing to 23 and the average-12 quality run.
- **App features** (about 35 tasks). Examples: loyalty card, buy-k-get-1, bulk pricing,
  12h clock, shift check, bill split, price-limit pick, minutes late, ticket by age,
  rounding to 5, exam passes, calendar free slot, leaderboard place, meeting overlap,
  restock, queue order, rating bucket, next free locker, podium, cart trimming, one item
  per category, pagination, undo, delete the 3rd item, cheapest item and gift-card pair.

## Validation (`check-all.mjs`)

`nice -n 19 node check-all.mjs [nearThreshold]` re-validates every `*.json` here and checks:

- the src parses
- fields, ins and arity are valid
- num tasks are checked on their full input space; list tasks on 2000 seeded random lists
  (the empty list and sorted and reverse runs included)
- results are in range: an integer 0..15, or for list2list an array of distinct input members
- no input mutation, determinism, not constant, not near-identity

It also checks behavioral duplicates against every same-kind (and, for num, same-ins)
task in `../suite/*.json` and inside suite2. Final result: 100/100 pass, 0 identical.
The highest agreement with any other task is 0.781 (with suite 1). Inside suite2, every
pair agrees below 0.70.

The critic also replaced four structural near-duplicates of suite 1 that passed the
behavioral test but were mirror images or special cases of suite 1 tasks:

| replaced | why | replaced by |
|---|---|---|
| rotate right | mirror of rotate left | first half |
| index of min | mirror of index of max | spread max-min |
| 2nd largest | mirror of 2nd smallest | abs(last-first) |
| signed abs | the b=0 case of circular distance | leading zeros |

One critic draft, cart sum > 50, was dropped because it agreed 98.8% with suite 1's
length>4. It became the checksum task.
