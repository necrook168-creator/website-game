"use client";

import { useState } from "react";
import cardStyles from "./GameCard.module.css";
import styles from "./RockPaperScissorsGame.module.css";

const choices = [
  { label: "石头", icon: "✊" },
  { label: "剪刀", icon: "✌️" },
  { label: "布", icon: "🖐️" }
] as const;

type Choice = (typeof choices)[number]["label"];
type Score = { win: number; draw: number; loss: number };

export function RockPaperScissorsGame() {
  const [result, setResult] = useState("先出一手，看看电脑今天是什么路数。");
  const [score, setScore] = useState<Score>({ win: 0, draw: 0, loss: 0 });

  const playRound = (playerChoice: Choice) => {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)].label;

    if (playerChoice === computerChoice) {
      setScore((current) => ({ ...current, draw: current.draw + 1 }));
      setResult(`你出${playerChoice}，电脑也出${computerChoice}。这局平手。`);
      return;
    }

    const isWin =
      (playerChoice === "石头" && computerChoice === "剪刀") ||
      (playerChoice === "剪刀" && computerChoice === "布") ||
      (playerChoice === "布" && computerChoice === "石头");

    if (isWin) {
      setScore((current) => ({ ...current, win: current.win + 1 }));
      setResult(`你出${playerChoice}，电脑出${computerChoice}。这局你赢。`);
      return;
    }

    setScore((current) => ({ ...current, loss: current.loss + 1 }));
    setResult(`你出${playerChoice}，电脑出${computerChoice}。这局电脑赢。`);
  };

  return (
    <article className={cardStyles.card}>
      <h2>石头剪刀布</h2>
      <p className={cardStyles.copy}>
        和电脑即刻对战。每点一次就是一局，看看你是能读懂随机数，还是会被它连续教育。
      </p>
      <div className={styles.panel}>
        <div className={styles.buttons}>
          {choices.map((choice) => (
            <button
              key={choice.label}
              className={`${cardStyles.button} ${styles.choice}`}
              onClick={() => playRound(choice.label)}
              type="button"
            >
              <span>{choice.icon}</span>
              {choice.label}
            </button>
          ))}
        </div>
        <div className={styles.board}>
          <div className={styles.result}>{result}</div>
          <div className={styles.score}>
            <div className={cardStyles.pill}>你 {score.win}</div>
            <div className={cardStyles.pill}>平 {score.draw}</div>
            <div className={cardStyles.pill}>电脑 {score.loss}</div>
          </div>
          <div className={cardStyles.buttonRow} style={{ marginTop: 0 }}>
            <button
              className={`${cardStyles.button} ${cardStyles.secondary}`}
              onClick={() => {
                setScore({ win: 0, draw: 0, loss: 0 });
                setResult("战绩已清空，再打一轮。");
              }}
              type="button"
            >
              清空战绩
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
