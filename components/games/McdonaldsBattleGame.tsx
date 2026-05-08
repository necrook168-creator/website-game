"use client";

import { useState } from "react";
import cardStyles from "./GameCard.module.css";
import styles from "./McdonaldsBattleGame.module.css";

const fighters = [
  {
    id: "fries",
    label: "French Fries",
    icon: "🍟",
    nickname: "脆脆薯条",
    flavor: "先手快，专门压制冰可乐。",
    battleCry: "咔嚓连击"
  },
  {
    id: "burger",
    label: "Burger",
    icon: "🍔",
    nickname: "厚厚汉堡",
    flavor: "力量型选手，能稳稳顶住薯条。",
    battleCry: "双层重压"
  },
  {
    id: "soda",
    label: "Soda",
    icon: "🥤",
    nickname: "气泡可乐",
    flavor: "节奏飘忽，最会打乱汉堡。",
    battleCry: "汽泡冲击"
  }
] as const;

type FighterId = (typeof fighters)[number]["id"];
type Score = { player: number; cpu: number; draw: number };

const winsAgainst: Record<FighterId, FighterId> = {
  fries: "soda",
  burger: "fries",
  soda: "burger"
};

const fighterById = Object.fromEntries(fighters.map((fighter) => [fighter.id, fighter])) as Record<
  FighterId,
  (typeof fighters)[number]
>;

export function McdonaldsBattleGame() {
  const [selected, setSelected] = useState<FighterId>("fries");
  const [enemy, setEnemy] = useState<FighterId>("burger");
  const [headline, setHeadline] = useState("选一个角色开打，看看薯条、汉堡、可乐今天谁最能打。");
  const [score, setScore] = useState<Score>({ player: 0, cpu: 0, draw: 0 });

  const playRound = (fighterId: FighterId) => {
    const cpuId = fighters[Math.floor(Math.random() * fighters.length)].id;
    setSelected(fighterId);
    setEnemy(cpuId);

    if (fighterId === cpuId) {
      setScore((current) => ({ ...current, draw: current.draw + 1 }));
      setHeadline(`你和电脑都派出${fighterById[fighterId].nickname}，两边撞成一团，这回合平手。`);
      return;
    }

    if (winsAgainst[fighterId] === cpuId) {
      setScore((current) => ({ ...current, player: current.player + 1 }));
      setHeadline(
        `${fighterById[fighterId].nickname}冲过去压住了${fighterById[cpuId].nickname}，这一局你赢。`
      );
      return;
    }

    setScore((current) => ({ ...current, cpu: current.cpu + 1 }));
    setHeadline(
      `${fighterById[cpuId].nickname}反手把${fighterById[fighterId].nickname}打退，电脑拿下这一局。`
    );
  };

  const resetBattle = () => {
    setSelected("fries");
    setEnemy("burger");
    setScore({ player: 0, cpu: 0, draw: 0 });
    setHeadline("比分清空了，重新开一场新的快餐擂台。");
  };

  const playerFighter = fighterById[selected];
  const enemyFighter = fighterById[enemy];

  return (
    <article className={`${cardStyles.card} ${styles.card}`}>
      <div className={styles.header}>
        <span className={styles.kicker}>McDonald's Food Fight</span>
        <h2>薯条汉堡可乐打架游戏</h2>
      </div>
      <p className={cardStyles.copy}>
        这是一个麦当劳风的轻量对战小游戏。薯条克可乐，可乐克汉堡，汉堡克薯条，点一下就开一局。
      </p>

      <div className={styles.arena}>
        <div className={styles.fighterCard}>
          <span className={styles.sideTag}>你这边</span>
          <div className={styles.avatar}>{playerFighter.icon}</div>
          <strong>{playerFighter.nickname}</strong>
          <em className={styles.battleCry}>{playerFighter.battleCry}</em>
          <span>{playerFighter.flavor}</span>
        </div>
        <div className={styles.versus}>VS</div>
        <div className={`${styles.fighterCard} ${styles.enemyCard}`}>
          <span className={styles.sideTag}>电脑</span>
          <div className={styles.avatar}>{enemyFighter.icon}</div>
          <strong>{enemyFighter.nickname}</strong>
          <em className={styles.battleCry}>{enemyFighter.battleCry}</em>
          <span>{enemyFighter.flavor}</span>
        </div>
      </div>

      <div className={styles.choiceGrid}>
        {fighters.map((fighter) => (
          <button
            key={fighter.id}
            className={styles.choice}
            onClick={() => playRound(fighter.id)}
            type="button"
          >
            <span className={styles.choiceIcon}>{fighter.icon}</span>
            <strong>{fighter.label}</strong>
            <em className={styles.choiceCry}>{fighter.battleCry}</em>
            <span>{fighter.nickname}</span>
          </button>
        ))}
      </div>

      <div className={`${cardStyles.status} ${styles.status}`}>{headline}</div>

      <div className={styles.scoreboard}>
        <div className={styles.scorePill}>你赢了 {score.player}</div>
        <div className={styles.scorePill}>平手 {score.draw}</div>
        <div className={styles.scorePill}>电脑赢了 {score.cpu}</div>
      </div>

      <div className={cardStyles.buttonRow}>
        <button className={`${cardStyles.button} ${styles.resetButton}`} onClick={resetBattle} type="button">
          重新开打
        </button>
      </div>
    </article>
  );
}
