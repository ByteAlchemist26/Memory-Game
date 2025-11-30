// src/data/cards.js
export default function generateCards() {
  const symbols = [
    "🍎", "🍌", "🍒", "🍇", "🍉",
    "🍑", "🍍", "🥝", "🥥", "🥭",
    "🍓", "🍈"
  ];

  // create 12 pairs → 24 cards
  const pairs = symbols.flatMap((symbol, index) => [
    { id: index * 2, symbol, matched: false },
    { id: index * 2 + 1, symbol, matched: false }
  ]);

  // shuffle
  const cards = [...pairs].sort(() => Math.random() - 0.5);

  return cards;
}
