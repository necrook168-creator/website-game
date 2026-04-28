"use client";

import { useEffect, useState } from "react";
import cardStyles from "./GameCard.module.css";
import styles from "./MemoryMatchGame.module.css";

const icons = ["🎮", "🎯", "🚀", "⭐", "🎵", "🔥", "🧠", "🍀"] as const;

type MemoryCard = {
  id: number;
  icon: string;
  revealed: boolean;
  matched: boolean;
};

function shuffle<T>(list: T[]) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createDeck(): MemoryCard[] {
  return shuffle(
    icons.concat(icons).map((icon, index) => ({
      id: index,
      icon,
      revealed: false,
      matched: false
    }))
  );
}

export function MemoryMatchGame() {
  const [deck, setDeck] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setDeck(createDeck());
  }, []);

  const completionMessage =
    matchedPairs === icons.length ? `你完成了全部配对，总步数 ${moves}。` : null;

  const resetGame = () => {
    setDeck(createDeck());
    setFlipped([]);
    setMatchedPairs(0);
    setMoves(0);
    setLocked(false);
  };

  const handleTurn = (index: number) => {
    const currentCard = deck[index];
    if (!currentCard || locked || currentCard.matched || currentCard.revealed) {
      return;
    }

    const nextDeck = deck.map((card, cardIndex) =>
      cardIndex === index ? { ...card, revealed: true } : card
    );
    const nextFlipped = [...flipped, index];

    setDeck(nextDeck);
    setFlipped(nextFlipped);

    if (nextFlipped.length < 2) {
      return;
    }

    const [firstIndex, secondIndex] = nextFlipped;
    const firstCard = nextDeck[firstIndex];
    const secondCard = nextDeck[secondIndex];

    setMoves((current) => current + 1);
    setLocked(true);

    if (firstCard.icon === secondCard.icon) {
      const matchedDeck = nextDeck.map((card, cardIndex) =>
        cardIndex === firstIndex || cardIndex === secondIndex
          ? { ...card, matched: true }
          : card
      );

      setDeck(matchedDeck);
      setFlipped([]);
      setMatchedPairs((current) => current + 1);
      setLocked(false);
      return;
    }

    window.setTimeout(() => {
      setDeck((currentDeck) =>
        currentDeck.map((card, cardIndex) =>
          cardIndex === firstIndex || cardIndex === secondIndex
            ? { ...card, revealed: false }
            : card
        )
      );
      setFlipped([]);
      setLocked(false);
    }, 700);
  };

  return (
    <article className={cardStyles.card}>
      <h2>记忆配对</h2>
      <p className={cardStyles.copy}>
        翻开两张卡片，找到相同图案。用更少步数完成 8 组配对，会比单纯靠运气更帅一点。
      </p>
      <div className={styles.head}>
        <div className={styles.metrics}>
          <div className={cardStyles.pill}>步数 {moves}</div>
          <div className={cardStyles.pill}>配对 {matchedPairs} / 8</div>
        </div>
        <button
          className={`${cardStyles.button} ${cardStyles.secondary}`}
          onClick={resetGame}
          type="button"
        >
          重新洗牌
        </button>
      </div>
      <div className={styles.grid}>
        {deck.map((card, index) => (
          <button
            key={card.id}
            aria-label={`记忆卡片 ${index + 1}`}
            className={[
              styles.memoryCard,
              card.revealed ? styles.revealed : "",
              card.matched ? styles.matched : ""
            ].join(" ")}
            onClick={() => handleTurn(index)}
            type="button"
          >
            {card.icon}
          </button>
        ))}
      </div>
      {completionMessage ? <div className={styles.completion}>{completionMessage}</div> : null}
    </article>
  );
}
